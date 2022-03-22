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
  MATIC_Bytes: any;
  MATIC_BigDecimal: any;
  BigInt: any;
  ETHEREUM_Bytes: any;
  ETHEREUM_BigDecimal: any;
};

export type Query = {
  MATIC_user?: Maybe<MATIC_User>;
  MATIC_users: Array<MATIC_User>;
  MATIC_bundle?: Maybe<MATIC_Bundle>;
  MATIC_bundles: Array<MATIC_Bundle>;
  MATIC_factory?: Maybe<MATIC_Factory>;
  MATIC_factories: Array<MATIC_Factory>;
  MATIC_hourData?: Maybe<MATIC_HourData>;
  MATIC_hourDatas: Array<MATIC_HourData>;
  MATIC_dayData?: Maybe<MATIC_DayData>;
  MATIC_dayDatas: Array<MATIC_DayData>;
  MATIC_token?: Maybe<MATIC_Token>;
  MATIC_tokens: Array<MATIC_Token>;
  MATIC_tokenHourData?: Maybe<MATIC_TokenHourData>;
  MATIC_tokenHourDatas: Array<MATIC_TokenHourData>;
  MATIC_tokenDayData?: Maybe<MATIC_TokenDayData>;
  MATIC_tokenDayDatas: Array<MATIC_TokenDayData>;
  MATIC_pair?: Maybe<MATIC_Pair>;
  MATIC_pairs: Array<MATIC_Pair>;
  MATIC_pairHourData?: Maybe<MATIC_PairHourData>;
  MATIC_pairHourDatas: Array<MATIC_PairHourData>;
  MATIC_pairDayData?: Maybe<MATIC_PairDayData>;
  MATIC_pairDayDatas: Array<MATIC_PairDayData>;
  MATIC_liquidityPosition?: Maybe<MATIC_LiquidityPosition>;
  MATIC_liquidityPositions: Array<MATIC_LiquidityPosition>;
  MATIC_liquidityPositionSnapshot?: Maybe<MATIC_LiquidityPositionSnapshot>;
  MATIC_liquidityPositionSnapshots: Array<MATIC_LiquidityPositionSnapshot>;
  MATIC_transaction?: Maybe<MATIC_Transaction>;
  MATIC_transactions: Array<MATIC_Transaction>;
  MATIC_mint?: Maybe<MATIC_Mint>;
  MATIC_mints: Array<MATIC_Mint>;
  MATIC_burn?: Maybe<MATIC_Burn>;
  MATIC_burns: Array<MATIC_Burn>;
  MATIC_swap?: Maybe<MATIC_Swap>;
  MATIC_swaps: Array<MATIC_Swap>;
  /** Access to subgraph metadata */
  MATIC__meta?: Maybe<MATIC__Meta_>;
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<ETHEREUM_Factory>;
  ETHEREUM_factories: Array<ETHEREUM_Factory>;
  ETHEREUM_hourData?: Maybe<ETHEREUM_HourData>;
  ETHEREUM_hourDatas: Array<ETHEREUM_HourData>;
  ETHEREUM_dayData?: Maybe<ETHEREUM_DayData>;
  ETHEREUM_dayDatas: Array<ETHEREUM_DayData>;
  ETHEREUM_token?: Maybe<ETHEREUM_Token>;
  ETHEREUM_tokens: Array<ETHEREUM_Token>;
  ETHEREUM_tokenHourData?: Maybe<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenHourDatas: Array<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenDayData?: Maybe<ETHEREUM_TokenDayData>;
  ETHEREUM_tokenDayDatas: Array<ETHEREUM_TokenDayData>;
  ETHEREUM_pair?: Maybe<ETHEREUM_Pair>;
  ETHEREUM_pairs: Array<ETHEREUM_Pair>;
  ETHEREUM_pairHourData?: Maybe<ETHEREUM_PairHourData>;
  ETHEREUM_pairHourDatas: Array<ETHEREUM_PairHourData>;
  ETHEREUM_pairDayData?: Maybe<ETHEREUM_PairDayData>;
  ETHEREUM_pairDayDatas: Array<ETHEREUM_PairDayData>;
  ETHEREUM_liquidityPosition?: Maybe<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositionSnapshot?: Maybe<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_liquidityPositionSnapshots: Array<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_transaction?: Maybe<ETHEREUM_Transaction>;
  ETHEREUM_transactions: Array<ETHEREUM_Transaction>;
  ETHEREUM_mint?: Maybe<ETHEREUM_Mint>;
  ETHEREUM_mints: Array<ETHEREUM_Mint>;
  ETHEREUM_burn?: Maybe<ETHEREUM_Burn>;
  ETHEREUM_burns: Array<ETHEREUM_Burn>;
  ETHEREUM_swap?: Maybe<ETHEREUM_Swap>;
  ETHEREUM_swaps: Array<ETHEREUM_Swap>;
  ETHEREUM_tokenSearch: Array<ETHEREUM_Token>;
  ETHEREUM_pairSearch: Array<ETHEREUM_Pair>;
  ETHEREUM_userSearch: Array<ETHEREUM_User>;
  /** Access to subgraph metadata */
  ETHEREUM__meta?: Maybe<ETHEREUM__Meta_>;
};


export type QueryMATIC_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_User_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_User_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Bundle_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Bundle_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Factory_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Factory_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_HourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_HourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_DayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_DayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Token_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Token_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Transaction_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Transaction_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC__metaArgs = {
  block?: InputMaybe<MATIC_Block_height>;
};


export type QueryETHEREUM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_User_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_User_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Bundle_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Bundle_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Factory_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Factory_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_HourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_HourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_DayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_DayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Token_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Token_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Transaction_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Transaction_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenSearchArgs = {
  text: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairSearchArgs = {
  text: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_userSearchArgs = {
  text: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM__metaArgs = {
  block?: InputMaybe<ETHEREUM_Block_height>;
};

/** The block at which the query should be executed. */
export type MATIC_Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['MATIC_Bytes']>;
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

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type MATIC_User = {
  id: Scalars['ID'];
  liquidityPositions: Array<MATIC_LiquidityPosition>;
};


export type MATIC_UserliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
};

export type MATIC_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

/** Defines the order direction, either ascending or descending */
export type MATIC_OrderDirection =
  | 'asc'
  | 'desc';

export type MATIC_LiquidityPosition_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type MATIC_LiquidityPosition = {
  id: Scalars['ID'];
  user: MATIC_User;
  pair: MATIC_Pair;
  liquidityTokenBalance: Scalars['MATIC_BigDecimal'];
  snapshots: Array<Maybe<MATIC_LiquidityPositionSnapshot>>;
  block: Scalars['Int'];
  timestamp: Scalars['Int'];
};


export type MATIC_LiquidityPositionsnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
};

export type MATIC_Pair = {
  id: Scalars['ID'];
  factory: MATIC_Factory;
  name: Scalars['String'];
  token0: MATIC_Token;
  token1: MATIC_Token;
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  totalSupply: Scalars['MATIC_BigDecimal'];
  reserveETH: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  trackedReserveETH: Scalars['MATIC_BigDecimal'];
  token0Price: Scalars['MATIC_BigDecimal'];
  token1Price: Scalars['MATIC_BigDecimal'];
  volumeToken0: Scalars['MATIC_BigDecimal'];
  volumeToken1: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  liquidityPositions: Array<MATIC_LiquidityPosition>;
  liquidityPositionSnapshots: Array<MATIC_LiquidityPositionSnapshot>;
  dayData: Array<MATIC_PairDayData>;
  hourData: Array<MATIC_PairHourData>;
  mints: Array<MATIC_Mint>;
  burns: Array<MATIC_Burn>;
  swaps: Array<MATIC_Swap>;
  timestamp: Scalars['BigInt'];
  block: Scalars['BigInt'];
};


export type MATIC_PairliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
};


export type MATIC_PairliquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
};


export type MATIC_PairdayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
};


export type MATIC_PairhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairHourData_filter>;
};


export type MATIC_PairmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
};


export type MATIC_PairburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
};


export type MATIC_PairswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
};

export type MATIC_Factory = {
  id: Scalars['ID'];
  pairCount: Scalars['BigInt'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  volumeETH: Scalars['MATIC_BigDecimal'];
  untrackedVolumeUSD: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  tokenCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  pairs: Array<MATIC_Pair>;
  tokens: Array<MATIC_Token>;
  hourData: Array<MATIC_HourData>;
  dayData: Array<MATIC_DayData>;
};


export type MATIC_FactorypairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_FactorytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Token_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Token_filter>;
};


export type MATIC_FactoryhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_HourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_HourData_filter>;
};


export type MATIC_FactorydayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_DayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_DayData_filter>;
};

export type MATIC_Pair_orderBy =
  | 'id'
  | 'factory'
  | 'name'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveETH'
  | 'reserveUSD'
  | 'trackedReserveETH'
  | 'token0Price'
  | 'token1Price'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidityProviderCount'
  | 'liquidityPositions'
  | 'liquidityPositionSnapshots'
  | 'dayData'
  | 'hourData'
  | 'mints'
  | 'burns'
  | 'swaps'
  | 'timestamp'
  | 'block';

export type MATIC_Pair_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  trackedReserveETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token0Price?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token0Price_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1Price?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1Price_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_Token_orderBy =
  | 'id'
  | 'factory'
  | 'symbol'
  | 'name'
  | 'decimals'
  | 'totalSupply'
  | 'volume'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'derivedETH'
  | 'whitelistPairs'
  | 'hourData'
  | 'dayData'
  | 'basePairs'
  | 'quotePairs'
  | 'basePairsDayData'
  | 'quotePairsDayData';

export type MATIC_Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  derivedETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  whitelistPairs?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_contains?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not_contains?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

export type MATIC_Token = {
  id: Scalars['ID'];
  factory: MATIC_Factory;
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  volume: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MATIC_BigDecimal'];
  derivedETH: Scalars['MATIC_BigDecimal'];
  whitelistPairs: Array<MATIC_Pair>;
  hourData: Array<MATIC_TokenHourData>;
  dayData: Array<MATIC_TokenDayData>;
  basePairs: Array<MATIC_Pair>;
  quotePairs: Array<MATIC_Pair>;
  basePairsDayData: Array<MATIC_PairDayData>;
  quotePairsDayData: Array<MATIC_PairDayData>;
};


export type MATIC_TokenwhitelistPairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_TokenhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenHourData_filter>;
};


export type MATIC_TokendayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenDayData_filter>;
};


export type MATIC_TokenbasePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_TokenquotePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_TokenbasePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
};


export type MATIC_TokenquotePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
};

export type MATIC_TokenHourData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type MATIC_TokenHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_TokenHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MATIC_Token;
  volume: Scalars['MATIC_BigDecimal'];
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  priceUSD: Scalars['MATIC_BigDecimal'];
};

export type MATIC_TokenDayData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type MATIC_TokenDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_TokenDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MATIC_Token;
  volume: Scalars['MATIC_BigDecimal'];
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  priceUSD: Scalars['MATIC_BigDecimal'];
};

export type MATIC_PairDayData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type MATIC_PairDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_PairDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MATIC_Pair;
  token0: MATIC_Token;
  token1: MATIC_Token;
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  totalSupply: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  volumeToken0: Scalars['MATIC_BigDecimal'];
  volumeToken1: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_HourData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type MATIC_HourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: MATIC_Factory;
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolume: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_DayData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type MATIC_DayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: MATIC_Factory;
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolume: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_LiquidityPositionSnapshot_orderBy =
  | 'id'
  | 'liquidityPosition'
  | 'timestamp'
  | 'block'
  | 'user'
  | 'pair'
  | 'token0PriceUSD'
  | 'token1PriceUSD'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'liquidityTokenTotalSupply'
  | 'liquidityTokenBalance';

export type MATIC_LiquidityPositionSnapshot_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPosition?: InputMaybe<Scalars['String']>;
  liquidityPosition_not?: InputMaybe<Scalars['String']>;
  liquidityPosition_gt?: InputMaybe<Scalars['String']>;
  liquidityPosition_lt?: InputMaybe<Scalars['String']>;
  liquidityPosition_gte?: InputMaybe<Scalars['String']>;
  liquidityPosition_lte?: InputMaybe<Scalars['String']>;
  liquidityPosition_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0PriceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1PriceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_LiquidityPositionSnapshot = {
  id: Scalars['ID'];
  liquidityPosition: MATIC_LiquidityPosition;
  timestamp: Scalars['Int'];
  block: Scalars['Int'];
  user: MATIC_User;
  pair: MATIC_Pair;
  token0PriceUSD: Scalars['MATIC_BigDecimal'];
  token1PriceUSD: Scalars['MATIC_BigDecimal'];
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  liquidityTokenTotalSupply: Scalars['MATIC_BigDecimal'];
  liquidityTokenBalance: Scalars['MATIC_BigDecimal'];
};

export type MATIC_PairHourData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type MATIC_PairHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_PairHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MATIC_Pair;
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  volumeToken0: Scalars['MATIC_BigDecimal'];
  volumeToken1: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_Mint_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'to'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'logIndex'
  | 'amountUSD'
  | 'feeTo'
  | 'feeLiquidity';

export type MATIC_Mint_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  amount0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Mint = {
  id: Scalars['ID'];
  transaction: MATIC_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MATIC_Pair;
  to: Scalars['MATIC_Bytes'];
  liquidity: Scalars['MATIC_BigDecimal'];
  sender?: Maybe<Scalars['MATIC_Bytes']>;
  amount0?: Maybe<Scalars['MATIC_BigDecimal']>;
  amount1?: Maybe<Scalars['MATIC_BigDecimal']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MATIC_BigDecimal']>;
  feeTo?: Maybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MATIC_BigDecimal']>;
};

export type MATIC_Transaction = {
  id: Scalars['ID'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  mints: Array<Maybe<MATIC_Mint>>;
  burns: Array<Maybe<MATIC_Burn>>;
  swaps: Array<Maybe<MATIC_Swap>>;
};


export type MATIC_TransactionmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
};


export type MATIC_TransactionburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
};


export type MATIC_TransactionswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
};

export type MATIC_Burn_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'to'
  | 'logIndex'
  | 'amountUSD'
  | 'complete'
  | 'feeTo'
  | 'feeLiquidity';

export type MATIC_Burn_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  amount0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  to?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  complete?: InputMaybe<Scalars['Boolean']>;
  complete_not?: InputMaybe<Scalars['Boolean']>;
  complete_in?: InputMaybe<Array<Scalars['Boolean']>>;
  complete_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  feeTo?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Burn = {
  id: Scalars['ID'];
  transaction: MATIC_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MATIC_Pair;
  liquidity: Scalars['MATIC_BigDecimal'];
  sender?: Maybe<Scalars['MATIC_Bytes']>;
  amount0?: Maybe<Scalars['MATIC_BigDecimal']>;
  amount1?: Maybe<Scalars['MATIC_BigDecimal']>;
  to?: Maybe<Scalars['MATIC_Bytes']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MATIC_BigDecimal']>;
  complete: Scalars['Boolean'];
  feeTo?: Maybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MATIC_BigDecimal']>;
};

export type MATIC_Swap_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'sender'
  | 'amount0In'
  | 'amount1In'
  | 'amount0Out'
  | 'amount1Out'
  | 'to'
  | 'logIndex'
  | 'amountUSD';

export type MATIC_Swap_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  amount0In?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0In_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1In?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1In_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0Out?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1Out?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  to?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Swap = {
  id: Scalars['ID'];
  transaction: MATIC_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MATIC_Pair;
  sender: Scalars['MATIC_Bytes'];
  amount0In: Scalars['MATIC_BigDecimal'];
  amount1In: Scalars['MATIC_BigDecimal'];
  amount0Out: Scalars['MATIC_BigDecimal'];
  amount1Out: Scalars['MATIC_BigDecimal'];
  to: Scalars['MATIC_Bytes'];
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD: Scalars['MATIC_BigDecimal'];
};

export type MATIC_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type MATIC_User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export type MATIC_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['MATIC_BigDecimal'];
};

export type MATIC_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

export type MATIC_Bundle_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ethPrice?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Factory_orderBy =
  | 'id'
  | 'pairCount'
  | 'volumeUSD'
  | 'volumeETH'
  | 'untrackedVolumeUSD'
  | 'liquidityUSD'
  | 'liquidityETH'
  | 'txCount'
  | 'tokenCount'
  | 'userCount'
  | 'pairs'
  | 'tokens'
  | 'hourData'
  | 'dayData';

export type MATIC_Factory_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pairCount?: InputMaybe<Scalars['BigInt']>;
  pairCount_not?: InputMaybe<Scalars['BigInt']>;
  pairCount_gt?: InputMaybe<Scalars['BigInt']>;
  pairCount_lt?: InputMaybe<Scalars['BigInt']>;
  pairCount_gte?: InputMaybe<Scalars['BigInt']>;
  pairCount_lte?: InputMaybe<Scalars['BigInt']>;
  pairCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pairCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount?: InputMaybe<Scalars['BigInt']>;
  userCount_not?: InputMaybe<Scalars['BigInt']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']>;
  userCount_lt?: InputMaybe<Scalars['BigInt']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

export type MATIC_Transaction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mints?: InputMaybe<Array<Scalars['String']>>;
  mints_not?: InputMaybe<Array<Scalars['String']>>;
  mints_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

/** The type for the top-level _meta field */
export type MATIC__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: MATIC__Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type MATIC__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['MATIC_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The block at which the query should be executed. */
export type ETHEREUM_Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
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

export type ETHEREUM_User = {
  id: Scalars['ID'];
  liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
};


export type ETHEREUM_UserliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
};

export type ETHEREUM_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

/** Defines the order direction, either ascending or descending */
export type ETHEREUM_OrderDirection =
  | 'asc'
  | 'desc';

export type ETHEREUM_LiquidityPosition_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type ETHEREUM_LiquidityPosition = {
  id: Scalars['ID'];
  user: ETHEREUM_User;
  pair: ETHEREUM_Pair;
  liquidityTokenBalance: Scalars['ETHEREUM_BigDecimal'];
  snapshots: Array<Maybe<ETHEREUM_LiquidityPositionSnapshot>>;
  block: Scalars['Int'];
  timestamp: Scalars['Int'];
};


export type ETHEREUM_LiquidityPositionsnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
};

export type ETHEREUM_Pair = {
  id: Scalars['ID'];
  factory: ETHEREUM_Factory;
  name: Scalars['String'];
  token0: ETHEREUM_Token;
  token1: ETHEREUM_Token;
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  totalSupply: Scalars['ETHEREUM_BigDecimal'];
  reserveETH: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  trackedReserveETH: Scalars['ETHEREUM_BigDecimal'];
  token0Price: Scalars['ETHEREUM_BigDecimal'];
  token1Price: Scalars['ETHEREUM_BigDecimal'];
  volumeToken0: Scalars['ETHEREUM_BigDecimal'];
  volumeToken1: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
  liquidityPositionSnapshots: Array<ETHEREUM_LiquidityPositionSnapshot>;
  dayData: Array<ETHEREUM_PairDayData>;
  hourData: Array<ETHEREUM_PairHourData>;
  mints: Array<ETHEREUM_Mint>;
  burns: Array<ETHEREUM_Burn>;
  swaps: Array<ETHEREUM_Swap>;
  timestamp: Scalars['BigInt'];
  block: Scalars['BigInt'];
};


export type ETHEREUM_PairliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
};


export type ETHEREUM_PairliquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
};


