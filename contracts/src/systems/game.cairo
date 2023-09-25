#[system]
mod create {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use starknet::{ContractAddress, Zeroable};

    use dojo::world::Context;

    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health};
    use enter_the_dojo::constants::{MAX_HEALTH};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated
    }

    #[derive(Drop, starknet::Event)]
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
        set!(
            ctx.world,
            (Game {
                game_id,
                player_one: player_id, // creator auto joins game
                player_two: Zeroable::zero(),
                next_to_move: Zeroable::zero(),
                num_moves: Zeroable::zero(),
                winner: Zeroable::zero(),
            })
        );

        // create player entity
        set!(ctx.world, (Health { game_id, player_id, amount: MAX_HEALTH }));

        // emit game created
        emit!(ctx.world, GameCreated { game_id, creator: player_id });

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

    use enter_the_dojo::components::game::Game;
    use enter_the_dojo::components::player::{Health};
    use enter_the_dojo::constants::{MAX_HEALTH};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PlayerJoined: PlayerJoined
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerJoined {
        game_id: u32,
        player_id: ContractAddress
    }

    fn execute(ctx: Context, game_id: u32) {
        let player_id = ctx.origin;

        let mut game = get!(ctx.world, game_id, (Game));
        assert(game.player_one != player_id, 'cannot join own game');
        assert(game.player_two.is_zero(), 'game is full');

        // update game entity
        game.player_two = player_id;
        game.next_to_move = game.player_one;
        set!(ctx.world, (game));

        // create player entity
        set!(ctx.world, (Health { game_id, player_id, amount: MAX_HEALTH }));

        // emit player joined
        emit!(ctx.world, PlayerJoined { game_id, player_id });

        ()
    }
}
