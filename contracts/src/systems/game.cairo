#[system]
mod create {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use starknet::{ContractAddress, Zeroable};

    use dojo::world::Context;

    use enter_the_dojo::events::emit;
    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{MAX_HEALTH, MAX_SPECIALS};

    #[derive(Drop, Serde)]
    struct GameCreated {
        game_id: u32,
        creator: ContractAddress
    }

    fn execute(ctx: Context) {
        // getting the origin of the caller from context
        let player_id = ctx.origin;

        // generate an id that is unique to to this world
        let game_id = ctx.world.uuid();

        // create game entity
        set !(
            ctx.world,
            (Game {
                game_id,
                player_one: player_id, // creator auto joins game
                player_two: Zeroable::zero(),
                next_to_move: Zeroable::zero(),
                num_moves: Zeroable::zero(),
                winner: Zeroable::zero(),
            })
        )

        // create player entity
        set !(
            ctx.world,
            (Health { game_id, player_id, amount: MAX_HEALTH }, Special { game_id, player_id, remaining: MAX_SPECIALS })
        )

        // emit game created
        //emit!(ctx.world, GameCreated { game_id, creator: player_id });
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@GameCreated { game_id, creator: player_id }, ref values);
        emit(ctx, 'GameCreated', values.span());

        ()
    }
}

#[system]
mod join {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use starknet::{ContractAddress, Zeroable};

    use dojo::world::Context;

    use enter_the_dojo::events::emit;
    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health, Special};
    use enter_the_dojo::constants::{MAX_HEALTH, MAX_SPECIALS};

    #[derive(Drop, Serde)]
    struct PlayerJoined {
        game_id: u32,
        player_id: ContractAddress
    }

    fn execute(ctx: Context, game_id: u32) {
        let player_id = ctx.origin;

        let mut game = get !(ctx.world, game_id, (Game));
        assert(game.player_one != player_id, 'cannot join own game');
        assert(game.player_two.is_zero(), 'game is full');

        // update game entity
        game.player_two = player_id;
        game.next_to_move = game.player_one;
        set !(ctx.world, (game));

        // create player entity
        set !(
            ctx.world,
            (Health { game_id, player_id, amount: MAX_HEALTH }, Special { game_id, player_id, remaining: MAX_SPECIALS }),
        )

        // emit player joined
        //emit!(ctx.world, PlayerJoined {game_id, player_id });
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@PlayerJoined { game_id, player_id }, ref values);
        emit(ctx, 'PlayerJoined', values.span());

        ()
    }
}