export type ETHEREUM_PairdayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
};


export type ETHEREUM_PairhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairHourData_filter>;
};


export type ETHEREUM_PairmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
};


export type ETHEREUM_PairburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
};


export type ETHEREUM_PairswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
};

export type ETHEREUM_Factory = {
  id: Scalars['ID'];
  pairCount: Scalars['BigInt'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolumeUSD: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  tokenCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  pairs: Array<ETHEREUM_Pair>;
  tokens: Array<ETHEREUM_Token>;
  hourData: Array<ETHEREUM_HourData>;
  dayData: Array<ETHEREUM_DayData>;
};


export type ETHEREUM_FactorypairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
};


export type ETHEREUM_FactorytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Token_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Token_filter>;
};


export type ETHEREUM_FactoryhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_HourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_HourData_filter>;
};


export type ETHEREUM_FactorydayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_DayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_DayData_filter>;
};

export type ETHEREUM_Pair_orderBy =
  | 'id'
  | 'factory'
  | 'name'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveETH'
  | 'reserveUSD'
  | 'trackedReserveETH'
  | 'token0Price'
  | 'token1Price'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidityProviderCount'
  | 'liquidityPositions'
  | 'liquidityPositionSnapshots'
  | 'dayData'
  | 'hourData'
  | 'mints'
  | 'burns'
  | 'swaps'
  | 'timestamp'
  | 'block';

export type ETHEREUM_Pair_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  trackedReserveETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token0Price?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token0Price_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1Price?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1Price_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_Token_orderBy =
  | 'id'
  | 'factory'
  | 'symbol'
  | 'name'
  | 'decimals'
  | 'totalSupply'
  | 'volume'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'derivedETH'
  | 'hourData'
  | 'dayData'
  | 'basePairs'
  | 'quotePairs'
  | 'basePairsDayData'
  | 'quotePairsDayData';

export type ETHEREUM_Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  derivedETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Token = {
  id: Scalars['ID'];
  factory: ETHEREUM_Factory;
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  volume: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  derivedETH: Scalars['ETHEREUM_BigDecimal'];
  hourData: Array<ETHEREUM_TokenHourData>;
  dayData: Array<ETHEREUM_TokenDayData>;
  basePairs: Array<ETHEREUM_Pair>;
  quotePairs: Array<ETHEREUM_Pair>;
  basePairsDayData: Array<ETHEREUM_PairDayData>;
  quotePairsDayData: Array<ETHEREUM_PairDayData>;
};


export type ETHEREUM_TokenhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenHourData_filter>;
};


export type ETHEREUM_TokendayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenDayData_filter>;
};


export type ETHEREUM_TokenbasePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
};


export type ETHEREUM_TokenquotePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
};


export type ETHEREUM_TokenbasePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
};


export type ETHEREUM_TokenquotePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
};

export type ETHEREUM_TokenHourData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type ETHEREUM_TokenHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_TokenHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: ETHEREUM_Token;
  volume: Scalars['ETHEREUM_BigDecimal'];
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  priceUSD: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_TokenDayData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type ETHEREUM_TokenDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_TokenDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: ETHEREUM_Token;
  volume: Scalars['ETHEREUM_BigDecimal'];
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  priceUSD: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_PairDayData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type ETHEREUM_PairDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_PairDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: ETHEREUM_Pair;
  token0: ETHEREUM_Token;
  token1: ETHEREUM_Token;
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  totalSupply: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  volumeToken0: Scalars['ETHEREUM_BigDecimal'];
  volumeToken1: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_HourData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type ETHEREUM_HourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: ETHEREUM_Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_DayData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type ETHEREUM_DayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: ETHEREUM_Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_LiquidityPositionSnapshot_orderBy =
  | 'id'
  | 'liquidityPosition'
  | 'timestamp'
  | 'block'
  | 'user'
  | 'pair'
  | 'token0PriceUSD'
  | 'token1PriceUSD'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'liquidityTokenTotalSupply'
  | 'liquidityTokenBalance';

export type ETHEREUM_LiquidityPositionSnapshot_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPosition?: InputMaybe<Scalars['String']>;
  liquidityPosition_not?: InputMaybe<Scalars['String']>;
  liquidityPosition_gt?: InputMaybe<Scalars['String']>;
  liquidityPosition_lt?: InputMaybe<Scalars['String']>;
  liquidityPosition_gte?: InputMaybe<Scalars['String']>;
  liquidityPosition_lte?: InputMaybe<Scalars['String']>;
  liquidityPosition_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0PriceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1PriceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_LiquidityPositionSnapshot = {
  id: Scalars['ID'];
  liquidityPosition: ETHEREUM_LiquidityPosition;
  timestamp: Scalars['Int'];
  block: Scalars['Int'];
  user: ETHEREUM_User;
  pair: ETHEREUM_Pair;
  token0PriceUSD: Scalars['ETHEREUM_BigDecimal'];
  token1PriceUSD: Scalars['ETHEREUM_BigDecimal'];
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  liquidityTokenTotalSupply: Scalars['ETHEREUM_BigDecimal'];
  liquidityTokenBalance: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_PairHourData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type ETHEREUM_PairHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_PairHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: ETHEREUM_Pair;
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  volumeToken0: Scalars['ETHEREUM_BigDecimal'];
  volumeToken1: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_Mint_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'to'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'logIndex'
  | 'amountUSD'
  | 'feeTo'
  | 'feeLiquidity';

export type ETHEREUM_Mint_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Mint = {
  id: Scalars['ID'];
  transaction: ETHEREUM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: ETHEREUM_Pair;
  to: Scalars['ETHEREUM_Bytes'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  sender?: Maybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  feeTo?: Maybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
};

export type ETHEREUM_Transaction = {
  id: Scalars['ID'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  mints: Array<Maybe<ETHEREUM_Mint>>;
  burns: Array<Maybe<ETHEREUM_Burn>>;
  swaps: Array<Maybe<ETHEREUM_Swap>>;
};


export type ETHEREUM_TransactionmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
};


export type ETHEREUM_TransactionburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
};


export type ETHEREUM_TransactionswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
};

export type ETHEREUM_Burn_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'to'
  | 'logIndex'
  | 'amountUSD'
  | 'complete'
  | 'feeTo'
  | 'feeLiquidity';

export type ETHEREUM_Burn_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  to?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  complete?: InputMaybe<Scalars['Boolean']>;
  complete_not?: InputMaybe<Scalars['Boolean']>;
  complete_in?: InputMaybe<Array<Scalars['Boolean']>>;
  complete_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  feeTo?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Burn = {
  id: Scalars['ID'];
  transaction: ETHEREUM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: ETHEREUM_Pair;
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  sender?: Maybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  to?: Maybe<Scalars['ETHEREUM_Bytes']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  complete: Scalars['Boolean'];
  feeTo?: Maybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
};

export type ETHEREUM_Swap_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'sender'
  | 'amount0In'
  | 'amount1In'
  | 'amount0Out'
  | 'amount1Out'
  | 'to'
  | 'logIndex'
  | 'amountUSD';

