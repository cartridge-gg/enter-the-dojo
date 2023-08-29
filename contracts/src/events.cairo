use dojo::world::{Context, IWorldDispatcherTrait};
use serde::Serde;
use array::{ArrayTrait, SpanTrait};

// helper function to emit events, eventually dojo will 
// have framework level event/logging
fn emit(ctx: Context, name: felt252, values: Span<felt252>) {
    let mut keys = array::ArrayTrait::new();
    keys.append(name);
    ctx.world.emit(keys, values);
}
