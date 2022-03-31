// @ts-nocheck
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLSchema, ExecutionResult } from 'graphql';

import { compileQuery, isCompiledQuery, CompilerOptions } from 'graphql-jit';
import { AggregateError, isAsyncIterable, mapAsyncIterator } from '@graphql-tools/utils';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

/** The block at which the query should be executed. */
export type Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Furo = {
  id: Scalars['ID'];
  streamCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
};

export type Furo_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  streamCount?: InputMaybe<Scalars['BigInt']>;
  streamCount_not?: InputMaybe<Scalars['BigInt']>;
  streamCount_gt?: InputMaybe<Scalars['BigInt']>;
  streamCount_lt?: InputMaybe<Scalars['BigInt']>;
  streamCount_gte?: InputMaybe<Scalars['BigInt']>;
  streamCount_lte?: InputMaybe<Scalars['BigInt']>;
  streamCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  streamCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount?: InputMaybe<Scalars['BigInt']>;
  userCount_not?: InputMaybe<Scalars['BigInt']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']>;
  userCount_lt?: InputMaybe<Scalars['BigInt']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount?: InputMaybe<Scalars['BigInt']>;
  transactionCount_not?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Furo_orderBy =
  | 'id'
  | 'streamCount'
  | 'userCount'
  | 'transactionCount';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  furo?: Maybe<Furo>;
  furos: Array<Furo>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  user?: Maybe<User>;
  users: Array<User>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryfuroArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfurosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Furo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Furo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transaction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryusersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Stream = {
  id: Scalars['ID'];
  recipient: User;
  amount: Scalars['BigInt'];
  withdrawnAmount: Scalars['BigInt'];
  token: Token;
  status: StreamStatus;
  createdBy: User;
  fromBentoBox: Scalars['Boolean'];
  startedAt: Scalars['BigInt'];
  expiresAt: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  modifiedAtBlock: Scalars['BigInt'];
  modifiedAtTimestamp: Scalars['BigInt'];
};

export type StreamStatus =
  | 'ACTIVE'
  | 'EXTENDED'
  | 'CANCELLED'
  | 'EXPIRED';

export type Stream_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  recipient?: InputMaybe<Scalars['String']>;
  recipient_not?: InputMaybe<Scalars['String']>;
  recipient_gt?: InputMaybe<Scalars['String']>;
  recipient_lt?: InputMaybe<Scalars['String']>;
  recipient_gte?: InputMaybe<Scalars['String']>;
  recipient_lte?: InputMaybe<Scalars['String']>;
  recipient_in?: InputMaybe<Array<Scalars['String']>>;
  recipient_not_in?: InputMaybe<Array<Scalars['String']>>;
  recipient_contains?: InputMaybe<Scalars['String']>;
  recipient_contains_nocase?: InputMaybe<Scalars['String']>;
  recipient_not_contains?: InputMaybe<Scalars['String']>;
  recipient_not_contains_nocase?: InputMaybe<Scalars['String']>;
  recipient_starts_with?: InputMaybe<Scalars['String']>;
  recipient_starts_with_nocase?: InputMaybe<Scalars['String']>;
  recipient_not_starts_with?: InputMaybe<Scalars['String']>;
  recipient_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  recipient_ends_with?: InputMaybe<Scalars['String']>;
  recipient_ends_with_nocase?: InputMaybe<Scalars['String']>;
  recipient_not_ends_with?: InputMaybe<Scalars['String']>;
  recipient_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawnAmount?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_not?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_gt?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_lt?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_gte?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_lte?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<StreamStatus>;
  status_not?: InputMaybe<StreamStatus>;
  status_in?: InputMaybe<Array<StreamStatus>>;
  status_not_in?: InputMaybe<Array<StreamStatus>>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdBy_not?: InputMaybe<Scalars['String']>;
  createdBy_gt?: InputMaybe<Scalars['String']>;
  createdBy_lt?: InputMaybe<Scalars['String']>;
  createdBy_gte?: InputMaybe<Scalars['String']>;
  createdBy_lte?: InputMaybe<Scalars['String']>;
  createdBy_in?: InputMaybe<Array<Scalars['String']>>;
  createdBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdBy_contains?: InputMaybe<Scalars['String']>;
  createdBy_contains_nocase?: InputMaybe<Scalars['String']>;
  createdBy_not_contains?: InputMaybe<Scalars['String']>;
  createdBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdBy_starts_with?: InputMaybe<Scalars['String']>;
  createdBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdBy_not_starts_with?: InputMaybe<Scalars['String']>;
  createdBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdBy_ends_with?: InputMaybe<Scalars['String']>;
  createdBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdBy_not_ends_with?: InputMaybe<Scalars['String']>;
  createdBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fromBentoBox?: InputMaybe<Scalars['Boolean']>;
  fromBentoBox_not?: InputMaybe<Scalars['Boolean']>;
  fromBentoBox_in?: InputMaybe<Array<Scalars['Boolean']>>;
  fromBentoBox_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  startedAt?: InputMaybe<Scalars['BigInt']>;
  startedAt_not?: InputMaybe<Scalars['BigInt']>;
  startedAt_gt?: InputMaybe<Scalars['BigInt']>;
  startedAt_lt?: InputMaybe<Scalars['BigInt']>;
  startedAt_gte?: InputMaybe<Scalars['BigInt']>;
  startedAt_lte?: InputMaybe<Scalars['BigInt']>;
  startedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiresAt?: InputMaybe<Scalars['BigInt']>;
  expiresAt_not?: InputMaybe<Scalars['BigInt']>;
  expiresAt_gt?: InputMaybe<Scalars['BigInt']>;
  expiresAt_lt?: InputMaybe<Scalars['BigInt']>;
  expiresAt_gte?: InputMaybe<Scalars['BigInt']>;
  expiresAt_lte?: InputMaybe<Scalars['BigInt']>;
  expiresAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiresAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount?: InputMaybe<Scalars['BigInt']>;
  transactionCount_not?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtBlock?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Stream_orderBy =
  | 'id'
  | 'recipient'
  | 'amount'
  | 'withdrawnAmount'
  | 'token'
  | 'status'
  | 'createdBy'
  | 'fromBentoBox'
  | 'startedAt'
  | 'expiresAt'
  | 'transactionCount'
  | 'createdAtBlock'
  | 'createdAtTimestamp'
  | 'modifiedAtBlock'
  | 'modifiedAtTimestamp';

