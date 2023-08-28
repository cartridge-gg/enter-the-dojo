import { InvokeTransactionReceiptResponse, num, shortString } from "starknet";

export enum DojoEvents {
  GameCreated = "GameCreated",
  GameOver = "GameOver",
  PlayerJoined = "PlayerJoined",
  PlayerAttacked = "PlayerAttacked",
}

export interface BaseEventData {
  gameId: string;
}

export interface CreatedEventData extends BaseEventData {
  creator: string;
}

export interface JoinedEventData extends BaseEventData {
  playerId: string;
}

export interface AttackedEventData extends BaseEventData {
  playerId: string;
  opponentId: string;
  action: number;
  damage: number;
}

export interface OverEventData extends BaseEventData {
  winner: string;
  loser: string;
}

export const parseEvent = (
  receipt: InvokeTransactionReceiptResponse,
  eventType: DojoEvents,
): BaseEventData => {
  const raw = receipt.events?.find(
    (e) => shortString.decodeShortString(e.keys[0]) === eventType,
  );

  if (!raw) {
    throw new Error(`event not found`);
  }

  switch (eventType) {
    case DojoEvents.GameCreated:
      return {
        gameId: num.toHexString(raw.data[0]),
        creator: num.toHexString(raw.data[1]),
      } as CreatedEventData;

    case DojoEvents.PlayerJoined:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
      } as JoinedEventData;

    case DojoEvents.PlayerAttacked:
      return {
        gameId: num.toHexString(raw.data[0]),
        playerId: num.toHexString(raw.data[1]),
        opponentId: num.toHexString(raw.data[2]),
        action: Number(raw.data[3]),
        damage: Number(raw.data[4]),
      } as JoinedEventData;

    case DojoEvents.GameOver:
      return {
        gameId: num.toHexString(raw.data[0]),
        winner: num.toHexString(raw.data[1]),
        loser: num.toHexString(raw.data[2]),
      } as OverEventData;

    default:
      throw new Error(`event parse not implemented: ${eventType}`);
  }
};
