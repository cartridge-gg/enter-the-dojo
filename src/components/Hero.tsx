import { useDojo } from "@/hooks/dojo";
import { useGameEntity } from "@/hooks/dojo/entities/useGameEntity";
import { PlayerEntity } from "@/hooks/dojo/entities/usePlayersEntity";
import { Action, useSystems } from "@/hooks/dojo/useSystems";
import { formatAddress } from "@/utils/contract";
import {
  Box,
  Image,
  Text,
  keyframes,
  Flex,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MAX_HEALTH = 100;

export enum HeroType {
  One = "hero_1",
  Two = "hero_2",
}

enum PlayerState {
  IDLE = "idle",
  ATTACK_ONE = "attack_one",
  ATTACK_TWO = "attack_two",
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
  playerEntity,
  isMirrored = false,
}: {
  type: HeroType;
  address?: string;
  playerEntity?: PlayerEntity;
  isMirrored?: boolean;
}) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const [state, setState] = useState<PlayerState>(PlayerState.IDLE);
  const [isYou, setIsYou] = useState(false);
  const [health, setHealth] = useState<number>(0);
  const { attack, isPending } = useSystems();
  const { account } = useDojo();
  const { game } = useGameEntity({
    gameId: gameId && gameId[0],
  });

  useEffect(() => {
    if (account && address) {
      setIsYou(account.address === address);
    }
  }, [account, address]);

  useEffect(() => {
    if (playerEntity) {
      setHealth(Number(playerEntity.health!));
    }
  }, [playerEntity]);

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
              <HealthBar health={health} />
            </VStack>

            {isYou && game?.nextToMove === address && (
              <HStack
                position="absolute"
                bottom="0"
                transform={isMirrored ? "scaleX(-1)" : ""}
              >
                <Button
                  size="sm"
                  onClick={async () => {
                    if (gameId) {
                      const result = await attack(gameId[0], Action.Light);
                      console.log(result);
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
                      const result = await attack(gameId[0], Action.Heavy);
                      console.log(result);
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