export type Subscription = {
  furo?: Maybe<Furo>;
  furos: Array<Furo>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  user?: Maybe<User>;
  users: Array<User>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionfuroArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfurosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Furo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Furo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transaction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionusersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Token = {
  id: Scalars['ID'];
  symbol: Scalars['String'];
  symbolSuccess: Scalars['Boolean'];
  name: Scalars['String'];
  nameSuccess: Scalars['Boolean'];
  decimals: Scalars['BigInt'];
  decimalsSuccess: Scalars['Boolean'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};

export type Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbolSuccess?: InputMaybe<Scalars['Boolean']>;
  symbolSuccess_not?: InputMaybe<Scalars['Boolean']>;
  symbolSuccess_in?: InputMaybe<Array<Scalars['Boolean']>>;
  symbolSuccess_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nameSuccess?: InputMaybe<Scalars['Boolean']>;
  nameSuccess_not?: InputMaybe<Scalars['Boolean']>;
  nameSuccess_in?: InputMaybe<Array<Scalars['Boolean']>>;
  nameSuccess_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimalsSuccess?: InputMaybe<Scalars['Boolean']>;
  decimalsSuccess_not?: InputMaybe<Scalars['Boolean']>;
  decimalsSuccess_in?: InputMaybe<Array<Scalars['Boolean']>>;
  decimalsSuccess_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Token_orderBy =
  | 'id'
  | 'symbol'
  | 'symbolSuccess'
  | 'name'
  | 'nameSuccess'
  | 'decimals'
  | 'decimalsSuccess'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type Transaction = {
  id: Scalars['ID'];
  type?: Maybe<TransactionType>;
  stream: Stream;
  amount: Scalars['BigInt'];
  to: User;
  token: Token;
  toBentoBox: Scalars['Boolean'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};

export type TransactionType =
  | 'DEPOSIT'
  | 'EXTEND'
  | 'WITHDRAWAL'
  | 'DISBURSEMENT';

export type Transaction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  type?: InputMaybe<TransactionType>;
  type_not?: InputMaybe<TransactionType>;
  type_in?: InputMaybe<Array<TransactionType>>;
  type_not_in?: InputMaybe<Array<TransactionType>>;
  stream?: InputMaybe<Scalars['String']>;
  stream_not?: InputMaybe<Scalars['String']>;
  stream_gt?: InputMaybe<Scalars['String']>;
  stream_lt?: InputMaybe<Scalars['String']>;
  stream_gte?: InputMaybe<Scalars['String']>;
  stream_lte?: InputMaybe<Scalars['String']>;
  stream_in?: InputMaybe<Array<Scalars['String']>>;
  stream_not_in?: InputMaybe<Array<Scalars['String']>>;
  stream_contains?: InputMaybe<Scalars['String']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']>;
  stream_not_contains?: InputMaybe<Scalars['String']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']>;
  stream_starts_with?: InputMaybe<Scalars['String']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stream_not_starts_with?: InputMaybe<Scalars['String']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stream_ends_with?: InputMaybe<Scalars['String']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['String']>;
  to_not?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_contains_nocase?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']>;
  to_starts_with?: InputMaybe<Scalars['String']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']>;
  to_not_starts_with?: InputMaybe<Scalars['String']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  to_ends_with?: InputMaybe<Scalars['String']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']>;
  to_not_ends_with?: InputMaybe<Scalars['String']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  toBentoBox?: InputMaybe<Scalars['Boolean']>;
  toBentoBox_not?: InputMaybe<Scalars['Boolean']>;
  toBentoBox_in?: InputMaybe<Array<Scalars['Boolean']>>;
  toBentoBox_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Transaction_orderBy =
  | 'id'
  | 'type'
  | 'stream'
  | 'amount'
  | 'to'
  | 'token'
  | 'toBentoBox'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type User = {
  id: Scalars['ID'];
  revenueStreams: Array<Stream>;
  createdStreams: Array<Stream>;
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};


export type UserrevenueStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
};


export type UsercreatedStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
};

export type User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type User_orderBy =
  | 'id'
  | 'revenueStreams'
  | 'createdStreams'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Block_height: Block_height;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Furo: ResolverTypeWrapper<Furo>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Furo_filter: Furo_filter;
  Furo_orderBy: Furo_orderBy;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  Stream: ResolverTypeWrapper<Stream>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  StreamStatus: StreamStatus;
  Stream_filter: Stream_filter;
  String: ResolverTypeWrapper<Scalars['String']>;
  Stream_orderBy: Stream_orderBy;
  Subscription: ResolverTypeWrapper<{}>;
  Token: ResolverTypeWrapper<Token>;
  Token_filter: Token_filter;
  Token_orderBy: Token_orderBy;
  Transaction: ResolverTypeWrapper<Transaction>;
  TransactionType: TransactionType;
  Transaction_filter: Transaction_filter;
  Transaction_orderBy: Transaction_orderBy;
  User: ResolverTypeWrapper<User>;
  User_filter: User_filter;
  User_orderBy: User_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  Block_height: Block_height;
  Int: Scalars['Int'];
  Bytes: Scalars['Bytes'];
  Furo: Furo;
  ID: Scalars['ID'];
  Furo_filter: Furo_filter;
  Query: {};
  Stream: Stream;
  Boolean: Scalars['Boolean'];
  Stream_filter: Stream_filter;
  String: Scalars['String'];
  Subscription: {};
  Token: Token;
  Token_filter: Token_filter;
  Transaction: Transaction;
  Transaction_filter: Transaction_filter;
  User: User;
  User_filter: User_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type FuroResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Furo'] = ResolversParentTypes['Furo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  streamCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  furo?: Resolver<Maybe<ResolversTypes['Furo']>, ParentType, ContextType, RequireFields<QueryfuroArgs, 'id' | 'subgraphError'>>;
  furos?: Resolver<Array<ResolversTypes['Furo']>, ParentType, ContextType, RequireFields<QueryfurosArgs, 'skip' | 'first' | 'subgraphError'>>;
  stream?: Resolver<Maybe<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<QuerystreamArgs, 'id' | 'subgraphError'>>;
  streams?: Resolver<Array<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<QuerystreamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QuerytransactionArgs, 'id' | 'subgraphError'>>;
  transactions?: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QuerytransactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokenArgs, 'id' | 'subgraphError'>>;
  tokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id' | 'subgraphError'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryusersArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type StreamResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Stream'] = ResolversParentTypes['Stream']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  withdrawnAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['StreamStatus'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  fromBentoBox?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  modifiedAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  modifiedAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  furo?: SubscriptionResolver<Maybe<ResolversTypes['Furo']>, "furo", ParentType, ContextType, RequireFields<SubscriptionfuroArgs, 'id' | 'subgraphError'>>;
  furos?: SubscriptionResolver<Array<ResolversTypes['Furo']>, "furos", ParentType, ContextType, RequireFields<SubscriptionfurosArgs, 'skip' | 'first' | 'subgraphError'>>;
  stream?: SubscriptionResolver<Maybe<ResolversTypes['Stream']>, "stream", ParentType, ContextType, RequireFields<SubscriptionstreamArgs, 'id' | 'subgraphError'>>;
  streams?: SubscriptionResolver<Array<ResolversTypes['Stream']>, "streams", ParentType, ContextType, RequireFields<SubscriptionstreamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  transaction?: SubscriptionResolver<Maybe<ResolversTypes['Transaction']>, "transaction", ParentType, ContextType, RequireFields<SubscriptiontransactionArgs, 'id' | 'subgraphError'>>;
  transactions?: SubscriptionResolver<Array<ResolversTypes['Transaction']>, "transactions", ParentType, ContextType, RequireFields<SubscriptiontransactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: SubscriptionResolver<Maybe<ResolversTypes['Token']>, "token", ParentType, ContextType, RequireFields<SubscriptiontokenArgs, 'id' | 'subgraphError'>>;
  tokens?: SubscriptionResolver<Array<ResolversTypes['Token']>, "tokens", ParentType, ContextType, RequireFields<SubscriptiontokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  user?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "user", ParentType, ContextType, RequireFields<SubscriptionuserArgs, 'id' | 'subgraphError'>>;
  users?: SubscriptionResolver<Array<ResolversTypes['User']>, "users", ParentType, ContextType, RequireFields<SubscriptionusersArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type TokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbolSuccess?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameSuccess?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  decimalsSuccess?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['TransactionType']>, ParentType, ContextType>;
  stream?: Resolver<ResolversTypes['Stream'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  toBentoBox?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  revenueStreams?: Resolver<Array<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<UserrevenueStreamsArgs, 'skip' | 'first'>>;
  createdStreams?: Resolver<Array<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<UsercreatedStreamsArgs, 'skip' | 'first'>>;
  createdAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Furo?: FuroResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Stream?: StreamResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

import { MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';

import { InContextSdkMethod } from '@graphql-mesh/types';


    export namespace FurostreamKovanTypes {
      export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

/** The block at which the query should be executed. */
export type Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Furo = {
  id: Scalars['ID'];
  streamCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
};

export type Furo_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  streamCount?: InputMaybe<Scalars['BigInt']>;
  streamCount_not?: InputMaybe<Scalars['BigInt']>;
  streamCount_gt?: InputMaybe<Scalars['BigInt']>;
  streamCount_lt?: InputMaybe<Scalars['BigInt']>;
  streamCount_gte?: InputMaybe<Scalars['BigInt']>;
  streamCount_lte?: InputMaybe<Scalars['BigInt']>;
  streamCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  streamCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount?: InputMaybe<Scalars['BigInt']>;
  userCount_not?: InputMaybe<Scalars['BigInt']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']>;
  userCount_lt?: InputMaybe<Scalars['BigInt']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount?: InputMaybe<Scalars['BigInt']>;
  transactionCount_not?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Furo_orderBy =
  | 'id'
  | 'streamCount'
  | 'userCount'
  | 'transactionCount';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  furo?: Maybe<Furo>;
  furos: Array<Furo>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  user?: Maybe<User>;
  users: Array<User>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryfuroArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfurosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Furo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Furo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerystreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transaction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryuserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryusersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Stream = {
  id: Scalars['ID'];
  recipient: User;
  amount: Scalars['BigInt'];
  withdrawnAmount: Scalars['BigInt'];
  token: Token;
  status: StreamStatus;
  createdBy: User;
  fromBentoBox: Scalars['Boolean'];
  startedAt: Scalars['BigInt'];
  expiresAt: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  modifiedAtBlock: Scalars['BigInt'];
  modifiedAtTimestamp: Scalars['BigInt'];
};

export type StreamStatus =
  | 'ACTIVE'
  | 'EXTENDED'
  | 'CANCELLED'
  | 'EXPIRED';

export type Stream_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  recipient?: InputMaybe<Scalars['String']>;
  recipient_not?: InputMaybe<Scalars['String']>;
  recipient_gt?: InputMaybe<Scalars['String']>;
  recipient_lt?: InputMaybe<Scalars['String']>;
  recipient_gte?: InputMaybe<Scalars['String']>;
  recipient_lte?: InputMaybe<Scalars['String']>;
  recipient_in?: InputMaybe<Array<Scalars['String']>>;
  recipient_not_in?: InputMaybe<Array<Scalars['String']>>;
  recipient_contains?: InputMaybe<Scalars['String']>;
  recipient_contains_nocase?: InputMaybe<Scalars['String']>;
  recipient_not_contains?: InputMaybe<Scalars['String']>;
  recipient_not_contains_nocase?: InputMaybe<Scalars['String']>;
  recipient_starts_with?: InputMaybe<Scalars['String']>;
  recipient_starts_with_nocase?: InputMaybe<Scalars['String']>;
  recipient_not_starts_with?: InputMaybe<Scalars['String']>;
  recipient_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  recipient_ends_with?: InputMaybe<Scalars['String']>;
  recipient_ends_with_nocase?: InputMaybe<Scalars['String']>;
  recipient_not_ends_with?: InputMaybe<Scalars['String']>;
  recipient_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawnAmount?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_not?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_gt?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_lt?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_gte?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_lte?: InputMaybe<Scalars['BigInt']>;
  withdrawnAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<StreamStatus>;
  status_not?: InputMaybe<StreamStatus>;
  status_in?: InputMaybe<Array<StreamStatus>>;
  status_not_in?: InputMaybe<Array<StreamStatus>>;
  createdBy?: InputMaybe<Scalars['String']>;
  createdBy_not?: InputMaybe<Scalars['String']>;
  createdBy_gt?: InputMaybe<Scalars['String']>;
  createdBy_lt?: InputMaybe<Scalars['String']>;
  createdBy_gte?: InputMaybe<Scalars['String']>;
  createdBy_lte?: InputMaybe<Scalars['String']>;
  createdBy_in?: InputMaybe<Array<Scalars['String']>>;
  createdBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdBy_contains?: InputMaybe<Scalars['String']>;
  createdBy_contains_nocase?: InputMaybe<Scalars['String']>;
  createdBy_not_contains?: InputMaybe<Scalars['String']>;
  createdBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdBy_starts_with?: InputMaybe<Scalars['String']>;
  createdBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdBy_not_starts_with?: InputMaybe<Scalars['String']>;
  createdBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdBy_ends_with?: InputMaybe<Scalars['String']>;
  createdBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdBy_not_ends_with?: InputMaybe<Scalars['String']>;
  createdBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fromBentoBox?: InputMaybe<Scalars['Boolean']>;
  fromBentoBox_not?: InputMaybe<Scalars['Boolean']>;
  fromBentoBox_in?: InputMaybe<Array<Scalars['Boolean']>>;
  fromBentoBox_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  startedAt?: InputMaybe<Scalars['BigInt']>;
  startedAt_not?: InputMaybe<Scalars['BigInt']>;
  startedAt_gt?: InputMaybe<Scalars['BigInt']>;
  startedAt_lt?: InputMaybe<Scalars['BigInt']>;
  startedAt_gte?: InputMaybe<Scalars['BigInt']>;
  startedAt_lte?: InputMaybe<Scalars['BigInt']>;
  startedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiresAt?: InputMaybe<Scalars['BigInt']>;
  expiresAt_not?: InputMaybe<Scalars['BigInt']>;
  expiresAt_gt?: InputMaybe<Scalars['BigInt']>;
  expiresAt_lt?: InputMaybe<Scalars['BigInt']>;
  expiresAt_gte?: InputMaybe<Scalars['BigInt']>;
  expiresAt_lte?: InputMaybe<Scalars['BigInt']>;
  expiresAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiresAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount?: InputMaybe<Scalars['BigInt']>;
  transactionCount_not?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lt?: InputMaybe<Scalars['BigInt']>;
  transactionCount_gte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_lte?: InputMaybe<Scalars['BigInt']>;
  transactionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtBlock?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  modifiedAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  modifiedAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Stream_orderBy =
  | 'id'
  | 'recipient'
  | 'amount'
  | 'withdrawnAmount'
  | 'token'
  | 'status'
  | 'createdBy'
  | 'fromBentoBox'
  | 'startedAt'
  | 'expiresAt'
  | 'transactionCount'
  | 'createdAtBlock'
  | 'createdAtTimestamp'
  | 'modifiedAtBlock'
  | 'modifiedAtTimestamp';

export type Subscription = {
  furo?: Maybe<Furo>;
  furos: Array<Furo>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  user?: Maybe<User>;
  users: Array<User>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionfuroArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfurosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Furo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Furo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionstreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transaction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionuserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionusersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Token = {
  id: Scalars['ID'];
  symbol: Scalars['String'];
  symbolSuccess: Scalars['Boolean'];
  name: Scalars['String'];
  nameSuccess: Scalars['Boolean'];
  decimals: Scalars['BigInt'];
  decimalsSuccess: Scalars['Boolean'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};

export type Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbolSuccess?: InputMaybe<Scalars['Boolean']>;
  symbolSuccess_not?: InputMaybe<Scalars['Boolean']>;
  symbolSuccess_in?: InputMaybe<Array<Scalars['Boolean']>>;
  symbolSuccess_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nameSuccess?: InputMaybe<Scalars['Boolean']>;
  nameSuccess_not?: InputMaybe<Scalars['Boolean']>;
  nameSuccess_in?: InputMaybe<Array<Scalars['Boolean']>>;
  nameSuccess_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimalsSuccess?: InputMaybe<Scalars['Boolean']>;
  decimalsSuccess_not?: InputMaybe<Scalars['Boolean']>;
  decimalsSuccess_in?: InputMaybe<Array<Scalars['Boolean']>>;
  decimalsSuccess_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Token_orderBy =
  | 'id'
  | 'symbol'
  | 'symbolSuccess'
  | 'name'
  | 'nameSuccess'
  | 'decimals'
  | 'decimalsSuccess'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type Transaction = {
  id: Scalars['ID'];
  type?: Maybe<TransactionType>;
  stream: Stream;
  amount: Scalars['BigInt'];
  to: User;
  token: Token;
  toBentoBox: Scalars['Boolean'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};

export type TransactionType =
  | 'DEPOSIT'
  | 'EXTEND'
  | 'WITHDRAWAL'
  | 'DISBURSEMENT';

export type Transaction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  type?: InputMaybe<TransactionType>;
  type_not?: InputMaybe<TransactionType>;
  type_in?: InputMaybe<Array<TransactionType>>;
  type_not_in?: InputMaybe<Array<TransactionType>>;
  stream?: InputMaybe<Scalars['String']>;
  stream_not?: InputMaybe<Scalars['String']>;
  stream_gt?: InputMaybe<Scalars['String']>;
  stream_lt?: InputMaybe<Scalars['String']>;
  stream_gte?: InputMaybe<Scalars['String']>;
  stream_lte?: InputMaybe<Scalars['String']>;
  stream_in?: InputMaybe<Array<Scalars['String']>>;
  stream_not_in?: InputMaybe<Array<Scalars['String']>>;
  stream_contains?: InputMaybe<Scalars['String']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']>;
  stream_not_contains?: InputMaybe<Scalars['String']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']>;
  stream_starts_with?: InputMaybe<Scalars['String']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stream_not_starts_with?: InputMaybe<Scalars['String']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stream_ends_with?: InputMaybe<Scalars['String']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['String']>;
  to_not?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_contains_nocase?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']>;
  to_starts_with?: InputMaybe<Scalars['String']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']>;
  to_not_starts_with?: InputMaybe<Scalars['String']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  to_ends_with?: InputMaybe<Scalars['String']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']>;
  to_not_ends_with?: InputMaybe<Scalars['String']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  toBentoBox?: InputMaybe<Scalars['Boolean']>;
  toBentoBox_not?: InputMaybe<Scalars['Boolean']>;
  toBentoBox_in?: InputMaybe<Array<Scalars['Boolean']>>;
  toBentoBox_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Transaction_orderBy =
  | 'id'
  | 'type'
  | 'stream'
  | 'amount'
  | 'to'
  | 'token'
  | 'toBentoBox'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type User = {
  id: Scalars['ID'];
  revenueStreams: Array<Stream>;
  createdStreams: Array<Stream>;
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};


export type UserrevenueStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
};


export type UsercreatedStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
};

export type User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type User_orderBy =
  | 'id'
  | 'revenueStreams'
  | 'createdStreams'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

    }
    export type QueryFurostreamKovanSdk = {
  /** null **/
  furo: InContextSdkMethod<FurostreamKovanTypes.Query['furo'], FurostreamKovanTypes.QueryfuroArgs, MeshContext>,
  /** null **/
  furos: InContextSdkMethod<FurostreamKovanTypes.Query['furos'], FurostreamKovanTypes.QueryfurosArgs, MeshContext>,
  /** null **/
  stream: InContextSdkMethod<FurostreamKovanTypes.Query['stream'], FurostreamKovanTypes.QuerystreamArgs, MeshContext>,
  /** null **/
  streams: InContextSdkMethod<FurostreamKovanTypes.Query['streams'], FurostreamKovanTypes.QuerystreamsArgs, MeshContext>,
  /** null **/
  transaction: InContextSdkMethod<FurostreamKovanTypes.Query['transaction'], FurostreamKovanTypes.QuerytransactionArgs, MeshContext>,
  /** null **/
  transactions: InContextSdkMethod<FurostreamKovanTypes.Query['transactions'], FurostreamKovanTypes.QuerytransactionsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<FurostreamKovanTypes.Query['token'], FurostreamKovanTypes.QuerytokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<FurostreamKovanTypes.Query['tokens'], FurostreamKovanTypes.QuerytokensArgs, MeshContext>,
  /** null **/
  user: InContextSdkMethod<FurostreamKovanTypes.Query['user'], FurostreamKovanTypes.QueryuserArgs, MeshContext>,
  /** null **/
  users: InContextSdkMethod<FurostreamKovanTypes.Query['users'], FurostreamKovanTypes.QueryusersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<FurostreamKovanTypes.Query['_meta'], FurostreamKovanTypes.Query_metaArgs, MeshContext>
};

export type MutationFurostreamKovanSdk = {

};

export type SubscriptionFurostreamKovanSdk = {
  /** null **/
  furo: InContextSdkMethod<FurostreamKovanTypes.Subscription['furo'], FurostreamKovanTypes.SubscriptionfuroArgs, MeshContext>,
  /** null **/
  furos: InContextSdkMethod<FurostreamKovanTypes.Subscription['furos'], FurostreamKovanTypes.SubscriptionfurosArgs, MeshContext>,
  /** null **/
  stream: InContextSdkMethod<FurostreamKovanTypes.Subscription['stream'], FurostreamKovanTypes.SubscriptionstreamArgs, MeshContext>,
  /** null **/
  streams: InContextSdkMethod<FurostreamKovanTypes.Subscription['streams'], FurostreamKovanTypes.SubscriptionstreamsArgs, MeshContext>,
  /** null **/
  transaction: InContextSdkMethod<FurostreamKovanTypes.Subscription['transaction'], FurostreamKovanTypes.SubscriptiontransactionArgs, MeshContext>,
  /** null **/
  transactions: InContextSdkMethod<FurostreamKovanTypes.Subscription['transactions'], FurostreamKovanTypes.SubscriptiontransactionsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<FurostreamKovanTypes.Subscription['token'], FurostreamKovanTypes.SubscriptiontokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<FurostreamKovanTypes.Subscription['tokens'], FurostreamKovanTypes.SubscriptiontokensArgs, MeshContext>,
  /** null **/
  user: InContextSdkMethod<FurostreamKovanTypes.Subscription['user'], FurostreamKovanTypes.SubscriptionuserArgs, MeshContext>,
  /** null **/
  users: InContextSdkMethod<FurostreamKovanTypes.Subscription['users'], FurostreamKovanTypes.SubscriptionusersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<FurostreamKovanTypes.Subscription['_meta'], FurostreamKovanTypes.Subscription_metaArgs, MeshContext>
};

export type FurostreamKovanContext = {
      ["furostream_kovan"]: { Query: QueryFurostreamKovanSdk, Mutation: MutationFurostreamKovanSdk, Subscription: SubscriptionFurostreamKovanSdk },
    };

export type MeshContext = FurostreamKovanContext & BaseMeshContext;


import { getMesh } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import pathModule from 'path';
import { fileURLToPath } from '@graphql-mesh/utils';
import ExternalModule_0 from '@graphql-mesh/cache-inmemory-lru';
import ExternalModule_1 from '@graphql-mesh/graphql';
import ExternalModule_2 from '@graphql-mesh/merger-bare';
import ExternalModule_3 from './sources/furostream_kovan/schema.graphql.ts';

const importedModules: Record<string, any> = {
  // @ts-ignore
  ["@graphql-mesh/cache-inmemory-lru"]: ExternalModule_0,
  // @ts-ignore
  ["@graphql-mesh/graphql"]: ExternalModule_1,
  // @ts-ignore
  ["@graphql-mesh/merger-bare"]: ExternalModule_2,
  // @ts-ignore
  [".graphclient/sources/furostream_kovan/schema.graphql.ts"]: ExternalModule_3
};

const baseDir = pathModule.join(__dirname, '..');

const importFn = (moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  if (!(relativeModuleId in importedModules)) {
    throw new Error(`Cannot find module '${relativeModuleId}'.`);
  }
  return Promise.resolve(importedModules[relativeModuleId]);
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
}), {
  readonly: true,
  validate: false
});

import { GetMeshOptions } from '@graphql-mesh/runtime';
import { YamlConfig } from '@graphql-mesh/types';
import { parse } from 'graphql';
import { PubSub } from '@graphql-mesh/utils';
import MeshCache from '@graphql-mesh/cache-inmemory-lru';
import { DefaultLogger } from '@graphql-mesh/utils';
import GraphqlHandler from '@graphql-mesh/graphql'
import BareMerger from '@graphql-mesh/merger-bare';
import { resolveAdditionalResolvers } from '@graphql-mesh/utils';
export const rawConfig: YamlConfig.Config = {"sources":[{"name":"furostream_kovan","handler":{"graphql":{"endpoint":"https://api.thegraph.com/subgraphs/name/olastenberg/furostream-kovan"}}}],"documents":["./query.graphql"]} as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const cache = new (MeshCache as any)({
      ...(rawConfig.cache || {}),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
    } as any)
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger('🕸️');
const sources = [];
const transforms = [];
const furostreamKovanTransforms = [];
const additionalTypeDefs: DocumentNode[] = [] as any[];
const furostreamKovanHandler = new GraphqlHandler({
              name: rawConfig.sources[0].name,
              config: rawConfig.sources[0].handler["graphql"],
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child(rawConfig.sources[0].name),
              logger: logger.child(rawConfig.sources[0].name),
              importFn
            });
sources.push({
          name: 'furostream_kovan',
          handler: furostreamKovanHandler,
          transforms: furostreamKovanTransforms
        })
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('BareMerger'),
        store: rootStore.child('bareMerger')
      })
