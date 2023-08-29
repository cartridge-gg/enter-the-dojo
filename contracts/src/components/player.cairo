use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Health {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    amount: u8
}
