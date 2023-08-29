import { InvokeTransactionReceiptResponse, num, shortString } from "starknet";

// events are keyed by the poseidon hash of the event name
export enum DojoEvents {
  GameCreated = "0x230f942bb2087887c3b1dd964c716614bb6df172214f22409fefb734d96a4d2",
  GameOver = "0x165460ded86991fa560a0d331810f83651da90c5df6d4b61357c3b3807ff41c",
  PlayerJoined = "0x214916ce0265d355fd91110809ffba7b5e672b108a8beea3dd235818431264b",
  PlayerAttacked = "0xbd6fc100b1379e91b7597179bead271adc63454e770ed90bc9b66247a86c84",
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
  const raw = receipt.events?.find((e) => e.keys[0] === eventType);

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
