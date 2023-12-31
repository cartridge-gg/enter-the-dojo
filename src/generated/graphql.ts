import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  QueryFunctionContext,
} from "react-query";
import { useFetchData } from "@/hooks/fetcher";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ContractAddress: any;
  Cursor: any;
  DateTime: any;
  felt252: any;
  u8: any;
  u32: any;
};

export type Component = {
  __typename?: "Component";
  classHash?: Maybe<Scalars["felt252"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  transactionHash?: Maybe<Scalars["felt252"]>;
};

export type ComponentConnection = {
  __typename?: "ComponentConnection";
  edges?: Maybe<Array<Maybe<ComponentEdge>>>;
  totalCount: Scalars["Int"];
};

export type ComponentEdge = {
  __typename?: "ComponentEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<Component>;
};

export type ComponentUnion = Game | Health | Special;

export enum Direction {
  Asc = "ASC",
  Desc = "DESC",
}

export type Entity = {
  __typename?: "Entity";
  componentNames?: Maybe<Scalars["String"]>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["ID"]>;
  keys?: Maybe<Array<Maybe<Scalars["String"]>>>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type EntityConnection = {
  __typename?: "EntityConnection";
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars["Int"];
};

export type EntityEdge = {
  __typename?: "EntityEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: "Event";
  createdAt?: Maybe<Scalars["DateTime"]>;
  data?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  keys?: Maybe<Scalars["String"]>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars["Int"]>;
};

export type EventConnection = {
  __typename?: "EventConnection";
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars["Int"];
};

export type EventEdge = {
  __typename?: "EventEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<Event>;
};

export type Game = {
  __typename?: "Game";
  entity?: Maybe<Entity>;
  next_to_move?: Maybe<Scalars["ContractAddress"]>;
  num_moves?: Maybe<Scalars["u32"]>;
  player_one?: Maybe<Scalars["ContractAddress"]>;
  player_two?: Maybe<Scalars["ContractAddress"]>;
  winner?: Maybe<Scalars["ContractAddress"]>;
};

export type GameConnection = {
  __typename?: "GameConnection";
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  totalCount: Scalars["Int"];
};

export type GameEdge = {
  __typename?: "GameEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<Game>;
};

export type GameOrder = {
  direction: Direction;
  field: GameOrderOrderField;
};

export enum GameOrderOrderField {
  NextToMove = "NEXT_TO_MOVE",
  NumMoves = "NUM_MOVES",
  PlayerOne = "PLAYER_ONE",
  PlayerTwo = "PLAYER_TWO",
  Winner = "WINNER",
}

export type GameWhereInput = {
  next_to_move?: InputMaybe<Scalars["String"]>;
  next_to_moveGT?: InputMaybe<Scalars["String"]>;
  next_to_moveGTE?: InputMaybe<Scalars["String"]>;
  next_to_moveLT?: InputMaybe<Scalars["String"]>;
  next_to_moveLTE?: InputMaybe<Scalars["String"]>;
  next_to_moveNEQ?: InputMaybe<Scalars["String"]>;
  num_moves?: InputMaybe<Scalars["Int"]>;
  num_movesGT?: InputMaybe<Scalars["Int"]>;
  num_movesGTE?: InputMaybe<Scalars["Int"]>;
  num_movesLT?: InputMaybe<Scalars["Int"]>;
  num_movesLTE?: InputMaybe<Scalars["Int"]>;
  num_movesNEQ?: InputMaybe<Scalars["Int"]>;
  player_one?: InputMaybe<Scalars["String"]>;
  player_oneGT?: InputMaybe<Scalars["String"]>;
  player_oneGTE?: InputMaybe<Scalars["String"]>;
  player_oneLT?: InputMaybe<Scalars["String"]>;
  player_oneLTE?: InputMaybe<Scalars["String"]>;
  player_oneNEQ?: InputMaybe<Scalars["String"]>;
  player_two?: InputMaybe<Scalars["String"]>;
  player_twoGT?: InputMaybe<Scalars["String"]>;
  player_twoGTE?: InputMaybe<Scalars["String"]>;
  player_twoLT?: InputMaybe<Scalars["String"]>;
  player_twoLTE?: InputMaybe<Scalars["String"]>;
  player_twoNEQ?: InputMaybe<Scalars["String"]>;
  winner?: InputMaybe<Scalars["String"]>;
  winnerGT?: InputMaybe<Scalars["String"]>;
  winnerGTE?: InputMaybe<Scalars["String"]>;
  winnerLT?: InputMaybe<Scalars["String"]>;
  winnerLTE?: InputMaybe<Scalars["String"]>;
  winnerNEQ?: InputMaybe<Scalars["String"]>;
};

export type Health = {
  __typename?: "Health";
  amount?: Maybe<Scalars["u8"]>;
  entity?: Maybe<Entity>;
};

export type HealthConnection = {
  __typename?: "HealthConnection";
  edges?: Maybe<Array<Maybe<HealthEdge>>>;
  totalCount: Scalars["Int"];
};

export type HealthEdge = {
  __typename?: "HealthEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<Health>;
};

export type HealthOrder = {
  direction: Direction;
  field: HealthOrderOrderField;
};

export enum HealthOrderOrderField {
  Amount = "AMOUNT",
}

export type HealthWhereInput = {
  amount?: InputMaybe<Scalars["Int"]>;
  amountGT?: InputMaybe<Scalars["Int"]>;
  amountGTE?: InputMaybe<Scalars["Int"]>;
  amountLT?: InputMaybe<Scalars["Int"]>;
  amountLTE?: InputMaybe<Scalars["Int"]>;
  amountNEQ?: InputMaybe<Scalars["Int"]>;
};

export type Query = {
  __typename?: "Query";
  component: Component;
  components?: Maybe<ComponentConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  gameComponents?: Maybe<GameConnection>;
  healthComponents?: Maybe<HealthConnection>;
  specialComponents?: Maybe<SpecialConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
};

export type QueryComponentArgs = {
  id: Scalars["ID"];
};

export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  keys?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type QueryEntityArgs = {
  id: Scalars["ID"];
};

export type QueryEventArgs = {
  id: Scalars["ID"];
};

export type QueryGameComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};

export type QueryHealthComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  order?: InputMaybe<HealthOrder>;
  where?: InputMaybe<HealthWhereInput>;
};

