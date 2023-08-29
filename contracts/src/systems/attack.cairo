#[derive(Serde, Copy, Drop, PartialEq)]
enum Action {
    Light: (),
    Heavy: (),
    Special: (),
}

#[system]
mod attack {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use super::Action;
    use starknet::{ContractAddress, Zeroable};

    use dojo::world::Context;

    use enter_the_dojo::events::emit;
    use enter_the_dojo::components::game::{Game, GameTrait};
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{
        LIGHT_DAMAGE, HEAVY_DAMAGE, SPECIAL_DAMAGE, LIGHT_CHANCE, HEAVY_CHANCE, SPECIAL_CHANCE
    };

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PlayerAttacked: PlayerAttacked,
        GameOver: GameOver,
    }
    

    #[derive(Drop, starknet::Event)]
    struct PlayerAttacked {
        game_id: u32,
        player_id: ContractAddress,
        opponent_id: ContractAddress,
        action: Action,
        damage: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct GameOver {
        game_id: u32,
        winner: ContractAddress,
        loser: ContractAddress,
    }

    fn execute(ctx: Context, game_id: u32, action: Action) {
        // gets player address
        let player_id = ctx.origin;

        // read game entity
        let mut game = get !(ctx.world, game_id, (Game));

        // game condition checking
        assert(game.winner.is_zero(), 'game already over');
        assert(game.next_to_move == player_id, 'not your turn');

        // only retrieve own player's special component
        // we don't care about health component as it does 
        // not get updated
        let mut special = get !(ctx.world, (game_id, player_id).into(), (Special));

        // check if attack is special and is valid
        if action == Action::Special(()) {
            assert(special.remaining > 0, 'no specials left');
            special.remaining -= 1;
            set !(ctx.world, (special));
        }

        // cacluate damage, use VRF for seed in the future
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let mut damage = calculate_damage(seed, action);

        // opposing player
        let opponent_id = if game.player_one == player_id {
            game.player_two
        } else {
            game.player_one
        };

        // only retrieve health for opponent player as their 
        // special component does not get updated
        let mut health = get !(ctx.world, (game_id, opponent_id).into(), (Health));

        // check if killing blow
        let killing_blow = if damage >= health.amount {
            damage = health.amount;
            true
        } else {
            false
        };

        // update opponent health
        health.amount -= damage;
        set !(ctx.world, (health));

        // emit player attacked
        emit!(ctx.world, PlayerAttacked { game_id, player_id, opponent_id, action, damage });

        // update game state
        game.next_to_move = opponent_id;
        game.num_moves += 1;
        game.winner = if killing_blow {
            // emit game over 
            emit!(ctx.world, GameOver { game_id, winner: player_id, loser: opponent_id });

            player_id
        } else {
            Zeroable::zero()
        };
        set !( ctx.world, (game));
    }

    fn calculate_damage(seed: felt252, action: Action) -> u8 {
        match action {
            Action::Light(()) => chance_hit(seed, LIGHT_CHANCE, LIGHT_DAMAGE),
            Action::Heavy(()) => chance_hit(seed, HEAVY_CHANCE, HEAVY_DAMAGE),
            Action::Special(()) => chance_hit(seed, SPECIAL_CHANCE, SPECIAL_DAMAGE),
        }
    }

    fn chance_hit(seed: felt252, likelihood: u8, damage: u8) -> u8 {
        let seed: u256 = seed.into();
        let result: u128 = seed.low % 100;

        if result <= likelihood.into() {
            damage
        } else {
            0
        }
    }
}

