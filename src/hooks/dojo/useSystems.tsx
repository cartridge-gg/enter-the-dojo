import { BaseEventData, DojoEvents, parseEvent } from "@/utils/event";
import { useCallback } from "react";
import { useDojo } from ".";

export enum Action {
  Light = 0,
  Heavy = 1,
}

export interface SystemsInterface {
  create: () => Promise<SystemExecuteResult>;
  join: (gameId: string) => Promise<SystemExecuteResult>;
  attack: (gameId: string, action: Action) => Promise<SystemExecuteResult>;
  isPending: boolean;
  error?: Error;
}

export interface SystemExecuteResult {
  hash: string;
  event?: BaseEventData;
}

export const useSystems = (): SystemsInterface => {
  const { execute, account, error, isPending } = useDojo();

  const executeAndReciept = useCallback(
    async (method: string, params: Array<string | number>) => {
      if (!account) {
        throw new Error("No account connected");
      }

      try {
        const hash = await execute(method, params);
        return await account.getTransactionReceipt(hash);
      } catch (err) {
        console.error(`Error execute ${method}`, err);
        throw err;
      }
    },
    [execute, account],
  );

  const create = useCallback(async () => {
    const receipt = await executeAndReciept("create", []);
    const event = parseEvent(receipt, DojoEvents.GameCreated);

    return {
      hash: receipt.transaction_hash,
      event,
    };
  }, [executeAndReciept]);

  const join = useCallback(
    async (gameId: string) => {
      console.log(gameId);
      const receipt = await executeAndReciept("join", [gameId]);
      const event = parseEvent(receipt, DojoEvents.PlayerJoined);

      return {
        hash: receipt.transaction_hash,
        event,
      };
    },
    [executeAndReciept],
  );

  const attack = useCallback(
    async (gameId: string, action: Action) => {
      const receipt = await executeAndReciept("attack", [gameId, action]);
      const event = parseEvent(receipt, DojoEvents.PlayerAttacked);

      return {
        hash: receipt.transaction_hash,
        event,
      };
    },
    [executeAndReciept],
  );

  return {
    create,
    join,
    attack,
    isPending,
    error,
  };
};
