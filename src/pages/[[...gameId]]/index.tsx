import { Header } from "@/components/Header";
import { Hero, HeroType } from "@/components/Hero";
import { useDojo } from "@/hooks/dojo";
import { useGameEntity } from "@/hooks/dojo/entities/useGameEntity";
import { usePlayersEntity } from "@/hooks/dojo/entities/usePlayersEntity";
import { Action, useSystems } from "@/hooks/dojo/useSystems";
import { Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

enum GameState {
  CREATE_GAME,
  WAIT_FOR_JOIN,
  WAIT_FOR_OPPONENT,
  CAN_ATTACK,
  CAN_JOIN,
  END,
}

export default function Home() {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const { account } = useDojo();
  const { create, join, isPending } = useSystems();

  const { game } = useGameEntity({
    gameId: gameId && gameId[0],
  });
  const { playerOne, playerTwo } = usePlayersEntity({
    gameId: gameId && gameId[0],
    oneAddress: game?.playerOne,
    twoAddress: game?.playerTwo,
  });

  const [gameState, setGameState] = useState<GameState>(GameState.CREATE_GAME);

  useEffect(() => {
    if (!game) {
      return setGameState(GameState.CREATE_GAME);
      
    }

    if (game.playerOne !== account?.address && game.playerTwo === "0x0") {
      return setGameState(GameState.CAN_JOIN);
    }
    
    if (game.nextToMove === account?.address) {
      return setGameState(GameState.CAN_ATTACK);
    } 
    
    if (game.playerTwo === "0x0") {
      return setGameState(GameState.WAIT_FOR_JOIN);
    } 
    
    if (
      game.nextToMove !== account?.address &&
      (game.playerOne === account?.address ||
        game.playerTwo === account?.address)
    ) {
      return setGameState(GameState.WAIT_FOR_OPPONENT);
    }
    
  }, [account, game]);

  return (
    <>
      <Head>
        <title>Enter the Dojo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          position="fixed"
          top="0"
          left="0"
          boxSize="full"
          align="center"
          justify="center"
          bgColor="gray.300"
          backgroundImage="url('/torii.png')"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
        >
          <Header />
          <VStack>
            <HStack
              position="relative"
              top="100px"
              gap="80px"
              visibility={gameId ? "visible" : "hidden"}
            >
              <Hero
                type={HeroType.One}
                playerEntity={playerOne}
                address={game?.playerOne}
              />
              <Hero
                type={HeroType.Two}
                playerEntity={playerTwo}
                address={game?.playerTwo}
                isMirrored
              />
            </HStack>
            {account && (
              <HStack mt="40px" h="40px">
                {gameState === GameState.CREATE_GAME && (
                  <Button
                    size="sm"
                    onClick={async () => {
                      const result = await create();
                      router.push(`/${result.event?.gameId}`);
                    }}
                    isLoading={isPending}
                  >
                    Create Game
                  </Button>
                )}

                {gameState === GameState.CAN_JOIN && (
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (gameId) {
                        const result = await join(gameId[0]);
                      }
                    }}
                    isLoading={isPending}
                  >
                    Join Game
                  </Button>
                )}

                {gameState === GameState.WAIT_FOR_JOIN && (
                  <Text>Waiting for someone to Join</Text>
                )}

                {gameState === GameState.WAIT_FOR_OPPONENT && (
                  <Text>Opponent to move</Text>
                )}
              </HStack>
            )}
          </VStack>
        </Flex>
      </main>
    </>
  );
}
