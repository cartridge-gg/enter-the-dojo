#[derive(Serde, Copy, Drop, PartialEq)]
enum Action {
    Punch: (),
    Kick: (),
    Special: (),
}

impl ActionIntoFelt252 of Into<Action, felt252> {
    fn into(self: Action) -> felt252 {
        match self {
            Action::Punch(()) => 0,
            Action::Kick(()) => 1,
            Action::Special(()) => 3,
        }
    }
}

#[system]
mod Attack {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use super::Action;

    use enter_the_dojo::components::game::{Game, GameTrait};
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{
        PUNCH_DAMAGE, KICK_DAMAGE, SPECIAL_DAMAGE, PUNCH_CHANCE, KICK_CHANCE, SPECIAL_CHANCE
    };

    #[event]
    fn PlayerAttacked(
        game_id: felt252,
        player_id: felt252,
        opponent_id: felt252,
        action: Action,
        damage: u8,
        killing_blow: bool,
    ) {}

    fn execute(ctx: Context, game_id: felt252, action: Action) {
        // gets player address
        let player_id: felt252 = ctx.caller_account.into();

        // read game entity
        let game_sk = (game_id, (0)).into_partitioned();
        let game = commands::<Game>::entity(game_sk);

        // game condition checking
        assert(game.winner == 0, 'game already over');
        assert(game.next_to_move == player_id, 'not your turn');
        assert(game.is_playing(player_id), 'not your game');

        // retrieve own player
        let player_sk = (game_id, (player_id)).into_partitioned();
        let (health, special) = commands::<(Health, Special)>::entity(player_sk);

        // check if attack is special and is valid
        if action == Action::Special(()) {
            assert(special.remaining > 0, 'no specials left');

            commands::set_entity(
                player_sk, // player storage key
                (
                    health, // health stays the same
                     Special {
                        remaining: special.remaining - 1 // decrement special 
                    }
                )
            );
        }

        // opposing player
        let opponent_id = if game.player_one == player_id {
            game.player_two
        } else {
            game.player_one
        };
        let opponent_sk = (game_id, (opponent_id)).into_partitioned();
        let (health, special) = commands::<(Health, Special)>::entity(opponent_sk);

        // cacluate damage, use VRF for seed in the future
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let mut damage = calculate_damage(seed, action);

        // check if killing blow
        let killing_blow = if damage > health.amount {
            damage = health.amount;
            true
        } else {
            false
        };

        // update opponent health
        commands::set_entity(
            opponent_sk, // opponent storage key
            (
                special, // special stays the same
                 Health {
                    amount: health.amount - damage // decrement health
                }
            )
        );

        // update game state
        commands::set_entity(
            game_sk,
            (Game {
                player_one: game.player_one,
                player_two: game.player_two,
                next_to_move: opponent_id,
                num_moves: game.num_moves + 1,
                winner: if killing_blow {
                    player_id
                } else {
                    0
                }
            })
        );

        PlayerAttacked(game_id, player_id, opponent_id, action, damage, killing_blow);
    }

    fn calculate_damage(seed: felt252, action: Action) -> u8 {
        match action {
            Action::Punch(()) => hit_chance(seed, PUNCH_CHANCE, PUNCH_DAMAGE),
            Action::Kick(()) => hit_chance(seed, KICK_CHANCE, KICK_DAMAGE),
            Action::Special(()) => hit_chance(seed, SPECIAL_CHANCE, SPECIAL_DAMAGE),
        }
    }

    fn hit_chance(seed: felt252, likelihood: u8, damage: u8) -> u8 {
        let seed: u256 = seed.into();
        let result: u128 = seed.low % 100;

        if result <= likelihood.into() {
            damage
        } else {
            0
        }
    }
}

