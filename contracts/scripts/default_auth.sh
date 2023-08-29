#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export WORLD_ADDRESS="0x8a0c92088c0698f8a38906693a34881547e8b4dfcfcafdbc0efc42464e239b";

# make sure all components/systems are deployed
COMPONENTS=("Game" "Health" "Special")
SYSTEMS=("create" "join" "attack")

# check components
for component in ${COMPONENTS[@]}; do
    sozo component entity $component --world $WORLD_ADDRESS > /dev/null
done

# check systems
for system in ${SYSTEMS[@]}; do
    SYSTEM_OUTPUT=$(sozo system get $system --world $WORLD_ADDRESS)
    if [[ "$SYSTEM_OUTPUT" == "0x0" ]]; then
        echo "Error: $system is not deployed"
        exit 1
    fi
done

# enable system -> component authorizations
CREATE_COMPONENTS=("Game" "Health" "Special")
JOIN_COMPONENTS=("Game" "Health" "Special")
ATTACK_COMPONENTS=("Game" "Health" "Special")

for component in ${CREATE_COMPONENTS[@]}; do
    sozo auth writer $component create --world $WORLD_ADDRESS
done

for component in ${JOIN_COMPONENTS[@]}; do
    sozo auth writer $component join --world $WORLD_ADDRESS
done

for component in ${ATTACK_COMPONENTS[@]}; do
    sozo auth writer $component attack --world $WORLD_ADDRESS
done

echo "Default authorizations have been successfully set."