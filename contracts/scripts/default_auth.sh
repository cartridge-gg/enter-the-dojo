#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export WORLD_ADDRESS="0x8a0c92088c0698f8a38906693a34881547e8b4dfcfcafdbc0efc42464e239b";

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