export type QuerySpecialComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]>;
  before?: InputMaybe<Scalars["Cursor"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  order?: InputMaybe<SpecialOrder>;
  where?: InputMaybe<SpecialWhereInput>;
};

export type QuerySystemArgs = {
  id: Scalars["ID"];
};

export type QuerySystemCallArgs = {
  id: Scalars["Int"];
};

export type Special = {
  __typename?: "Special";
  entity?: Maybe<Entity>;
  remaining?: Maybe<Scalars["u8"]>;
};

export type SpecialConnection = {
  __typename?: "SpecialConnection";
  edges?: Maybe<Array<Maybe<SpecialEdge>>>;
  totalCount: Scalars["Int"];
};

export type SpecialEdge = {
  __typename?: "SpecialEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<Special>;
};

export type SpecialOrder = {
  direction: Direction;
  field: SpecialOrderOrderField;
};

export enum SpecialOrderOrderField {
  Remaining = "REMAINING",
}

export type SpecialWhereInput = {
  remaining?: InputMaybe<Scalars["Int"]>;
  remainingGT?: InputMaybe<Scalars["Int"]>;
  remainingGTE?: InputMaybe<Scalars["Int"]>;
  remainingLT?: InputMaybe<Scalars["Int"]>;
  remainingLTE?: InputMaybe<Scalars["Int"]>;
  remainingNEQ?: InputMaybe<Scalars["Int"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  componentRegistered: Component;
  entityUpdated: Entity;
};

export type System = {
  __typename?: "System";
  classHash?: Maybe<Scalars["felt252"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars["felt252"]>;
};

export type SystemCall = {
  __typename?: "SystemCall";
  createdAt?: Maybe<Scalars["DateTime"]>;
  data?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  system: System;
  systemId?: Maybe<Scalars["ID"]>;
  transactionHash?: Maybe<Scalars["String"]>;
};

export type SystemCallConnection = {
  __typename?: "SystemCallConnection";
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars["Int"];
};

export type SystemCallEdge = {
  __typename?: "SystemCallEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: "SystemConnection";
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars["Int"];
};

export type SystemEdge = {
  __typename?: "SystemEdge";
  cursor: Scalars["Cursor"];
  node?: Maybe<System>;
};

export type AvailableGamesQueryVariables = Exact<{
  limit: Scalars["Int"];
}>;

export type AvailableGamesQuery = {
  __typename?: "Query";
  gameComponents?: {
    __typename?: "GameConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "GameEdge";
      cursor: any;
      node?: {
        __typename?: "Game";
        player_one?: any | null;
        entity?: {
          __typename?: "Entity";
          keys?: Array<string | null> | null;
        } | null;
      } | null;
    } | null> | null;
  } | null;
};

export type EntitiesQueryVariables = Exact<{
  gameId: Scalars["String"];
}>;

export type EntitiesQuery = {
  __typename?: "Query";
  entities?: {
    __typename?: "EntityConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "EntityEdge";
      node?: {
        __typename?: "Entity";
        keys?: Array<string | null> | null;
        components?: Array<
          | {
              __typename: "Game";
              player_one?: any | null;
              player_two?: any | null;
              next_to_move?: any | null;
              winner?: any | null;
            }
          | { __typename: "Health"; amount?: any | null }
          | { __typename: "Special" }
          | null
        > | null;
      } | null;
    } | null> | null;
  } | null;
};