export type ETHEREUM_Swap_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  amount0In?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0In_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1In?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1In_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0Out?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1Out?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  to?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Swap = {
  id: Scalars['ID'];
  transaction: ETHEREUM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: ETHEREUM_Pair;
  sender: Scalars['ETHEREUM_Bytes'];
  amount0In: Scalars['ETHEREUM_BigDecimal'];
  amount1In: Scalars['ETHEREUM_BigDecimal'];
  amount0Out: Scalars['ETHEREUM_BigDecimal'];
  amount1Out: Scalars['ETHEREUM_BigDecimal'];
  to: Scalars['ETHEREUM_Bytes'];
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type ETHEREUM_User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export type ETHEREUM_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

export type ETHEREUM_Bundle_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ethPrice?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Factory_orderBy =
  | 'id'
  | 'pairCount'
  | 'volumeUSD'
  | 'volumeETH'
  | 'untrackedVolumeUSD'
  | 'liquidityUSD'
  | 'liquidityETH'
  | 'txCount'
  | 'tokenCount'
  | 'userCount'
  | 'pairs'
  | 'tokens'
  | 'hourData'
  | 'dayData';

export type ETHEREUM_Factory_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pairCount?: InputMaybe<Scalars['BigInt']>;
  pairCount_not?: InputMaybe<Scalars['BigInt']>;
  pairCount_gt?: InputMaybe<Scalars['BigInt']>;
  pairCount_lt?: InputMaybe<Scalars['BigInt']>;
  pairCount_gte?: InputMaybe<Scalars['BigInt']>;
  pairCount_lte?: InputMaybe<Scalars['BigInt']>;
  pairCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pairCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount?: InputMaybe<Scalars['BigInt']>;
  userCount_not?: InputMaybe<Scalars['BigInt']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']>;
  userCount_lt?: InputMaybe<Scalars['BigInt']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

export type ETHEREUM_Transaction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mints?: InputMaybe<Array<Scalars['String']>>;
  mints_not?: InputMaybe<Array<Scalars['String']>>;
  mints_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

/** The type for the top-level _meta field */
export type ETHEREUM__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: ETHEREUM__Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type ETHEREUM__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['ETHEREUM_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

export type Subscription = {
  MATIC_user?: Maybe<MATIC_User>;
  MATIC_users: Array<MATIC_User>;
  MATIC_bundle?: Maybe<MATIC_Bundle>;
  MATIC_bundles: Array<MATIC_Bundle>;
  MATIC_factory?: Maybe<MATIC_Factory>;
  MATIC_factories: Array<MATIC_Factory>;
  MATIC_hourData?: Maybe<MATIC_HourData>;
  MATIC_hourDatas: Array<MATIC_HourData>;
  MATIC_dayData?: Maybe<MATIC_DayData>;
  MATIC_dayDatas: Array<MATIC_DayData>;
  MATIC_token?: Maybe<MATIC_Token>;
  MATIC_tokens: Array<MATIC_Token>;
  MATIC_tokenHourData?: Maybe<MATIC_TokenHourData>;
  MATIC_tokenHourDatas: Array<MATIC_TokenHourData>;
  MATIC_tokenDayData?: Maybe<MATIC_TokenDayData>;
  MATIC_tokenDayDatas: Array<MATIC_TokenDayData>;
  MATIC_pair?: Maybe<MATIC_Pair>;
  MATIC_pairs: Array<MATIC_Pair>;
  MATIC_pairHourData?: Maybe<MATIC_PairHourData>;
  MATIC_pairHourDatas: Array<MATIC_PairHourData>;
  MATIC_pairDayData?: Maybe<MATIC_PairDayData>;
  MATIC_pairDayDatas: Array<MATIC_PairDayData>;
  MATIC_liquidityPosition?: Maybe<MATIC_LiquidityPosition>;
  MATIC_liquidityPositions: Array<MATIC_LiquidityPosition>;
  MATIC_liquidityPositionSnapshot?: Maybe<MATIC_LiquidityPositionSnapshot>;
  MATIC_liquidityPositionSnapshots: Array<MATIC_LiquidityPositionSnapshot>;
  MATIC_transaction?: Maybe<MATIC_Transaction>;
  MATIC_transactions: Array<MATIC_Transaction>;
  MATIC_mint?: Maybe<MATIC_Mint>;
  MATIC_mints: Array<MATIC_Mint>;
  MATIC_burn?: Maybe<MATIC_Burn>;
  MATIC_burns: Array<MATIC_Burn>;
  MATIC_swap?: Maybe<MATIC_Swap>;
  MATIC_swaps: Array<MATIC_Swap>;
  /** Access to subgraph metadata */
  MATIC__meta?: Maybe<MATIC__Meta_>;
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<ETHEREUM_Factory>;
  ETHEREUM_factories: Array<ETHEREUM_Factory>;
  ETHEREUM_hourData?: Maybe<ETHEREUM_HourData>;
  ETHEREUM_hourDatas: Array<ETHEREUM_HourData>;
  ETHEREUM_dayData?: Maybe<ETHEREUM_DayData>;
  ETHEREUM_dayDatas: Array<ETHEREUM_DayData>;
  ETHEREUM_token?: Maybe<ETHEREUM_Token>;
  ETHEREUM_tokens: Array<ETHEREUM_Token>;
  ETHEREUM_tokenHourData?: Maybe<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenHourDatas: Array<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenDayData?: Maybe<ETHEREUM_TokenDayData>;
  ETHEREUM_tokenDayDatas: Array<ETHEREUM_TokenDayData>;
  ETHEREUM_pair?: Maybe<ETHEREUM_Pair>;
  ETHEREUM_pairs: Array<ETHEREUM_Pair>;
  ETHEREUM_pairHourData?: Maybe<ETHEREUM_PairHourData>;
  ETHEREUM_pairHourDatas: Array<ETHEREUM_PairHourData>;
  ETHEREUM_pairDayData?: Maybe<ETHEREUM_PairDayData>;
  ETHEREUM_pairDayDatas: Array<ETHEREUM_PairDayData>;
  ETHEREUM_liquidityPosition?: Maybe<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositionSnapshot?: Maybe<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_liquidityPositionSnapshots: Array<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_transaction?: Maybe<ETHEREUM_Transaction>;
  ETHEREUM_transactions: Array<ETHEREUM_Transaction>;
  ETHEREUM_mint?: Maybe<ETHEREUM_Mint>;
  ETHEREUM_mints: Array<ETHEREUM_Mint>;
  ETHEREUM_burn?: Maybe<ETHEREUM_Burn>;
  ETHEREUM_burns: Array<ETHEREUM_Burn>;
  ETHEREUM_swap?: Maybe<ETHEREUM_Swap>;
  ETHEREUM_swaps: Array<ETHEREUM_Swap>;
  /** Access to subgraph metadata */
  ETHEREUM__meta?: Maybe<ETHEREUM__Meta_>;
};


export type SubscriptionMATIC_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_User_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_User_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Bundle_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Bundle_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Factory_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Factory_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_HourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_HourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_DayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_DayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Token_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Token_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Transaction_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Transaction_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC__metaArgs = {
  block?: InputMaybe<MATIC_Block_height>;
};


export type SubscriptionETHEREUM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_User_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_User_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Bundle_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Bundle_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Factory_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Factory_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_HourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_HourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_DayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_DayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Token_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Token_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Transaction_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Transaction_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM__metaArgs = {
  block?: InputMaybe<ETHEREUM_Block_height>;
};

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
  ID: ResolverTypeWrapper<Scalars['ID']>;
  MATIC_Block_height: MATIC_Block_height;
  MATIC_Bytes: ResolverTypeWrapper<Scalars['MATIC_Bytes']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
  MATIC_User: ResolverTypeWrapper<MATIC_User>;
  MATIC_LiquidityPosition_orderBy: MATIC_LiquidityPosition_orderBy;
  MATIC_OrderDirection: MATIC_OrderDirection;
  MATIC_LiquidityPosition_filter: MATIC_LiquidityPosition_filter;
  String: ResolverTypeWrapper<Scalars['String']>;
  MATIC_BigDecimal: ResolverTypeWrapper<Scalars['MATIC_BigDecimal']>;
  MATIC_LiquidityPosition: ResolverTypeWrapper<MATIC_LiquidityPosition>;
  MATIC_Pair: ResolverTypeWrapper<MATIC_Pair>;
  MATIC_Factory: ResolverTypeWrapper<MATIC_Factory>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  MATIC_Pair_orderBy: MATIC_Pair_orderBy;
  MATIC_Pair_filter: MATIC_Pair_filter;
  MATIC_Token_orderBy: MATIC_Token_orderBy;
  MATIC_Token_filter: MATIC_Token_filter;
  MATIC_Token: ResolverTypeWrapper<MATIC_Token>;
  MATIC_TokenHourData_orderBy: MATIC_TokenHourData_orderBy;
  MATIC_TokenHourData_filter: MATIC_TokenHourData_filter;
  MATIC_TokenHourData: ResolverTypeWrapper<MATIC_TokenHourData>;
  MATIC_TokenDayData_orderBy: MATIC_TokenDayData_orderBy;
  MATIC_TokenDayData_filter: MATIC_TokenDayData_filter;
  MATIC_TokenDayData: ResolverTypeWrapper<MATIC_TokenDayData>;
  MATIC_PairDayData_orderBy: MATIC_PairDayData_orderBy;
  MATIC_PairDayData_filter: MATIC_PairDayData_filter;
  MATIC_PairDayData: ResolverTypeWrapper<MATIC_PairDayData>;
  MATIC_HourData_orderBy: MATIC_HourData_orderBy;
  MATIC_HourData_filter: MATIC_HourData_filter;
  MATIC_HourData: ResolverTypeWrapper<MATIC_HourData>;
  MATIC_DayData_orderBy: MATIC_DayData_orderBy;
  MATIC_DayData_filter: MATIC_DayData_filter;
  MATIC_DayData: ResolverTypeWrapper<MATIC_DayData>;
  MATIC_LiquidityPositionSnapshot_orderBy: MATIC_LiquidityPositionSnapshot_orderBy;
  MATIC_LiquidityPositionSnapshot_filter: MATIC_LiquidityPositionSnapshot_filter;
  MATIC_LiquidityPositionSnapshot: ResolverTypeWrapper<MATIC_LiquidityPositionSnapshot>;
  MATIC_PairHourData_orderBy: MATIC_PairHourData_orderBy;
  MATIC_PairHourData_filter: MATIC_PairHourData_filter;
  MATIC_PairHourData: ResolverTypeWrapper<MATIC_PairHourData>;
  MATIC_Mint_orderBy: MATIC_Mint_orderBy;
  MATIC_Mint_filter: MATIC_Mint_filter;
  MATIC_Mint: ResolverTypeWrapper<MATIC_Mint>;
  MATIC_Transaction: ResolverTypeWrapper<MATIC_Transaction>;
  MATIC_Burn_orderBy: MATIC_Burn_orderBy;
  MATIC_Burn_filter: MATIC_Burn_filter;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  MATIC_Burn: ResolverTypeWrapper<MATIC_Burn>;
  MATIC_Swap_orderBy: MATIC_Swap_orderBy;
  MATIC_Swap_filter: MATIC_Swap_filter;
  MATIC_Swap: ResolverTypeWrapper<MATIC_Swap>;
  MATIC_User_orderBy: MATIC_User_orderBy;
  MATIC_User_filter: MATIC_User_filter;
  MATIC_Bundle: ResolverTypeWrapper<MATIC_Bundle>;
  MATIC_Bundle_orderBy: MATIC_Bundle_orderBy;
  MATIC_Bundle_filter: MATIC_Bundle_filter;
  MATIC_Factory_orderBy: MATIC_Factory_orderBy;
  MATIC_Factory_filter: MATIC_Factory_filter;
  MATIC_Transaction_orderBy: MATIC_Transaction_orderBy;
  MATIC_Transaction_filter: MATIC_Transaction_filter;
  MATIC__Meta_: ResolverTypeWrapper<MATIC__Meta_>;
  MATIC__Block_: ResolverTypeWrapper<MATIC__Block_>;
  ETHEREUM_Block_height: ETHEREUM_Block_height;
  ETHEREUM_Bytes: ResolverTypeWrapper<Scalars['ETHEREUM_Bytes']>;
  ETHEREUM_User: ResolverTypeWrapper<ETHEREUM_User>;
  ETHEREUM_LiquidityPosition_orderBy: ETHEREUM_LiquidityPosition_orderBy;
  ETHEREUM_OrderDirection: ETHEREUM_OrderDirection;
  ETHEREUM_LiquidityPosition_filter: ETHEREUM_LiquidityPosition_filter;
  ETHEREUM_BigDecimal: ResolverTypeWrapper<Scalars['ETHEREUM_BigDecimal']>;
  ETHEREUM_LiquidityPosition: ResolverTypeWrapper<ETHEREUM_LiquidityPosition>;
  ETHEREUM_Pair: ResolverTypeWrapper<ETHEREUM_Pair>;
  ETHEREUM_Factory: ResolverTypeWrapper<ETHEREUM_Factory>;
  ETHEREUM_Pair_orderBy: ETHEREUM_Pair_orderBy;
  ETHEREUM_Pair_filter: ETHEREUM_Pair_filter;
  ETHEREUM_Token_orderBy: ETHEREUM_Token_orderBy;
  ETHEREUM_Token_filter: ETHEREUM_Token_filter;
  ETHEREUM_Token: ResolverTypeWrapper<ETHEREUM_Token>;
  ETHEREUM_TokenHourData_orderBy: ETHEREUM_TokenHourData_orderBy;
  ETHEREUM_TokenHourData_filter: ETHEREUM_TokenHourData_filter;
  ETHEREUM_TokenHourData: ResolverTypeWrapper<ETHEREUM_TokenHourData>;
  ETHEREUM_TokenDayData_orderBy: ETHEREUM_TokenDayData_orderBy;
  ETHEREUM_TokenDayData_filter: ETHEREUM_TokenDayData_filter;
  ETHEREUM_TokenDayData: ResolverTypeWrapper<ETHEREUM_TokenDayData>;
  ETHEREUM_PairDayData_orderBy: ETHEREUM_PairDayData_orderBy;
  ETHEREUM_PairDayData_filter: ETHEREUM_PairDayData_filter;
  ETHEREUM_PairDayData: ResolverTypeWrapper<ETHEREUM_PairDayData>;
  ETHEREUM_HourData_orderBy: ETHEREUM_HourData_orderBy;
  ETHEREUM_HourData_filter: ETHEREUM_HourData_filter;
  ETHEREUM_HourData: ResolverTypeWrapper<ETHEREUM_HourData>;
  ETHEREUM_DayData_orderBy: ETHEREUM_DayData_orderBy;
  ETHEREUM_DayData_filter: ETHEREUM_DayData_filter;
  ETHEREUM_DayData: ResolverTypeWrapper<ETHEREUM_DayData>;
  ETHEREUM_LiquidityPositionSnapshot_orderBy: ETHEREUM_LiquidityPositionSnapshot_orderBy;
  ETHEREUM_LiquidityPositionSnapshot_filter: ETHEREUM_LiquidityPositionSnapshot_filter;
  ETHEREUM_LiquidityPositionSnapshot: ResolverTypeWrapper<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_PairHourData_orderBy: ETHEREUM_PairHourData_orderBy;
  ETHEREUM_PairHourData_filter: ETHEREUM_PairHourData_filter;
  ETHEREUM_PairHourData: ResolverTypeWrapper<ETHEREUM_PairHourData>;
  ETHEREUM_Mint_orderBy: ETHEREUM_Mint_orderBy;
  ETHEREUM_Mint_filter: ETHEREUM_Mint_filter;
  ETHEREUM_Mint: ResolverTypeWrapper<ETHEREUM_Mint>;
  ETHEREUM_Transaction: ResolverTypeWrapper<ETHEREUM_Transaction>;
  ETHEREUM_Burn_orderBy: ETHEREUM_Burn_orderBy;
  ETHEREUM_Burn_filter: ETHEREUM_Burn_filter;
  ETHEREUM_Burn: ResolverTypeWrapper<ETHEREUM_Burn>;
  ETHEREUM_Swap_orderBy: ETHEREUM_Swap_orderBy;
  ETHEREUM_Swap_filter: ETHEREUM_Swap_filter;
  ETHEREUM_Swap: ResolverTypeWrapper<ETHEREUM_Swap>;
  ETHEREUM_User_orderBy: ETHEREUM_User_orderBy;
  ETHEREUM_User_filter: ETHEREUM_User_filter;
  ETHEREUM_Bundle: ResolverTypeWrapper<ETHEREUM_Bundle>;
  ETHEREUM_Bundle_orderBy: ETHEREUM_Bundle_orderBy;
  ETHEREUM_Bundle_filter: ETHEREUM_Bundle_filter;
  ETHEREUM_Factory_orderBy: ETHEREUM_Factory_orderBy;
  ETHEREUM_Factory_filter: ETHEREUM_Factory_filter;
  ETHEREUM_Transaction_orderBy: ETHEREUM_Transaction_orderBy;
  ETHEREUM_Transaction_filter: ETHEREUM_Transaction_filter;
  ETHEREUM__Meta_: ResolverTypeWrapper<ETHEREUM__Meta_>;
  ETHEREUM__Block_: ResolverTypeWrapper<ETHEREUM__Block_>;
  Subscription: ResolverTypeWrapper<{}>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  ID: Scalars['ID'];
  MATIC_Block_height: MATIC_Block_height;
  MATIC_Bytes: Scalars['MATIC_Bytes'];
  Int: Scalars['Int'];
  MATIC_User: MATIC_User;
  MATIC_LiquidityPosition_filter: MATIC_LiquidityPosition_filter;
  String: Scalars['String'];
  MATIC_BigDecimal: Scalars['MATIC_BigDecimal'];
  MATIC_LiquidityPosition: MATIC_LiquidityPosition;
  MATIC_Pair: MATIC_Pair;
  MATIC_Factory: MATIC_Factory;
  BigInt: Scalars['BigInt'];
  MATIC_Pair_filter: MATIC_Pair_filter;
  MATIC_Token_filter: MATIC_Token_filter;
  MATIC_Token: MATIC_Token;
  MATIC_TokenHourData_filter: MATIC_TokenHourData_filter;
  MATIC_TokenHourData: MATIC_TokenHourData;
  MATIC_TokenDayData_filter: MATIC_TokenDayData_filter;
  MATIC_TokenDayData: MATIC_TokenDayData;
  MATIC_PairDayData_filter: MATIC_PairDayData_filter;
  MATIC_PairDayData: MATIC_PairDayData;
  MATIC_HourData_filter: MATIC_HourData_filter;
  MATIC_HourData: MATIC_HourData;
  MATIC_DayData_filter: MATIC_DayData_filter;
  MATIC_DayData: MATIC_DayData;
  MATIC_LiquidityPositionSnapshot_filter: MATIC_LiquidityPositionSnapshot_filter;
  MATIC_LiquidityPositionSnapshot: MATIC_LiquidityPositionSnapshot;
  MATIC_PairHourData_filter: MATIC_PairHourData_filter;
  MATIC_PairHourData: MATIC_PairHourData;
  MATIC_Mint_filter: MATIC_Mint_filter;
  MATIC_Mint: MATIC_Mint;
  MATIC_Transaction: MATIC_Transaction;
  MATIC_Burn_filter: MATIC_Burn_filter;
  Boolean: Scalars['Boolean'];
  MATIC_Burn: MATIC_Burn;
  MATIC_Swap_filter: MATIC_Swap_filter;
  MATIC_Swap: MATIC_Swap;
  MATIC_User_filter: MATIC_User_filter;
  MATIC_Bundle: MATIC_Bundle;
  MATIC_Bundle_filter: MATIC_Bundle_filter;
  MATIC_Factory_filter: MATIC_Factory_filter;
  MATIC_Transaction_filter: MATIC_Transaction_filter;
  MATIC__Meta_: MATIC__Meta_;
  MATIC__Block_: MATIC__Block_;
  ETHEREUM_Block_height: ETHEREUM_Block_height;
  ETHEREUM_Bytes: Scalars['ETHEREUM_Bytes'];
  ETHEREUM_User: ETHEREUM_User;
  ETHEREUM_LiquidityPosition_filter: ETHEREUM_LiquidityPosition_filter;
  ETHEREUM_BigDecimal: Scalars['ETHEREUM_BigDecimal'];
  ETHEREUM_LiquidityPosition: ETHEREUM_LiquidityPosition;
  ETHEREUM_Pair: ETHEREUM_Pair;
  ETHEREUM_Factory: ETHEREUM_Factory;
  ETHEREUM_Pair_filter: ETHEREUM_Pair_filter;
  ETHEREUM_Token_filter: ETHEREUM_Token_filter;
  ETHEREUM_Token: ETHEREUM_Token;
  ETHEREUM_TokenHourData_filter: ETHEREUM_TokenHourData_filter;
  ETHEREUM_TokenHourData: ETHEREUM_TokenHourData;
  ETHEREUM_TokenDayData_filter: ETHEREUM_TokenDayData_filter;
  ETHEREUM_TokenDayData: ETHEREUM_TokenDayData;
  ETHEREUM_PairDayData_filter: ETHEREUM_PairDayData_filter;
  ETHEREUM_PairDayData: ETHEREUM_PairDayData;
  ETHEREUM_HourData_filter: ETHEREUM_HourData_filter;
  ETHEREUM_HourData: ETHEREUM_HourData;
  ETHEREUM_DayData_filter: ETHEREUM_DayData_filter;
  ETHEREUM_DayData: ETHEREUM_DayData;
  ETHEREUM_LiquidityPositionSnapshot_filter: ETHEREUM_LiquidityPositionSnapshot_filter;
  ETHEREUM_LiquidityPositionSnapshot: ETHEREUM_LiquidityPositionSnapshot;
  ETHEREUM_PairHourData_filter: ETHEREUM_PairHourData_filter;
  ETHEREUM_PairHourData: ETHEREUM_PairHourData;
  ETHEREUM_Mint_filter: ETHEREUM_Mint_filter;
  ETHEREUM_Mint: ETHEREUM_Mint;
  ETHEREUM_Transaction: ETHEREUM_Transaction;
  ETHEREUM_Burn_filter: ETHEREUM_Burn_filter;
  ETHEREUM_Burn: ETHEREUM_Burn;
  ETHEREUM_Swap_filter: ETHEREUM_Swap_filter;
  ETHEREUM_Swap: ETHEREUM_Swap;
  ETHEREUM_User_filter: ETHEREUM_User_filter;
  ETHEREUM_Bundle: ETHEREUM_Bundle;
  ETHEREUM_Bundle_filter: ETHEREUM_Bundle_filter;
  ETHEREUM_Factory_filter: ETHEREUM_Factory_filter;
  ETHEREUM_Transaction_filter: ETHEREUM_Transaction_filter;
  ETHEREUM__Meta_: ETHEREUM__Meta_;
  ETHEREUM__Block_: ETHEREUM__Block_;
  Subscription: {};
  Float: Scalars['Float'];
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  MATIC_user?: Resolver<Maybe<ResolversTypes['MATIC_User']>, ParentType, ContextType, RequireFields<QueryMATIC_userArgs, 'id' | 'subgraphError'>>;
  MATIC_users?: Resolver<Array<ResolversTypes['MATIC_User']>, ParentType, ContextType, RequireFields<QueryMATIC_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_bundle?: Resolver<Maybe<ResolversTypes['MATIC_Bundle']>, ParentType, ContextType, RequireFields<QueryMATIC_bundleArgs, 'id' | 'subgraphError'>>;
  MATIC_bundles?: Resolver<Array<ResolversTypes['MATIC_Bundle']>, ParentType, ContextType, RequireFields<QueryMATIC_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_factory?: Resolver<Maybe<ResolversTypes['MATIC_Factory']>, ParentType, ContextType, RequireFields<QueryMATIC_factoryArgs, 'id' | 'subgraphError'>>;
  MATIC_factories?: Resolver<Array<ResolversTypes['MATIC_Factory']>, ParentType, ContextType, RequireFields<QueryMATIC_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_hourData?: Resolver<Maybe<ResolversTypes['MATIC_HourData']>, ParentType, ContextType, RequireFields<QueryMATIC_hourDataArgs, 'id' | 'subgraphError'>>;
  MATIC_hourDatas?: Resolver<Array<ResolversTypes['MATIC_HourData']>, ParentType, ContextType, RequireFields<QueryMATIC_hourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_dayData?: Resolver<Maybe<ResolversTypes['MATIC_DayData']>, ParentType, ContextType, RequireFields<QueryMATIC_dayDataArgs, 'id' | 'subgraphError'>>;
  MATIC_dayDatas?: Resolver<Array<ResolversTypes['MATIC_DayData']>, ParentType, ContextType, RequireFields<QueryMATIC_dayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_token?: Resolver<Maybe<ResolversTypes['MATIC_Token']>, ParentType, ContextType, RequireFields<QueryMATIC_tokenArgs, 'id' | 'subgraphError'>>;
  MATIC_tokens?: Resolver<Array<ResolversTypes['MATIC_Token']>, ParentType, ContextType, RequireFields<QueryMATIC_tokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_tokenHourData?: Resolver<Maybe<ResolversTypes['MATIC_TokenHourData']>, ParentType, ContextType, RequireFields<QueryMATIC_tokenHourDataArgs, 'id' | 'subgraphError'>>;
  MATIC_tokenHourDatas?: Resolver<Array<ResolversTypes['MATIC_TokenHourData']>, ParentType, ContextType, RequireFields<QueryMATIC_tokenHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_tokenDayData?: Resolver<Maybe<ResolversTypes['MATIC_TokenDayData']>, ParentType, ContextType, RequireFields<QueryMATIC_tokenDayDataArgs, 'id' | 'subgraphError'>>;
  MATIC_tokenDayDatas?: Resolver<Array<ResolversTypes['MATIC_TokenDayData']>, ParentType, ContextType, RequireFields<QueryMATIC_tokenDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_pair?: Resolver<Maybe<ResolversTypes['MATIC_Pair']>, ParentType, ContextType, RequireFields<QueryMATIC_pairArgs, 'id' | 'subgraphError'>>;
  MATIC_pairs?: Resolver<Array<ResolversTypes['MATIC_Pair']>, ParentType, ContextType, RequireFields<QueryMATIC_pairsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_pairHourData?: Resolver<Maybe<ResolversTypes['MATIC_PairHourData']>, ParentType, ContextType, RequireFields<QueryMATIC_pairHourDataArgs, 'id' | 'subgraphError'>>;
  MATIC_pairHourDatas?: Resolver<Array<ResolversTypes['MATIC_PairHourData']>, ParentType, ContextType, RequireFields<QueryMATIC_pairHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_pairDayData?: Resolver<Maybe<ResolversTypes['MATIC_PairDayData']>, ParentType, ContextType, RequireFields<QueryMATIC_pairDayDataArgs, 'id' | 'subgraphError'>>;
  MATIC_pairDayDatas?: Resolver<Array<ResolversTypes['MATIC_PairDayData']>, ParentType, ContextType, RequireFields<QueryMATIC_pairDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_liquidityPosition?: Resolver<Maybe<ResolversTypes['MATIC_LiquidityPosition']>, ParentType, ContextType, RequireFields<QueryMATIC_liquidityPositionArgs, 'id' | 'subgraphError'>>;
  MATIC_liquidityPositions?: Resolver<Array<ResolversTypes['MATIC_LiquidityPosition']>, ParentType, ContextType, RequireFields<QueryMATIC_liquidityPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_liquidityPositionSnapshot?: Resolver<Maybe<ResolversTypes['MATIC_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<QueryMATIC_liquidityPositionSnapshotArgs, 'id' | 'subgraphError'>>;
  MATIC_liquidityPositionSnapshots?: Resolver<Array<ResolversTypes['MATIC_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<QueryMATIC_liquidityPositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_transaction?: Resolver<Maybe<ResolversTypes['MATIC_Transaction']>, ParentType, ContextType, RequireFields<QueryMATIC_transactionArgs, 'id' | 'subgraphError'>>;
  MATIC_transactions?: Resolver<Array<ResolversTypes['MATIC_Transaction']>, ParentType, ContextType, RequireFields<QueryMATIC_transactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_mint?: Resolver<Maybe<ResolversTypes['MATIC_Mint']>, ParentType, ContextType, RequireFields<QueryMATIC_mintArgs, 'id' | 'subgraphError'>>;
  MATIC_mints?: Resolver<Array<ResolversTypes['MATIC_Mint']>, ParentType, ContextType, RequireFields<QueryMATIC_mintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_burn?: Resolver<Maybe<ResolversTypes['MATIC_Burn']>, ParentType, ContextType, RequireFields<QueryMATIC_burnArgs, 'id' | 'subgraphError'>>;
  MATIC_burns?: Resolver<Array<ResolversTypes['MATIC_Burn']>, ParentType, ContextType, RequireFields<QueryMATIC_burnsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_swap?: Resolver<Maybe<ResolversTypes['MATIC_Swap']>, ParentType, ContextType, RequireFields<QueryMATIC_swapArgs, 'id' | 'subgraphError'>>;
  MATIC_swaps?: Resolver<Array<ResolversTypes['MATIC_Swap']>, ParentType, ContextType, RequireFields<QueryMATIC_swapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC__meta?: Resolver<Maybe<ResolversTypes['MATIC__Meta_']>, ParentType, ContextType, Partial<QueryMATIC__metaArgs>>;
  ETHEREUM_user?: Resolver<Maybe<ResolversTypes['ETHEREUM_User']>, ParentType, ContextType, RequireFields<QueryETHEREUM_userArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_users?: Resolver<Array<ResolversTypes['ETHEREUM_User']>, ParentType, ContextType, RequireFields<QueryETHEREUM_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_bundle?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bundle']>, ParentType, ContextType, RequireFields<QueryETHEREUM_bundleArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_bundles?: Resolver<Array<ResolversTypes['ETHEREUM_Bundle']>, ParentType, ContextType, RequireFields<QueryETHEREUM_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_factory?: Resolver<Maybe<ResolversTypes['ETHEREUM_Factory']>, ParentType, ContextType, RequireFields<QueryETHEREUM_factoryArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_factories?: Resolver<Array<ResolversTypes['ETHEREUM_Factory']>, ParentType, ContextType, RequireFields<QueryETHEREUM_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_hourData?: Resolver<Maybe<ResolversTypes['ETHEREUM_HourData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_hourDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_hourDatas?: Resolver<Array<ResolversTypes['ETHEREUM_HourData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_hourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_dayData?: Resolver<Maybe<ResolversTypes['ETHEREUM_DayData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_dayDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_dayDatas?: Resolver<Array<ResolversTypes['ETHEREUM_DayData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_dayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_token?: Resolver<Maybe<ResolversTypes['ETHEREUM_Token']>, ParentType, ContextType, RequireFields<QueryETHEREUM_tokenArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_tokens?: Resolver<Array<ResolversTypes['ETHEREUM_Token']>, ParentType, ContextType, RequireFields<QueryETHEREUM_tokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_tokenHourData?: Resolver<Maybe<ResolversTypes['ETHEREUM_TokenHourData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_tokenHourDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_tokenHourDatas?: Resolver<Array<ResolversTypes['ETHEREUM_TokenHourData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_tokenHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_tokenDayData?: Resolver<Maybe<ResolversTypes['ETHEREUM_TokenDayData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_tokenDayDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_tokenDayDatas?: Resolver<Array<ResolversTypes['ETHEREUM_TokenDayData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_tokenDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_pair?: Resolver<Maybe<ResolversTypes['ETHEREUM_Pair']>, ParentType, ContextType, RequireFields<QueryETHEREUM_pairArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_pairs?: Resolver<Array<ResolversTypes['ETHEREUM_Pair']>, ParentType, ContextType, RequireFields<QueryETHEREUM_pairsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_pairHourData?: Resolver<Maybe<ResolversTypes['ETHEREUM_PairHourData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_pairHourDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_pairHourDatas?: Resolver<Array<ResolversTypes['ETHEREUM_PairHourData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_pairHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_pairDayData?: Resolver<Maybe<ResolversTypes['ETHEREUM_PairDayData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_pairDayDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_pairDayDatas?: Resolver<Array<ResolversTypes['ETHEREUM_PairDayData']>, ParentType, ContextType, RequireFields<QueryETHEREUM_pairDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_liquidityPosition?: Resolver<Maybe<ResolversTypes['ETHEREUM_LiquidityPosition']>, ParentType, ContextType, RequireFields<QueryETHEREUM_liquidityPositionArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_liquidityPositions?: Resolver<Array<ResolversTypes['ETHEREUM_LiquidityPosition']>, ParentType, ContextType, RequireFields<QueryETHEREUM_liquidityPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_liquidityPositionSnapshot?: Resolver<Maybe<ResolversTypes['ETHEREUM_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<QueryETHEREUM_liquidityPositionSnapshotArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_liquidityPositionSnapshots?: Resolver<Array<ResolversTypes['ETHEREUM_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<QueryETHEREUM_liquidityPositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_transaction?: Resolver<Maybe<ResolversTypes['ETHEREUM_Transaction']>, ParentType, ContextType, RequireFields<QueryETHEREUM_transactionArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_transactions?: Resolver<Array<ResolversTypes['ETHEREUM_Transaction']>, ParentType, ContextType, RequireFields<QueryETHEREUM_transactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_mint?: Resolver<Maybe<ResolversTypes['ETHEREUM_Mint']>, ParentType, ContextType, RequireFields<QueryETHEREUM_mintArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_mints?: Resolver<Array<ResolversTypes['ETHEREUM_Mint']>, ParentType, ContextType, RequireFields<QueryETHEREUM_mintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_burn?: Resolver<Maybe<ResolversTypes['ETHEREUM_Burn']>, ParentType, ContextType, RequireFields<QueryETHEREUM_burnArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_burns?: Resolver<Array<ResolversTypes['ETHEREUM_Burn']>, ParentType, ContextType, RequireFields<QueryETHEREUM_burnsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_swap?: Resolver<Maybe<ResolversTypes['ETHEREUM_Swap']>, ParentType, ContextType, RequireFields<QueryETHEREUM_swapArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_swaps?: Resolver<Array<ResolversTypes['ETHEREUM_Swap']>, ParentType, ContextType, RequireFields<QueryETHEREUM_swapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_tokenSearch?: Resolver<Array<ResolversTypes['ETHEREUM_Token']>, ParentType, ContextType, RequireFields<QueryETHEREUM_tokenSearchArgs, 'text' | 'first' | 'skip' | 'subgraphError'>>;
  ETHEREUM_pairSearch?: Resolver<Array<ResolversTypes['ETHEREUM_Pair']>, ParentType, ContextType, RequireFields<QueryETHEREUM_pairSearchArgs, 'text' | 'first' | 'skip' | 'subgraphError'>>;
  ETHEREUM_userSearch?: Resolver<Array<ResolversTypes['ETHEREUM_User']>, ParentType, ContextType, RequireFields<QueryETHEREUM_userSearchArgs, 'text' | 'first' | 'skip' | 'subgraphError'>>;
  ETHEREUM__meta?: Resolver<Maybe<ResolversTypes['ETHEREUM__Meta_']>, ParentType, ContextType, Partial<QueryETHEREUM__metaArgs>>;
}>;

export interface MATIC_BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MATIC_Bytes'], any> {
  name: 'MATIC_Bytes';
}

export type MATIC_UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_User'] = ResolversParentTypes['MATIC_User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityPositions?: Resolver<Array<ResolversTypes['MATIC_LiquidityPosition']>, ParentType, ContextType, RequireFields<MATIC_UserliquidityPositionsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface MATIC_BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MATIC_BigDecimal'], any> {
  name: 'MATIC_BigDecimal';
}

export type MATIC_LiquidityPositionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_LiquidityPosition'] = ResolversParentTypes['MATIC_LiquidityPosition']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['MATIC_User'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MATIC_Pair'], ParentType, ContextType>;
  liquidityTokenBalance?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  snapshots?: Resolver<Array<Maybe<ResolversTypes['MATIC_LiquidityPositionSnapshot']>>, ParentType, ContextType, RequireFields<MATIC_LiquidityPositionsnapshotsArgs, 'skip' | 'first'>>;
  block?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_PairResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Pair'] = ResolversParentTypes['MATIC_Pair']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['MATIC_Factory'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['MATIC_Token'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['MATIC_Token'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserveETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  trackedReserveETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  token0Price?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  token1Price?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityProviderCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityPositions?: Resolver<Array<ResolversTypes['MATIC_LiquidityPosition']>, ParentType, ContextType, RequireFields<MATIC_PairliquidityPositionsArgs, 'skip' | 'first'>>;
  liquidityPositionSnapshots?: Resolver<Array<ResolversTypes['MATIC_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<MATIC_PairliquidityPositionSnapshotsArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['MATIC_PairDayData']>, ParentType, ContextType, RequireFields<MATIC_PairdayDataArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['MATIC_PairHourData']>, ParentType, ContextType, RequireFields<MATIC_PairhourDataArgs, 'skip' | 'first'>>;
  mints?: Resolver<Array<ResolversTypes['MATIC_Mint']>, ParentType, ContextType, RequireFields<MATIC_PairmintsArgs, 'skip' | 'first'>>;
  burns?: Resolver<Array<ResolversTypes['MATIC_Burn']>, ParentType, ContextType, RequireFields<MATIC_PairburnsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<ResolversTypes['MATIC_Swap']>, ParentType, ContextType, RequireFields<MATIC_PairswapsArgs, 'skip' | 'first'>>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_FactoryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Factory'] = ResolversParentTypes['MATIC_Factory']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pairCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokenCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pairs?: Resolver<Array<ResolversTypes['MATIC_Pair']>, ParentType, ContextType, RequireFields<MATIC_FactorypairsArgs, 'skip' | 'first'>>;
  tokens?: Resolver<Array<ResolversTypes['MATIC_Token']>, ParentType, ContextType, RequireFields<MATIC_FactorytokensArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['MATIC_HourData']>, ParentType, ContextType, RequireFields<MATIC_FactoryhourDataArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['MATIC_DayData']>, ParentType, ContextType, RequireFields<MATIC_FactorydayDataArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type MATIC_TokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Token'] = ResolversParentTypes['MATIC_Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['MATIC_Factory'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  derivedETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  whitelistPairs?: Resolver<Array<ResolversTypes['MATIC_Pair']>, ParentType, ContextType, RequireFields<MATIC_TokenwhitelistPairsArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['MATIC_TokenHourData']>, ParentType, ContextType, RequireFields<MATIC_TokenhourDataArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['MATIC_TokenDayData']>, ParentType, ContextType, RequireFields<MATIC_TokendayDataArgs, 'skip' | 'first'>>;
  basePairs?: Resolver<Array<ResolversTypes['MATIC_Pair']>, ParentType, ContextType, RequireFields<MATIC_TokenbasePairsArgs, 'skip' | 'first'>>;
  quotePairs?: Resolver<Array<ResolversTypes['MATIC_Pair']>, ParentType, ContextType, RequireFields<MATIC_TokenquotePairsArgs, 'skip' | 'first'>>;
  basePairsDayData?: Resolver<Array<ResolversTypes['MATIC_PairDayData']>, ParentType, ContextType, RequireFields<MATIC_TokenbasePairsDayDataArgs, 'skip' | 'first'>>;
  quotePairsDayData?: Resolver<Array<ResolversTypes['MATIC_PairDayData']>, ParentType, ContextType, RequireFields<MATIC_TokenquotePairsDayDataArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_TokenHourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_TokenHourData'] = ResolversParentTypes['MATIC_TokenHourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['MATIC_Token'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  priceUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_TokenDayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_TokenDayData'] = ResolversParentTypes['MATIC_TokenDayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['MATIC_Token'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  priceUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_PairDayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_PairDayData'] = ResolversParentTypes['MATIC_PairDayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MATIC_Pair'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['MATIC_Token'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['MATIC_Token'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_HourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_HourData'] = ResolversParentTypes['MATIC_HourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['MATIC_Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_DayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_DayData'] = ResolversParentTypes['MATIC_DayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['MATIC_Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_LiquidityPositionSnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_LiquidityPositionSnapshot'] = ResolversParentTypes['MATIC_LiquidityPositionSnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityPosition?: Resolver<ResolversTypes['MATIC_LiquidityPosition'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['MATIC_User'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MATIC_Pair'], ParentType, ContextType>;
  token0PriceUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  token1PriceUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityTokenTotalSupply?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  liquidityTokenBalance?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_PairHourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_PairHourData'] = ResolversParentTypes['MATIC_PairHourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MATIC_Pair'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_MintResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Mint'] = ResolversParentTypes['MATIC_Mint']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['MATIC_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MATIC_Pair'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['MATIC_Bytes'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['MATIC_Bytes']>, ParentType, ContextType>;
  amount0?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  amount1?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  feeTo?: Resolver<Maybe<ResolversTypes['MATIC_Bytes']>, ParentType, ContextType>;
  feeLiquidity?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_TransactionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Transaction'] = ResolversParentTypes['MATIC_Transaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mints?: Resolver<Array<Maybe<ResolversTypes['MATIC_Mint']>>, ParentType, ContextType, RequireFields<MATIC_TransactionmintsArgs, 'skip' | 'first'>>;
  burns?: Resolver<Array<Maybe<ResolversTypes['MATIC_Burn']>>, ParentType, ContextType, RequireFields<MATIC_TransactionburnsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<Maybe<ResolversTypes['MATIC_Swap']>>, ParentType, ContextType, RequireFields<MATIC_TransactionswapsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_BurnResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Burn'] = ResolversParentTypes['MATIC_Burn']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['MATIC_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MATIC_Pair'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['MATIC_Bytes']>, ParentType, ContextType>;
  amount0?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  amount1?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  to?: Resolver<Maybe<ResolversTypes['MATIC_Bytes']>, ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  feeTo?: Resolver<Maybe<ResolversTypes['MATIC_Bytes']>, ParentType, ContextType>;
  feeLiquidity?: Resolver<Maybe<ResolversTypes['MATIC_BigDecimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_SwapResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Swap'] = ResolversParentTypes['MATIC_Swap']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['MATIC_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MATIC_Pair'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['MATIC_Bytes'], ParentType, ContextType>;
  amount0In?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  amount1In?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  amount0Out?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  amount1Out?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['MATIC_Bytes'], ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC_BundleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC_Bundle'] = ResolversParentTypes['MATIC_Bundle']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ethPrice?: Resolver<ResolversTypes['MATIC_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC__Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC__Meta_'] = ResolversParentTypes['MATIC__Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['MATIC__Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MATIC__Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MATIC__Block_'] = ResolversParentTypes['MATIC__Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['MATIC_Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ETHEREUM_BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ETHEREUM_Bytes'], any> {
  name: 'ETHEREUM_Bytes';
}

export type ETHEREUM_UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_User'] = ResolversParentTypes['ETHEREUM_User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityPositions?: Resolver<Array<ResolversTypes['ETHEREUM_LiquidityPosition']>, ParentType, ContextType, RequireFields<ETHEREUM_UserliquidityPositionsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ETHEREUM_BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ETHEREUM_BigDecimal'], any> {
  name: 'ETHEREUM_BigDecimal';
}

export type ETHEREUM_LiquidityPositionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_LiquidityPosition'] = ResolversParentTypes['ETHEREUM_LiquidityPosition']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['ETHEREUM_User'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['ETHEREUM_Pair'], ParentType, ContextType>;
  liquidityTokenBalance?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  snapshots?: Resolver<Array<Maybe<ResolversTypes['ETHEREUM_LiquidityPositionSnapshot']>>, ParentType, ContextType, RequireFields<ETHEREUM_LiquidityPositionsnapshotsArgs, 'skip' | 'first'>>;
  block?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_PairResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Pair'] = ResolversParentTypes['ETHEREUM_Pair']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['ETHEREUM_Factory'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['ETHEREUM_Token'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['ETHEREUM_Token'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserveETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  trackedReserveETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  token0Price?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  token1Price?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityProviderCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityPositions?: Resolver<Array<ResolversTypes['ETHEREUM_LiquidityPosition']>, ParentType, ContextType, RequireFields<ETHEREUM_PairliquidityPositionsArgs, 'skip' | 'first'>>;
  liquidityPositionSnapshots?: Resolver<Array<ResolversTypes['ETHEREUM_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<ETHEREUM_PairliquidityPositionSnapshotsArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['ETHEREUM_PairDayData']>, ParentType, ContextType, RequireFields<ETHEREUM_PairdayDataArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['ETHEREUM_PairHourData']>, ParentType, ContextType, RequireFields<ETHEREUM_PairhourDataArgs, 'skip' | 'first'>>;
  mints?: Resolver<Array<ResolversTypes['ETHEREUM_Mint']>, ParentType, ContextType, RequireFields<ETHEREUM_PairmintsArgs, 'skip' | 'first'>>;
  burns?: Resolver<Array<ResolversTypes['ETHEREUM_Burn']>, ParentType, ContextType, RequireFields<ETHEREUM_PairburnsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<ResolversTypes['ETHEREUM_Swap']>, ParentType, ContextType, RequireFields<ETHEREUM_PairswapsArgs, 'skip' | 'first'>>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_FactoryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Factory'] = ResolversParentTypes['ETHEREUM_Factory']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pairCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokenCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pairs?: Resolver<Array<ResolversTypes['ETHEREUM_Pair']>, ParentType, ContextType, RequireFields<ETHEREUM_FactorypairsArgs, 'skip' | 'first'>>;
  tokens?: Resolver<Array<ResolversTypes['ETHEREUM_Token']>, ParentType, ContextType, RequireFields<ETHEREUM_FactorytokensArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['ETHEREUM_HourData']>, ParentType, ContextType, RequireFields<ETHEREUM_FactoryhourDataArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['ETHEREUM_DayData']>, ParentType, ContextType, RequireFields<ETHEREUM_FactorydayDataArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_TokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Token'] = ResolversParentTypes['ETHEREUM_Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['ETHEREUM_Factory'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  derivedETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  hourData?: Resolver<Array<ResolversTypes['ETHEREUM_TokenHourData']>, ParentType, ContextType, RequireFields<ETHEREUM_TokenhourDataArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['ETHEREUM_TokenDayData']>, ParentType, ContextType, RequireFields<ETHEREUM_TokendayDataArgs, 'skip' | 'first'>>;
  basePairs?: Resolver<Array<ResolversTypes['ETHEREUM_Pair']>, ParentType, ContextType, RequireFields<ETHEREUM_TokenbasePairsArgs, 'skip' | 'first'>>;
  quotePairs?: Resolver<Array<ResolversTypes['ETHEREUM_Pair']>, ParentType, ContextType, RequireFields<ETHEREUM_TokenquotePairsArgs, 'skip' | 'first'>>;
  basePairsDayData?: Resolver<Array<ResolversTypes['ETHEREUM_PairDayData']>, ParentType, ContextType, RequireFields<ETHEREUM_TokenbasePairsDayDataArgs, 'skip' | 'first'>>;
  quotePairsDayData?: Resolver<Array<ResolversTypes['ETHEREUM_PairDayData']>, ParentType, ContextType, RequireFields<ETHEREUM_TokenquotePairsDayDataArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_TokenHourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_TokenHourData'] = ResolversParentTypes['ETHEREUM_TokenHourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['ETHEREUM_Token'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  priceUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_TokenDayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_TokenDayData'] = ResolversParentTypes['ETHEREUM_TokenDayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['ETHEREUM_Token'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  priceUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_PairDayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_PairDayData'] = ResolversParentTypes['ETHEREUM_PairDayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['ETHEREUM_Pair'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['ETHEREUM_Token'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['ETHEREUM_Token'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_HourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_HourData'] = ResolversParentTypes['ETHEREUM_HourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['ETHEREUM_Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_DayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_DayData'] = ResolversParentTypes['ETHEREUM_DayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['ETHEREUM_Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_LiquidityPositionSnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_LiquidityPositionSnapshot'] = ResolversParentTypes['ETHEREUM_LiquidityPositionSnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityPosition?: Resolver<ResolversTypes['ETHEREUM_LiquidityPosition'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['ETHEREUM_User'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['ETHEREUM_Pair'], ParentType, ContextType>;
  token0PriceUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  token1PriceUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityTokenTotalSupply?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityTokenBalance?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_PairHourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_PairHourData'] = ResolversParentTypes['ETHEREUM_PairHourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['ETHEREUM_Pair'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_MintResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Mint'] = ResolversParentTypes['ETHEREUM_Mint']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['ETHEREUM_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['ETHEREUM_Pair'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['ETHEREUM_Bytes'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bytes']>, ParentType, ContextType>;
  amount0?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  amount1?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  feeTo?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bytes']>, ParentType, ContextType>;
  feeLiquidity?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_TransactionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Transaction'] = ResolversParentTypes['ETHEREUM_Transaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mints?: Resolver<Array<Maybe<ResolversTypes['ETHEREUM_Mint']>>, ParentType, ContextType, RequireFields<ETHEREUM_TransactionmintsArgs, 'skip' | 'first'>>;
  burns?: Resolver<Array<Maybe<ResolversTypes['ETHEREUM_Burn']>>, ParentType, ContextType, RequireFields<ETHEREUM_TransactionburnsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<Maybe<ResolversTypes['ETHEREUM_Swap']>>, ParentType, ContextType, RequireFields<ETHEREUM_TransactionswapsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_BurnResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Burn'] = ResolversParentTypes['ETHEREUM_Burn']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['ETHEREUM_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['ETHEREUM_Pair'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bytes']>, ParentType, ContextType>;
  amount0?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  amount1?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  to?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bytes']>, ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  feeTo?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bytes']>, ParentType, ContextType>;
  feeLiquidity?: Resolver<Maybe<ResolversTypes['ETHEREUM_BigDecimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_SwapResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Swap'] = ResolversParentTypes['ETHEREUM_Swap']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['ETHEREUM_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['ETHEREUM_Pair'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['ETHEREUM_Bytes'], ParentType, ContextType>;
  amount0In?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  amount1In?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  amount0Out?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  amount1Out?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['ETHEREUM_Bytes'], ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_BundleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Bundle'] = ResolversParentTypes['ETHEREUM_Bundle']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ethPrice?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM__Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM__Meta_'] = ResolversParentTypes['ETHEREUM__Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['ETHEREUM__Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM__Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM__Block_'] = ResolversParentTypes['ETHEREUM__Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  MATIC_user?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_User']>, "MATIC_user", ParentType, ContextType, RequireFields<SubscriptionMATIC_userArgs, 'id' | 'subgraphError'>>;
  MATIC_users?: SubscriptionResolver<Array<ResolversTypes['MATIC_User']>, "MATIC_users", ParentType, ContextType, RequireFields<SubscriptionMATIC_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_bundle?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Bundle']>, "MATIC_bundle", ParentType, ContextType, RequireFields<SubscriptionMATIC_bundleArgs, 'id' | 'subgraphError'>>;
  MATIC_bundles?: SubscriptionResolver<Array<ResolversTypes['MATIC_Bundle']>, "MATIC_bundles", ParentType, ContextType, RequireFields<SubscriptionMATIC_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_factory?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Factory']>, "MATIC_factory", ParentType, ContextType, RequireFields<SubscriptionMATIC_factoryArgs, 'id' | 'subgraphError'>>;
  MATIC_factories?: SubscriptionResolver<Array<ResolversTypes['MATIC_Factory']>, "MATIC_factories", ParentType, ContextType, RequireFields<SubscriptionMATIC_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_hourData?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_HourData']>, "MATIC_hourData", ParentType, ContextType, RequireFields<SubscriptionMATIC_hourDataArgs, 'id' | 'subgraphError'>>;
  MATIC_hourDatas?: SubscriptionResolver<Array<ResolversTypes['MATIC_HourData']>, "MATIC_hourDatas", ParentType, ContextType, RequireFields<SubscriptionMATIC_hourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_dayData?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_DayData']>, "MATIC_dayData", ParentType, ContextType, RequireFields<SubscriptionMATIC_dayDataArgs, 'id' | 'subgraphError'>>;
  MATIC_dayDatas?: SubscriptionResolver<Array<ResolversTypes['MATIC_DayData']>, "MATIC_dayDatas", ParentType, ContextType, RequireFields<SubscriptionMATIC_dayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_token?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Token']>, "MATIC_token", ParentType, ContextType, RequireFields<SubscriptionMATIC_tokenArgs, 'id' | 'subgraphError'>>;
  MATIC_tokens?: SubscriptionResolver<Array<ResolversTypes['MATIC_Token']>, "MATIC_tokens", ParentType, ContextType, RequireFields<SubscriptionMATIC_tokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_tokenHourData?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_TokenHourData']>, "MATIC_tokenHourData", ParentType, ContextType, RequireFields<SubscriptionMATIC_tokenHourDataArgs, 'id' | 'subgraphError'>>;
  MATIC_tokenHourDatas?: SubscriptionResolver<Array<ResolversTypes['MATIC_TokenHourData']>, "MATIC_tokenHourDatas", ParentType, ContextType, RequireFields<SubscriptionMATIC_tokenHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_tokenDayData?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_TokenDayData']>, "MATIC_tokenDayData", ParentType, ContextType, RequireFields<SubscriptionMATIC_tokenDayDataArgs, 'id' | 'subgraphError'>>;
  MATIC_tokenDayDatas?: SubscriptionResolver<Array<ResolversTypes['MATIC_TokenDayData']>, "MATIC_tokenDayDatas", ParentType, ContextType, RequireFields<SubscriptionMATIC_tokenDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_pair?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Pair']>, "MATIC_pair", ParentType, ContextType, RequireFields<SubscriptionMATIC_pairArgs, 'id' | 'subgraphError'>>;
  MATIC_pairs?: SubscriptionResolver<Array<ResolversTypes['MATIC_Pair']>, "MATIC_pairs", ParentType, ContextType, RequireFields<SubscriptionMATIC_pairsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_pairHourData?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_PairHourData']>, "MATIC_pairHourData", ParentType, ContextType, RequireFields<SubscriptionMATIC_pairHourDataArgs, 'id' | 'subgraphError'>>;
  MATIC_pairHourDatas?: SubscriptionResolver<Array<ResolversTypes['MATIC_PairHourData']>, "MATIC_pairHourDatas", ParentType, ContextType, RequireFields<SubscriptionMATIC_pairHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_pairDayData?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_PairDayData']>, "MATIC_pairDayData", ParentType, ContextType, RequireFields<SubscriptionMATIC_pairDayDataArgs, 'id' | 'subgraphError'>>;
  MATIC_pairDayDatas?: SubscriptionResolver<Array<ResolversTypes['MATIC_PairDayData']>, "MATIC_pairDayDatas", ParentType, ContextType, RequireFields<SubscriptionMATIC_pairDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_liquidityPosition?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_LiquidityPosition']>, "MATIC_liquidityPosition", ParentType, ContextType, RequireFields<SubscriptionMATIC_liquidityPositionArgs, 'id' | 'subgraphError'>>;
  MATIC_liquidityPositions?: SubscriptionResolver<Array<ResolversTypes['MATIC_LiquidityPosition']>, "MATIC_liquidityPositions", ParentType, ContextType, RequireFields<SubscriptionMATIC_liquidityPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_liquidityPositionSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_LiquidityPositionSnapshot']>, "MATIC_liquidityPositionSnapshot", ParentType, ContextType, RequireFields<SubscriptionMATIC_liquidityPositionSnapshotArgs, 'id' | 'subgraphError'>>;
  MATIC_liquidityPositionSnapshots?: SubscriptionResolver<Array<ResolversTypes['MATIC_LiquidityPositionSnapshot']>, "MATIC_liquidityPositionSnapshots", ParentType, ContextType, RequireFields<SubscriptionMATIC_liquidityPositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_transaction?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Transaction']>, "MATIC_transaction", ParentType, ContextType, RequireFields<SubscriptionMATIC_transactionArgs, 'id' | 'subgraphError'>>;
  MATIC_transactions?: SubscriptionResolver<Array<ResolversTypes['MATIC_Transaction']>, "MATIC_transactions", ParentType, ContextType, RequireFields<SubscriptionMATIC_transactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_mint?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Mint']>, "MATIC_mint", ParentType, ContextType, RequireFields<SubscriptionMATIC_mintArgs, 'id' | 'subgraphError'>>;
  MATIC_mints?: SubscriptionResolver<Array<ResolversTypes['MATIC_Mint']>, "MATIC_mints", ParentType, ContextType, RequireFields<SubscriptionMATIC_mintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_burn?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Burn']>, "MATIC_burn", ParentType, ContextType, RequireFields<SubscriptionMATIC_burnArgs, 'id' | 'subgraphError'>>;
  MATIC_burns?: SubscriptionResolver<Array<ResolversTypes['MATIC_Burn']>, "MATIC_burns", ParentType, ContextType, RequireFields<SubscriptionMATIC_burnsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC_swap?: SubscriptionResolver<Maybe<ResolversTypes['MATIC_Swap']>, "MATIC_swap", ParentType, ContextType, RequireFields<SubscriptionMATIC_swapArgs, 'id' | 'subgraphError'>>;
  MATIC_swaps?: SubscriptionResolver<Array<ResolversTypes['MATIC_Swap']>, "MATIC_swaps", ParentType, ContextType, RequireFields<SubscriptionMATIC_swapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MATIC__meta?: SubscriptionResolver<Maybe<ResolversTypes['MATIC__Meta_']>, "MATIC__meta", ParentType, ContextType, Partial<SubscriptionMATIC__metaArgs>>;
  ETHEREUM_user?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_User']>, "ETHEREUM_user", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_userArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_users?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_User']>, "ETHEREUM_users", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_bundle?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Bundle']>, "ETHEREUM_bundle", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_bundleArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_bundles?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Bundle']>, "ETHEREUM_bundles", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_factory?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Factory']>, "ETHEREUM_factory", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_factoryArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_factories?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Factory']>, "ETHEREUM_factories", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_hourData?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_HourData']>, "ETHEREUM_hourData", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_hourDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_hourDatas?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_HourData']>, "ETHEREUM_hourDatas", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_hourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_dayData?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_DayData']>, "ETHEREUM_dayData", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_dayDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_dayDatas?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_DayData']>, "ETHEREUM_dayDatas", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_dayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_token?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Token']>, "ETHEREUM_token", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_tokenArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_tokens?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Token']>, "ETHEREUM_tokens", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_tokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_tokenHourData?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_TokenHourData']>, "ETHEREUM_tokenHourData", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_tokenHourDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_tokenHourDatas?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_TokenHourData']>, "ETHEREUM_tokenHourDatas", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_tokenHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_tokenDayData?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_TokenDayData']>, "ETHEREUM_tokenDayData", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_tokenDayDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_tokenDayDatas?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_TokenDayData']>, "ETHEREUM_tokenDayDatas", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_tokenDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_pair?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Pair']>, "ETHEREUM_pair", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_pairArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_pairs?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Pair']>, "ETHEREUM_pairs", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_pairsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_pairHourData?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_PairHourData']>, "ETHEREUM_pairHourData", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_pairHourDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_pairHourDatas?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_PairHourData']>, "ETHEREUM_pairHourDatas", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_pairHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_pairDayData?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_PairDayData']>, "ETHEREUM_pairDayData", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_pairDayDataArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_pairDayDatas?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_PairDayData']>, "ETHEREUM_pairDayDatas", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_pairDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_liquidityPosition?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_LiquidityPosition']>, "ETHEREUM_liquidityPosition", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_liquidityPositionArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_liquidityPositions?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_LiquidityPosition']>, "ETHEREUM_liquidityPositions", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_liquidityPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_liquidityPositionSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_LiquidityPositionSnapshot']>, "ETHEREUM_liquidityPositionSnapshot", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_liquidityPositionSnapshotArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_liquidityPositionSnapshots?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_LiquidityPositionSnapshot']>, "ETHEREUM_liquidityPositionSnapshots", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_liquidityPositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_transaction?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Transaction']>, "ETHEREUM_transaction", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_transactionArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_transactions?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Transaction']>, "ETHEREUM_transactions", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_transactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_mint?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Mint']>, "ETHEREUM_mint", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_mintArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_mints?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Mint']>, "ETHEREUM_mints", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_mintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_burn?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Burn']>, "ETHEREUM_burn", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_burnArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_burns?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Burn']>, "ETHEREUM_burns", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_burnsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_swap?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Swap']>, "ETHEREUM_swap", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_swapArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_swaps?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Swap']>, "ETHEREUM_swaps", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_swapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM__meta?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM__Meta_']>, "ETHEREUM__meta", ParentType, ContextType, Partial<SubscriptionETHEREUM__metaArgs>>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  MATIC_Bytes?: GraphQLScalarType;
  MATIC_User?: MATIC_UserResolvers<ContextType>;
  MATIC_BigDecimal?: GraphQLScalarType;
  MATIC_LiquidityPosition?: MATIC_LiquidityPositionResolvers<ContextType>;
  MATIC_Pair?: MATIC_PairResolvers<ContextType>;
  MATIC_Factory?: MATIC_FactoryResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  MATIC_Token?: MATIC_TokenResolvers<ContextType>;
  MATIC_TokenHourData?: MATIC_TokenHourDataResolvers<ContextType>;
  MATIC_TokenDayData?: MATIC_TokenDayDataResolvers<ContextType>;
  MATIC_PairDayData?: MATIC_PairDayDataResolvers<ContextType>;
  MATIC_HourData?: MATIC_HourDataResolvers<ContextType>;
  MATIC_DayData?: MATIC_DayDataResolvers<ContextType>;
  MATIC_LiquidityPositionSnapshot?: MATIC_LiquidityPositionSnapshotResolvers<ContextType>;
  MATIC_PairHourData?: MATIC_PairHourDataResolvers<ContextType>;
  MATIC_Mint?: MATIC_MintResolvers<ContextType>;
  MATIC_Transaction?: MATIC_TransactionResolvers<ContextType>;
  MATIC_Burn?: MATIC_BurnResolvers<ContextType>;
  MATIC_Swap?: MATIC_SwapResolvers<ContextType>;
  MATIC_Bundle?: MATIC_BundleResolvers<ContextType>;
  MATIC__Meta_?: MATIC__Meta_Resolvers<ContextType>;
  MATIC__Block_?: MATIC__Block_Resolvers<ContextType>;
  ETHEREUM_Bytes?: GraphQLScalarType;
  ETHEREUM_User?: ETHEREUM_UserResolvers<ContextType>;
  ETHEREUM_BigDecimal?: GraphQLScalarType;
  ETHEREUM_LiquidityPosition?: ETHEREUM_LiquidityPositionResolvers<ContextType>;
  ETHEREUM_Pair?: ETHEREUM_PairResolvers<ContextType>;
  ETHEREUM_Factory?: ETHEREUM_FactoryResolvers<ContextType>;
  ETHEREUM_Token?: ETHEREUM_TokenResolvers<ContextType>;
  ETHEREUM_TokenHourData?: ETHEREUM_TokenHourDataResolvers<ContextType>;
  ETHEREUM_TokenDayData?: ETHEREUM_TokenDayDataResolvers<ContextType>;
  ETHEREUM_PairDayData?: ETHEREUM_PairDayDataResolvers<ContextType>;
  ETHEREUM_HourData?: ETHEREUM_HourDataResolvers<ContextType>;
  ETHEREUM_DayData?: ETHEREUM_DayDataResolvers<ContextType>;
  ETHEREUM_LiquidityPositionSnapshot?: ETHEREUM_LiquidityPositionSnapshotResolvers<ContextType>;
  ETHEREUM_PairHourData?: ETHEREUM_PairHourDataResolvers<ContextType>;
  ETHEREUM_Mint?: ETHEREUM_MintResolvers<ContextType>;
  ETHEREUM_Transaction?: ETHEREUM_TransactionResolvers<ContextType>;
  ETHEREUM_Burn?: ETHEREUM_BurnResolvers<ContextType>;
  ETHEREUM_Swap?: ETHEREUM_SwapResolvers<ContextType>;
  ETHEREUM_Bundle?: ETHEREUM_BundleResolvers<ContextType>;
  ETHEREUM__Meta_?: ETHEREUM__Meta_Resolvers<ContextType>;
  ETHEREUM__Block_?: ETHEREUM__Block_Resolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;


import { MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';

import { InContextSdkMethod } from '@graphql-mesh/types';


    export namespace MaticExchangeTypes {
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
  MATIC_Bytes: any;
  MATIC_BigDecimal: any;
  BigInt: any;
};

export type Query = {
  MATIC_user?: Maybe<MATIC_User>;
  MATIC_users: Array<MATIC_User>;
  MATIC_bundle?: Maybe<MATIC_Bundle>;
  MATIC_bundles: Array<MATIC_Bundle>;
  MATIC_factory?: Maybe<MATIC_Factory>;
  MATIC_factories: Array<MATIC_Factory>;
  MATIC_hourData?: Maybe<MATIC_HourData>;
  MATIC_hourDatas: Array<MATIC_HourData>;
  MATIC_dayData?: Maybe<MATIC_DayData>;
  MATIC_dayDatas: Array<MATIC_DayData>;
  MATIC_token?: Maybe<MATIC_Token>;
  MATIC_tokens: Array<MATIC_Token>;
  MATIC_tokenHourData?: Maybe<MATIC_TokenHourData>;
  MATIC_tokenHourDatas: Array<MATIC_TokenHourData>;
  MATIC_tokenDayData?: Maybe<MATIC_TokenDayData>;
  MATIC_tokenDayDatas: Array<MATIC_TokenDayData>;
  MATIC_pair?: Maybe<MATIC_Pair>;
  MATIC_pairs: Array<MATIC_Pair>;
  MATIC_pairHourData?: Maybe<MATIC_PairHourData>;
  MATIC_pairHourDatas: Array<MATIC_PairHourData>;
  MATIC_pairDayData?: Maybe<MATIC_PairDayData>;
  MATIC_pairDayDatas: Array<MATIC_PairDayData>;
  MATIC_liquidityPosition?: Maybe<MATIC_LiquidityPosition>;
  MATIC_liquidityPositions: Array<MATIC_LiquidityPosition>;
  MATIC_liquidityPositionSnapshot?: Maybe<MATIC_LiquidityPositionSnapshot>;
  MATIC_liquidityPositionSnapshots: Array<MATIC_LiquidityPositionSnapshot>;
  MATIC_transaction?: Maybe<MATIC_Transaction>;
  MATIC_transactions: Array<MATIC_Transaction>;
  MATIC_mint?: Maybe<MATIC_Mint>;
  MATIC_mints: Array<MATIC_Mint>;
  MATIC_burn?: Maybe<MATIC_Burn>;
  MATIC_burns: Array<MATIC_Burn>;
  MATIC_swap?: Maybe<MATIC_Swap>;
  MATIC_swaps: Array<MATIC_Swap>;
  /** Access to subgraph metadata */
  MATIC__meta?: Maybe<MATIC__Meta_>;
};


export type QueryMATIC_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_User_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_User_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Bundle_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Bundle_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Factory_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Factory_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_HourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_HourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_DayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_DayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Token_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Token_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Transaction_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Transaction_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMATIC__metaArgs = {
  block?: InputMaybe<MATIC_Block_height>;
};

/** The block at which the query should be executed. */
export type MATIC_Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['MATIC_Bytes']>;
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

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type MATIC_User = {
  id: Scalars['ID'];
  liquidityPositions: Array<MATIC_LiquidityPosition>;
};


export type MATIC_UserliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
};

export type MATIC_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

/** Defines the order direction, either ascending or descending */
export type MATIC_OrderDirection =
  | 'asc'
  | 'desc';

export type MATIC_LiquidityPosition_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type MATIC_LiquidityPosition = {
  id: Scalars['ID'];
  user: MATIC_User;
  pair: MATIC_Pair;
  liquidityTokenBalance: Scalars['MATIC_BigDecimal'];
  snapshots: Array<Maybe<MATIC_LiquidityPositionSnapshot>>;
  block: Scalars['Int'];
  timestamp: Scalars['Int'];
};


export type MATIC_LiquidityPositionsnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
};

export type MATIC_Pair = {
  id: Scalars['ID'];
  factory: MATIC_Factory;
  name: Scalars['String'];
  token0: MATIC_Token;
  token1: MATIC_Token;
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  totalSupply: Scalars['MATIC_BigDecimal'];
  reserveETH: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  trackedReserveETH: Scalars['MATIC_BigDecimal'];
  token0Price: Scalars['MATIC_BigDecimal'];
  token1Price: Scalars['MATIC_BigDecimal'];
  volumeToken0: Scalars['MATIC_BigDecimal'];
  volumeToken1: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  liquidityPositions: Array<MATIC_LiquidityPosition>;
  liquidityPositionSnapshots: Array<MATIC_LiquidityPositionSnapshot>;
  dayData: Array<MATIC_PairDayData>;
  hourData: Array<MATIC_PairHourData>;
  mints: Array<MATIC_Mint>;
  burns: Array<MATIC_Burn>;
  swaps: Array<MATIC_Swap>;
  timestamp: Scalars['BigInt'];
  block: Scalars['BigInt'];
};


export type MATIC_PairliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
};


export type MATIC_PairliquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
};


export type MATIC_PairdayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
};


export type MATIC_PairhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairHourData_filter>;
};


export type MATIC_PairmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
};


export type MATIC_PairburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
};


export type MATIC_PairswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
};

