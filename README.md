<p align="center"><img src=".github/etd.png" /></p>

# Enter the Dojo

Welcome to Enter the Dojo, a super simple on-chain game built on Starknet using
the [Dojo Engine](https://github.com/dojoengine/dojo). This project aims to
showcase the simplicity and power of Dojo Engine for building on-chain games
using ESC (Entity Component System) concepts.

### Description

Enter the Dojo is a turn-based 1v1 combat game. Take turns attacking your
opponent with different moves, but be careful, each attack deals varying damages
and has a potential to miss. Choose your attacks wisely!

### Development

Install the latest Dojo toolchain from here
[installation guide](https://book.dojoengine.org/getting-started/quick-start.html)

```bash
# Start Katana
katana --disable-fee

# cd into contracts dir
cd contracts

# Build the game
sozo build

# Migrate the world, this will declare/deploy contracts to katana,
# update the world address in Scarb.toml
sozo migrate

# Setup some basic authorization between system and components
./scripts/default_auth.sh

# Start torii indexer
torii

# Start frontend
yarn && yarn dev
```

### How to play

To play the game from the frontend, open up two browsers - one in normal mode
and one in incognito mode. Create burner wallets in both windows. Burner wallets
are tied to the current browser profile being used thus the reason for two
windows. Create a game in one window and in the other window click on
`Available Games` to find that game and join. Now take turns between the two
windows to battle!