export const AvailableGamesDocument = `
    query AvailableGames($limit: Int!) {
  gameComponents(first: $limit, where: {player_two: "0x0"}) {
    totalCount
    edges {
      cursor
      node {
        player_one
        entity {
          keys
        }
      }
    }
  }
}
    `;
export const useAvailableGamesQuery = <
  TData = AvailableGamesQuery,
  TError = unknown,
>(
  variables: AvailableGamesQueryVariables,
  options?: UseQueryOptions<AvailableGamesQuery, TError, TData>,
) =>
  useQuery<AvailableGamesQuery, TError, TData>(
    ["AvailableGames", variables],
    useFetchData<AvailableGamesQuery, AvailableGamesQueryVariables>(
      AvailableGamesDocument,
    ).bind(null, variables),
    options,
  );

useAvailableGamesQuery.getKey = (variables: AvailableGamesQueryVariables) => [
  "AvailableGames",
  variables,
];
export const useInfiniteAvailableGamesQuery = <
  TData = AvailableGamesQuery,
  TError = unknown,
>(
  variables: AvailableGamesQueryVariables,
  options?: UseInfiniteQueryOptions<AvailableGamesQuery, TError, TData>,
) => {
  const query = useFetchData<AvailableGamesQuery, AvailableGamesQueryVariables>(
    AvailableGamesDocument,
  );
  return useInfiniteQuery<AvailableGamesQuery, TError, TData>(
    ["AvailableGames.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfiniteAvailableGamesQuery.getKey = (
  variables: AvailableGamesQueryVariables,
) => ["AvailableGames.infinite", variables];
export const EntitiesDocument = `
    query Entities($gameId: String!) {
  entities(keys: [$gameId]) {
    totalCount
    edges {
      node {
        keys
        components {
          __typename
          ... on Game {
            player_one
            player_two
            next_to_move
            winner
          }
          ... on Health {
            amount
          }
        }
      }
    }
  }
}
    `;
export const useEntitiesQuery = <TData = EntitiesQuery, TError = unknown>(
  variables: EntitiesQueryVariables,
  options?: UseQueryOptions<EntitiesQuery, TError, TData>,
) =>
  useQuery<EntitiesQuery, TError, TData>(
    ["Entities", variables],
    useFetchData<EntitiesQuery, EntitiesQueryVariables>(EntitiesDocument).bind(
      null,
      variables,
    ),
    options,
  );

useEntitiesQuery.getKey = (variables: EntitiesQueryVariables) => [
  "Entities",
  variables,
];
export const useInfiniteEntitiesQuery = <
  TData = EntitiesQuery,
  TError = unknown,
>(
  variables: EntitiesQueryVariables,
  options?: UseInfiniteQueryOptions<EntitiesQuery, TError, TData>,
) => {
  const query = useFetchData<EntitiesQuery, EntitiesQueryVariables>(
    EntitiesDocument,
  );
  return useInfiniteQuery<EntitiesQuery, TError, TData>(
    ["Entities.infinite", variables],
    (metaData) => query({ ...variables, ...(metaData.pageParam ?? {}) }),
    options,
  );
};

useInfiniteEntitiesQuery.getKey = (variables: EntitiesQueryVariables) => [
  "Entities.infinite",
  variables,
];