export type MATIC_Factory = {
  id: Scalars['ID'];
  pairCount: Scalars['BigInt'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  volumeETH: Scalars['MATIC_BigDecimal'];
  untrackedVolumeUSD: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  tokenCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  pairs: Array<MATIC_Pair>;
  tokens: Array<MATIC_Token>;
  hourData: Array<MATIC_HourData>;
  dayData: Array<MATIC_DayData>;
};


export type MATIC_FactorypairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_FactorytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Token_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Token_filter>;
};


export type MATIC_FactoryhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_HourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_HourData_filter>;
};


export type MATIC_FactorydayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_DayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_DayData_filter>;
};

export type MATIC_Pair_orderBy =
  | 'id'
  | 'factory'
  | 'name'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveETH'
  | 'reserveUSD'
  | 'trackedReserveETH'
  | 'token0Price'
  | 'token1Price'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidityProviderCount'
  | 'liquidityPositions'
  | 'liquidityPositionSnapshots'
  | 'dayData'
  | 'hourData'
  | 'mints'
  | 'burns'
  | 'swaps'
  | 'timestamp'
  | 'block';

export type MATIC_Pair_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  trackedReserveETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token0Price?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0Price_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token0Price_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1Price?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1Price_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1Price_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_Token_orderBy =
  | 'id'
  | 'factory'
  | 'symbol'
  | 'name'
  | 'decimals'
  | 'totalSupply'
  | 'volume'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'derivedETH'
  | 'whitelistPairs'
  | 'hourData'
  | 'dayData'
  | 'basePairs'
  | 'quotePairs'
  | 'basePairsDayData'
  | 'quotePairsDayData';

