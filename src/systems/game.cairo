#[system]
mod Create {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use enter_the_dojo::events::emit;
    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{MAX_HEALTH, MAX_SPECIALS};

    #[derive(Drop, Serde)]
    struct GameCreated {
        game_id: u32,
        creator: felt252
    }

    fn execute(ctx: Context) {
        // getting the origin of the caller from context
        let player_id: felt252 = ctx.caller_account.into();

        // generate an id that is unique to to this world
        let game_id = ctx.world.uuid();

        // create game entity
        set !(
            ctx,
            game_id.into(),
            (Game {
                player_one: player_id, // creator auto joins game
                player_two: 0,
                next_to_move: 0,
                num_moves: 0,
                winner: 0,
            })
        )

        // create player entity
        set !(
            ctx,
            (game_id, player_id).into(),
            (Health { amount: MAX_HEALTH }, Special { remaining: MAX_SPECIALS })
        )

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@GameCreated { game_id, creator: player_id }, ref values);
        emit(ctx, 'GameCreated', values.span());

        ()
    }
}

#[system]
mod Join {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use enter_the_dojo::events::emit;
    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{MAX_HEALTH, MAX_SPECIALS};

    #[derive(Drop, Serde)]
    struct PlayerJoined {
        game_id: u32,
        player_id: felt252
    }

    fn execute(ctx: Context, game_id: u32) {
        let player_id: felt252 = ctx.caller_account.into();

        let game = get !(ctx, game_id.into(), Game);
        assert(game.player_one != player_id, 'cannot join own game');
        assert(game.player_two == 0, 'game is full');

        // update game entity
        set !(
            ctx,
            game_id.into(),
            (Game {
                player_one: game.player_one,
                player_two: player_id,
                next_to_move: game.player_one,
                num_moves: 0,
                winner: 0,
            })
        )

        // create player entity
        set !(
            ctx,
            (game_id, player_id).into(),
            (Health { amount: MAX_HEALTH }, Special { remaining: MAX_SPECIALS }),
        )

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@PlayerJoined { game_id, player_id }, ref values);
        emit(ctx, 'PlayerJoined', values.span());

        ()
    }
}
