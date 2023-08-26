# Enter the Dojo

Welcome to Enter the Dojo, a super simple on-chain game built on Starknet using the [Dojo Engine](https://github.com/dojoengine/dojo). This project aims to showcase the simplicity and power of Dojo Engine for building on-chain games using ESC (Entity Component System) concepts.

### Description

Enter the Dojo is a turn-based 1v1 combat game. Punch, kick, and unleash your special attacks against your opponent. But be careful, each attack deals varying damages and has a potential to miss. Choose your attacks wisely!

### Development

Install the latest Dojo toolchain from here [installation guide](https://book.dojoengine.org/getting-started/installation.html)

```bash
# Start Katana
katana --seed 0

# Build the game
sozo build

# Migrate the world, this will declare/deploy contracts to katana,
# update the world address in Scarb.toml
sozo migrate

# Create a game, account credentials are stored in Scarb.toml
sozo execute Create

# Open up another terminal and cd into player_two
sozo execute Join --calldata 0

# View the schema of a component
sozo component schema Game

# View the value of a component
# Depending on how you structure your storage keys the last input
# specifies the key parts
sozo component entity Game 0

# Figure out how to punch, kick, and use special attack to deal a killing blow your opponent!
```