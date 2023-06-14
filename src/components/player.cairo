#[derive(Component, Copy, Drop, Serde)]
struct Health {
    amount: u8
}

#[derive(Component, Copy, Drop, Serde)]
struct Special {
    remaining: u8
}