export type MATIC_Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  derivedETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  derivedETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  whitelistPairs?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_contains?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not_contains?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

export type MATIC_Token = {
  id: Scalars['ID'];
  factory: MATIC_Factory;
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  volume: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MATIC_BigDecimal'];
  derivedETH: Scalars['MATIC_BigDecimal'];
  whitelistPairs: Array<MATIC_Pair>;
  hourData: Array<MATIC_TokenHourData>;
  dayData: Array<MATIC_TokenDayData>;
  basePairs: Array<MATIC_Pair>;
  quotePairs: Array<MATIC_Pair>;
  basePairsDayData: Array<MATIC_PairDayData>;
  quotePairsDayData: Array<MATIC_PairDayData>;
};


export type MATIC_TokenwhitelistPairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_TokenhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenHourData_filter>;
};


export type MATIC_TokendayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenDayData_filter>;
};


export type MATIC_TokenbasePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_TokenquotePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
};


export type MATIC_TokenbasePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
};


export type MATIC_TokenquotePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
};

export type MATIC_TokenHourData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type MATIC_TokenHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_TokenHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MATIC_Token;
  volume: Scalars['MATIC_BigDecimal'];
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  priceUSD: Scalars['MATIC_BigDecimal'];
};

export type MATIC_TokenDayData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type MATIC_TokenDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_TokenDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MATIC_Token;
  volume: Scalars['MATIC_BigDecimal'];
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  priceUSD: Scalars['MATIC_BigDecimal'];
};

