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

export type Query = {
  furoStream?: Maybe<FuroStream>;
  furoStreams: Array<FuroStream>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  token?: Maybe<VestingToken>;
  tokens: Array<VestingToken>;
  user?: Maybe<User>;
  users: Array<User>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  furoVesting?: Maybe<FuroVesting>;
  furoVestings: Array<FuroVesting>;
  vesting?: Maybe<Vesting>;
  vestings: Array<Vesting>;
  schedule?: Maybe<Schedule>;
  schedules: Array<Schedule>;
  schedulePeriod?: Maybe<SchedulePeriod>;
  schedulePeriods: Array<SchedulePeriod>;
  vestingTransaction?: Maybe<VestingTransaction>;
  vestingTransactions: Array<VestingTransaction>;
  vestingUser?: Maybe<VestingUser>;
  vestingUsers: Array<VestingUser>;
};


export type QueryfuroStreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfuroStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroStream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroStream_filter>;
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


export type QueryfuroVestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfuroVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroVesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroVesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryscheduleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschedulesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Schedule_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schedule_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschedulePeriodArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschedulePeriodsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SchedulePeriod_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SchedulePeriod_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingTransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingTransactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transaction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscription = {
  furoStream?: Maybe<FuroStream>;
  furoStreams: Array<FuroStream>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  transaction?: Maybe<VestingTransaction>;
  transactions: Array<VestingTransaction>;
  token?: Maybe<VestingToken>;
  tokens: Array<VestingToken>;
  user?: Maybe<VestingUser>;
  users: Array<VestingUser>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  furoVesting?: Maybe<FuroVesting>;
  furoVestings: Array<FuroVesting>;
  vesting?: Maybe<Vesting>;
  vestings: Array<Vesting>;
  schedule?: Maybe<Schedule>;
  schedules: Array<Schedule>;
  schedulePeriod?: Maybe<SchedulePeriod>;
  schedulePeriods: Array<SchedulePeriod>;
};


export type SubscriptionfuroStreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfuroStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroStream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroStream_filter>;
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


export type SubscriptionfuroVestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfuroVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroVesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroVesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionvestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionvestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionscheduleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschedulesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Schedule_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schedule_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschedulePeriodArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschedulePeriodsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SchedulePeriod_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SchedulePeriod_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
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

export type FuroStream = {
  id: Scalars['ID'];
  streamCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
};

export type FuroStream_filter = {
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

export type FuroStream_orderBy =
  | 'id'
  | 'streamCount'
  | 'userCount'
  | 'transactionCount';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

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
  vesting?: InputMaybe<Scalars['String']>;
  vesting_not?: InputMaybe<Scalars['String']>;
  vesting_gt?: InputMaybe<Scalars['String']>;
  vesting_lt?: InputMaybe<Scalars['String']>;
  vesting_gte?: InputMaybe<Scalars['String']>;
  vesting_lte?: InputMaybe<Scalars['String']>;
  vesting_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_not_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_contains?: InputMaybe<Scalars['String']>;
  vesting_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_contains?: InputMaybe<Scalars['String']>;
  vesting_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_starts_with?: InputMaybe<Scalars['String']>;
  vesting_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_ends_with?: InputMaybe<Scalars['String']>;
  vesting_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  | 'createdAtTimestamp'
  | 'vesting';

export type User = {
  id: Scalars['ID'];
  incomingStreams: Array<Stream>;
  outgoingStreams: Array<Stream>;
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};


export type UserincomingStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
};


export type UseroutgoingStreamsArgs = {
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
  | 'incomingStreams'
  | 'outgoingStreams'
  | 'createdAtBlock'
  | 'createdAtTimestamp'
  | 'incomingVestings'
  | 'outgoingVestings';

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

export type FuroVesting = {
  id: Scalars['ID'];
  vestingCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
};

export type FuroVesting_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  vestingCount?: InputMaybe<Scalars['BigInt']>;
  vestingCount_not?: InputMaybe<Scalars['BigInt']>;
  vestingCount_gt?: InputMaybe<Scalars['BigInt']>;
  vestingCount_lt?: InputMaybe<Scalars['BigInt']>;
  vestingCount_gte?: InputMaybe<Scalars['BigInt']>;
  vestingCount_lte?: InputMaybe<Scalars['BigInt']>;
  vestingCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  vestingCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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

export type FuroVesting_orderBy =
  | 'id'
  | 'vestingCount'
  | 'userCount'
  | 'transactionCount';

export type Schedule = {
  id: Scalars['ID'];
  vesting: Vesting;
  periods: Array<SchedulePeriod>;
};


export type ScheduleperiodsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SchedulePeriod_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SchedulePeriod_filter>;
};

export type SchedulePeriod = {
  id: Scalars['ID'];
  schedule: Schedule;
  time: Scalars['BigInt'];
  type: SchedulePeriodType;
  amount: Scalars['BigInt'];
};

export type SchedulePeriodType =
  | 'START'
  | 'CLIFF'
  | 'STEP'
  | 'END';

export type SchedulePeriod_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  schedule?: InputMaybe<Scalars['String']>;
  schedule_not?: InputMaybe<Scalars['String']>;
  schedule_gt?: InputMaybe<Scalars['String']>;
  schedule_lt?: InputMaybe<Scalars['String']>;
  schedule_gte?: InputMaybe<Scalars['String']>;
  schedule_lte?: InputMaybe<Scalars['String']>;
  schedule_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_not_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_contains?: InputMaybe<Scalars['String']>;
  schedule_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_contains?: InputMaybe<Scalars['String']>;
  schedule_not_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_starts_with?: InputMaybe<Scalars['String']>;
  schedule_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_ends_with?: InputMaybe<Scalars['String']>;
  schedule_ends_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  type?: InputMaybe<SchedulePeriodType>;
  type_not?: InputMaybe<SchedulePeriodType>;
  type_in?: InputMaybe<Array<SchedulePeriodType>>;
  type_not_in?: InputMaybe<Array<SchedulePeriodType>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type SchedulePeriod_orderBy =
  | 'id'
  | 'schedule'
  | 'time'
  | 'type'
  | 'amount';

export type Schedule_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  vesting?: InputMaybe<Scalars['String']>;
  vesting_not?: InputMaybe<Scalars['String']>;
  vesting_gt?: InputMaybe<Scalars['String']>;
  vesting_lt?: InputMaybe<Scalars['String']>;
  vesting_gte?: InputMaybe<Scalars['String']>;
  vesting_lte?: InputMaybe<Scalars['String']>;
  vesting_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_not_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_contains?: InputMaybe<Scalars['String']>;
  vesting_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_contains?: InputMaybe<Scalars['String']>;
  vesting_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_starts_with?: InputMaybe<Scalars['String']>;
  vesting_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_ends_with?: InputMaybe<Scalars['String']>;
  vesting_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
};

export type Schedule_orderBy =
  | 'id'
  | 'vesting'
  | 'periods';

export type VestingToken = {
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

export type VestingTransaction = {
  id: Scalars['ID'];
  type: TransactionType;
  vesting: Vesting;
  amount: Scalars['BigInt'];
  to: VestingUser;
  token: VestingToken;
  toBentoBox: Scalars['Boolean'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};

export type VestingUser = {
  id: Scalars['ID'];
  incomingVestings: Array<Vesting>;
  outgoingVestings: Array<Vesting>;
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};


export type VestingUserincomingVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
};


export type VestingUseroutgoingVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
};