const additionalResolversRawConfig = [];
const additionalResolvers = await resolveAdditionalResolvers(
      baseDir,
      additionalResolversRawConfig,
      importFn,
      pubsub
  )
const liveQueryInvalidations = rawConfig.liveQueryInvalidations;
const additionalEnvelopPlugins = [];

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    liveQueryInvalidations,
    additionalEnvelopPlugins,
  };
}

export const documentsInSDL = /*#__PURE__*/ [/* GraphQL */`query UserStreams($id: String) {
  user(id: $id) {
    revenueStreams(orderBy: startedAt) {
      id
      status
      startedAt
      expiresAt
      amount
      withdrawnAmount
      token {
        id
        symbol
        name
      }
    }
    createdStreams(orderBy: startedAt) {
      id
      status
      startedAt
      expiresAt
      amount
      withdrawnAmount
      token {
        id
        symbol
        name
      }
    }
  }
}`];

export async function getBuiltGraphClient(): Promise<MeshInstance<MeshContext>> {
  const meshConfig = await getMeshOptions();
  return getMesh<MeshContext>(meshConfig);
}

export async function getBuiltGraphSDK<TGlobalContext = any, TGlobalRoot = any, TOperationContext = any, TOperationRoot = any>(sdkOptions?: SdkOptions<TGlobalContext, TGlobalRoot>) {
  const { schema } = await getBuiltGraphClient();
  return getSdk<TGlobalContext, TGlobalRoot, TOperationContext, TOperationRoot>(schema, sdkOptions);
}
export type UserStreamsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type UserStreamsQuery = { user?: Maybe<{ revenueStreams: Array<(
      Pick<Stream, 'id' | 'status' | 'startedAt' | 'expiresAt' | 'amount' | 'withdrawnAmount'>
      & { token: Pick<Token, 'id' | 'symbol' | 'name'> }
    )>, createdStreams: Array<(
      Pick<Stream, 'id' | 'status' | 'startedAt' | 'expiresAt' | 'amount' | 'withdrawnAmount'>
      & { token: Pick<Token, 'id' | 'symbol' | 'name'> }
    )> }> };


