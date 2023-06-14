#[system]
mod Create {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    
    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{MAX_HEALTH, MAX_SPECIALS};

    #[event]
    fn GameCreated(game_id: felt252, creator: felt252) {}

    fn execute(ctx: Context) {
        // getting the origin of the caller from context
        let player_id: felt252 = ctx.caller_account.into();

        // generate an id that is unique to to this world
        let game_id = commands::uuid();

        // create game entity
        commands::set_entity(
            (game_id, (0)).into_partitioned(), // key parts = /game_id
            (Game {
                player_one: player_id, // creator auto joins game
                player_two: 0,
                next_to_move: 0,
                num_moves: 0,
                winner: 0,
            })
        )

        // create player entity
        commands::set_entity(
            (game_id, (player_id)).into_partitioned(), // key parts = /game_id/player_id 
            (Health { amount: MAX_HEALTH }, Special { remaining: MAX_SPECIALS })
        )

        GameCreated(game_id.into(), player_id);
        ()
    }
}

#[system]
mod Join {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{MAX_HEALTH, MAX_SPECIALS};

    #[event]
    fn PlayerJoined(game_id: felt252, player_id: felt252) {}

    fn execute(ctx: Context, game_id: felt252) {
        let player_id: felt252 = ctx.caller_account.into();

        let game = commands::<Game>::entity((game_id, (0)).into_partitioned());
        assert(game.player_one != player_id, 'own game');
        assert(game.player_one != 0, 'no game');
        assert(game.player_two == 0, 'game full');

        // update game entity
        commands::set_entity(
            (game_id, (0)).into_partitioned(),
            (Game {
                player_one: game.player_one,
                player_two: player_id,
                next_to_move: game.player_one,
                num_moves: 0,
                winner: 0,
            })
        )

        // create player entity
        commands::set_entity(
            (game_id, (player_id)).into_partitioned(), // key parts = /game_id/player_id 
            (Health { amount: MAX_HEALTH }, Special { remaining: MAX_SPECIALS })
        )

        PlayerJoined(game_id, player_id);
        ()
    }
}
