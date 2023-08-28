import { Game, useGameEntityQuery } from "@/generated/graphql";
import { useEffect, useState } from "react";
import { ec, num } from "starknet";
import { REFETCH_INTERVAL } from "..";

interface GameEntityData {
  entity: {
    components: Game[];
  };
}

export class GameEntity {
  playerOne: string;
  playerTwo: string;
  nextToMove: string;
  numMoves: number;
  winner: string;

  constructor(game: Game) {
    this.playerOne = game.player_one;
    this.playerTwo = game.player_two;
    this.nextToMove = game.next_to_move;
    this.numMoves = game.next_to_move;
    this.winner = game.winner;
  }

  static create(data: GameEntityData): GameEntity | undefined {
    if (!data || !data.entity) return undefined;

    const components = data.entity.components || [];
    const gameComponent = components.find(
      (component) => component.__typename === "Game",
    );

    if (!gameComponent) return undefined;

    return new GameEntity(gameComponent as Game);
  }
}

export interface GameInterface {
  game?: GameEntity;
  isFetched: boolean;
}

export const useGameEntity = ({
  gameId,
}: {
  gameId?: string;
}): GameInterface => {
  const [game, setGame] = useState<GameEntity>();
  const [key, setKey] = useState<string>("");

  const { data, isFetched } = useGameEntityQuery(
    { id: key },
    {
      enabled: !!gameId,
      refetchInterval: REFETCH_INTERVAL,
    },
  );

  useEffect(() => {
    if (gameId) {
      const key_ = ec.starkCurve.poseidonHashMany([num.toBigInt(gameId)]);
      setKey(num.toHex(key_));
    }
  }, [gameId]);

  useEffect(() => {
    const game_ = GameEntity.create(data as GameEntityData);
    if (game_) setGame(game_);
  }, [data]);

  return {
    game,
    isFetched,
  };
};
