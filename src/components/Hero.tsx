import { useDojo } from "@/hooks/dojo";
import { useEntities } from "@/hooks/dojo/useEntities";
import { Action, useSystems } from "@/hooks/dojo/useSystems";
import { formatAddress } from "@/utils/contract";
import {
  Box,
  Text,
  keyframes,
  Flex,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

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
}

const animation = keyframes`
  100% {
    background-position: -1600px
  }
`;

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
  useEffect(() => {}, [game]);

  const attackLight = useCallback(()=>{
    setState(PlayerState.ATTACK_LIGHT);
    setTimeout(() => {
      setState(PlayerState.IDLE);
    }, type === HeroType.One ? 1000 : 500); // hack: animateion length diff between two pngs
  }, []);

  const attackHeavy = useCallback(()=>{
    setState(PlayerState.ATTACK_HEAVY);
    setTimeout(() => {
      setState(PlayerState.IDLE);
    }, type === HeroType.One ? 1000 : 500);
  }, []);

  return (
    <>
      <Flex
        boxSize="200px"
        background={`url('/${type}/${state}.png') left center`}
        animation={`${animation} 1s steps(8) infinite`}
        transform={isMirrored ? "scaleX(-1)" : ""}
        justify="center"
        position="relative"
      >
        {health !== 0 && (
          <>
            <VStack gap="0" align="flex-start">
              <Text transform={isMirrored ? "scaleX(-1)" : ""} fontSize="10px">
                {isYou ? "You" : address ? formatAddress(address) : "..."}
              </Text>
              <HealthBar health={health || 0} />
            </VStack>

            {isYou && isAction && (
              <HStack
                position="absolute"
                bottom="0"
                transform={isMirrored ? "scaleX(-1)" : ""}
              >
                <Button
                  size="sm"
                  onClick={async () => {
                    if (gameId) {
                      attackLight();
                      const result = await attack(gameId[0], Action.Light);
                    }
                  }}
                  isLoading={isPending}
                >
                  Light
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    if (gameId) {
                      attackHeavy();
                      const result = await attack(gameId[0], Action.Heavy);
                    }
                  }}
                  isLoading={isPending}
                >
                  Heavy
                </Button>
              </HStack>
            )}
          </>
        )}
      </Flex>
    </>
  );
};

const HealthBar = ({ health }: { health: number }) => {
  const percentage = `${(health / MAX_HEALTH) * 100}%`;
  return (
    <HStack h="8px" w="100px" bgColor="gray.200">
      <Box h="full" w={percentage} bgColor="green.400" />
    </HStack>
  );
};
