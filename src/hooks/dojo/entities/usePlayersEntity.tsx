import { useEffect, useState } from "react";
import { ec, num } from "starknet";
import {
  ComponentUnion,
  Health,
  usePlayersEntityQuery,
} from "@/generated/graphql";
import { REFETCH_INTERVAL } from "..";

interface PlayersEntityData {
  playerOne: {
    components: ComponentUnion[];
  };
  playerTwo: {
    components: ComponentUnion[];
  };
}

export type PlayerEntity = {
  health?: number;
  //special: number;
};

export class PlayersEntity {
  playerOne: PlayerEntity;
  playerTwo: PlayerEntity;

  constructor(playerOne: Health, playerTwo: Health) {
    this.playerOne = { health: Number(playerOne.amount) } as PlayerEntity;
    this.playerTwo = { health: Number(playerTwo.amount) } as PlayerEntity;
  }

  static create(data: PlayersEntityData) {
    if (!data) return undefined;

    const oneHealth = (data.playerOne.components || []).find(
      (component) => component.__typename === "Health",
    );

    const twoHealth = (data.playerTwo.components || []).find(
      (component) => component.__typename === "Health",
    );

    if (!oneHealth || !twoHealth) return undefined;

    return new PlayersEntity(oneHealth as Health, twoHealth as Health);
  }
}

export interface PlayersInterface {
  playerOne?: PlayerEntity;
  playerTwo?: PlayerEntity;
  isFetched: boolean;
}

export const usePlayersEntity = ({
  gameId,
  oneAddress,
  twoAddress,
}: {
  gameId?: string;
  oneAddress?: string;
  twoAddress?: string;
}): PlayersInterface => {
  const [playerOne, setPlayerOne] = useState<PlayerEntity>();
  const [playerTwo, setPlayerTwo] = useState<PlayerEntity>();
  const [keyOne, setKeyOne] = useState<string>("");
  const [keyTwo, setKeyTwo] = useState<string>("");

  const { data, isFetched } = usePlayersEntityQuery(
    {
      playerOneId: keyOne,
      playerTwoId: keyTwo,
    },
    {
      enabled: !!gameId && (oneAddress !== "0x0" || twoAddress === "0x0"),
      refetchInterval: REFETCH_INTERVAL,
    },
  );

  useEffect(() => {
    if (
      !gameId ||
      !oneAddress ||
      oneAddress === "0x0" ||
      !twoAddress ||
      twoAddress === "0x0"
    )
      return;

    const one = ec.starkCurve.poseidonHashMany([
      num.toBigInt(gameId),
      num.toBigInt(oneAddress),
    ]);
    const two = ec.starkCurve.poseidonHashMany([
      num.toBigInt(gameId),
      num.toBigInt(twoAddress),
    ]);
    setKeyOne(num.toHex(one));
    setKeyTwo(num.toHex(two));
  }, [gameId, oneAddress, twoAddress]);

  useEffect(() => {
    const players = PlayersEntity.create(data as PlayersEntityData);
    if (players) {
      setPlayerOne(players.playerOne);
      setPlayerTwo(players.playerTwo);
    }
  }, [data]);

  return {
    playerOne,
    playerTwo,
    isFetched,
  };
};