export type Vesting = {
  id: Scalars['ID'];
  recipient: VestingUser;
  cliffDuration: Scalars['BigInt'];
  stepDuration: Scalars['BigInt'];
  steps: Scalars['BigInt'];
  cliffAmount: Scalars['BigInt'];
  stepAmount: Scalars['BigInt'];
  totalAmount: Scalars['BigInt'];
  withdrawnAmount: Scalars['BigInt'];
  token: VestingToken;
  schedule: Schedule;
  status: VestingStatus;
  createdBy: VestingUser;
  fromBentoBox: Scalars['Boolean'];
  startedAt: Scalars['BigInt'];
  expiresAt: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  cancelledAtBlock: Scalars['BigInt'];
  cancelledAtTimestamp: Scalars['BigInt'];
};

export type VestingStatus =
  | 'ACTIVE'
  | 'CANCELLED'
  | 'EXPIRED';

export type Vesting_filter = {
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
  cliffDuration?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_not?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_gt?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_lt?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_gte?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_lte?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cliffDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepDuration?: InputMaybe<Scalars['BigInt']>;
  stepDuration_not?: InputMaybe<Scalars['BigInt']>;
  stepDuration_gt?: InputMaybe<Scalars['BigInt']>;
  stepDuration_lt?: InputMaybe<Scalars['BigInt']>;
  stepDuration_gte?: InputMaybe<Scalars['BigInt']>;
  stepDuration_lte?: InputMaybe<Scalars['BigInt']>;
  stepDuration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  steps?: InputMaybe<Scalars['BigInt']>;
  steps_not?: InputMaybe<Scalars['BigInt']>;
  steps_gt?: InputMaybe<Scalars['BigInt']>;
  steps_lt?: InputMaybe<Scalars['BigInt']>;
  steps_gte?: InputMaybe<Scalars['BigInt']>;
  steps_lte?: InputMaybe<Scalars['BigInt']>;
  steps_in?: InputMaybe<Array<Scalars['BigInt']>>;
  steps_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cliffAmount?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_not?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_gt?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_lt?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_gte?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_lte?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cliffAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepAmount?: InputMaybe<Scalars['BigInt']>;
  stepAmount_not?: InputMaybe<Scalars['BigInt']>;
  stepAmount_gt?: InputMaybe<Scalars['BigInt']>;
  stepAmount_lt?: InputMaybe<Scalars['BigInt']>;
  stepAmount_gte?: InputMaybe<Scalars['BigInt']>;
  stepAmount_lte?: InputMaybe<Scalars['BigInt']>;
  stepAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmount?: InputMaybe<Scalars['BigInt']>;
  totalAmount_not?: InputMaybe<Scalars['BigInt']>;
  totalAmount_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmount_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmount_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmount_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  schedule?: InputMaybe<Scalars['String']>;
  schedule_not?: InputMaybe<Scalars['String']>;
  schedule_gt?: InputMaybe<Scalars['String']>;
  schedule_lt?: InputMaybe<Scalars['String']>;
  schedule_gte?: InputMaybe<Scalars['String']>;
  schedule_lte?: InputMaybe<Scalars['String']>;
  schedule_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_not_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_contains?: InputMaybe<Scalars['String']>;
  schedule_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_contains?: InputMaybe<Scalars['String']>;
  schedule_not_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_starts_with?: InputMaybe<Scalars['String']>;
  schedule_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_ends_with?: InputMaybe<Scalars['String']>;
  schedule_ends_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<VestingStatus>;
  status_not?: InputMaybe<VestingStatus>;
  status_in?: InputMaybe<Array<VestingStatus>>;
  status_not_in?: InputMaybe<Array<VestingStatus>>;
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
  cancelledAtBlock?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cancelledAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cancelledAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cancelledAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Vesting_orderBy =
  | 'id'
  | 'recipient'
  | 'cliffDuration'
  | 'stepDuration'
  | 'steps'
  | 'cliffAmount'
  | 'stepAmount'
  | 'totalAmount'
  | 'withdrawnAmount'
  | 'token'
  | 'schedule'
  | 'status'
  | 'createdBy'
  | 'fromBentoBox'
  | 'startedAt'
  | 'expiresAt'
  | 'transactionCount'
  | 'createdAtBlock'
  | 'createdAtTimestamp'
  | 'cancelledAtBlock'
  | 'cancelledAtTimestamp';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FuroStream: ResolverTypeWrapper<FuroStream>;
  FuroStream_filter: FuroStream_filter;
  FuroStream_orderBy: FuroStream_orderBy;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  OrderDirection: OrderDirection;
  Stream: ResolverTypeWrapper<Stream>;
  StreamStatus: StreamStatus;
  Stream_filter: Stream_filter;
  Stream_orderBy: Stream_orderBy;
  String: ResolverTypeWrapper<Scalars['String']>;
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
  FuroVesting: ResolverTypeWrapper<FuroVesting>;
  FuroVesting_filter: FuroVesting_filter;
  FuroVesting_orderBy: FuroVesting_orderBy;
  Schedule: ResolverTypeWrapper<Schedule>;
  SchedulePeriod: ResolverTypeWrapper<SchedulePeriod>;
  SchedulePeriodType: SchedulePeriodType;
  SchedulePeriod_filter: SchedulePeriod_filter;
  SchedulePeriod_orderBy: SchedulePeriod_orderBy;
  Schedule_filter: Schedule_filter;
  Schedule_orderBy: Schedule_orderBy;
  VestingToken: ResolverTypeWrapper<VestingToken>;
  VestingTransaction: ResolverTypeWrapper<VestingTransaction>;
  VestingUser: ResolverTypeWrapper<VestingUser>;
  Vesting: ResolverTypeWrapper<Vesting>;
  VestingStatus: VestingStatus;
  Vesting_filter: Vesting_filter;
  Vesting_orderBy: Vesting_orderBy;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Subscription: {};
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Float: Scalars['Float'];
  FuroStream: FuroStream;
  FuroStream_filter: FuroStream_filter;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Stream: Stream;
  Stream_filter: Stream_filter;
  String: Scalars['String'];
  Token: Token;
  Token_filter: Token_filter;
  Transaction: Transaction;
  Transaction_filter: Transaction_filter;
  User: User;
  User_filter: User_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
  FuroVesting: FuroVesting;
  FuroVesting_filter: FuroVesting_filter;
  Schedule: Schedule;
  SchedulePeriod: SchedulePeriod;
  SchedulePeriod_filter: SchedulePeriod_filter;
  Schedule_filter: Schedule_filter;
  VestingToken: VestingToken;
  VestingTransaction: VestingTransaction;
  VestingUser: VestingUser;
  Vesting: Vesting;
  Vesting_filter: Vesting_filter;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  furoStream?: Resolver<Maybe<ResolversTypes['FuroStream']>, ParentType, ContextType, RequireFields<QueryfuroStreamArgs, 'id' | 'subgraphError'>>;
  furoStreams?: Resolver<Array<ResolversTypes['FuroStream']>, ParentType, ContextType, RequireFields<QueryfuroStreamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  stream?: Resolver<Maybe<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<QuerystreamArgs, 'id' | 'subgraphError'>>;
  streams?: Resolver<Array<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<QuerystreamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QuerytransactionArgs, 'id' | 'subgraphError'>>;
  transactions?: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QuerytransactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: Resolver<Maybe<ResolversTypes['VestingToken']>, ParentType, ContextType, RequireFields<QuerytokenArgs, 'id' | 'subgraphError'>>;
  tokens?: Resolver<Array<ResolversTypes['VestingToken']>, ParentType, ContextType, RequireFields<QuerytokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id' | 'subgraphError'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryusersArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
  furoVesting?: Resolver<Maybe<ResolversTypes['FuroVesting']>, ParentType, ContextType, RequireFields<QueryfuroVestingArgs, 'id' | 'subgraphError'>>;
  furoVestings?: Resolver<Array<ResolversTypes['FuroVesting']>, ParentType, ContextType, RequireFields<QueryfuroVestingsArgs, 'skip' | 'first' | 'subgraphError'>>;
  vesting?: Resolver<Maybe<ResolversTypes['Vesting']>, ParentType, ContextType, RequireFields<QueryvestingArgs, 'id' | 'subgraphError'>>;
  vestings?: Resolver<Array<ResolversTypes['Vesting']>, ParentType, ContextType, RequireFields<QueryvestingsArgs, 'skip' | 'first' | 'subgraphError'>>;
  schedule?: Resolver<Maybe<ResolversTypes['Schedule']>, ParentType, ContextType, RequireFields<QueryscheduleArgs, 'id' | 'subgraphError'>>;
  schedules?: Resolver<Array<ResolversTypes['Schedule']>, ParentType, ContextType, RequireFields<QueryschedulesArgs, 'skip' | 'first' | 'subgraphError'>>;
  schedulePeriod?: Resolver<Maybe<ResolversTypes['SchedulePeriod']>, ParentType, ContextType, RequireFields<QueryschedulePeriodArgs, 'id' | 'subgraphError'>>;
  schedulePeriods?: Resolver<Array<ResolversTypes['SchedulePeriod']>, ParentType, ContextType, RequireFields<QueryschedulePeriodsArgs, 'skip' | 'first' | 'subgraphError'>>;
  vestingTransaction?: Resolver<Maybe<ResolversTypes['VestingTransaction']>, ParentType, ContextType, RequireFields<QueryvestingTransactionArgs, 'id' | 'subgraphError'>>;
  vestingTransactions?: Resolver<Array<ResolversTypes['VestingTransaction']>, ParentType, ContextType, RequireFields<QueryvestingTransactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  vestingUser?: Resolver<Maybe<ResolversTypes['VestingUser']>, ParentType, ContextType, RequireFields<QueryvestingUserArgs, 'id' | 'subgraphError'>>;
  vestingUsers?: Resolver<Array<ResolversTypes['VestingUser']>, ParentType, ContextType, RequireFields<QueryvestingUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  furoStream?: SubscriptionResolver<Maybe<ResolversTypes['FuroStream']>, "furoStream", ParentType, ContextType, RequireFields<SubscriptionfuroStreamArgs, 'id' | 'subgraphError'>>;
  furoStreams?: SubscriptionResolver<Array<ResolversTypes['FuroStream']>, "furoStreams", ParentType, ContextType, RequireFields<SubscriptionfuroStreamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  stream?: SubscriptionResolver<Maybe<ResolversTypes['Stream']>, "stream", ParentType, ContextType, RequireFields<SubscriptionstreamArgs, 'id' | 'subgraphError'>>;
  streams?: SubscriptionResolver<Array<ResolversTypes['Stream']>, "streams", ParentType, ContextType, RequireFields<SubscriptionstreamsArgs, 'skip' | 'first' | 'subgraphError'>>;
  transaction?: SubscriptionResolver<Maybe<ResolversTypes['VestingTransaction']>, "transaction", ParentType, ContextType, RequireFields<SubscriptiontransactionArgs, 'id' | 'subgraphError'>>;
  transactions?: SubscriptionResolver<Array<ResolversTypes['VestingTransaction']>, "transactions", ParentType, ContextType, RequireFields<SubscriptiontransactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: SubscriptionResolver<Maybe<ResolversTypes['VestingToken']>, "token", ParentType, ContextType, RequireFields<SubscriptiontokenArgs, 'id' | 'subgraphError'>>;
  tokens?: SubscriptionResolver<Array<ResolversTypes['VestingToken']>, "tokens", ParentType, ContextType, RequireFields<SubscriptiontokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  user?: SubscriptionResolver<Maybe<ResolversTypes['VestingUser']>, "user", ParentType, ContextType, RequireFields<SubscriptionuserArgs, 'id' | 'subgraphError'>>;
  users?: SubscriptionResolver<Array<ResolversTypes['VestingUser']>, "users", ParentType, ContextType, RequireFields<SubscriptionusersArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
  furoVesting?: SubscriptionResolver<Maybe<ResolversTypes['FuroVesting']>, "furoVesting", ParentType, ContextType, RequireFields<SubscriptionfuroVestingArgs, 'id' | 'subgraphError'>>;
  furoVestings?: SubscriptionResolver<Array<ResolversTypes['FuroVesting']>, "furoVestings", ParentType, ContextType, RequireFields<SubscriptionfuroVestingsArgs, 'skip' | 'first' | 'subgraphError'>>;
  vesting?: SubscriptionResolver<Maybe<ResolversTypes['Vesting']>, "vesting", ParentType, ContextType, RequireFields<SubscriptionvestingArgs, 'id' | 'subgraphError'>>;
  vestings?: SubscriptionResolver<Array<ResolversTypes['Vesting']>, "vestings", ParentType, ContextType, RequireFields<SubscriptionvestingsArgs, 'skip' | 'first' | 'subgraphError'>>;
  schedule?: SubscriptionResolver<Maybe<ResolversTypes['Schedule']>, "schedule", ParentType, ContextType, RequireFields<SubscriptionscheduleArgs, 'id' | 'subgraphError'>>;
  schedules?: SubscriptionResolver<Array<ResolversTypes['Schedule']>, "schedules", ParentType, ContextType, RequireFields<SubscriptionschedulesArgs, 'skip' | 'first' | 'subgraphError'>>;
  schedulePeriod?: SubscriptionResolver<Maybe<ResolversTypes['SchedulePeriod']>, "schedulePeriod", ParentType, ContextType, RequireFields<SubscriptionschedulePeriodArgs, 'id' | 'subgraphError'>>;
  schedulePeriods?: SubscriptionResolver<Array<ResolversTypes['SchedulePeriod']>, "schedulePeriods", ParentType, ContextType, RequireFields<SubscriptionschedulePeriodsArgs, 'skip' | 'first' | 'subgraphError'>>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type FuroStreamResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FuroStream'] = ResolversParentTypes['FuroStream']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  streamCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  incomingStreams?: Resolver<Array<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<UserincomingStreamsArgs, 'skip' | 'first'>>;
  outgoingStreams?: Resolver<Array<ResolversTypes['Stream']>, ParentType, ContextType, RequireFields<UseroutgoingStreamsArgs, 'skip' | 'first'>>;
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

export type FuroVestingResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FuroVesting'] = ResolversParentTypes['FuroVesting']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vestingCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Schedule'] = ResolversParentTypes['Schedule']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vesting?: Resolver<ResolversTypes['Vesting'], ParentType, ContextType>;
  periods?: Resolver<Array<ResolversTypes['SchedulePeriod']>, ParentType, ContextType, RequireFields<ScheduleperiodsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SchedulePeriodResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SchedulePeriod'] = ResolversParentTypes['SchedulePeriod']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  schedule?: Resolver<ResolversTypes['Schedule'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SchedulePeriodType'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VestingTokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['VestingToken'] = ResolversParentTypes['VestingToken']> = ResolversObject<{
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

export type VestingTransactionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['VestingTransaction'] = ResolversParentTypes['VestingTransaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TransactionType'], ParentType, ContextType>;
  vesting?: Resolver<ResolversTypes['Vesting'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['VestingUser'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['VestingToken'], ParentType, ContextType>;
  toBentoBox?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VestingUserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['VestingUser'] = ResolversParentTypes['VestingUser']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  incomingVestings?: Resolver<Array<ResolversTypes['Vesting']>, ParentType, ContextType, RequireFields<VestingUserincomingVestingsArgs, 'skip' | 'first'>>;
  outgoingVestings?: Resolver<Array<ResolversTypes['Vesting']>, ParentType, ContextType, RequireFields<VestingUseroutgoingVestingsArgs, 'skip' | 'first'>>;
  createdAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VestingResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Vesting'] = ResolversParentTypes['Vesting']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['VestingUser'], ParentType, ContextType>;
  cliffDuration?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  stepDuration?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  steps?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cliffAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  stepAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  withdrawnAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['VestingToken'], ParentType, ContextType>;
  schedule?: Resolver<ResolversTypes['Schedule'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['VestingStatus'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['VestingUser'], ParentType, ContextType>;
  fromBentoBox?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cancelledAtBlock?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cancelledAtTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  FuroStream?: FuroStreamResolvers<ContextType>;
  Stream?: StreamResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
  FuroVesting?: FuroVestingResolvers<ContextType>;
  Schedule?: ScheduleResolvers<ContextType>;
  SchedulePeriod?: SchedulePeriodResolvers<ContextType>;
  VestingToken?: VestingTokenResolvers<ContextType>;
  VestingTransaction?: VestingTransactionResolvers<ContextType>;
  VestingUser?: VestingUserResolvers<ContextType>;
  Vesting?: VestingResolvers<ContextType>;
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

export type FuroStream = {
  id: Scalars['ID'];
  streamCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
};

export type FuroStream_filter = {
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

export type FuroStream_orderBy =
  | 'id'
  | 'streamCount'
  | 'userCount'
  | 'transactionCount';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  furoStream?: Maybe<FuroStream>;
  furoStreams: Array<FuroStream>;
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


export type QueryfuroStreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfuroStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroStream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroStream_filter>;
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
  furoStream?: Maybe<FuroStream>;
  furoStreams: Array<FuroStream>;
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


export type SubscriptionfuroStreamArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfuroStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroStream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroStream_filter>;
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
  incomingStreams: Array<Stream>;
  outgoingStreams: Array<Stream>;
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};


export type UserincomingStreamsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stream_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Stream_filter>;
};


export type UseroutgoingStreamsArgs = {
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
  | 'incomingStreams'
  | 'outgoingStreams'
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
  furoStream: InContextSdkMethod<FurostreamKovanTypes.Query['furoStream'], FurostreamKovanTypes.QueryfuroStreamArgs, MeshContext>,
  /** null **/
  furoStreams: InContextSdkMethod<FurostreamKovanTypes.Query['furoStreams'], FurostreamKovanTypes.QueryfuroStreamsArgs, MeshContext>,
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
  furoStream: InContextSdkMethod<FurostreamKovanTypes.Subscription['furoStream'], FurostreamKovanTypes.SubscriptionfuroStreamArgs, MeshContext>,
  /** null **/
  furoStreams: InContextSdkMethod<FurostreamKovanTypes.Subscription['furoStreams'], FurostreamKovanTypes.SubscriptionfuroStreamsArgs, MeshContext>,
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


    export namespace FurovestingKovanTypes {
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

export type FuroVesting = {
  id: Scalars['ID'];
  vestingCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
};

export type FuroVesting_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  vestingCount?: InputMaybe<Scalars['BigInt']>;
  vestingCount_not?: InputMaybe<Scalars['BigInt']>;
  vestingCount_gt?: InputMaybe<Scalars['BigInt']>;
  vestingCount_lt?: InputMaybe<Scalars['BigInt']>;
  vestingCount_gte?: InputMaybe<Scalars['BigInt']>;
  vestingCount_lte?: InputMaybe<Scalars['BigInt']>;
  vestingCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  vestingCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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

export type FuroVesting_orderBy =
  | 'id'
  | 'vestingCount'
  | 'userCount'
  | 'transactionCount';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  furoVesting?: Maybe<FuroVesting>;
  furoVestings: Array<FuroVesting>;
  vesting?: Maybe<Vesting>;
  vestings: Array<Vesting>;
  schedule?: Maybe<Schedule>;
  schedules: Array<Schedule>;
  schedulePeriod?: Maybe<SchedulePeriod>;
  schedulePeriods: Array<SchedulePeriod>;
  vestingTransaction?: Maybe<VestingTransaction>;
  vestingTransactions: Array<VestingTransaction>;
  token?: Maybe<VestingToken>;
  tokens: Array<VestingToken>;
  vestingUser?: Maybe<VestingUser>;
  vestingUsers: Array<VestingUser>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryfuroVestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfuroVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroVesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroVesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryscheduleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschedulesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Schedule_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schedule_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschedulePeriodArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschedulePeriodsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SchedulePeriod_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SchedulePeriod_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingTransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingTransactionsArgs = {
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


export type QueryvestingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvestingUsersArgs = {
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

export type Schedule = {
  id: Scalars['ID'];
  vesting: Vesting;
  periods: Array<SchedulePeriod>;
};


export type ScheduleperiodsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SchedulePeriod_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SchedulePeriod_filter>;
};

export type SchedulePeriod = {
  id: Scalars['ID'];
  schedule: Schedule;
  time: Scalars['BigInt'];
  type: SchedulePeriodType;
  amount: Scalars['BigInt'];
};

export type SchedulePeriodType =
  | 'START'
  | 'CLIFF'
  | 'STEP'
  | 'END';

export type SchedulePeriod_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  schedule?: InputMaybe<Scalars['String']>;
  schedule_not?: InputMaybe<Scalars['String']>;
  schedule_gt?: InputMaybe<Scalars['String']>;
  schedule_lt?: InputMaybe<Scalars['String']>;
  schedule_gte?: InputMaybe<Scalars['String']>;
  schedule_lte?: InputMaybe<Scalars['String']>;
  schedule_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_not_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_contains?: InputMaybe<Scalars['String']>;
  schedule_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_contains?: InputMaybe<Scalars['String']>;
  schedule_not_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_starts_with?: InputMaybe<Scalars['String']>;
  schedule_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_ends_with?: InputMaybe<Scalars['String']>;
  schedule_ends_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  type?: InputMaybe<SchedulePeriodType>;
  type_not?: InputMaybe<SchedulePeriodType>;
  type_in?: InputMaybe<Array<SchedulePeriodType>>;
  type_not_in?: InputMaybe<Array<SchedulePeriodType>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type SchedulePeriod_orderBy =
  | 'id'
  | 'schedule'
  | 'time'
  | 'type'
  | 'amount';

export type Schedule_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  vesting?: InputMaybe<Scalars['String']>;
  vesting_not?: InputMaybe<Scalars['String']>;
  vesting_gt?: InputMaybe<Scalars['String']>;
  vesting_lt?: InputMaybe<Scalars['String']>;
  vesting_gte?: InputMaybe<Scalars['String']>;
  vesting_lte?: InputMaybe<Scalars['String']>;
  vesting_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_not_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_contains?: InputMaybe<Scalars['String']>;
  vesting_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_contains?: InputMaybe<Scalars['String']>;
  vesting_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_starts_with?: InputMaybe<Scalars['String']>;
  vesting_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_ends_with?: InputMaybe<Scalars['String']>;
  vesting_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
};

export type Schedule_orderBy =
  | 'id'
  | 'vesting'
  | 'periods';

export type Subscription = {
  furoVesting?: Maybe<FuroVesting>;
  furoVestings: Array<FuroVesting>;
  vesting?: Maybe<Vesting>;
  vestings: Array<Vesting>;
  schedule?: Maybe<Schedule>;
  schedules: Array<Schedule>;
  schedulePeriod?: Maybe<SchedulePeriod>;
  schedulePeriods: Array<SchedulePeriod>;
  transaction?: Maybe<VestingTransaction>;
  transactions: Array<VestingTransaction>;
  token?: Maybe<VestingToken>;
  tokens: Array<VestingToken>;
  user?: Maybe<VestingUser>;
  users: Array<VestingUser>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionfuroVestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfuroVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FuroVesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FuroVesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionvestingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionvestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionscheduleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschedulesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Schedule_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schedule_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschedulePeriodArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschedulePeriodsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SchedulePeriod_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SchedulePeriod_filter>;
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

export type VestingToken = {
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

export type VestingTransaction = {
  id: Scalars['ID'];
  type: TransactionType;
  vesting: Vesting;
  amount: Scalars['BigInt'];
  to: VestingUser;
  token: VestingToken;
  toBentoBox: Scalars['Boolean'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};

export type TransactionType =
  | 'DEPOSIT'
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
  vesting?: InputMaybe<Scalars['String']>;
  vesting_not?: InputMaybe<Scalars['String']>;
  vesting_gt?: InputMaybe<Scalars['String']>;
  vesting_lt?: InputMaybe<Scalars['String']>;
  vesting_gte?: InputMaybe<Scalars['String']>;
  vesting_lte?: InputMaybe<Scalars['String']>;
  vesting_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_not_in?: InputMaybe<Array<Scalars['String']>>;
  vesting_contains?: InputMaybe<Scalars['String']>;
  vesting_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_contains?: InputMaybe<Scalars['String']>;
  vesting_not_contains_nocase?: InputMaybe<Scalars['String']>;
  vesting_starts_with?: InputMaybe<Scalars['String']>;
  vesting_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with?: InputMaybe<Scalars['String']>;
  vesting_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_ends_with?: InputMaybe<Scalars['String']>;
  vesting_ends_with_nocase?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with?: InputMaybe<Scalars['String']>;
  vesting_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  | 'vesting'
  | 'amount'
  | 'to'
  | 'token'
  | 'toBentoBox'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type VestingUser = {
  id: Scalars['ID'];
  incomingVestings: Array<Vesting>;
  outgoingVestings: Array<Vesting>;
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
};


export type VestingUserincomingVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
};


export type VestingUseroutgoingVestingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vesting_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Vesting_filter>;
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
  | 'incomingVestings'
  | 'outgoingVestings'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type Vesting = {
  id: Scalars['ID'];
  recipient: VestingUser;
  cliffDuration: Scalars['BigInt'];
  stepDuration: Scalars['BigInt'];
  steps: Scalars['BigInt'];
  cliffAmount: Scalars['BigInt'];
  stepAmount: Scalars['BigInt'];
  totalAmount: Scalars['BigInt'];
  withdrawnAmount: Scalars['BigInt'];
  token: VestingToken;
  schedule: Schedule;
  status: VestingStatus;
  createdBy: VestingUser;
  fromBentoBox: Scalars['Boolean'];
  startedAt: Scalars['BigInt'];
  expiresAt: Scalars['BigInt'];
  transactionCount: Scalars['BigInt'];
  createdAtBlock: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  cancelledAtBlock: Scalars['BigInt'];
  cancelledAtTimestamp: Scalars['BigInt'];
};

export type VestingStatus =
  | 'ACTIVE'
  | 'CANCELLED'
  | 'EXPIRED';

export type Vesting_filter = {
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
  cliffDuration?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_not?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_gt?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_lt?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_gte?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_lte?: InputMaybe<Scalars['BigInt']>;
  cliffDuration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cliffDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepDuration?: InputMaybe<Scalars['BigInt']>;
  stepDuration_not?: InputMaybe<Scalars['BigInt']>;
  stepDuration_gt?: InputMaybe<Scalars['BigInt']>;
  stepDuration_lt?: InputMaybe<Scalars['BigInt']>;
  stepDuration_gte?: InputMaybe<Scalars['BigInt']>;
  stepDuration_lte?: InputMaybe<Scalars['BigInt']>;
  stepDuration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  steps?: InputMaybe<Scalars['BigInt']>;
  steps_not?: InputMaybe<Scalars['BigInt']>;
  steps_gt?: InputMaybe<Scalars['BigInt']>;
  steps_lt?: InputMaybe<Scalars['BigInt']>;
  steps_gte?: InputMaybe<Scalars['BigInt']>;
  steps_lte?: InputMaybe<Scalars['BigInt']>;
  steps_in?: InputMaybe<Array<Scalars['BigInt']>>;
  steps_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cliffAmount?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_not?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_gt?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_lt?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_gte?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_lte?: InputMaybe<Scalars['BigInt']>;
  cliffAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cliffAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepAmount?: InputMaybe<Scalars['BigInt']>;
  stepAmount_not?: InputMaybe<Scalars['BigInt']>;
  stepAmount_gt?: InputMaybe<Scalars['BigInt']>;
  stepAmount_lt?: InputMaybe<Scalars['BigInt']>;
  stepAmount_gte?: InputMaybe<Scalars['BigInt']>;
  stepAmount_lte?: InputMaybe<Scalars['BigInt']>;
  stepAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stepAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmount?: InputMaybe<Scalars['BigInt']>;
  totalAmount_not?: InputMaybe<Scalars['BigInt']>;
  totalAmount_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmount_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmount_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmount_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  schedule?: InputMaybe<Scalars['String']>;
  schedule_not?: InputMaybe<Scalars['String']>;
  schedule_gt?: InputMaybe<Scalars['String']>;
  schedule_lt?: InputMaybe<Scalars['String']>;
  schedule_gte?: InputMaybe<Scalars['String']>;
  schedule_lte?: InputMaybe<Scalars['String']>;
  schedule_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_not_in?: InputMaybe<Array<Scalars['String']>>;
  schedule_contains?: InputMaybe<Scalars['String']>;
  schedule_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_contains?: InputMaybe<Scalars['String']>;
  schedule_not_contains_nocase?: InputMaybe<Scalars['String']>;
  schedule_starts_with?: InputMaybe<Scalars['String']>;
  schedule_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with?: InputMaybe<Scalars['String']>;
  schedule_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_ends_with?: InputMaybe<Scalars['String']>;
  schedule_ends_with_nocase?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with?: InputMaybe<Scalars['String']>;
  schedule_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<VestingStatus>;
  status_not?: InputMaybe<VestingStatus>;
  status_in?: InputMaybe<Array<VestingStatus>>;
  status_not_in?: InputMaybe<Array<VestingStatus>>;
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
  cancelledAtBlock?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cancelledAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cancelledAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  cancelledAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cancelledAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Vesting_orderBy =
  | 'id'
  | 'recipient'
  | 'cliffDuration'
  | 'stepDuration'
  | 'steps'
  | 'cliffAmount'
  | 'stepAmount'
  | 'totalAmount'
  | 'withdrawnAmount'
  | 'token'
  | 'schedule'
  | 'status'
  | 'createdBy'
  | 'fromBentoBox'
  | 'startedAt'
  | 'expiresAt'
  | 'transactionCount'
  | 'createdAtBlock'
  | 'createdAtTimestamp'
  | 'cancelledAtBlock'
  | 'cancelledAtTimestamp';

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
    export type QueryFurovestingKovanSdk = {
  /** null **/
  furoVesting: InContextSdkMethod<FurovestingKovanTypes.Query['furoVesting'], FurovestingKovanTypes.QueryfuroVestingArgs, MeshContext>,
  /** null **/
  furoVestings: InContextSdkMethod<FurovestingKovanTypes.Query['furoVestings'], FurovestingKovanTypes.QueryfuroVestingsArgs, MeshContext>,
  /** null **/
  vesting: InContextSdkMethod<FurovestingKovanTypes.Query['vesting'], FurovestingKovanTypes.QueryvestingArgs, MeshContext>,
  /** null **/
  vestings: InContextSdkMethod<FurovestingKovanTypes.Query['vestings'], FurovestingKovanTypes.QueryvestingsArgs, MeshContext>,
  /** null **/
  schedule: InContextSdkMethod<FurovestingKovanTypes.Query['schedule'], FurovestingKovanTypes.QueryscheduleArgs, MeshContext>,
  /** null **/
  schedules: InContextSdkMethod<FurovestingKovanTypes.Query['schedules'], FurovestingKovanTypes.QueryschedulesArgs, MeshContext>,
  /** null **/
  schedulePeriod: InContextSdkMethod<FurovestingKovanTypes.Query['schedulePeriod'], FurovestingKovanTypes.QueryschedulePeriodArgs, MeshContext>,
  /** null **/
  schedulePeriods: InContextSdkMethod<FurovestingKovanTypes.Query['schedulePeriods'], FurovestingKovanTypes.QueryschedulePeriodsArgs, MeshContext>,
  /** null **/
  vestingTransaction: InContextSdkMethod<FurovestingKovanTypes.Query['vestingTransaction'], FurovestingKovanTypes.QueryvestingTransactionArgs, MeshContext>,
  /** null **/
  vestingTransactions: InContextSdkMethod<FurovestingKovanTypes.Query['vestingTransactions'], FurovestingKovanTypes.QueryvestingTransactionsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<FurovestingKovanTypes.Query['token'], FurovestingKovanTypes.QuerytokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<FurovestingKovanTypes.Query['tokens'], FurovestingKovanTypes.QuerytokensArgs, MeshContext>,
  /** null **/
  vestingUser: InContextSdkMethod<FurovestingKovanTypes.Query['vestingUser'], FurovestingKovanTypes.QueryvestingUserArgs, MeshContext>,
  /** null **/
  vestingUsers: InContextSdkMethod<FurovestingKovanTypes.Query['vestingUsers'], FurovestingKovanTypes.QueryvestingUsersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<FurovestingKovanTypes.Query['_meta'], FurovestingKovanTypes.Query_metaArgs, MeshContext>
};

export type MutationFurovestingKovanSdk = {

};

export type SubscriptionFurovestingKovanSdk = {
  /** null **/
  furoVesting: InContextSdkMethod<FurovestingKovanTypes.Subscription['furoVesting'], FurovestingKovanTypes.SubscriptionfuroVestingArgs, MeshContext>,
  /** null **/
  furoVestings: InContextSdkMethod<FurovestingKovanTypes.Subscription['furoVestings'], FurovestingKovanTypes.SubscriptionfuroVestingsArgs, MeshContext>,
  /** null **/
  vesting: InContextSdkMethod<FurovestingKovanTypes.Subscription['vesting'], FurovestingKovanTypes.SubscriptionvestingArgs, MeshContext>,
  /** null **/
  vestings: InContextSdkMethod<FurovestingKovanTypes.Subscription['vestings'], FurovestingKovanTypes.SubscriptionvestingsArgs, MeshContext>,
  /** null **/
  schedule: InContextSdkMethod<FurovestingKovanTypes.Subscription['schedule'], FurovestingKovanTypes.SubscriptionscheduleArgs, MeshContext>,
  /** null **/
  schedules: InContextSdkMethod<FurovestingKovanTypes.Subscription['schedules'], FurovestingKovanTypes.SubscriptionschedulesArgs, MeshContext>,
  /** null **/
  schedulePeriod: InContextSdkMethod<FurovestingKovanTypes.Subscription['schedulePeriod'], FurovestingKovanTypes.SubscriptionschedulePeriodArgs, MeshContext>,
  /** null **/
  schedulePeriods: InContextSdkMethod<FurovestingKovanTypes.Subscription['schedulePeriods'], FurovestingKovanTypes.SubscriptionschedulePeriodsArgs, MeshContext>,
  /** null **/
  transaction: InContextSdkMethod<FurovestingKovanTypes.Subscription['transaction'], FurovestingKovanTypes.SubscriptiontransactionArgs, MeshContext>,
  /** null **/
  transactions: InContextSdkMethod<FurovestingKovanTypes.Subscription['transactions'], FurovestingKovanTypes.SubscriptiontransactionsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<FurovestingKovanTypes.Subscription['token'], FurovestingKovanTypes.SubscriptiontokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<FurovestingKovanTypes.Subscription['tokens'], FurovestingKovanTypes.SubscriptiontokensArgs, MeshContext>,
  /** null **/
  user: InContextSdkMethod<FurovestingKovanTypes.Subscription['user'], FurovestingKovanTypes.SubscriptionuserArgs, MeshContext>,
  /** null **/
  users: InContextSdkMethod<FurovestingKovanTypes.Subscription['users'], FurovestingKovanTypes.SubscriptionusersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<FurovestingKovanTypes.Subscription['_meta'], FurovestingKovanTypes.Subscription_metaArgs, MeshContext>
};

export type FurostreamKovanContext = {
      ["furostream_kovan"]: { Query: QueryFurostreamKovanSdk, Mutation: MutationFurostreamKovanSdk, Subscription: SubscriptionFurostreamKovanSdk },
    };

export type FurovestingKovanContext = {
      ["furovesting_kovan"]: { Query: QueryFurovestingKovanSdk, Mutation: MutationFurovestingKovanSdk, Subscription: SubscriptionFurovestingKovanSdk },
    };

export type MeshContext = FurostreamKovanContext & FurovestingKovanContext & BaseMeshContext;


import { getMesh } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import pathModule from 'path';
import { fileURLToPath } from '@graphql-mesh/utils';
import ExternalModule_0 from '@graphql-mesh/cache-inmemory-lru';
import ExternalModule_1 from '@graphql-mesh/graphql';
import ExternalModule_2 from '@graphql-mesh/merger-stitching';
import ExternalModule_3 from '@graphql-mesh/transform-rename';
import ExternalModule_4 from './sources/furostream_kovan/schema.graphql.ts';
import ExternalModule_5 from './sources/furovesting_kovan/schema.graphql.ts';

const importedModules: Record<string, any> = {
  // @ts-ignore
  ["@graphql-mesh/cache-inmemory-lru"]: ExternalModule_0,
  // @ts-ignore
  ["@graphql-mesh/graphql"]: ExternalModule_1,
  // @ts-ignore
  ["@graphql-mesh/merger-stitching"]: ExternalModule_2,
  // @ts-ignore
  ["@graphql-mesh/transform-rename"]: ExternalModule_3,
  // @ts-ignore
  [".graphclient/sources/furostream_kovan/schema.graphql.ts"]: ExternalModule_4,
  // @ts-ignore
  [".graphclient/sources/furovesting_kovan/schema.graphql.ts"]: ExternalModule_5
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
import StitchingMerger from '@graphql-mesh/merger-stitching';
import RenameTransform from '@graphql-mesh/transform-rename';
import { resolveAdditionalResolvers } from '@graphql-mesh/utils';
export const rawConfig: YamlConfig.Config = {"sources":[{"name":"furostream_kovan","handler":{"graphql":{"endpoint":"https://api.thegraph.com/subgraphs/name/olastenberg/furostream-kovan"}}},{"name":"furovesting_kovan","handler":{"graphql":{"endpoint":"https://api.thegraph.com/subgraphs/name/olastenberg/furovesting-kovan"}},"transforms":[{"rename":{"mode":"wrap","renames":[{"from":{"type":"Transaction"},"to":{"type":"VestingTransaction"}},{"from":{"type":"Query","field":"transaction"},"to":{"type":"Query","field":"vestingTransaction"}},{"from":{"type":"Query","field":"transactions"},"to":{"type":"Query","field":"vestingTransactions"}},{"from":{"type":"Furo"},"to":{"type":"FuroVesting"}},{"from":{"type":"Query","field":"furo"},"to":{"type":"Query","field":"furoVesting"}},{"from":{"type":"Token"},"to":{"type":"VestingToken"}},{"from":{"type":"User"},"to":{"type":"VestingUser"}},{"from":{"type":"Query","field":"user"},"to":{"type":"Query","field":"vestingUser"}},{"from":{"type":"Query","field":"users"},"to":{"type":"Query","field":"vestingUsers"}}]}}]}],"documents":["./query.graphql"]} as any
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
const furovestingKovanTransforms = [];
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
const furovestingKovanHandler = new GraphqlHandler({
              name: rawConfig.sources[1].name,
              config: rawConfig.sources[1].handler["graphql"],
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child(rawConfig.sources[1].name),
              logger: logger.child(rawConfig.sources[1].name),
              importFn
            });
sources.push({
          name: 'furostream_kovan',
          handler: furostreamKovanHandler,
          transforms: furostreamKovanTransforms
        })
const merger = new(StitchingMerger as any)({
        cache,
        pubsub,
        logger: logger.child('StitchingMerger'),
        store: rootStore.child('stitchingMerger')
      })
furovestingKovanTransforms.push(
                new RenameTransform({
                  apiName: rawConfig.sources[1].name,
                  config: rawConfig.sources[1].transforms[0]["rename"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
sources.push({
          name: 'furovesting_kovan',
          handler: furovestingKovanHandler,
          transforms: furovestingKovanTransforms
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

export const documentsInSDL = /*#__PURE__*/ [/* GraphQL */`query UserStreams($id: ID!) {
  user(id: $id) {
    incomingStreams(orderBy: startedAt) {
      id
      status
      startedAt
      expiresAt
      amount
      withdrawnAmount
      recipient {
        id
      }
      createdBy {
        id
      }
      token {
        id
        symbol
        name
        decimals
      }
    }
    outgoingStreams(orderBy: startedAt) {
      id
      status
      startedAt
      expiresAt
      amount
      withdrawnAmount
      recipient {
        id
      }
      createdBy {
        id
      }
      token {
        id
        symbol
        name
        decimals
      }
    }
  }
}

query Stream($id: ID!) {
  stream(id: $id) {
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
      decimals
    }
  }
}

query Transactions($id: String) {
  transactions(
    where: {stream: $id}
    orderBy: createdAtTimestamp
    orderDirection: desc
  ) {
    id
    type
    amount
    toBentoBox
    createdAtBlock
    createdAtTimestamp
    token {
      id
      name
      symbol
      decimals
    }
    to {
      id
    }
  }
}

query UserVestings($id: ID!) {
  vestingUser(id: $id) {
    incomingVestings {
      id
      status
      steps
      startedAt
      expiresAt
      cliffDuration
      stepDuration
      stepAmount
      cliffAmount
      totalAmount
      withdrawnAmount
      fromBentoBox
      token {
        id
        name
        symbol
        decimals
      }
      recipient {
        id
      }
      createdBy {
        id
      }
    }
    outgoingVestings {
      id
      status
      steps
      startedAt
      expiresAt
      cliffDuration
      stepDuration
      stepAmount
      cliffAmount
      totalAmount
      withdrawnAmount
      fromBentoBox
      token {
        id
        name
        symbol
        decimals
      }
      recipient {
        id
      }
      createdBy {
        id
      }
    }
  }
}

query Vesting($id: ID!) {
  vesting(id: $id) {
    id
    status
    steps
    startedAt
    expiresAt
    cliffDuration
    stepDuration
    stepAmount
    cliffAmount
    totalAmount
    withdrawnAmount
    fromBentoBox
    token {
      symbol
    }
    status
    schedule {
      id
    }
    recipient {
      id
    }
    createdBy {
      id
    }
  }
}

query VestingTransactions($id: String) {
  vestingTransactions(where: {vesting: $id}) {
    id
    type
    amount
    toBentoBox
    createdAtBlock
    createdAtTimestamp
    token {
      id
      name
      symbol
      decimals
    }
  }
}

query VestingSchedule($id: ID!) {
  vesting(id: $id) {
    schedule {
      periods(orderBy: time) {
        id
        type
        time
        amount
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
  id: Scalars['ID'];
}>;


export type UserStreamsQuery = { user?: Maybe<{ incomingStreams: Array<(
      Pick<Stream, 'id' | 'status' | 'startedAt' | 'expiresAt' | 'amount' | 'withdrawnAmount'>
      & { recipient: Pick<User, 'id'>, createdBy: Pick<User, 'id'>, token: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'> }
    )>, outgoingStreams: Array<(
      Pick<Stream, 'id' | 'status' | 'startedAt' | 'expiresAt' | 'amount' | 'withdrawnAmount'>
      & { recipient: Pick<User, 'id'>, createdBy: Pick<User, 'id'>, token: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'> }
    )> }> };

export type StreamQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StreamQuery = { stream?: Maybe<(
    Pick<Stream, 'id' | 'status' | 'startedAt' | 'expiresAt' | 'amount' | 'withdrawnAmount'>
    & { token: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'> }
  )> };

export type TransactionsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type TransactionsQuery = { transactions: Array<(
    Pick<Transaction, 'id' | 'type' | 'amount' | 'toBentoBox' | 'createdAtBlock' | 'createdAtTimestamp'>
    & { token: Pick<Token, 'id' | 'name' | 'symbol' | 'decimals'>, to: Pick<User, 'id'> }
  )> };

export type UserVestingsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserVestingsQuery = { vestingUser?: Maybe<{ incomingVestings: Array<(
      Pick<Vesting, 'id' | 'status' | 'steps' | 'startedAt' | 'expiresAt' | 'cliffDuration' | 'stepDuration' | 'stepAmount' | 'cliffAmount' | 'totalAmount' | 'withdrawnAmount' | 'fromBentoBox'>
      & { token: Pick<VestingToken, 'id' | 'name' | 'symbol' | 'decimals'>, recipient: Pick<VestingUser, 'id'>, createdBy: Pick<VestingUser, 'id'> }
    )>, outgoingVestings: Array<(
      Pick<Vesting, 'id' | 'status' | 'steps' | 'startedAt' | 'expiresAt' | 'cliffDuration' | 'stepDuration' | 'stepAmount' | 'cliffAmount' | 'totalAmount' | 'withdrawnAmount' | 'fromBentoBox'>
      & { token: Pick<VestingToken, 'id' | 'name' | 'symbol' | 'decimals'>, recipient: Pick<VestingUser, 'id'>, createdBy: Pick<VestingUser, 'id'> }
    )> }> };

export type VestingQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VestingQuery = { vesting?: Maybe<(
    Pick<Vesting, 'id' | 'status' | 'steps' | 'startedAt' | 'expiresAt' | 'cliffDuration' | 'stepDuration' | 'stepAmount' | 'cliffAmount' | 'totalAmount' | 'withdrawnAmount' | 'fromBentoBox'>
    & { token: Pick<VestingToken, 'symbol'>, schedule: Pick<Schedule, 'id'>, recipient: Pick<VestingUser, 'id'>, createdBy: Pick<VestingUser, 'id'> }
  )> };

export type VestingTransactionsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type VestingTransactionsQuery = { vestingTransactions: Array<(
    Pick<VestingTransaction, 'id' | 'type' | 'amount' | 'toBentoBox' | 'createdAtBlock' | 'createdAtTimestamp'>
    & { token: Pick<VestingToken, 'id' | 'name' | 'symbol' | 'decimals'> }
  )> };

export type VestingScheduleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VestingScheduleQuery = { vesting?: Maybe<{ schedule: { periods: Array<Pick<SchedulePeriod, 'id' | 'type' | 'time' | 'amount'>> } }> };


export const UserStreamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserStreams"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incomingStreams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"startedAt"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingStreams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"startedAt"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserStreamsQuery, UserStreamsQueryVariables>;
export const StreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Stream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}}]}}]} as unknown as DocumentNode<StreamQuery, StreamQueryVariables>;
export const TransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Transactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"stream"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"createdAtTimestamp"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"toBentoBox"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TransactionsQuery, TransactionsQueryVariables>;
export const UserVestingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserVestings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vestingUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incomingVestings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"steps"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"cliffDuration"}},{"kind":"Field","name":{"kind":"Name","value":"stepDuration"}},{"kind":"Field","name":{"kind":"Name","value":"stepAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cliffAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fromBentoBox"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingVestings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"steps"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"cliffDuration"}},{"kind":"Field","name":{"kind":"Name","value":"stepDuration"}},{"kind":"Field","name":{"kind":"Name","value":"stepAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cliffAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fromBentoBox"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserVestingsQuery, UserVestingsQueryVariables>;
export const VestingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Vesting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vesting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"steps"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"cliffDuration"}},{"kind":"Field","name":{"kind":"Name","value":"stepDuration"}},{"kind":"Field","name":{"kind":"Name","value":"stepAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cliffAmount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fromBentoBox"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schedule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<VestingQuery, VestingQueryVariables>;
export const VestingTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VestingTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vestingTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"vesting"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"toBentoBox"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}}]}}]} as unknown as DocumentNode<VestingTransactionsQuery, VestingTransactionsQueryVariables>;
export const VestingScheduleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VestingSchedule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vesting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schedule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periods"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"time"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VestingScheduleQuery, VestingScheduleQueryVariables>;








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

    const StreamCompiled = compileQuery(schema, StreamDocument, 'Stream', jitOptions);
    if(!(isCompiledQuery(StreamCompiled))) {
      const originalErrors = StreamCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile Stream: \n\t${originalErrors.join('\n\t')}`);
    }

    const TransactionsCompiled = compileQuery(schema, TransactionsDocument, 'Transactions', jitOptions);
    if(!(isCompiledQuery(TransactionsCompiled))) {
      const originalErrors = TransactionsCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile Transactions: \n\t${originalErrors.join('\n\t')}`);
    }

    const UserVestingsCompiled = compileQuery(schema, UserVestingsDocument, 'UserVestings', jitOptions);
    if(!(isCompiledQuery(UserVestingsCompiled))) {
      const originalErrors = UserVestingsCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile UserVestings: \n\t${originalErrors.join('\n\t')}`);
    }

    const VestingCompiled = compileQuery(schema, VestingDocument, 'Vesting', jitOptions);
    if(!(isCompiledQuery(VestingCompiled))) {
      const originalErrors = VestingCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile Vesting: \n\t${originalErrors.join('\n\t')}`);
    }

    const VestingTransactionsCompiled = compileQuery(schema, VestingTransactionsDocument, 'VestingTransactions', jitOptions);
    if(!(isCompiledQuery(VestingTransactionsCompiled))) {
      const originalErrors = VestingTransactionsCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile VestingTransactions: \n\t${originalErrors.join('\n\t')}`);
    }

    const VestingScheduleCompiled = compileQuery(schema, VestingScheduleDocument, 'VestingSchedule', jitOptions);
    if(!(isCompiledQuery(VestingScheduleCompiled))) {
      const originalErrors = VestingScheduleCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile VestingSchedule: \n\t${originalErrors.join('\n\t')}`);
    }

  return {
    async UserStreams(variables: UserStreamsQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<UserStreamsQuery> {
      const result = await UserStreamsCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'UserStreams');
    },
    async Stream(variables: StreamQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<StreamQuery> {
      const result = await StreamCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'Stream');
    },
    async Transactions(variables?: TransactionsQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<TransactionsQuery> {
      const result = await TransactionsCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'Transactions');
    },
    async UserVestings(variables: UserVestingsQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<UserVestingsQuery> {
      const result = await UserVestingsCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'UserVestings');
    },
    async Vesting(variables: VestingQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<VestingQuery> {
      const result = await VestingCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'Vesting');
    },
    async VestingTransactions(variables?: VestingTransactionsQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<VestingTransactionsQuery> {
      const result = await VestingTransactionsCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'VestingTransactions');
    },
    async VestingSchedule(variables: VestingScheduleQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<VestingScheduleQuery> {
      const result = await VestingScheduleCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'VestingSchedule');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;