export type MATIC_PairDayData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type MATIC_PairDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_PairDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MATIC_Pair;
  token0: MATIC_Token;
  token1: MATIC_Token;
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  totalSupply: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  volumeToken0: Scalars['MATIC_BigDecimal'];
  volumeToken1: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_HourData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type MATIC_HourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: MATIC_Factory;
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolume: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_DayData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type MATIC_DayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: MATIC_Factory;
  volumeETH: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  untrackedVolume: Scalars['MATIC_BigDecimal'];
  liquidityETH: Scalars['MATIC_BigDecimal'];
  liquidityUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_LiquidityPositionSnapshot_orderBy =
  | 'id'
  | 'liquidityPosition'
  | 'timestamp'
  | 'block'
  | 'user'
  | 'pair'
  | 'token0PriceUSD'
  | 'token1PriceUSD'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'liquidityTokenTotalSupply'
  | 'liquidityTokenBalance';

export type MATIC_LiquidityPositionSnapshot_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPosition?: InputMaybe<Scalars['String']>;
  liquidityPosition_not?: InputMaybe<Scalars['String']>;
  liquidityPosition_gt?: InputMaybe<Scalars['String']>;
  liquidityPosition_lt?: InputMaybe<Scalars['String']>;
  liquidityPosition_gte?: InputMaybe<Scalars['String']>;
  liquidityPosition_lte?: InputMaybe<Scalars['String']>;
  liquidityPosition_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0PriceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1PriceUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_LiquidityPositionSnapshot = {
  id: Scalars['ID'];
  liquidityPosition: MATIC_LiquidityPosition;
  timestamp: Scalars['Int'];
  block: Scalars['Int'];
  user: MATIC_User;
  pair: MATIC_Pair;
  token0PriceUSD: Scalars['MATIC_BigDecimal'];
  token1PriceUSD: Scalars['MATIC_BigDecimal'];
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  liquidityTokenTotalSupply: Scalars['MATIC_BigDecimal'];
  liquidityTokenBalance: Scalars['MATIC_BigDecimal'];
};

export type MATIC_PairHourData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type MATIC_PairHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_PairHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MATIC_Pair;
  reserve0: Scalars['MATIC_BigDecimal'];
  reserve1: Scalars['MATIC_BigDecimal'];
  reserveUSD: Scalars['MATIC_BigDecimal'];
  volumeToken0: Scalars['MATIC_BigDecimal'];
  volumeToken1: Scalars['MATIC_BigDecimal'];
  volumeUSD: Scalars['MATIC_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MATIC_Mint_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'to'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'logIndex'
  | 'amountUSD'
  | 'feeTo'
  | 'feeLiquidity';

export type MATIC_Mint_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  amount0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Mint = {
  id: Scalars['ID'];
  transaction: MATIC_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MATIC_Pair;
  to: Scalars['MATIC_Bytes'];
  liquidity: Scalars['MATIC_BigDecimal'];
  sender?: Maybe<Scalars['MATIC_Bytes']>;
  amount0?: Maybe<Scalars['MATIC_BigDecimal']>;
  amount1?: Maybe<Scalars['MATIC_BigDecimal']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MATIC_BigDecimal']>;
  feeTo?: Maybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MATIC_BigDecimal']>;
};

export type MATIC_Transaction = {
  id: Scalars['ID'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  mints: Array<Maybe<MATIC_Mint>>;
  burns: Array<Maybe<MATIC_Burn>>;
  swaps: Array<Maybe<MATIC_Swap>>;
};


export type MATIC_TransactionmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
};


export type MATIC_TransactionburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
};


export type MATIC_TransactionswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
};

export type MATIC_Burn_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'to'
  | 'logIndex'
  | 'amountUSD'
  | 'complete'
  | 'feeTo'
  | 'feeLiquidity';

export type MATIC_Burn_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  amount0?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  to?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  complete?: InputMaybe<Scalars['Boolean']>;
  complete_not?: InputMaybe<Scalars['Boolean']>;
  complete_in?: InputMaybe<Array<Scalars['Boolean']>>;
  complete_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  feeTo?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Burn = {
  id: Scalars['ID'];
  transaction: MATIC_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MATIC_Pair;
  liquidity: Scalars['MATIC_BigDecimal'];
  sender?: Maybe<Scalars['MATIC_Bytes']>;
  amount0?: Maybe<Scalars['MATIC_BigDecimal']>;
  amount1?: Maybe<Scalars['MATIC_BigDecimal']>;
  to?: Maybe<Scalars['MATIC_Bytes']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MATIC_BigDecimal']>;
  complete: Scalars['Boolean'];
  feeTo?: Maybe<Scalars['MATIC_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MATIC_BigDecimal']>;
};

export type MATIC_Swap_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'sender'
  | 'amount0In'
  | 'amount1In'
  | 'amount0Out'
  | 'amount1Out'
  | 'to'
  | 'logIndex'
  | 'amountUSD';

export type MATIC_Swap_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  amount0In?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0In_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0In_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1In?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1In_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1In_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0Out?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount0Out_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1Out?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amount1Out_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  to?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MATIC_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MATIC_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Swap = {
  id: Scalars['ID'];
  transaction: MATIC_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MATIC_Pair;
  sender: Scalars['MATIC_Bytes'];
  amount0In: Scalars['MATIC_BigDecimal'];
  amount1In: Scalars['MATIC_BigDecimal'];
  amount0Out: Scalars['MATIC_BigDecimal'];
  amount1Out: Scalars['MATIC_BigDecimal'];
  to: Scalars['MATIC_Bytes'];
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD: Scalars['MATIC_BigDecimal'];
};

export type MATIC_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type MATIC_User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export type MATIC_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['MATIC_BigDecimal'];
};

export type MATIC_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

export type MATIC_Bundle_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ethPrice?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  ethPrice_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
};

export type MATIC_Factory_orderBy =
  | 'id'
  | 'pairCount'
  | 'volumeUSD'
  | 'volumeETH'
  | 'untrackedVolumeUSD'
  | 'liquidityUSD'
  | 'liquidityETH'
  | 'txCount'
  | 'tokenCount'
  | 'userCount'
  | 'pairs'
  | 'tokens'
  | 'hourData'
  | 'dayData';

export type MATIC_Factory_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pairCount?: InputMaybe<Scalars['BigInt']>;
  pairCount_not?: InputMaybe<Scalars['BigInt']>;
  pairCount_gt?: InputMaybe<Scalars['BigInt']>;
  pairCount_lt?: InputMaybe<Scalars['BigInt']>;
  pairCount_gte?: InputMaybe<Scalars['BigInt']>;
  pairCount_lte?: InputMaybe<Scalars['BigInt']>;
  pairCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pairCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MATIC_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MATIC_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount?: InputMaybe<Scalars['BigInt']>;
  userCount_not?: InputMaybe<Scalars['BigInt']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']>;
  userCount_lt?: InputMaybe<Scalars['BigInt']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MATIC_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

export type MATIC_Transaction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mints?: InputMaybe<Array<Scalars['String']>>;
  mints_not?: InputMaybe<Array<Scalars['String']>>;
  mints_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

/** The type for the top-level _meta field */
export type MATIC__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: MATIC__Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type MATIC__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['MATIC_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

export type Subscription = {
  MATIC_user?: Maybe<MATIC_User>;
  MATIC_users: Array<MATIC_User>;
  MATIC_bundle?: Maybe<MATIC_Bundle>;
  MATIC_bundles: Array<MATIC_Bundle>;
  MATIC_factory?: Maybe<MATIC_Factory>;
  MATIC_factories: Array<MATIC_Factory>;
  MATIC_hourData?: Maybe<MATIC_HourData>;
  MATIC_hourDatas: Array<MATIC_HourData>;
  MATIC_dayData?: Maybe<MATIC_DayData>;
  MATIC_dayDatas: Array<MATIC_DayData>;
  MATIC_token?: Maybe<MATIC_Token>;
  MATIC_tokens: Array<MATIC_Token>;
  MATIC_tokenHourData?: Maybe<MATIC_TokenHourData>;
  MATIC_tokenHourDatas: Array<MATIC_TokenHourData>;
  MATIC_tokenDayData?: Maybe<MATIC_TokenDayData>;
  MATIC_tokenDayDatas: Array<MATIC_TokenDayData>;
  MATIC_pair?: Maybe<MATIC_Pair>;
  MATIC_pairs: Array<MATIC_Pair>;
  MATIC_pairHourData?: Maybe<MATIC_PairHourData>;
  MATIC_pairHourDatas: Array<MATIC_PairHourData>;
  MATIC_pairDayData?: Maybe<MATIC_PairDayData>;
  MATIC_pairDayDatas: Array<MATIC_PairDayData>;
  MATIC_liquidityPosition?: Maybe<MATIC_LiquidityPosition>;
  MATIC_liquidityPositions: Array<MATIC_LiquidityPosition>;
  MATIC_liquidityPositionSnapshot?: Maybe<MATIC_LiquidityPositionSnapshot>;
  MATIC_liquidityPositionSnapshots: Array<MATIC_LiquidityPositionSnapshot>;
  MATIC_transaction?: Maybe<MATIC_Transaction>;
  MATIC_transactions: Array<MATIC_Transaction>;
  MATIC_mint?: Maybe<MATIC_Mint>;
  MATIC_mints: Array<MATIC_Mint>;
  MATIC_burn?: Maybe<MATIC_Burn>;
  MATIC_burns: Array<MATIC_Burn>;
  MATIC_swap?: Maybe<MATIC_Swap>;
  MATIC_swaps: Array<MATIC_Swap>;
  /** Access to subgraph metadata */
  MATIC__meta?: Maybe<MATIC__Meta_>;
};


export type SubscriptionMATIC_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_User_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_User_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Bundle_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Bundle_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Factory_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Factory_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_HourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_HourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_DayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_DayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Token_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Token_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_TokenDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Pair_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Pair_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairHourData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_PairDayData_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPosition_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Transaction_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Transaction_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Mint_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Mint_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Burn_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Burn_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MATIC_Swap_orderBy>;
  orderDirection?: InputMaybe<MATIC_OrderDirection>;
  where?: InputMaybe<MATIC_Swap_filter>;
  block?: InputMaybe<MATIC_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMATIC__metaArgs = {
  block?: InputMaybe<MATIC_Block_height>;
};

    }
    export type QueryMaticExchangeSdk = {
  /** null **/
  MATIC_user: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_user'], MaticExchangeTypes.QueryMATIC_userArgs, MeshContext>,
  /** null **/
  MATIC_users: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_users'], MaticExchangeTypes.QueryMATIC_usersArgs, MeshContext>,
  /** null **/
  MATIC_bundle: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_bundle'], MaticExchangeTypes.QueryMATIC_bundleArgs, MeshContext>,
  /** null **/
  MATIC_bundles: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_bundles'], MaticExchangeTypes.QueryMATIC_bundlesArgs, MeshContext>,
  /** null **/
  MATIC_factory: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_factory'], MaticExchangeTypes.QueryMATIC_factoryArgs, MeshContext>,
  /** null **/
  MATIC_factories: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_factories'], MaticExchangeTypes.QueryMATIC_factoriesArgs, MeshContext>,
  /** null **/
  MATIC_hourData: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_hourData'], MaticExchangeTypes.QueryMATIC_hourDataArgs, MeshContext>,
  /** null **/
  MATIC_hourDatas: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_hourDatas'], MaticExchangeTypes.QueryMATIC_hourDatasArgs, MeshContext>,
  /** null **/
  MATIC_dayData: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_dayData'], MaticExchangeTypes.QueryMATIC_dayDataArgs, MeshContext>,
  /** null **/
  MATIC_dayDatas: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_dayDatas'], MaticExchangeTypes.QueryMATIC_dayDatasArgs, MeshContext>,
  /** null **/
  MATIC_token: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_token'], MaticExchangeTypes.QueryMATIC_tokenArgs, MeshContext>,
  /** null **/
  MATIC_tokens: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_tokens'], MaticExchangeTypes.QueryMATIC_tokensArgs, MeshContext>,
  /** null **/
  MATIC_tokenHourData: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_tokenHourData'], MaticExchangeTypes.QueryMATIC_tokenHourDataArgs, MeshContext>,
  /** null **/
  MATIC_tokenHourDatas: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_tokenHourDatas'], MaticExchangeTypes.QueryMATIC_tokenHourDatasArgs, MeshContext>,
  /** null **/
  MATIC_tokenDayData: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_tokenDayData'], MaticExchangeTypes.QueryMATIC_tokenDayDataArgs, MeshContext>,
  /** null **/
  MATIC_tokenDayDatas: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_tokenDayDatas'], MaticExchangeTypes.QueryMATIC_tokenDayDatasArgs, MeshContext>,
  /** null **/
  MATIC_pair: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_pair'], MaticExchangeTypes.QueryMATIC_pairArgs, MeshContext>,
  /** null **/
  MATIC_pairs: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_pairs'], MaticExchangeTypes.QueryMATIC_pairsArgs, MeshContext>,
  /** null **/
  MATIC_pairHourData: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_pairHourData'], MaticExchangeTypes.QueryMATIC_pairHourDataArgs, MeshContext>,
  /** null **/
  MATIC_pairHourDatas: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_pairHourDatas'], MaticExchangeTypes.QueryMATIC_pairHourDatasArgs, MeshContext>,
  /** null **/
  MATIC_pairDayData: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_pairDayData'], MaticExchangeTypes.QueryMATIC_pairDayDataArgs, MeshContext>,
  /** null **/
  MATIC_pairDayDatas: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_pairDayDatas'], MaticExchangeTypes.QueryMATIC_pairDayDatasArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPosition: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_liquidityPosition'], MaticExchangeTypes.QueryMATIC_liquidityPositionArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPositions: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_liquidityPositions'], MaticExchangeTypes.QueryMATIC_liquidityPositionsArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPositionSnapshot: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_liquidityPositionSnapshot'], MaticExchangeTypes.QueryMATIC_liquidityPositionSnapshotArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPositionSnapshots: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_liquidityPositionSnapshots'], MaticExchangeTypes.QueryMATIC_liquidityPositionSnapshotsArgs, MeshContext>,
  /** null **/
  MATIC_transaction: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_transaction'], MaticExchangeTypes.QueryMATIC_transactionArgs, MeshContext>,
  /** null **/
  MATIC_transactions: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_transactions'], MaticExchangeTypes.QueryMATIC_transactionsArgs, MeshContext>,
  /** null **/
  MATIC_mint: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_mint'], MaticExchangeTypes.QueryMATIC_mintArgs, MeshContext>,
  /** null **/
  MATIC_mints: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_mints'], MaticExchangeTypes.QueryMATIC_mintsArgs, MeshContext>,
  /** null **/
  MATIC_burn: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_burn'], MaticExchangeTypes.QueryMATIC_burnArgs, MeshContext>,
  /** null **/
  MATIC_burns: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_burns'], MaticExchangeTypes.QueryMATIC_burnsArgs, MeshContext>,
  /** null **/
  MATIC_swap: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_swap'], MaticExchangeTypes.QueryMATIC_swapArgs, MeshContext>,
  /** null **/
  MATIC_swaps: InContextSdkMethod<MaticExchangeTypes.Query['MATIC_swaps'], MaticExchangeTypes.QueryMATIC_swapsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  MATIC__meta: InContextSdkMethod<MaticExchangeTypes.Query['MATIC__meta'], MaticExchangeTypes.QueryMATIC__metaArgs, MeshContext>
};

export type MutationMaticExchangeSdk = {

};

