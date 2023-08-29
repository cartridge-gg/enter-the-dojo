import { useDojo } from "@/hooks/dojo";
import { useEntities } from "@/hooks/dojo/useEntities";
import { Action, useSystems } from "@/hooks/dojo/useSystems";
import { formatAddress } from "@/utils/contract";
import {
  Box,
  Text,
  keyframes as ky,
  Flex,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const MAX_HEALTH = 100;

export enum HeroType {
  One = "hero_1",
  Two = "hero_2",
}

enum PlayerState {
  IDLE = "idle",
  ATTACK_LIGHT = "attack_one",
  ATTACK_HEAVY = "attack_two",
  TAKE_HIT = "take_hit",
  DEATH = "death",
}

export const Hero = ({
  type,
  address,
  health,
  isAction = false,
  isMirrored = false,
}: {
  type: HeroType;
  address?: string;
  health?: number;
  isAction?: boolean;
  isMirrored?: boolean;
}) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const [state, setState] = useState<PlayerState>(PlayerState.IDLE);
  const [isYou, setIsYou] = useState(false);

  const { account } = useDojo();
  const { attack, isPending } = useSystems();
  const { game } = useEntities({
    gameId: gameId && gameId[0],
  });

  useEffect(() => {
    if (account && address) {
      setIsYou(account.address === address);
    }
  }, [account, address]);

  // listen to game updates
  useEffect(() => {
    if (game) {
      if (game.winner !== "0x0" && game.winner !== address) {
        uDied();
      }
    }
  }, [game]);

  // Use a better framework to handle animation like Phaser or Pixijs, but because how simple this game is
  // we'll manually code up animation frames
  const animation = useMemo(() => {
    switch (state) {
      case PlayerState.IDLE:
        return `${ky`
        100% {
          background-position: -${type === HeroType.One ? 1400 : 600}px
        }
      `} 1s steps(${type === HeroType.One ? 7 : 3}) infinite`;
      case PlayerState.ATTACK_LIGHT:
      case PlayerState.ATTACK_HEAVY:
        return `${ky`
        100% {
          background-position: -1000px
        }
      `} 1s steps(5)`;
      case PlayerState.TAKE_HIT:
        return `${ky`
        100% {
          background-position: -600px
        }
      `} 1s steps(3)`;
      case PlayerState.DEATH:
        return `${ky`
        100% {
          background-position: -1000px
        }
      `} 1s steps(5) forwards`;
    }
  }, [state]);

  const attackLight = useCallback(async () => {
    setState(PlayerState.ATTACK_LIGHT);
    await new Promise((r) => setTimeout(r, 1000));
    setState(PlayerState.IDLE);
  }, []);

  const attackHeavy = useCallback(async () => {
    setState(PlayerState.ATTACK_HEAVY);
    await new Promise((r) => setTimeout(r, 1000));
    setState(PlayerState.IDLE);
  }, []);

  const uDied = useCallback(() => {
    setState(PlayerState.DEATH);
  }, []);
  console.log(address);
  return (
    <>
      <Flex
        boxSize="200px"
        background={`url('/${type}/${state}.png') left center`}
        animation={animation}
        transform={isMirrored ? "scaleX(-1)" : ""}
        justify="center"
        position="relative"
      >
        <>
          {game?.playerTwo !== "0x0" && (
            <VStack gap="0" align="flex-start">
              <Text transform={isMirrored ? "scaleX(-1)" : ""} fontSize="10px">
                {isYou ? "You" : address ? formatAddress(address) : "Waiting"}
              </Text>
              <HealthBar health={health || 0} />
            </VStack>
          )}

          {isYou && isAction && state !== PlayerState.DEATH && (
            <HStack
              position="absolute"
              bottom="0"
              transform={isMirrored ? "scaleX(-1)" : ""}
            >
              <Button
                size="sm"
                onClick={async () => {
                  if (gameId) {
                    await attackLight();
                    const result = await attack(gameId[0], Action.Light);
                  }
                }}
                isDisabled={state !== PlayerState.IDLE || isPending}
              >
                Light
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  if (gameId) {
                    await attackHeavy();
                    const result = await attack(gameId[0], Action.Heavy);
                  }
                }}
                isDisabled={state !== PlayerState.IDLE || isPending}
              >
                Heavy
              </Button>
            </HStack>
          )}
        </>
      </Flex>
    </>
  );
};

const HealthBar = ({ health }: { health: number }) => {
  const percentage = `${(health / MAX_HEALTH) * 100}%`;
  return (
    <HStack h="8px" w="80px" bgColor="gray.200">
      <Box h="full" w={percentage} bgColor="green.400" />
    </HStack>
  );
};
