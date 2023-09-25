#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export WORLD_ADDRESS="0x5e74e1e03139b9eb3d1b742691d8d966b438b599634cae3193d58636528d913";

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