export type SubscriptionMaticExchangeSdk = {
  /** null **/
  MATIC_user: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_user'], MaticExchangeTypes.SubscriptionMATIC_userArgs, MeshContext>,
  /** null **/
  MATIC_users: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_users'], MaticExchangeTypes.SubscriptionMATIC_usersArgs, MeshContext>,
  /** null **/
  MATIC_bundle: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_bundle'], MaticExchangeTypes.SubscriptionMATIC_bundleArgs, MeshContext>,
  /** null **/
  MATIC_bundles: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_bundles'], MaticExchangeTypes.SubscriptionMATIC_bundlesArgs, MeshContext>,
  /** null **/
  MATIC_factory: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_factory'], MaticExchangeTypes.SubscriptionMATIC_factoryArgs, MeshContext>,
  /** null **/
  MATIC_factories: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_factories'], MaticExchangeTypes.SubscriptionMATIC_factoriesArgs, MeshContext>,
  /** null **/
  MATIC_hourData: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_hourData'], MaticExchangeTypes.SubscriptionMATIC_hourDataArgs, MeshContext>,
  /** null **/
  MATIC_hourDatas: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_hourDatas'], MaticExchangeTypes.SubscriptionMATIC_hourDatasArgs, MeshContext>,
  /** null **/
  MATIC_dayData: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_dayData'], MaticExchangeTypes.SubscriptionMATIC_dayDataArgs, MeshContext>,
  /** null **/
  MATIC_dayDatas: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_dayDatas'], MaticExchangeTypes.SubscriptionMATIC_dayDatasArgs, MeshContext>,
  /** null **/
  MATIC_token: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_token'], MaticExchangeTypes.SubscriptionMATIC_tokenArgs, MeshContext>,
  /** null **/
  MATIC_tokens: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_tokens'], MaticExchangeTypes.SubscriptionMATIC_tokensArgs, MeshContext>,
  /** null **/
  MATIC_tokenHourData: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_tokenHourData'], MaticExchangeTypes.SubscriptionMATIC_tokenHourDataArgs, MeshContext>,
  /** null **/
  MATIC_tokenHourDatas: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_tokenHourDatas'], MaticExchangeTypes.SubscriptionMATIC_tokenHourDatasArgs, MeshContext>,
  /** null **/
  MATIC_tokenDayData: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_tokenDayData'], MaticExchangeTypes.SubscriptionMATIC_tokenDayDataArgs, MeshContext>,
  /** null **/
  MATIC_tokenDayDatas: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_tokenDayDatas'], MaticExchangeTypes.SubscriptionMATIC_tokenDayDatasArgs, MeshContext>,
  /** null **/
  MATIC_pair: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_pair'], MaticExchangeTypes.SubscriptionMATIC_pairArgs, MeshContext>,
  /** null **/
  MATIC_pairs: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_pairs'], MaticExchangeTypes.SubscriptionMATIC_pairsArgs, MeshContext>,
  /** null **/
  MATIC_pairHourData: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_pairHourData'], MaticExchangeTypes.SubscriptionMATIC_pairHourDataArgs, MeshContext>,
  /** null **/
  MATIC_pairHourDatas: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_pairHourDatas'], MaticExchangeTypes.SubscriptionMATIC_pairHourDatasArgs, MeshContext>,
  /** null **/
  MATIC_pairDayData: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_pairDayData'], MaticExchangeTypes.SubscriptionMATIC_pairDayDataArgs, MeshContext>,
  /** null **/
  MATIC_pairDayDatas: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_pairDayDatas'], MaticExchangeTypes.SubscriptionMATIC_pairDayDatasArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPosition: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_liquidityPosition'], MaticExchangeTypes.SubscriptionMATIC_liquidityPositionArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPositions: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_liquidityPositions'], MaticExchangeTypes.SubscriptionMATIC_liquidityPositionsArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPositionSnapshot: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_liquidityPositionSnapshot'], MaticExchangeTypes.SubscriptionMATIC_liquidityPositionSnapshotArgs, MeshContext>,
  /** null **/
  MATIC_liquidityPositionSnapshots: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_liquidityPositionSnapshots'], MaticExchangeTypes.SubscriptionMATIC_liquidityPositionSnapshotsArgs, MeshContext>,
  /** null **/
  MATIC_transaction: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_transaction'], MaticExchangeTypes.SubscriptionMATIC_transactionArgs, MeshContext>,
  /** null **/
  MATIC_transactions: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_transactions'], MaticExchangeTypes.SubscriptionMATIC_transactionsArgs, MeshContext>,
  /** null **/
  MATIC_mint: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_mint'], MaticExchangeTypes.SubscriptionMATIC_mintArgs, MeshContext>,
  /** null **/
  MATIC_mints: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_mints'], MaticExchangeTypes.SubscriptionMATIC_mintsArgs, MeshContext>,
  /** null **/
  MATIC_burn: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_burn'], MaticExchangeTypes.SubscriptionMATIC_burnArgs, MeshContext>,
  /** null **/
  MATIC_burns: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_burns'], MaticExchangeTypes.SubscriptionMATIC_burnsArgs, MeshContext>,
  /** null **/
  MATIC_swap: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_swap'], MaticExchangeTypes.SubscriptionMATIC_swapArgs, MeshContext>,
  /** null **/
  MATIC_swaps: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC_swaps'], MaticExchangeTypes.SubscriptionMATIC_swapsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  MATIC__meta: InContextSdkMethod<MaticExchangeTypes.Subscription['MATIC__meta'], MaticExchangeTypes.SubscriptionMATIC__metaArgs, MeshContext>
};


    export namespace EthereumExchangeTypes {
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
  ETHEREUM_Bytes: any;
  ETHEREUM_BigDecimal: any;
  BigInt: any;
};

export type Query = {
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<ETHEREUM_Factory>;
  ETHEREUM_factories: Array<ETHEREUM_Factory>;
  ETHEREUM_hourData?: Maybe<ETHEREUM_HourData>;
  ETHEREUM_hourDatas: Array<ETHEREUM_HourData>;
  ETHEREUM_dayData?: Maybe<ETHEREUM_DayData>;
  ETHEREUM_dayDatas: Array<ETHEREUM_DayData>;
  ETHEREUM_token?: Maybe<ETHEREUM_Token>;
  ETHEREUM_tokens: Array<ETHEREUM_Token>;
  ETHEREUM_tokenHourData?: Maybe<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenHourDatas: Array<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenDayData?: Maybe<ETHEREUM_TokenDayData>;
  ETHEREUM_tokenDayDatas: Array<ETHEREUM_TokenDayData>;
  ETHEREUM_pair?: Maybe<ETHEREUM_Pair>;
  ETHEREUM_pairs: Array<ETHEREUM_Pair>;
  ETHEREUM_pairHourData?: Maybe<ETHEREUM_PairHourData>;
  ETHEREUM_pairHourDatas: Array<ETHEREUM_PairHourData>;
  ETHEREUM_pairDayData?: Maybe<ETHEREUM_PairDayData>;
  ETHEREUM_pairDayDatas: Array<ETHEREUM_PairDayData>;
  ETHEREUM_liquidityPosition?: Maybe<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositionSnapshot?: Maybe<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_liquidityPositionSnapshots: Array<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_transaction?: Maybe<ETHEREUM_Transaction>;
  ETHEREUM_transactions: Array<ETHEREUM_Transaction>;
  ETHEREUM_mint?: Maybe<ETHEREUM_Mint>;
  ETHEREUM_mints: Array<ETHEREUM_Mint>;
  ETHEREUM_burn?: Maybe<ETHEREUM_Burn>;
  ETHEREUM_burns: Array<ETHEREUM_Burn>;
  ETHEREUM_swap?: Maybe<ETHEREUM_Swap>;
  ETHEREUM_swaps: Array<ETHEREUM_Swap>;
  ETHEREUM_tokenSearch: Array<ETHEREUM_Token>;
  ETHEREUM_pairSearch: Array<ETHEREUM_Pair>;
  ETHEREUM_userSearch: Array<ETHEREUM_User>;
  /** Access to subgraph metadata */
  ETHEREUM__meta?: Maybe<ETHEREUM__Meta_>;
};


export type QueryETHEREUM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_User_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_User_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Bundle_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Bundle_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Factory_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Factory_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_HourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_HourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_DayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_DayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Token_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Token_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Transaction_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Transaction_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_tokenSearchArgs = {
  text: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_pairSearchArgs = {
  text: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM_userSearchArgs = {
  text: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryETHEREUM__metaArgs = {
  block?: InputMaybe<ETHEREUM_Block_height>;
};

/** The block at which the query should be executed. */
export type ETHEREUM_Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
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

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type ETHEREUM_User = {
  id: Scalars['ID'];
  liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
};


export type ETHEREUM_UserliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
};

export type ETHEREUM_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

/** Defines the order direction, either ascending or descending */
export type ETHEREUM_OrderDirection =
  | 'asc'
  | 'desc';

export type ETHEREUM_LiquidityPosition_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type ETHEREUM_LiquidityPosition = {
  id: Scalars['ID'];
  user: ETHEREUM_User;
  pair: ETHEREUM_Pair;
  liquidityTokenBalance: Scalars['ETHEREUM_BigDecimal'];
  snapshots: Array<Maybe<ETHEREUM_LiquidityPositionSnapshot>>;
  block: Scalars['Int'];
  timestamp: Scalars['Int'];
};


export type ETHEREUM_LiquidityPositionsnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
};

export type ETHEREUM_Pair = {
  id: Scalars['ID'];
  factory: ETHEREUM_Factory;
  name: Scalars['String'];
  token0: ETHEREUM_Token;
  token1: ETHEREUM_Token;
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  totalSupply: Scalars['ETHEREUM_BigDecimal'];
  reserveETH: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  trackedReserveETH: Scalars['ETHEREUM_BigDecimal'];
  token0Price: Scalars['ETHEREUM_BigDecimal'];
  token1Price: Scalars['ETHEREUM_BigDecimal'];
  volumeToken0: Scalars['ETHEREUM_BigDecimal'];
  volumeToken1: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
  liquidityPositionSnapshots: Array<ETHEREUM_LiquidityPositionSnapshot>;
  dayData: Array<ETHEREUM_PairDayData>;
  hourData: Array<ETHEREUM_PairHourData>;
  mints: Array<ETHEREUM_Mint>;
  burns: Array<ETHEREUM_Burn>;
  swaps: Array<ETHEREUM_Swap>;
  timestamp: Scalars['BigInt'];
  block: Scalars['BigInt'];
};


export type ETHEREUM_PairliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
};


export type ETHEREUM_PairliquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
};


export type ETHEREUM_PairdayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
};


export type ETHEREUM_PairhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairHourData_filter>;
};


export type ETHEREUM_PairmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
};


export type ETHEREUM_PairburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
};


export type ETHEREUM_PairswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
};

export type ETHEREUM_Factory = {
  id: Scalars['ID'];
  pairCount: Scalars['BigInt'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolumeUSD: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  tokenCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  pairs: Array<ETHEREUM_Pair>;
  tokens: Array<ETHEREUM_Token>;
  hourData: Array<ETHEREUM_HourData>;
  dayData: Array<ETHEREUM_DayData>;
};


export type ETHEREUM_FactorypairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
};


export type ETHEREUM_FactorytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Token_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Token_filter>;
};


export type ETHEREUM_FactoryhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_HourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_HourData_filter>;
};


export type ETHEREUM_FactorydayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_DayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_DayData_filter>;
};

export type ETHEREUM_Pair_orderBy =
  | 'id'
  | 'factory'
  | 'name'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveETH'
  | 'reserveUSD'
  | 'trackedReserveETH'
  | 'token0Price'
  | 'token1Price'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidityProviderCount'
  | 'liquidityPositions'
  | 'liquidityPositionSnapshots'
  | 'dayData'
  | 'hourData'
  | 'mints'
  | 'burns'
  | 'swaps'
  | 'timestamp'
  | 'block';

export type ETHEREUM_Pair_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  trackedReserveETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token0Price?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0Price_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token0Price_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1Price?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1Price_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1Price_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_Token_orderBy =
  | 'id'
  | 'factory'
  | 'symbol'
  | 'name'
  | 'decimals'
  | 'totalSupply'
  | 'volume'
  | 'volumeUSD'
  | 'untrackedVolumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'derivedETH'
  | 'hourData'
  | 'dayData'
  | 'basePairs'
  | 'quotePairs'
  | 'basePairsDayData'
  | 'quotePairsDayData';

export type ETHEREUM_Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  derivedETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  derivedETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Token = {
  id: Scalars['ID'];
  factory: ETHEREUM_Factory;
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  volume: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  derivedETH: Scalars['ETHEREUM_BigDecimal'];
  hourData: Array<ETHEREUM_TokenHourData>;
  dayData: Array<ETHEREUM_TokenDayData>;
  basePairs: Array<ETHEREUM_Pair>;
  quotePairs: Array<ETHEREUM_Pair>;
  basePairsDayData: Array<ETHEREUM_PairDayData>;
  quotePairsDayData: Array<ETHEREUM_PairDayData>;
};


export type ETHEREUM_TokenhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenHourData_filter>;
};


export type ETHEREUM_TokendayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenDayData_filter>;
};


export type ETHEREUM_TokenbasePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
};


export type ETHEREUM_TokenquotePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
};


export type ETHEREUM_TokenbasePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
};


export type ETHEREUM_TokenquotePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
};

export type ETHEREUM_TokenHourData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type ETHEREUM_TokenHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_TokenHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: ETHEREUM_Token;
  volume: Scalars['ETHEREUM_BigDecimal'];
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  priceUSD: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_TokenDayData_orderBy =
  | 'id'
  | 'date'
  | 'token'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | 'txCount'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD';

export type ETHEREUM_TokenDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  volume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_TokenDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: ETHEREUM_Token;
  volume: Scalars['ETHEREUM_BigDecimal'];
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  priceUSD: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_PairDayData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type ETHEREUM_PairDayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_PairDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: ETHEREUM_Pair;
  token0: ETHEREUM_Token;
  token1: ETHEREUM_Token;
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  totalSupply: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  volumeToken0: Scalars['ETHEREUM_BigDecimal'];
  volumeToken1: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_HourData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type ETHEREUM_HourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: ETHEREUM_Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_DayData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type ETHEREUM_DayData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: ETHEREUM_Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_LiquidityPositionSnapshot_orderBy =
  | 'id'
  | 'liquidityPosition'
  | 'timestamp'
  | 'block'
  | 'user'
  | 'pair'
  | 'token0PriceUSD'
  | 'token1PriceUSD'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'liquidityTokenTotalSupply'
  | 'liquidityTokenBalance';

export type ETHEREUM_LiquidityPositionSnapshot_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPosition?: InputMaybe<Scalars['String']>;
  liquidityPosition_not?: InputMaybe<Scalars['String']>;
  liquidityPosition_gt?: InputMaybe<Scalars['String']>;
  liquidityPosition_lt?: InputMaybe<Scalars['String']>;
  liquidityPosition_gte?: InputMaybe<Scalars['String']>;
  liquidityPosition_lte?: InputMaybe<Scalars['String']>;
  liquidityPosition_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPosition_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0PriceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1PriceUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_LiquidityPositionSnapshot = {
  id: Scalars['ID'];
  liquidityPosition: ETHEREUM_LiquidityPosition;
  timestamp: Scalars['Int'];
  block: Scalars['Int'];
  user: ETHEREUM_User;
  pair: ETHEREUM_Pair;
  token0PriceUSD: Scalars['ETHEREUM_BigDecimal'];
  token1PriceUSD: Scalars['ETHEREUM_BigDecimal'];
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  liquidityTokenTotalSupply: Scalars['ETHEREUM_BigDecimal'];
  liquidityTokenBalance: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_PairHourData_orderBy =
  | 'id'
  | 'date'
  | 'pair'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | 'txCount';

export type ETHEREUM_PairHourData_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_PairHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: ETHEREUM_Pair;
  reserve0: Scalars['ETHEREUM_BigDecimal'];
  reserve1: Scalars['ETHEREUM_BigDecimal'];
  reserveUSD: Scalars['ETHEREUM_BigDecimal'];
  volumeToken0: Scalars['ETHEREUM_BigDecimal'];
  volumeToken1: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type ETHEREUM_Mint_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'to'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'logIndex'
  | 'amountUSD'
  | 'feeTo'
  | 'feeLiquidity';

export type ETHEREUM_Mint_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Mint = {
  id: Scalars['ID'];
  transaction: ETHEREUM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: ETHEREUM_Pair;
  to: Scalars['ETHEREUM_Bytes'];
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  sender?: Maybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  feeTo?: Maybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
};

export type ETHEREUM_Transaction = {
  id: Scalars['ID'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  mints: Array<Maybe<ETHEREUM_Mint>>;
  burns: Array<Maybe<ETHEREUM_Burn>>;
  swaps: Array<Maybe<ETHEREUM_Swap>>;
};


export type ETHEREUM_TransactionmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
};


export type ETHEREUM_TransactionburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
};


export type ETHEREUM_TransactionswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
};

export type ETHEREUM_Burn_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'liquidity'
  | 'sender'
  | 'amount0'
  | 'amount1'
  | 'to'
  | 'logIndex'
  | 'amountUSD'
  | 'complete'
  | 'feeTo'
  | 'feeLiquidity';

