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
