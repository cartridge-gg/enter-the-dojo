import {
  ComponentUnion,
  Game,
  Health,
  useEntitiesQuery,
} from "@/generated/graphql";
import { REFETCH_INTERVAL } from ".";
import { useEffect, useState } from "react";

interface EntitiesData {
  entities?: {
    edges: [
      {
        node: {
          keys: string[];
          components: ComponentUnion[];
        };
      },
    ];
  };
}

export type PlayerEntity = {
  address: string;
  health: number;
  // special: number;
};

export type GameEntity = {
  playerOne: string;
  playerTwo: string;
  nextToMove: string;
  numMoves: number;
  winner: string;
};

export class Entities {
  playerOne: PlayerEntity;
  playerTwo: PlayerEntity;
  game: GameEntity;

  constructor(game: Game, oneHealth: Health, twoHealth: Health) {
    this.game = {
      playerOne: game.player_one,
      playerTwo: game.player_two,
      nextToMove: game.next_to_move,
      numMoves: game.num_moves,
      winner: game.winner,
    } as GameEntity;
    this.playerOne = {
      address: game.player_one,
      health: oneHealth?.amount,
    } as PlayerEntity;
    this.playerTwo = {
      address: game.player_two,
      health: twoHealth?.amount,
    } as PlayerEntity;
  }

  static create(data: EntitiesData) {
    if (!data || !data.entities) return undefined;

    const game = data.entities.edges.find((edge) =>
      edge.node.components.find((component) => component.__typename === "Game"),
    )?.node.components[0] as Game;

    if (!game) return undefined;

    const oneHealth = findPlayer(data, game.player_one);
    const twoHealth = findPlayer(data, game.player_two);

    return new Entities(game as Game, oneHealth as Health, twoHealth as Health);
  }
}

export interface EntitiesInterface {
  game: GameEntity;
  playerOne: PlayerEntity;
  playerTwo: PlayerEntity;
  isFetched: boolean;
}

export const useEntities = ({ gameId }: { gameId: string }) => {
  const [entities, setEntities] = useState<Entities>();

  const { data, isFetched } = useEntitiesQuery(
    {
      gameId: gameId,
    },
    {
      enabled: !!gameId,
      refetchInterval: REFETCH_INTERVAL,
    },
  );

  useEffect(() => {
    const entities = Entities.create(data as EntitiesData);
    setEntities(entities);
  }, [data]);

  return {
    game: entities?.game,
    playerOne: entities?.playerOne,
    playerTwo: entities?.playerTwo,
    isFetched,
  };
};

function findPlayer(
  data: EntitiesData,
  playerAddress: string,
): Health | undefined {
  // we know player health is keyed by (gameId, playerAddress)
  const healthEdge = data.entities?.edges.find(
    (edge) => edge.node.keys[1] === playerAddress,
  );

  return healthEdge?.node.components.find(
    (component) => component.__typename === "Health",
  ) as Health;
}