export type ETHEREUM_Burn_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  to?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  complete?: InputMaybe<Scalars['Boolean']>;
  complete_not?: InputMaybe<Scalars['Boolean']>;
  complete_in?: InputMaybe<Array<Scalars['Boolean']>>;
  complete_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  feeTo?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Burn = {
  id: Scalars['ID'];
  transaction: ETHEREUM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: ETHEREUM_Pair;
  liquidity: Scalars['ETHEREUM_BigDecimal'];
  sender?: Maybe<Scalars['ETHEREUM_Bytes']>;
  amount0?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  to?: Maybe<Scalars['ETHEREUM_Bytes']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
  complete: Scalars['Boolean'];
  feeTo?: Maybe<Scalars['ETHEREUM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['ETHEREUM_BigDecimal']>;
};

export type ETHEREUM_Swap_orderBy =
  | 'id'
  | 'transaction'
  | 'timestamp'
  | 'pair'
  | 'sender'
  | 'amount0In'
  | 'amount1In'
  | 'amount0Out'
  | 'amount1Out'
  | 'to'
  | 'logIndex'
  | 'amountUSD';

export type ETHEREUM_Swap_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  amount0In?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0In_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0In_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1In?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1In_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1In_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0Out?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount0Out_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1Out?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amount1Out_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  to?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['ETHEREUM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['ETHEREUM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Swap = {
  id: Scalars['ID'];
  transaction: ETHEREUM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: ETHEREUM_Pair;
  sender: Scalars['ETHEREUM_Bytes'];
  amount0In: Scalars['ETHEREUM_BigDecimal'];
  amount1In: Scalars['ETHEREUM_BigDecimal'];
  amount0Out: Scalars['ETHEREUM_BigDecimal'];
  amount1Out: Scalars['ETHEREUM_BigDecimal'];
  to: Scalars['ETHEREUM_Bytes'];
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type ETHEREUM_User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export type ETHEREUM_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['ETHEREUM_BigDecimal'];
};

export type ETHEREUM_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

export type ETHEREUM_Bundle_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ethPrice?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  ethPrice_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
};

export type ETHEREUM_Factory_orderBy =
  | 'id'
  | 'pairCount'
  | 'volumeUSD'
  | 'volumeETH'
  | 'untrackedVolumeUSD'
  | 'liquidityUSD'
  | 'liquidityETH'
  | 'txCount'
  | 'tokenCount'
  | 'userCount'
  | 'pairs'
  | 'tokens'
  | 'hourData'
  | 'dayData';

export type ETHEREUM_Factory_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pairCount?: InputMaybe<Scalars['BigInt']>;
  pairCount_not?: InputMaybe<Scalars['BigInt']>;
  pairCount_gt?: InputMaybe<Scalars['BigInt']>;
  pairCount_lt?: InputMaybe<Scalars['BigInt']>;
  pairCount_gte?: InputMaybe<Scalars['BigInt']>;
  pairCount_lte?: InputMaybe<Scalars['BigInt']>;
  pairCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pairCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  volumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['ETHEREUM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['ETHEREUM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount?: InputMaybe<Scalars['BigInt']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount?: InputMaybe<Scalars['BigInt']>;
  userCount_not?: InputMaybe<Scalars['BigInt']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']>;
  userCount_lt?: InputMaybe<Scalars['BigInt']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type ETHEREUM_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

export type ETHEREUM_Transaction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mints?: InputMaybe<Array<Scalars['String']>>;
  mints_not?: InputMaybe<Array<Scalars['String']>>;
  mints_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  mints_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

/** The type for the top-level _meta field */
export type ETHEREUM__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: ETHEREUM__Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type ETHEREUM__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['ETHEREUM_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

export type Subscription = {
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<ETHEREUM_Factory>;
  ETHEREUM_factories: Array<ETHEREUM_Factory>;
  ETHEREUM_hourData?: Maybe<ETHEREUM_HourData>;
  ETHEREUM_hourDatas: Array<ETHEREUM_HourData>;
  ETHEREUM_dayData?: Maybe<ETHEREUM_DayData>;
  ETHEREUM_dayDatas: Array<ETHEREUM_DayData>;
  ETHEREUM_token?: Maybe<ETHEREUM_Token>;
  ETHEREUM_tokens: Array<ETHEREUM_Token>;
  ETHEREUM_tokenHourData?: Maybe<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenHourDatas: Array<ETHEREUM_TokenHourData>;
  ETHEREUM_tokenDayData?: Maybe<ETHEREUM_TokenDayData>;
  ETHEREUM_tokenDayDatas: Array<ETHEREUM_TokenDayData>;
  ETHEREUM_pair?: Maybe<ETHEREUM_Pair>;
  ETHEREUM_pairs: Array<ETHEREUM_Pair>;
  ETHEREUM_pairHourData?: Maybe<ETHEREUM_PairHourData>;
  ETHEREUM_pairHourDatas: Array<ETHEREUM_PairHourData>;
  ETHEREUM_pairDayData?: Maybe<ETHEREUM_PairDayData>;
  ETHEREUM_pairDayDatas: Array<ETHEREUM_PairDayData>;
  ETHEREUM_liquidityPosition?: Maybe<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositions: Array<ETHEREUM_LiquidityPosition>;
  ETHEREUM_liquidityPositionSnapshot?: Maybe<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_liquidityPositionSnapshots: Array<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_transaction?: Maybe<ETHEREUM_Transaction>;
  ETHEREUM_transactions: Array<ETHEREUM_Transaction>;
  ETHEREUM_mint?: Maybe<ETHEREUM_Mint>;
  ETHEREUM_mints: Array<ETHEREUM_Mint>;
  ETHEREUM_burn?: Maybe<ETHEREUM_Burn>;
  ETHEREUM_burns: Array<ETHEREUM_Burn>;
  ETHEREUM_swap?: Maybe<ETHEREUM_Swap>;
  ETHEREUM_swaps: Array<ETHEREUM_Swap>;
  /** Access to subgraph metadata */
  ETHEREUM__meta?: Maybe<ETHEREUM__Meta_>;
};


export type SubscriptionETHEREUM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_User_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_User_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Bundle_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Bundle_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Factory_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Factory_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_HourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_HourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_DayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_DayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Token_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Token_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_TokenDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairHourData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_PairDayData_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPosition_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Transaction_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Transaction_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Mint_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Mint_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Burn_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Burn_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Swap_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Swap_filter>;
  block?: InputMaybe<ETHEREUM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionETHEREUM__metaArgs = {
  block?: InputMaybe<ETHEREUM_Block_height>;
};

    }
    export type QueryEthereumExchangeSdk = {
  /** null **/
  ETHEREUM_user: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_user'], EthereumExchangeTypes.QueryETHEREUM_userArgs, MeshContext>,
  /** null **/
  ETHEREUM_users: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_users'], EthereumExchangeTypes.QueryETHEREUM_usersArgs, MeshContext>,
  /** null **/
  ETHEREUM_bundle: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_bundle'], EthereumExchangeTypes.QueryETHEREUM_bundleArgs, MeshContext>,
  /** null **/
  ETHEREUM_bundles: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_bundles'], EthereumExchangeTypes.QueryETHEREUM_bundlesArgs, MeshContext>,
  /** null **/
  ETHEREUM_factory: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_factory'], EthereumExchangeTypes.QueryETHEREUM_factoryArgs, MeshContext>,
  /** null **/
  ETHEREUM_factories: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_factories'], EthereumExchangeTypes.QueryETHEREUM_factoriesArgs, MeshContext>,
  /** null **/
  ETHEREUM_hourData: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_hourData'], EthereumExchangeTypes.QueryETHEREUM_hourDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_hourDatas: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_hourDatas'], EthereumExchangeTypes.QueryETHEREUM_hourDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_dayData: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_dayData'], EthereumExchangeTypes.QueryETHEREUM_dayDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_dayDatas: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_dayDatas'], EthereumExchangeTypes.QueryETHEREUM_dayDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_token: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_token'], EthereumExchangeTypes.QueryETHEREUM_tokenArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokens: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_tokens'], EthereumExchangeTypes.QueryETHEREUM_tokensArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenHourData: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_tokenHourData'], EthereumExchangeTypes.QueryETHEREUM_tokenHourDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenHourDatas: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_tokenHourDatas'], EthereumExchangeTypes.QueryETHEREUM_tokenHourDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenDayData: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_tokenDayData'], EthereumExchangeTypes.QueryETHEREUM_tokenDayDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenDayDatas: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_tokenDayDatas'], EthereumExchangeTypes.QueryETHEREUM_tokenDayDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_pair: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_pair'], EthereumExchangeTypes.QueryETHEREUM_pairArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairs: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_pairs'], EthereumExchangeTypes.QueryETHEREUM_pairsArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairHourData: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_pairHourData'], EthereumExchangeTypes.QueryETHEREUM_pairHourDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairHourDatas: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_pairHourDatas'], EthereumExchangeTypes.QueryETHEREUM_pairHourDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairDayData: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_pairDayData'], EthereumExchangeTypes.QueryETHEREUM_pairDayDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairDayDatas: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_pairDayDatas'], EthereumExchangeTypes.QueryETHEREUM_pairDayDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPosition: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_liquidityPosition'], EthereumExchangeTypes.QueryETHEREUM_liquidityPositionArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPositions: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_liquidityPositions'], EthereumExchangeTypes.QueryETHEREUM_liquidityPositionsArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPositionSnapshot: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_liquidityPositionSnapshot'], EthereumExchangeTypes.QueryETHEREUM_liquidityPositionSnapshotArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPositionSnapshots: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_liquidityPositionSnapshots'], EthereumExchangeTypes.QueryETHEREUM_liquidityPositionSnapshotsArgs, MeshContext>,
  /** null **/
  ETHEREUM_transaction: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_transaction'], EthereumExchangeTypes.QueryETHEREUM_transactionArgs, MeshContext>,
  /** null **/
  ETHEREUM_transactions: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_transactions'], EthereumExchangeTypes.QueryETHEREUM_transactionsArgs, MeshContext>,
  /** null **/
  ETHEREUM_mint: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_mint'], EthereumExchangeTypes.QueryETHEREUM_mintArgs, MeshContext>,
  /** null **/
  ETHEREUM_mints: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_mints'], EthereumExchangeTypes.QueryETHEREUM_mintsArgs, MeshContext>,
  /** null **/
  ETHEREUM_burn: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_burn'], EthereumExchangeTypes.QueryETHEREUM_burnArgs, MeshContext>,
  /** null **/
  ETHEREUM_burns: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_burns'], EthereumExchangeTypes.QueryETHEREUM_burnsArgs, MeshContext>,
  /** null **/
  ETHEREUM_swap: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_swap'], EthereumExchangeTypes.QueryETHEREUM_swapArgs, MeshContext>,
  /** null **/
  ETHEREUM_swaps: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_swaps'], EthereumExchangeTypes.QueryETHEREUM_swapsArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenSearch: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_tokenSearch'], EthereumExchangeTypes.QueryETHEREUM_tokenSearchArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairSearch: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_pairSearch'], EthereumExchangeTypes.QueryETHEREUM_pairSearchArgs, MeshContext>,
  /** null **/
  ETHEREUM_userSearch: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM_userSearch'], EthereumExchangeTypes.QueryETHEREUM_userSearchArgs, MeshContext>,
  /** Access to subgraph metadata **/
  ETHEREUM__meta: InContextSdkMethod<EthereumExchangeTypes.Query['ETHEREUM__meta'], EthereumExchangeTypes.QueryETHEREUM__metaArgs, MeshContext>
};

export type MutationEthereumExchangeSdk = {

};

export type SubscriptionEthereumExchangeSdk = {
  /** null **/
  ETHEREUM_user: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_user'], EthereumExchangeTypes.SubscriptionETHEREUM_userArgs, MeshContext>,
  /** null **/
  ETHEREUM_users: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_users'], EthereumExchangeTypes.SubscriptionETHEREUM_usersArgs, MeshContext>,
  /** null **/
  ETHEREUM_bundle: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_bundle'], EthereumExchangeTypes.SubscriptionETHEREUM_bundleArgs, MeshContext>,
  /** null **/
  ETHEREUM_bundles: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_bundles'], EthereumExchangeTypes.SubscriptionETHEREUM_bundlesArgs, MeshContext>,
  /** null **/
  ETHEREUM_factory: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_factory'], EthereumExchangeTypes.SubscriptionETHEREUM_factoryArgs, MeshContext>,
  /** null **/
  ETHEREUM_factories: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_factories'], EthereumExchangeTypes.SubscriptionETHEREUM_factoriesArgs, MeshContext>,
  /** null **/
  ETHEREUM_hourData: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_hourData'], EthereumExchangeTypes.SubscriptionETHEREUM_hourDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_hourDatas: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_hourDatas'], EthereumExchangeTypes.SubscriptionETHEREUM_hourDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_dayData: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_dayData'], EthereumExchangeTypes.SubscriptionETHEREUM_dayDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_dayDatas: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_dayDatas'], EthereumExchangeTypes.SubscriptionETHEREUM_dayDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_token: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_token'], EthereumExchangeTypes.SubscriptionETHEREUM_tokenArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokens: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_tokens'], EthereumExchangeTypes.SubscriptionETHEREUM_tokensArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenHourData: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_tokenHourData'], EthereumExchangeTypes.SubscriptionETHEREUM_tokenHourDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenHourDatas: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_tokenHourDatas'], EthereumExchangeTypes.SubscriptionETHEREUM_tokenHourDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenDayData: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_tokenDayData'], EthereumExchangeTypes.SubscriptionETHEREUM_tokenDayDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_tokenDayDatas: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_tokenDayDatas'], EthereumExchangeTypes.SubscriptionETHEREUM_tokenDayDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_pair: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_pair'], EthereumExchangeTypes.SubscriptionETHEREUM_pairArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairs: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_pairs'], EthereumExchangeTypes.SubscriptionETHEREUM_pairsArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairHourData: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_pairHourData'], EthereumExchangeTypes.SubscriptionETHEREUM_pairHourDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairHourDatas: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_pairHourDatas'], EthereumExchangeTypes.SubscriptionETHEREUM_pairHourDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairDayData: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_pairDayData'], EthereumExchangeTypes.SubscriptionETHEREUM_pairDayDataArgs, MeshContext>,
  /** null **/
  ETHEREUM_pairDayDatas: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_pairDayDatas'], EthereumExchangeTypes.SubscriptionETHEREUM_pairDayDatasArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPosition: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_liquidityPosition'], EthereumExchangeTypes.SubscriptionETHEREUM_liquidityPositionArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPositions: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_liquidityPositions'], EthereumExchangeTypes.SubscriptionETHEREUM_liquidityPositionsArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPositionSnapshot: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_liquidityPositionSnapshot'], EthereumExchangeTypes.SubscriptionETHEREUM_liquidityPositionSnapshotArgs, MeshContext>,
  /** null **/
  ETHEREUM_liquidityPositionSnapshots: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_liquidityPositionSnapshots'], EthereumExchangeTypes.SubscriptionETHEREUM_liquidityPositionSnapshotsArgs, MeshContext>,
  /** null **/
  ETHEREUM_transaction: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_transaction'], EthereumExchangeTypes.SubscriptionETHEREUM_transactionArgs, MeshContext>,
  /** null **/
  ETHEREUM_transactions: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_transactions'], EthereumExchangeTypes.SubscriptionETHEREUM_transactionsArgs, MeshContext>,
  /** null **/
  ETHEREUM_mint: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_mint'], EthereumExchangeTypes.SubscriptionETHEREUM_mintArgs, MeshContext>,
  /** null **/
  ETHEREUM_mints: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_mints'], EthereumExchangeTypes.SubscriptionETHEREUM_mintsArgs, MeshContext>,
  /** null **/
  ETHEREUM_burn: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_burn'], EthereumExchangeTypes.SubscriptionETHEREUM_burnArgs, MeshContext>,
  /** null **/
  ETHEREUM_burns: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_burns'], EthereumExchangeTypes.SubscriptionETHEREUM_burnsArgs, MeshContext>,
  /** null **/
  ETHEREUM_swap: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_swap'], EthereumExchangeTypes.SubscriptionETHEREUM_swapArgs, MeshContext>,
  /** null **/
  ETHEREUM_swaps: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM_swaps'], EthereumExchangeTypes.SubscriptionETHEREUM_swapsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  ETHEREUM__meta: InContextSdkMethod<EthereumExchangeTypes.Subscription['ETHEREUM__meta'], EthereumExchangeTypes.SubscriptionETHEREUM__metaArgs, MeshContext>
};

export type MaticExchangeContext = {
      ["matic-exchange"]: { Query: QueryMaticExchangeSdk, Mutation: MutationMaticExchangeSdk, Subscription: SubscriptionMaticExchangeSdk },
    };

export type EthereumExchangeContext = {
      ["ethereum-exchange"]: { Query: QueryEthereumExchangeSdk, Mutation: MutationEthereumExchangeSdk, Subscription: SubscriptionEthereumExchangeSdk },
    };

export type MeshContext = MaticExchangeContext & EthereumExchangeContext & BaseMeshContext;


import { getMesh } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import pathModule from 'path';
import { fileURLToPath } from '@graphql-mesh/utils';
import ExternalModule_0 from '@graphql-mesh/cache-inmemory-lru';
import ExternalModule_1 from '@graphql-mesh/graphql';
import ExternalModule_2 from '@graphql-mesh/merger-stitching';
import ExternalModule_3 from '@graphql-mesh/transform-prefix';
import ExternalModule_4 from '@graphql-mesh/transform-type-merging';
import ExternalModule_5 from './sources/matic-exchange/schema.graphql.ts';
import ExternalModule_6 from './sources/ethereum-exchange/schema.graphql.ts';

const importedModules: Record<string, any> = {
  // @ts-ignore
  ["@graphql-mesh/cache-inmemory-lru"]: ExternalModule_0,
  // @ts-ignore
  ["@graphql-mesh/graphql"]: ExternalModule_1,
  // @ts-ignore
  ["@graphql-mesh/merger-stitching"]: ExternalModule_2,
  // @ts-ignore
  ["@graphql-mesh/transform-prefix"]: ExternalModule_3,
  // @ts-ignore
  ["@graphql-mesh/transform-type-merging"]: ExternalModule_4,
  // @ts-ignore
  [".graphclient/sources/matic-exchange/schema.graphql.ts"]: ExternalModule_5,
  // @ts-ignore
  [".graphclient/sources/ethereum-exchange/schema.graphql.ts"]: ExternalModule_6
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
import PrefixTransform from '@graphql-mesh/transform-prefix';
import TypeMergingTransform from '@graphql-mesh/transform-type-merging';
import { resolveAdditionalResolvers } from '@graphql-mesh/utils';
export const rawConfig: YamlConfig.Config = {"sources":[{"name":"ethereum-exchange","handler":{"graphql":{"endpoint":"https://api.thegraph.com/subgraphs/name/sushiswap/exchange"}},"transforms":[{"prefix":{"value":"ETHEREUM_","includeRootOperations":true,"ignore":["_SubgraphErrorPolicy_"]}},{"typeMerging":{"queryFields":[{"queryFieldName":"ETHEREUM_factory","keyField":"id","keyArg":"id"}]}}]},{"name":"matic-exchange","handler":{"graphql":{"endpoint":"https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange"}},"transforms":[{"prefix":{"value":"MATIC_","includeRootOperations":true,"ignore":["_SubgraphErrorPolicy_"]}},{"typeMerging":{"queryFields":[{"queryFieldName":"MATIC_factory","keyField":"id","keyArg":"id"}]}}]}],"documents":["./factory-query.graphql"]} as any
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
const ethereumExchangeTransforms = [];
const maticExchangeTransforms = [];
const additionalTypeDefs: DocumentNode[] = [] as any[];
const ethereumExchangeHandler = new GraphqlHandler({
              name: rawConfig.sources[0].name,
              config: rawConfig.sources[0].handler["graphql"],
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child(rawConfig.sources[0].name),
              logger: logger.child(rawConfig.sources[0].name),
              importFn
            });
const maticExchangeHandler = new GraphqlHandler({
              name: rawConfig.sources[1].name,
              config: rawConfig.sources[1].handler["graphql"],
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child(rawConfig.sources[1].name),
              logger: logger.child(rawConfig.sources[1].name),
              importFn
            });
const merger = new(StitchingMerger as any)({
        cache,
        pubsub,
        logger: logger.child('StitchingMerger'),
        store: rootStore.child('stitchingMerger')
      })
ethereumExchangeTransforms.push(
                new PrefixTransform({
                  apiName: rawConfig.sources[0].name,
                  config: rawConfig.sources[0].transforms[0]["prefix"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
ethereumExchangeTransforms.push(
                new TypeMergingTransform({
                  apiName: rawConfig.sources[0].name,
                  config: rawConfig.sources[0].transforms[1]["typeMerging"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
maticExchangeTransforms.push(
                new PrefixTransform({
                  apiName: rawConfig.sources[1].name,
                  config: rawConfig.sources[1].transforms[0]["prefix"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
maticExchangeTransforms.push(
                new TypeMergingTransform({
                  apiName: rawConfig.sources[1].name,
                  config: rawConfig.sources[1].transforms[1]["typeMerging"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
sources.push({
          name: 'ethereum-exchange',
          handler: ethereumExchangeHandler,
          transforms: ethereumExchangeTransforms
        })
sources.push({
          name: 'matic-exchange',
          handler: maticExchangeHandler,
          transforms: maticExchangeTransforms
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

export const documentsInSDL = /*#__PURE__*/ [/* GraphQL */`query FactoriesQuery {
  ETHEREUM_factory(id: "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac") {
    __typename
    id
    volumeETH
    liquidityETH
  }
  MATIC_factory(id: "0xc35dadb65012ec5796536bd9864ed8773abc74c4") {
    __typename
    id
    volumeETH
    liquidityETH
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
export type FactoriesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type FactoriesQueryQuery = { ETHEREUM_factory?: Maybe<(
    { __typename: 'ETHEREUM_Factory' }
    & Pick<ETHEREUM_Factory, 'id' | 'volumeETH' | 'liquidityETH'>
  )>, MATIC_factory?: Maybe<(
    { __typename: 'MATIC_Factory' }
    & Pick<MATIC_Factory, 'id' | 'volumeETH' | 'liquidityETH'>
  )> };


export const FactoriesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FactoriesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ETHEREUM_factory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"volumeETH"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityETH"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MATIC_factory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"0xc35dadb65012ec5796536bd9864ed8773abc74c4","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"volumeETH"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityETH"}}]}}]}}]} as unknown as DocumentNode<FactoriesQueryQuery, FactoriesQueryQueryVariables>;


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
    const FactoriesQueryCompiled = compileQuery(schema, FactoriesQueryDocument, 'FactoriesQuery', jitOptions);
    if(!(isCompiledQuery(FactoriesQueryCompiled))) {
      const originalErrors = FactoriesQueryCompiled?.errors?.map(error => error.originalError || error) || [];
      throw new AggregateError(originalErrors, `Failed to compile FactoriesQuery: \n\t${originalErrors.join('\n\t')}`);
    }

  return {
    async FactoriesQuery(variables?: FactoriesQueryQueryVariables, context?: TOperationContext, root?: TOperationRoot): Promise<FactoriesQueryQuery> {
      const result = await FactoriesQueryCompiled.query({
        ...globalRoot,
        ...root
      }, {
        ...globalContext,
        ...context
      }, variables);
      return handleExecutionResult(result, 'FactoriesQuery');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;