export const UserStreamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserStreams"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revenueStreams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"startedAt"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdStreams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"startedAt"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserStreamsQuery, UserStreamsQueryVariables>;


function handleExecutionResult<T>(result: ExecutionResult, operationName: string) {
  if (result.errors) {
    const originalErrors = result.errors.map(error => error.originalError|| error);
    throw new AggregateError(originalErrors, `Failed to execute ${operationName}: \n\t${originalErrors.join('\n\t')}`);
  }
  return result.data as unknown as T;
}
export interface SdkOptions<TGlobalContext = any, TGlobalRoot = any> {
  globalContext?: TGlobalContext;
  globalRoot?: TGlobalRoot;
  jitOptions?: Partial<CompilerOptions>;
}
export function getSdk<TGlobalContext = any, TGlobalRoot = any, TOperationContext = any, TOperationRoot = any>(schema: GraphQLSchema, { globalContext, globalRoot, jitOptions = {} }: SdkOptions<TGlobalContext, TGlobalRoot> = {}) {
    const UserStreamsCompiled = compileQuery(schema, UserStreamsDocument, 'UserStreams', jitOptions);
    if(!(isCompiledQuery(UserStreamsCompiled))) {
      const originalErrors = UserStreamsCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile UserStreams: \n\t${originalErrors.join('\n\t')}`);
    }

  return {
    async UserStreams(variables?: UserStreamsQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<UserStreamsQuery> {
      const result = await UserStreamsCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'UserStreams');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;