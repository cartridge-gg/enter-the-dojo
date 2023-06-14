#[derive(Component, Copy, Drop, Serde)]
struct Game {
    player_one: felt252,
    player_two: felt252,
    next_to_move: felt252,
    num_moves: u32,
    winner: felt252,
}

trait GameTrait {
    fn is_playing(self: @Game, player_id: felt252) -> bool;
}

impl GameImpl of GameTrait {
    fn is_playing(self: @Game, player_id: felt252) -> bool {
        if player_id == *self.player_one {
            return true;
        }

        if player_id == *self.player_two {
            return true;
        }

        false
    }
}
