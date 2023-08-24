use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    game_id: u32,
    player_one: ContractAddress,
    player_two: ContractAddress,
    next_to_move: ContractAddress,
    num_moves: u32,
    winner: ContractAddress,
}

trait GameTrait {
    fn is_playing(self: @Game, player_id: ContractAddress) -> bool;
}

impl GameImpl of GameTrait {
    fn is_playing(self: @Game, player_id: ContractAddress) -> bool {
        if player_id == *self.player_one {
            return true;
        }

        if player_id == *self.player_two {
            return true;
        }

        false
    }
}
