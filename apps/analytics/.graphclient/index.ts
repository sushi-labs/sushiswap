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
  ETHEREUM_BigDecimal: any;
  BigInt: any;
  ETHEREUM_Bytes: any;
  MOONBEAM_BigDecimal: any;
  MOONBEAM_Bytes: any;
};

export type Query = {
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<Factory>;
  ETHEREUM_factories: Array<Factory>;
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
  MOONBEAM_user?: Maybe<MOONBEAM_User>;
  MOONBEAM_users: Array<MOONBEAM_User>;
  MOONBEAM_bundle?: Maybe<MOONBEAM_Bundle>;
  MOONBEAM_bundles: Array<MOONBEAM_Bundle>;
  MOONBEAM_factory?: Maybe<Factory>;
  MOONBEAM_factories: Array<Factory>;
  MOONBEAM_hourData?: Maybe<MOONBEAM_HourData>;
  MOONBEAM_hourDatas: Array<MOONBEAM_HourData>;
  MOONBEAM_dayData?: Maybe<MOONBEAM_DayData>;
  MOONBEAM_dayDatas: Array<MOONBEAM_DayData>;
  MOONBEAM_token?: Maybe<MOONBEAM_Token>;
  MOONBEAM_tokens: Array<MOONBEAM_Token>;
  MOONBEAM_tokenHourData?: Maybe<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenHourDatas: Array<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenDayData?: Maybe<MOONBEAM_TokenDayData>;
  MOONBEAM_tokenDayDatas: Array<MOONBEAM_TokenDayData>;
  MOONBEAM_pair?: Maybe<MOONBEAM_Pair>;
  MOONBEAM_pairs: Array<MOONBEAM_Pair>;
  MOONBEAM_pairHourData?: Maybe<MOONBEAM_PairHourData>;
  MOONBEAM_pairHourDatas: Array<MOONBEAM_PairHourData>;
  MOONBEAM_pairDayData?: Maybe<MOONBEAM_PairDayData>;
  MOONBEAM_pairDayDatas: Array<MOONBEAM_PairDayData>;
  MOONBEAM_liquidityPosition?: Maybe<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositionSnapshot?: Maybe<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_liquidityPositionSnapshots: Array<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_transaction?: Maybe<MOONBEAM_Transaction>;
  MOONBEAM_transactions: Array<MOONBEAM_Transaction>;
  MOONBEAM_mint?: Maybe<MOONBEAM_Mint>;
  MOONBEAM_mints: Array<MOONBEAM_Mint>;
  MOONBEAM_burn?: Maybe<MOONBEAM_Burn>;
  MOONBEAM_burns: Array<MOONBEAM_Burn>;
  MOONBEAM_swap?: Maybe<MOONBEAM_Swap>;
  MOONBEAM_swaps: Array<MOONBEAM_Swap>;
  /** Access to subgraph metadata */
  MOONBEAM__meta?: Maybe<MOONBEAM__Meta_>;
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


export type QueryMOONBEAM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_User_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_User_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Bundle_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Bundle_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Factory_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Factory_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_HourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_HourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_DayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_DayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Token_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Token_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Transaction_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Transaction_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM__metaArgs = {
  block?: InputMaybe<MOONBEAM_Block_height>;
};

export type Subscription = {
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<Factory>;
  ETHEREUM_factories: Array<Factory>;
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
  MOONBEAM_user?: Maybe<MOONBEAM_User>;
  MOONBEAM_users: Array<MOONBEAM_User>;
  MOONBEAM_bundle?: Maybe<MOONBEAM_Bundle>;
  MOONBEAM_bundles: Array<MOONBEAM_Bundle>;
  MOONBEAM_factory?: Maybe<Factory>;
  MOONBEAM_factories: Array<Factory>;
  MOONBEAM_hourData?: Maybe<MOONBEAM_HourData>;
  MOONBEAM_hourDatas: Array<MOONBEAM_HourData>;
  MOONBEAM_dayData?: Maybe<MOONBEAM_DayData>;
  MOONBEAM_dayDatas: Array<MOONBEAM_DayData>;
  MOONBEAM_token?: Maybe<MOONBEAM_Token>;
  MOONBEAM_tokens: Array<MOONBEAM_Token>;
  MOONBEAM_tokenHourData?: Maybe<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenHourDatas: Array<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenDayData?: Maybe<MOONBEAM_TokenDayData>;
  MOONBEAM_tokenDayDatas: Array<MOONBEAM_TokenDayData>;
  MOONBEAM_pair?: Maybe<MOONBEAM_Pair>;
  MOONBEAM_pairs: Array<MOONBEAM_Pair>;
  MOONBEAM_pairHourData?: Maybe<MOONBEAM_PairHourData>;
  MOONBEAM_pairHourDatas: Array<MOONBEAM_PairHourData>;
  MOONBEAM_pairDayData?: Maybe<MOONBEAM_PairDayData>;
  MOONBEAM_pairDayDatas: Array<MOONBEAM_PairDayData>;
  MOONBEAM_liquidityPosition?: Maybe<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositionSnapshot?: Maybe<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_liquidityPositionSnapshots: Array<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_transaction?: Maybe<MOONBEAM_Transaction>;
  MOONBEAM_transactions: Array<MOONBEAM_Transaction>;
  MOONBEAM_mint?: Maybe<MOONBEAM_Mint>;
  MOONBEAM_mints: Array<MOONBEAM_Mint>;
  MOONBEAM_burn?: Maybe<MOONBEAM_Burn>;
  MOONBEAM_burns: Array<MOONBEAM_Burn>;
  MOONBEAM_swap?: Maybe<MOONBEAM_Swap>;
  MOONBEAM_swaps: Array<MOONBEAM_Swap>;
  /** Access to subgraph metadata */
  MOONBEAM__meta?: Maybe<MOONBEAM__Meta_>;
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


export type SubscriptionMOONBEAM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_User_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_User_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Bundle_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Bundle_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Factory_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Factory_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_HourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_HourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_DayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_DayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Token_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Token_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Transaction_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Transaction_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM__metaArgs = {
  block?: InputMaybe<MOONBEAM_Block_height>;
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

export type ETHEREUM_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['ETHEREUM_BigDecimal'];
};

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

export type ETHEREUM_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type ETHEREUM_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type Factory = {
  id: Scalars['ID'];
  pairCount: Scalars['BigInt'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolumeUSD: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  tokenCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  pairs: Array<MOONBEAM_Pair>;
  tokens: Array<MOONBEAM_Token>;
  hourData: Array<MOONBEAM_HourData>;
  dayData: Array<MOONBEAM_DayData>;
};


export type FactorypairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type FactorytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Token_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Token_filter>;
};


export type FactoryhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_HourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_HourData_filter>;
};


export type FactorydayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_DayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_DayData_filter>;
};

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

export type ETHEREUM_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
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
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type ETHEREUM_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

/** Defines the order direction, either ascending or descending */
export type ETHEREUM_OrderDirection =
  | 'asc'
  | 'desc';

export type ETHEREUM_Pair = {
  id: Scalars['ID'];
  factory: Factory;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type ETHEREUM_Token = {
  id: Scalars['ID'];
  factory: Factory;
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
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
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export type ETHEREUM_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

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

export type ETHEREUM_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type ETHEREUM__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['ETHEREUM_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
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

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

/** The block at which the query should be executed. */
export type MOONBEAM_Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
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

export type MOONBEAM_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_Bundle_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ethPrice?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

export type MOONBEAM_Burn = {
  id: Scalars['ID'];
  transaction: MOONBEAM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MOONBEAM_Pair;
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  sender?: Maybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  to?: Maybe<Scalars['MOONBEAM_Bytes']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  complete: Scalars['Boolean'];
  feeTo?: Maybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
};

export type MOONBEAM_Burn_filter = {
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  to?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  complete?: InputMaybe<Scalars['Boolean']>;
  complete_not?: InputMaybe<Scalars['Boolean']>;
  complete_in?: InputMaybe<Array<Scalars['Boolean']>>;
  complete_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  feeTo?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Burn_orderBy =
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

export type MOONBEAM_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolume: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_DayData_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_DayData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type MOONBEAM_Factory_filter = {
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
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
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

export type MOONBEAM_Factory_orderBy =
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

export type MOONBEAM_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolume: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_HourData_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_HourData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type MOONBEAM_LiquidityPosition = {
  id: Scalars['ID'];
  user: MOONBEAM_User;
  pair: MOONBEAM_Pair;
  liquidityTokenBalance: Scalars['MOONBEAM_BigDecimal'];
  snapshots: Array<Maybe<MOONBEAM_LiquidityPositionSnapshot>>;
  block: Scalars['Int'];
  timestamp: Scalars['Int'];
};


export type MOONBEAM_LiquidityPositionsnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
};

export type MOONBEAM_LiquidityPositionSnapshot = {
  id: Scalars['ID'];
  liquidityPosition: MOONBEAM_LiquidityPosition;
  timestamp: Scalars['Int'];
  block: Scalars['Int'];
  user: MOONBEAM_User;
  pair: MOONBEAM_Pair;
  token0PriceUSD: Scalars['MOONBEAM_BigDecimal'];
  token1PriceUSD: Scalars['MOONBEAM_BigDecimal'];
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  liquidityTokenTotalSupply: Scalars['MOONBEAM_BigDecimal'];
  liquidityTokenBalance: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_LiquidityPositionSnapshot_filter = {
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
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  token0PriceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1PriceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_LiquidityPositionSnapshot_orderBy =
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

export type MOONBEAM_LiquidityPosition_filter = {
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
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

export type MOONBEAM_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

export type MOONBEAM_Mint = {
  id: Scalars['ID'];
  transaction: MOONBEAM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MOONBEAM_Pair;
  to: Scalars['MOONBEAM_Bytes'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  sender?: Maybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  feeTo?: Maybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
};

export type MOONBEAM_Mint_filter = {
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Mint_orderBy =
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

/** Defines the order direction, either ascending or descending */
export type MOONBEAM_OrderDirection =
  | 'asc'
  | 'desc';

export type MOONBEAM_Pair = {
  id: Scalars['ID'];
  factory: Factory;
  name: Scalars['String'];
  token0: MOONBEAM_Token;
  token1: MOONBEAM_Token;
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  totalSupply: Scalars['MOONBEAM_BigDecimal'];
  reserveETH: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  trackedReserveETH: Scalars['MOONBEAM_BigDecimal'];
  token0Price: Scalars['MOONBEAM_BigDecimal'];
  token1Price: Scalars['MOONBEAM_BigDecimal'];
  volumeToken0: Scalars['MOONBEAM_BigDecimal'];
  volumeToken1: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
  liquidityPositionSnapshots: Array<MOONBEAM_LiquidityPositionSnapshot>;
  dayData: Array<MOONBEAM_PairDayData>;
  hourData: Array<MOONBEAM_PairHourData>;
  mints: Array<MOONBEAM_Mint>;
  burns: Array<MOONBEAM_Burn>;
  swaps: Array<MOONBEAM_Swap>;
  timestamp: Scalars['BigInt'];
  block: Scalars['BigInt'];
};


export type MOONBEAM_PairliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
};


export type MOONBEAM_PairliquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
};


export type MOONBEAM_PairdayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
};


export type MOONBEAM_PairhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairHourData_filter>;
};


export type MOONBEAM_PairmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
};


export type MOONBEAM_PairburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
};


export type MOONBEAM_PairswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
};

export type MOONBEAM_PairDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MOONBEAM_Pair;
  token0: MOONBEAM_Token;
  token1: MOONBEAM_Token;
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  totalSupply: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  volumeToken0: Scalars['MOONBEAM_BigDecimal'];
  volumeToken1: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_PairDayData_filter = {
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_PairDayData_orderBy =
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

export type MOONBEAM_PairHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MOONBEAM_Pair;
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  volumeToken0: Scalars['MOONBEAM_BigDecimal'];
  volumeToken1: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_PairHourData_filter = {
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_PairHourData_orderBy =
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

export type MOONBEAM_Pair_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  trackedReserveETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token0Price?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token0Price_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1Price?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1Price_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
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

export type MOONBEAM_Pair_orderBy =
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

export type MOONBEAM_Swap = {
  id: Scalars['ID'];
  transaction: MOONBEAM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MOONBEAM_Pair;
  sender: Scalars['MOONBEAM_Bytes'];
  amount0In: Scalars['MOONBEAM_BigDecimal'];
  amount1In: Scalars['MOONBEAM_BigDecimal'];
  amount0Out: Scalars['MOONBEAM_BigDecimal'];
  amount1Out: Scalars['MOONBEAM_BigDecimal'];
  to: Scalars['MOONBEAM_Bytes'];
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_Swap_filter = {
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  amount0In?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0In_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1In?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1In_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0Out?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1Out?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  to?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Swap_orderBy =
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

export type MOONBEAM_Token = {
  id: Scalars['ID'];
  factory: Factory;
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  volume: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  derivedETH: Scalars['MOONBEAM_BigDecimal'];
  whitelistPairs: Array<MOONBEAM_Pair>;
  hourData: Array<MOONBEAM_TokenHourData>;
  dayData: Array<MOONBEAM_TokenDayData>;
  basePairs: Array<MOONBEAM_Pair>;
  quotePairs: Array<MOONBEAM_Pair>;
  basePairsDayData: Array<MOONBEAM_PairDayData>;
  quotePairsDayData: Array<MOONBEAM_PairDayData>;
};


export type MOONBEAM_TokenwhitelistPairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type MOONBEAM_TokenhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenHourData_filter>;
};


export type MOONBEAM_TokendayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenDayData_filter>;
};


export type MOONBEAM_TokenbasePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type MOONBEAM_TokenquotePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type MOONBEAM_TokenbasePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
};


export type MOONBEAM_TokenquotePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
};

export type MOONBEAM_TokenDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MOONBEAM_Token;
  volume: Scalars['MOONBEAM_BigDecimal'];
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  priceUSD: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_TokenDayData_filter = {
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  volume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_TokenDayData_orderBy =
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

export type MOONBEAM_TokenHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MOONBEAM_Token;
  volume: Scalars['MOONBEAM_BigDecimal'];
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  priceUSD: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_TokenHourData_filter = {
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  volume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_TokenHourData_orderBy =
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

export type MOONBEAM_Token_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
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
  volume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  derivedETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  whitelistPairs?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_contains?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export type MOONBEAM_Token_orderBy =
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

export type MOONBEAM_Transaction = {
  id: Scalars['ID'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  mints: Array<Maybe<MOONBEAM_Mint>>;
  burns: Array<Maybe<MOONBEAM_Burn>>;
  swaps: Array<Maybe<MOONBEAM_Swap>>;
};


export type MOONBEAM_TransactionmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
};


export type MOONBEAM_TransactionburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
};


export type MOONBEAM_TransactionswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
};

export type MOONBEAM_Transaction_filter = {
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
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export type MOONBEAM_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

export type MOONBEAM_User = {
  id: Scalars['ID'];
  liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
};


export type MOONBEAM_UserliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
};

export type MOONBEAM_User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export type MOONBEAM_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type MOONBEAM__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['MOONBEAM_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type MOONBEAM__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: MOONBEAM__Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
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
  Subscription: ResolverTypeWrapper<{}>;
  ETHEREUM_BigDecimal: ResolverTypeWrapper<Scalars['ETHEREUM_BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  ETHEREUM_Block_height: ETHEREUM_Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ETHEREUM_Bundle: ResolverTypeWrapper<ETHEREUM_Bundle>;
  ETHEREUM_Bundle_filter: ETHEREUM_Bundle_filter;
  ETHEREUM_Bundle_orderBy: ETHEREUM_Bundle_orderBy;
  ETHEREUM_Burn: ResolverTypeWrapper<ETHEREUM_Burn>;
  ETHEREUM_Burn_filter: ETHEREUM_Burn_filter;
  ETHEREUM_Burn_orderBy: ETHEREUM_Burn_orderBy;
  ETHEREUM_Bytes: ResolverTypeWrapper<Scalars['ETHEREUM_Bytes']>;
  ETHEREUM_DayData: ResolverTypeWrapper<ETHEREUM_DayData>;
  ETHEREUM_DayData_filter: ETHEREUM_DayData_filter;
  ETHEREUM_DayData_orderBy: ETHEREUM_DayData_orderBy;
  Factory: ResolverTypeWrapper<Factory>;
  ETHEREUM_Factory_filter: ETHEREUM_Factory_filter;
  ETHEREUM_Factory_orderBy: ETHEREUM_Factory_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ETHEREUM_HourData: ResolverTypeWrapper<ETHEREUM_HourData>;
  ETHEREUM_HourData_filter: ETHEREUM_HourData_filter;
  ETHEREUM_HourData_orderBy: ETHEREUM_HourData_orderBy;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ETHEREUM_LiquidityPosition: ResolverTypeWrapper<ETHEREUM_LiquidityPosition>;
  ETHEREUM_LiquidityPositionSnapshot: ResolverTypeWrapper<ETHEREUM_LiquidityPositionSnapshot>;
  ETHEREUM_LiquidityPositionSnapshot_filter: ETHEREUM_LiquidityPositionSnapshot_filter;
  ETHEREUM_LiquidityPositionSnapshot_orderBy: ETHEREUM_LiquidityPositionSnapshot_orderBy;
  ETHEREUM_LiquidityPosition_filter: ETHEREUM_LiquidityPosition_filter;
  ETHEREUM_LiquidityPosition_orderBy: ETHEREUM_LiquidityPosition_orderBy;
  ETHEREUM_Mint: ResolverTypeWrapper<ETHEREUM_Mint>;
  ETHEREUM_Mint_filter: ETHEREUM_Mint_filter;
  ETHEREUM_Mint_orderBy: ETHEREUM_Mint_orderBy;
  ETHEREUM_OrderDirection: ETHEREUM_OrderDirection;
  ETHEREUM_Pair: ResolverTypeWrapper<ETHEREUM_Pair>;
  ETHEREUM_PairDayData: ResolverTypeWrapper<ETHEREUM_PairDayData>;
  ETHEREUM_PairDayData_filter: ETHEREUM_PairDayData_filter;
  ETHEREUM_PairDayData_orderBy: ETHEREUM_PairDayData_orderBy;
  ETHEREUM_PairHourData: ResolverTypeWrapper<ETHEREUM_PairHourData>;
  ETHEREUM_PairHourData_filter: ETHEREUM_PairHourData_filter;
  ETHEREUM_PairHourData_orderBy: ETHEREUM_PairHourData_orderBy;
  ETHEREUM_Pair_filter: ETHEREUM_Pair_filter;
  ETHEREUM_Pair_orderBy: ETHEREUM_Pair_orderBy;
  String: ResolverTypeWrapper<Scalars['String']>;
  ETHEREUM_Swap: ResolverTypeWrapper<ETHEREUM_Swap>;
  ETHEREUM_Swap_filter: ETHEREUM_Swap_filter;
  ETHEREUM_Swap_orderBy: ETHEREUM_Swap_orderBy;
  ETHEREUM_Token: ResolverTypeWrapper<ETHEREUM_Token>;
  ETHEREUM_TokenDayData: ResolverTypeWrapper<ETHEREUM_TokenDayData>;
  ETHEREUM_TokenDayData_filter: ETHEREUM_TokenDayData_filter;
  ETHEREUM_TokenDayData_orderBy: ETHEREUM_TokenDayData_orderBy;
  ETHEREUM_TokenHourData: ResolverTypeWrapper<ETHEREUM_TokenHourData>;
  ETHEREUM_TokenHourData_filter: ETHEREUM_TokenHourData_filter;
  ETHEREUM_TokenHourData_orderBy: ETHEREUM_TokenHourData_orderBy;
  ETHEREUM_Token_filter: ETHEREUM_Token_filter;
  ETHEREUM_Token_orderBy: ETHEREUM_Token_orderBy;
  ETHEREUM_Transaction: ResolverTypeWrapper<ETHEREUM_Transaction>;
  ETHEREUM_Transaction_filter: ETHEREUM_Transaction_filter;
  ETHEREUM_Transaction_orderBy: ETHEREUM_Transaction_orderBy;
  ETHEREUM_User: ResolverTypeWrapper<ETHEREUM_User>;
  ETHEREUM_User_filter: ETHEREUM_User_filter;
  ETHEREUM_User_orderBy: ETHEREUM_User_orderBy;
  ETHEREUM__Block_: ResolverTypeWrapper<ETHEREUM__Block_>;
  ETHEREUM__Meta_: ResolverTypeWrapper<ETHEREUM__Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
  MOONBEAM_BigDecimal: ResolverTypeWrapper<Scalars['MOONBEAM_BigDecimal']>;
  MOONBEAM_Block_height: MOONBEAM_Block_height;
  MOONBEAM_Bundle: ResolverTypeWrapper<MOONBEAM_Bundle>;
  MOONBEAM_Bundle_filter: MOONBEAM_Bundle_filter;
  MOONBEAM_Bundle_orderBy: MOONBEAM_Bundle_orderBy;
  MOONBEAM_Burn: ResolverTypeWrapper<MOONBEAM_Burn>;
  MOONBEAM_Burn_filter: MOONBEAM_Burn_filter;
  MOONBEAM_Burn_orderBy: MOONBEAM_Burn_orderBy;
  MOONBEAM_Bytes: ResolverTypeWrapper<Scalars['MOONBEAM_Bytes']>;
  MOONBEAM_DayData: ResolverTypeWrapper<MOONBEAM_DayData>;
  MOONBEAM_DayData_filter: MOONBEAM_DayData_filter;
  MOONBEAM_DayData_orderBy: MOONBEAM_DayData_orderBy;
  MOONBEAM_Factory_filter: MOONBEAM_Factory_filter;
  MOONBEAM_Factory_orderBy: MOONBEAM_Factory_orderBy;
  MOONBEAM_HourData: ResolverTypeWrapper<MOONBEAM_HourData>;
  MOONBEAM_HourData_filter: MOONBEAM_HourData_filter;
  MOONBEAM_HourData_orderBy: MOONBEAM_HourData_orderBy;
  MOONBEAM_LiquidityPosition: ResolverTypeWrapper<MOONBEAM_LiquidityPosition>;
  MOONBEAM_LiquidityPositionSnapshot: ResolverTypeWrapper<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_LiquidityPositionSnapshot_filter: MOONBEAM_LiquidityPositionSnapshot_filter;
  MOONBEAM_LiquidityPositionSnapshot_orderBy: MOONBEAM_LiquidityPositionSnapshot_orderBy;
  MOONBEAM_LiquidityPosition_filter: MOONBEAM_LiquidityPosition_filter;
  MOONBEAM_LiquidityPosition_orderBy: MOONBEAM_LiquidityPosition_orderBy;
  MOONBEAM_Mint: ResolverTypeWrapper<MOONBEAM_Mint>;
  MOONBEAM_Mint_filter: MOONBEAM_Mint_filter;
  MOONBEAM_Mint_orderBy: MOONBEAM_Mint_orderBy;
  MOONBEAM_OrderDirection: MOONBEAM_OrderDirection;
  MOONBEAM_Pair: ResolverTypeWrapper<MOONBEAM_Pair>;
  MOONBEAM_PairDayData: ResolverTypeWrapper<MOONBEAM_PairDayData>;
  MOONBEAM_PairDayData_filter: MOONBEAM_PairDayData_filter;
  MOONBEAM_PairDayData_orderBy: MOONBEAM_PairDayData_orderBy;
  MOONBEAM_PairHourData: ResolverTypeWrapper<MOONBEAM_PairHourData>;
  MOONBEAM_PairHourData_filter: MOONBEAM_PairHourData_filter;
  MOONBEAM_PairHourData_orderBy: MOONBEAM_PairHourData_orderBy;
  MOONBEAM_Pair_filter: MOONBEAM_Pair_filter;
  MOONBEAM_Pair_orderBy: MOONBEAM_Pair_orderBy;
  MOONBEAM_Swap: ResolverTypeWrapper<MOONBEAM_Swap>;
  MOONBEAM_Swap_filter: MOONBEAM_Swap_filter;
  MOONBEAM_Swap_orderBy: MOONBEAM_Swap_orderBy;
  MOONBEAM_Token: ResolverTypeWrapper<MOONBEAM_Token>;
  MOONBEAM_TokenDayData: ResolverTypeWrapper<MOONBEAM_TokenDayData>;
  MOONBEAM_TokenDayData_filter: MOONBEAM_TokenDayData_filter;
  MOONBEAM_TokenDayData_orderBy: MOONBEAM_TokenDayData_orderBy;
  MOONBEAM_TokenHourData: ResolverTypeWrapper<MOONBEAM_TokenHourData>;
  MOONBEAM_TokenHourData_filter: MOONBEAM_TokenHourData_filter;
  MOONBEAM_TokenHourData_orderBy: MOONBEAM_TokenHourData_orderBy;
  MOONBEAM_Token_filter: MOONBEAM_Token_filter;
  MOONBEAM_Token_orderBy: MOONBEAM_Token_orderBy;
  MOONBEAM_Transaction: ResolverTypeWrapper<MOONBEAM_Transaction>;
  MOONBEAM_Transaction_filter: MOONBEAM_Transaction_filter;
  MOONBEAM_Transaction_orderBy: MOONBEAM_Transaction_orderBy;
  MOONBEAM_User: ResolverTypeWrapper<MOONBEAM_User>;
  MOONBEAM_User_filter: MOONBEAM_User_filter;
  MOONBEAM_User_orderBy: MOONBEAM_User_orderBy;
  MOONBEAM__Block_: ResolverTypeWrapper<MOONBEAM__Block_>;
  MOONBEAM__Meta_: ResolverTypeWrapper<MOONBEAM__Meta_>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Subscription: {};
  ETHEREUM_BigDecimal: Scalars['ETHEREUM_BigDecimal'];
  BigInt: Scalars['BigInt'];
  ETHEREUM_Block_height: ETHEREUM_Block_height;
  Boolean: Scalars['Boolean'];
  ETHEREUM_Bundle: ETHEREUM_Bundle;
  ETHEREUM_Bundle_filter: ETHEREUM_Bundle_filter;
  ETHEREUM_Burn: ETHEREUM_Burn;
  ETHEREUM_Burn_filter: ETHEREUM_Burn_filter;
  ETHEREUM_Bytes: Scalars['ETHEREUM_Bytes'];
  ETHEREUM_DayData: ETHEREUM_DayData;
  ETHEREUM_DayData_filter: ETHEREUM_DayData_filter;
  Factory: Factory;
  ETHEREUM_Factory_filter: ETHEREUM_Factory_filter;
  Float: Scalars['Float'];
  ETHEREUM_HourData: ETHEREUM_HourData;
  ETHEREUM_HourData_filter: ETHEREUM_HourData_filter;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  ETHEREUM_LiquidityPosition: ETHEREUM_LiquidityPosition;
  ETHEREUM_LiquidityPositionSnapshot: ETHEREUM_LiquidityPositionSnapshot;
  ETHEREUM_LiquidityPositionSnapshot_filter: ETHEREUM_LiquidityPositionSnapshot_filter;
  ETHEREUM_LiquidityPosition_filter: ETHEREUM_LiquidityPosition_filter;
  ETHEREUM_Mint: ETHEREUM_Mint;
  ETHEREUM_Mint_filter: ETHEREUM_Mint_filter;
  ETHEREUM_Pair: ETHEREUM_Pair;
  ETHEREUM_PairDayData: ETHEREUM_PairDayData;
  ETHEREUM_PairDayData_filter: ETHEREUM_PairDayData_filter;
  ETHEREUM_PairHourData: ETHEREUM_PairHourData;
  ETHEREUM_PairHourData_filter: ETHEREUM_PairHourData_filter;
  ETHEREUM_Pair_filter: ETHEREUM_Pair_filter;
  String: Scalars['String'];
  ETHEREUM_Swap: ETHEREUM_Swap;
  ETHEREUM_Swap_filter: ETHEREUM_Swap_filter;
  ETHEREUM_Token: ETHEREUM_Token;
  ETHEREUM_TokenDayData: ETHEREUM_TokenDayData;
  ETHEREUM_TokenDayData_filter: ETHEREUM_TokenDayData_filter;
  ETHEREUM_TokenHourData: ETHEREUM_TokenHourData;
  ETHEREUM_TokenHourData_filter: ETHEREUM_TokenHourData_filter;
  ETHEREUM_Token_filter: ETHEREUM_Token_filter;
  ETHEREUM_Transaction: ETHEREUM_Transaction;
  ETHEREUM_Transaction_filter: ETHEREUM_Transaction_filter;
  ETHEREUM_User: ETHEREUM_User;
  ETHEREUM_User_filter: ETHEREUM_User_filter;
  ETHEREUM__Block_: ETHEREUM__Block_;
  ETHEREUM__Meta_: ETHEREUM__Meta_;
  MOONBEAM_BigDecimal: Scalars['MOONBEAM_BigDecimal'];
  MOONBEAM_Block_height: MOONBEAM_Block_height;
  MOONBEAM_Bundle: MOONBEAM_Bundle;
  MOONBEAM_Bundle_filter: MOONBEAM_Bundle_filter;
  MOONBEAM_Burn: MOONBEAM_Burn;
  MOONBEAM_Burn_filter: MOONBEAM_Burn_filter;
  MOONBEAM_Bytes: Scalars['MOONBEAM_Bytes'];
  MOONBEAM_DayData: MOONBEAM_DayData;
  MOONBEAM_DayData_filter: MOONBEAM_DayData_filter;
  MOONBEAM_Factory_filter: MOONBEAM_Factory_filter;
  MOONBEAM_HourData: MOONBEAM_HourData;
  MOONBEAM_HourData_filter: MOONBEAM_HourData_filter;
  MOONBEAM_LiquidityPosition: MOONBEAM_LiquidityPosition;
  MOONBEAM_LiquidityPositionSnapshot: MOONBEAM_LiquidityPositionSnapshot;
  MOONBEAM_LiquidityPositionSnapshot_filter: MOONBEAM_LiquidityPositionSnapshot_filter;
  MOONBEAM_LiquidityPosition_filter: MOONBEAM_LiquidityPosition_filter;
  MOONBEAM_Mint: MOONBEAM_Mint;
  MOONBEAM_Mint_filter: MOONBEAM_Mint_filter;
  MOONBEAM_Pair: MOONBEAM_Pair;
  MOONBEAM_PairDayData: MOONBEAM_PairDayData;
  MOONBEAM_PairDayData_filter: MOONBEAM_PairDayData_filter;
  MOONBEAM_PairHourData: MOONBEAM_PairHourData;
  MOONBEAM_PairHourData_filter: MOONBEAM_PairHourData_filter;
  MOONBEAM_Pair_filter: MOONBEAM_Pair_filter;
  MOONBEAM_Swap: MOONBEAM_Swap;
  MOONBEAM_Swap_filter: MOONBEAM_Swap_filter;
  MOONBEAM_Token: MOONBEAM_Token;
  MOONBEAM_TokenDayData: MOONBEAM_TokenDayData;
  MOONBEAM_TokenDayData_filter: MOONBEAM_TokenDayData_filter;
  MOONBEAM_TokenHourData: MOONBEAM_TokenHourData;
  MOONBEAM_TokenHourData_filter: MOONBEAM_TokenHourData_filter;
  MOONBEAM_Token_filter: MOONBEAM_Token_filter;
  MOONBEAM_Transaction: MOONBEAM_Transaction;
  MOONBEAM_Transaction_filter: MOONBEAM_Transaction_filter;
  MOONBEAM_User: MOONBEAM_User;
  MOONBEAM_User_filter: MOONBEAM_User_filter;
  MOONBEAM__Block_: MOONBEAM__Block_;
  MOONBEAM__Meta_: MOONBEAM__Meta_;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  ETHEREUM_user?: Resolver<Maybe<ResolversTypes['ETHEREUM_User']>, ParentType, ContextType, RequireFields<QueryETHEREUM_userArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_users?: Resolver<Array<ResolversTypes['ETHEREUM_User']>, ParentType, ContextType, RequireFields<QueryETHEREUM_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_bundle?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bundle']>, ParentType, ContextType, RequireFields<QueryETHEREUM_bundleArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_bundles?: Resolver<Array<ResolversTypes['ETHEREUM_Bundle']>, ParentType, ContextType, RequireFields<QueryETHEREUM_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_factory?: Resolver<Maybe<ResolversTypes['Factory']>, ParentType, ContextType, RequireFields<QueryETHEREUM_factoryArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_factories?: Resolver<Array<ResolversTypes['Factory']>, ParentType, ContextType, RequireFields<QueryETHEREUM_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
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
  MOONBEAM_user?: Resolver<Maybe<ResolversTypes['MOONBEAM_User']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_userArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_users?: Resolver<Array<ResolversTypes['MOONBEAM_User']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_bundle?: Resolver<Maybe<ResolversTypes['MOONBEAM_Bundle']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_bundleArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_bundles?: Resolver<Array<ResolversTypes['MOONBEAM_Bundle']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_factory?: Resolver<Maybe<ResolversTypes['Factory']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_factoryArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_factories?: Resolver<Array<ResolversTypes['Factory']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_hourData?: Resolver<Maybe<ResolversTypes['MOONBEAM_HourData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_hourDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_hourDatas?: Resolver<Array<ResolversTypes['MOONBEAM_HourData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_hourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_dayData?: Resolver<Maybe<ResolversTypes['MOONBEAM_DayData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_dayDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_dayDatas?: Resolver<Array<ResolversTypes['MOONBEAM_DayData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_dayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_token?: Resolver<Maybe<ResolversTypes['MOONBEAM_Token']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_tokenArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_tokens?: Resolver<Array<ResolversTypes['MOONBEAM_Token']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_tokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_tokenHourData?: Resolver<Maybe<ResolversTypes['MOONBEAM_TokenHourData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_tokenHourDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_tokenHourDatas?: Resolver<Array<ResolversTypes['MOONBEAM_TokenHourData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_tokenHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_tokenDayData?: Resolver<Maybe<ResolversTypes['MOONBEAM_TokenDayData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_tokenDayDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_tokenDayDatas?: Resolver<Array<ResolversTypes['MOONBEAM_TokenDayData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_tokenDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_pair?: Resolver<Maybe<ResolversTypes['MOONBEAM_Pair']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_pairArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_pairs?: Resolver<Array<ResolversTypes['MOONBEAM_Pair']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_pairsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_pairHourData?: Resolver<Maybe<ResolversTypes['MOONBEAM_PairHourData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_pairHourDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_pairHourDatas?: Resolver<Array<ResolversTypes['MOONBEAM_PairHourData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_pairHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_pairDayData?: Resolver<Maybe<ResolversTypes['MOONBEAM_PairDayData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_pairDayDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_pairDayDatas?: Resolver<Array<ResolversTypes['MOONBEAM_PairDayData']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_pairDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_liquidityPosition?: Resolver<Maybe<ResolversTypes['MOONBEAM_LiquidityPosition']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_liquidityPositionArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_liquidityPositions?: Resolver<Array<ResolversTypes['MOONBEAM_LiquidityPosition']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_liquidityPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_liquidityPositionSnapshot?: Resolver<Maybe<ResolversTypes['MOONBEAM_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_liquidityPositionSnapshotArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_liquidityPositionSnapshots?: Resolver<Array<ResolversTypes['MOONBEAM_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_liquidityPositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_transaction?: Resolver<Maybe<ResolversTypes['MOONBEAM_Transaction']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_transactionArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_transactions?: Resolver<Array<ResolversTypes['MOONBEAM_Transaction']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_transactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_mint?: Resolver<Maybe<ResolversTypes['MOONBEAM_Mint']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_mintArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_mints?: Resolver<Array<ResolversTypes['MOONBEAM_Mint']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_mintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_burn?: Resolver<Maybe<ResolversTypes['MOONBEAM_Burn']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_burnArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_burns?: Resolver<Array<ResolversTypes['MOONBEAM_Burn']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_burnsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_swap?: Resolver<Maybe<ResolversTypes['MOONBEAM_Swap']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_swapArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_swaps?: Resolver<Array<ResolversTypes['MOONBEAM_Swap']>, ParentType, ContextType, RequireFields<QueryMOONBEAM_swapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM__meta?: Resolver<Maybe<ResolversTypes['MOONBEAM__Meta_']>, ParentType, ContextType, Partial<QueryMOONBEAM__metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  ETHEREUM_user?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_User']>, "ETHEREUM_user", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_userArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_users?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_User']>, "ETHEREUM_users", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_bundle?: SubscriptionResolver<Maybe<ResolversTypes['ETHEREUM_Bundle']>, "ETHEREUM_bundle", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_bundleArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_bundles?: SubscriptionResolver<Array<ResolversTypes['ETHEREUM_Bundle']>, "ETHEREUM_bundles", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  ETHEREUM_factory?: SubscriptionResolver<Maybe<ResolversTypes['Factory']>, "ETHEREUM_factory", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_factoryArgs, 'id' | 'subgraphError'>>;
  ETHEREUM_factories?: SubscriptionResolver<Array<ResolversTypes['Factory']>, "ETHEREUM_factories", ParentType, ContextType, RequireFields<SubscriptionETHEREUM_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
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
  MOONBEAM_user?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_User']>, "MOONBEAM_user", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_userArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_users?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_User']>, "MOONBEAM_users", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_bundle?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_Bundle']>, "MOONBEAM_bundle", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_bundleArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_bundles?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_Bundle']>, "MOONBEAM_bundles", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_bundlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_factory?: SubscriptionResolver<Maybe<ResolversTypes['Factory']>, "MOONBEAM_factory", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_factoryArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_factories?: SubscriptionResolver<Array<ResolversTypes['Factory']>, "MOONBEAM_factories", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_factoriesArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_hourData?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_HourData']>, "MOONBEAM_hourData", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_hourDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_hourDatas?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_HourData']>, "MOONBEAM_hourDatas", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_hourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_dayData?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_DayData']>, "MOONBEAM_dayData", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_dayDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_dayDatas?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_DayData']>, "MOONBEAM_dayDatas", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_dayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_token?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_Token']>, "MOONBEAM_token", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_tokenArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_tokens?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_Token']>, "MOONBEAM_tokens", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_tokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_tokenHourData?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_TokenHourData']>, "MOONBEAM_tokenHourData", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_tokenHourDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_tokenHourDatas?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_TokenHourData']>, "MOONBEAM_tokenHourDatas", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_tokenHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_tokenDayData?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_TokenDayData']>, "MOONBEAM_tokenDayData", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_tokenDayDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_tokenDayDatas?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_TokenDayData']>, "MOONBEAM_tokenDayDatas", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_tokenDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_pair?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_Pair']>, "MOONBEAM_pair", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_pairArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_pairs?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_Pair']>, "MOONBEAM_pairs", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_pairsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_pairHourData?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_PairHourData']>, "MOONBEAM_pairHourData", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_pairHourDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_pairHourDatas?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_PairHourData']>, "MOONBEAM_pairHourDatas", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_pairHourDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_pairDayData?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_PairDayData']>, "MOONBEAM_pairDayData", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_pairDayDataArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_pairDayDatas?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_PairDayData']>, "MOONBEAM_pairDayDatas", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_pairDayDatasArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_liquidityPosition?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_LiquidityPosition']>, "MOONBEAM_liquidityPosition", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_liquidityPositionArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_liquidityPositions?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_LiquidityPosition']>, "MOONBEAM_liquidityPositions", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_liquidityPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_liquidityPositionSnapshot?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_LiquidityPositionSnapshot']>, "MOONBEAM_liquidityPositionSnapshot", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_liquidityPositionSnapshotArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_liquidityPositionSnapshots?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_LiquidityPositionSnapshot']>, "MOONBEAM_liquidityPositionSnapshots", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_liquidityPositionSnapshotsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_transaction?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_Transaction']>, "MOONBEAM_transaction", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_transactionArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_transactions?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_Transaction']>, "MOONBEAM_transactions", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_transactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_mint?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_Mint']>, "MOONBEAM_mint", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_mintArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_mints?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_Mint']>, "MOONBEAM_mints", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_mintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_burn?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_Burn']>, "MOONBEAM_burn", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_burnArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_burns?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_Burn']>, "MOONBEAM_burns", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_burnsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM_swap?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM_Swap']>, "MOONBEAM_swap", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_swapArgs, 'id' | 'subgraphError'>>;
  MOONBEAM_swaps?: SubscriptionResolver<Array<ResolversTypes['MOONBEAM_Swap']>, "MOONBEAM_swaps", ParentType, ContextType, RequireFields<SubscriptionMOONBEAM_swapsArgs, 'skip' | 'first' | 'subgraphError'>>;
  MOONBEAM__meta?: SubscriptionResolver<Maybe<ResolversTypes['MOONBEAM__Meta_']>, "MOONBEAM__meta", ParentType, ContextType, Partial<SubscriptionMOONBEAM__metaArgs>>;
}>;

export interface ETHEREUM_BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ETHEREUM_BigDecimal'], any> {
  name: 'ETHEREUM_BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type ETHEREUM_BundleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Bundle'] = ResolversParentTypes['ETHEREUM_Bundle']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ethPrice?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
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

export interface ETHEREUM_BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ETHEREUM_Bytes'], any> {
  name: 'ETHEREUM_Bytes';
}

export type ETHEREUM_DayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_DayData'] = ResolversParentTypes['ETHEREUM_DayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FactoryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Factory'] = ResolversParentTypes['Factory']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pairCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokenCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pairs?: Resolver<Array<ResolversTypes['MOONBEAM_Pair']>, ParentType, ContextType, RequireFields<FactorypairsArgs, 'skip' | 'first'>>;
  tokens?: Resolver<Array<ResolversTypes['MOONBEAM_Token']>, ParentType, ContextType, RequireFields<FactorytokensArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['MOONBEAM_HourData']>, ParentType, ContextType, RequireFields<FactoryhourDataArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['MOONBEAM_DayData']>, ParentType, ContextType, RequireFields<FactorydayDataArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_HourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_HourData'] = ResolversParentTypes['ETHEREUM_HourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['ETHEREUM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

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

export type ETHEREUM_PairResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Pair'] = ResolversParentTypes['ETHEREUM_Pair']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
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

export type ETHEREUM_TokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Token'] = ResolversParentTypes['ETHEREUM_Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
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

export type ETHEREUM_TransactionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_Transaction'] = ResolversParentTypes['ETHEREUM_Transaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mints?: Resolver<Array<Maybe<ResolversTypes['ETHEREUM_Mint']>>, ParentType, ContextType, RequireFields<ETHEREUM_TransactionmintsArgs, 'skip' | 'first'>>;
  burns?: Resolver<Array<Maybe<ResolversTypes['ETHEREUM_Burn']>>, ParentType, ContextType, RequireFields<ETHEREUM_TransactionburnsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<Maybe<ResolversTypes['ETHEREUM_Swap']>>, ParentType, ContextType, RequireFields<ETHEREUM_TransactionswapsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM_UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM_User'] = ResolversParentTypes['ETHEREUM_User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityPositions?: Resolver<Array<ResolversTypes['ETHEREUM_LiquidityPosition']>, ParentType, ContextType, RequireFields<ETHEREUM_UserliquidityPositionsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM__Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM__Block_'] = ResolversParentTypes['ETHEREUM__Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['ETHEREUM_Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ETHEREUM__Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ETHEREUM__Meta_'] = ResolversParentTypes['ETHEREUM__Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['ETHEREUM__Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface MOONBEAM_BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MOONBEAM_BigDecimal'], any> {
  name: 'MOONBEAM_BigDecimal';
}

export type MOONBEAM_BundleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_Bundle'] = ResolversParentTypes['MOONBEAM_Bundle']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ethPrice?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_BurnResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_Burn'] = ResolversParentTypes['MOONBEAM_Burn']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['MOONBEAM_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MOONBEAM_Pair'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['MOONBEAM_Bytes']>, ParentType, ContextType>;
  amount0?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  amount1?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  to?: Resolver<Maybe<ResolversTypes['MOONBEAM_Bytes']>, ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  feeTo?: Resolver<Maybe<ResolversTypes['MOONBEAM_Bytes']>, ParentType, ContextType>;
  feeLiquidity?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface MOONBEAM_BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MOONBEAM_Bytes'], any> {
  name: 'MOONBEAM_Bytes';
}

export type MOONBEAM_DayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_DayData'] = ResolversParentTypes['MOONBEAM_DayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_HourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_HourData'] = ResolversParentTypes['MOONBEAM_HourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  untrackedVolume?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_LiquidityPositionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_LiquidityPosition'] = ResolversParentTypes['MOONBEAM_LiquidityPosition']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['MOONBEAM_User'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MOONBEAM_Pair'], ParentType, ContextType>;
  liquidityTokenBalance?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  snapshots?: Resolver<Array<Maybe<ResolversTypes['MOONBEAM_LiquidityPositionSnapshot']>>, ParentType, ContextType, RequireFields<MOONBEAM_LiquidityPositionsnapshotsArgs, 'skip' | 'first'>>;
  block?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_LiquidityPositionSnapshotResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_LiquidityPositionSnapshot'] = ResolversParentTypes['MOONBEAM_LiquidityPositionSnapshot']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityPosition?: Resolver<ResolversTypes['MOONBEAM_LiquidityPosition'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['MOONBEAM_User'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MOONBEAM_Pair'], ParentType, ContextType>;
  token0PriceUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  token1PriceUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityTokenTotalSupply?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityTokenBalance?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_MintResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_Mint'] = ResolversParentTypes['MOONBEAM_Mint']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['MOONBEAM_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MOONBEAM_Pair'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['MOONBEAM_Bytes'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['MOONBEAM_Bytes']>, ParentType, ContextType>;
  amount0?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  amount1?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  feeTo?: Resolver<Maybe<ResolversTypes['MOONBEAM_Bytes']>, ParentType, ContextType>;
  feeLiquidity?: Resolver<Maybe<ResolversTypes['MOONBEAM_BigDecimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_PairResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_Pair'] = ResolversParentTypes['MOONBEAM_Pair']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['MOONBEAM_Token'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['MOONBEAM_Token'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserveETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  trackedReserveETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  token0Price?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  token1Price?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityProviderCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidityPositions?: Resolver<Array<ResolversTypes['MOONBEAM_LiquidityPosition']>, ParentType, ContextType, RequireFields<MOONBEAM_PairliquidityPositionsArgs, 'skip' | 'first'>>;
  liquidityPositionSnapshots?: Resolver<Array<ResolversTypes['MOONBEAM_LiquidityPositionSnapshot']>, ParentType, ContextType, RequireFields<MOONBEAM_PairliquidityPositionSnapshotsArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['MOONBEAM_PairDayData']>, ParentType, ContextType, RequireFields<MOONBEAM_PairdayDataArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['MOONBEAM_PairHourData']>, ParentType, ContextType, RequireFields<MOONBEAM_PairhourDataArgs, 'skip' | 'first'>>;
  mints?: Resolver<Array<ResolversTypes['MOONBEAM_Mint']>, ParentType, ContextType, RequireFields<MOONBEAM_PairmintsArgs, 'skip' | 'first'>>;
  burns?: Resolver<Array<ResolversTypes['MOONBEAM_Burn']>, ParentType, ContextType, RequireFields<MOONBEAM_PairburnsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<ResolversTypes['MOONBEAM_Swap']>, ParentType, ContextType, RequireFields<MOONBEAM_PairswapsArgs, 'skip' | 'first'>>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_PairDayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_PairDayData'] = ResolversParentTypes['MOONBEAM_PairDayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MOONBEAM_Pair'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['MOONBEAM_Token'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['MOONBEAM_Token'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_PairHourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_PairHourData'] = ResolversParentTypes['MOONBEAM_PairHourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MOONBEAM_Pair'], ParentType, ContextType>;
  reserve0?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserve1?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  reserveUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeToken0?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeToken1?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_SwapResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_Swap'] = ResolversParentTypes['MOONBEAM_Swap']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['MOONBEAM_Transaction'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  pair?: Resolver<ResolversTypes['MOONBEAM_Pair'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['MOONBEAM_Bytes'], ParentType, ContextType>;
  amount0In?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  amount1In?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  amount0Out?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  amount1Out?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['MOONBEAM_Bytes'], ParentType, ContextType>;
  logIndex?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  amountUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_TokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_Token'] = ResolversParentTypes['MOONBEAM_Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  factory?: Resolver<ResolversTypes['Factory'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  untrackedVolumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  derivedETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  whitelistPairs?: Resolver<Array<ResolversTypes['MOONBEAM_Pair']>, ParentType, ContextType, RequireFields<MOONBEAM_TokenwhitelistPairsArgs, 'skip' | 'first'>>;
  hourData?: Resolver<Array<ResolversTypes['MOONBEAM_TokenHourData']>, ParentType, ContextType, RequireFields<MOONBEAM_TokenhourDataArgs, 'skip' | 'first'>>;
  dayData?: Resolver<Array<ResolversTypes['MOONBEAM_TokenDayData']>, ParentType, ContextType, RequireFields<MOONBEAM_TokendayDataArgs, 'skip' | 'first'>>;
  basePairs?: Resolver<Array<ResolversTypes['MOONBEAM_Pair']>, ParentType, ContextType, RequireFields<MOONBEAM_TokenbasePairsArgs, 'skip' | 'first'>>;
  quotePairs?: Resolver<Array<ResolversTypes['MOONBEAM_Pair']>, ParentType, ContextType, RequireFields<MOONBEAM_TokenquotePairsArgs, 'skip' | 'first'>>;
  basePairsDayData?: Resolver<Array<ResolversTypes['MOONBEAM_PairDayData']>, ParentType, ContextType, RequireFields<MOONBEAM_TokenbasePairsDayDataArgs, 'skip' | 'first'>>;
  quotePairsDayData?: Resolver<Array<ResolversTypes['MOONBEAM_PairDayData']>, ParentType, ContextType, RequireFields<MOONBEAM_TokenquotePairsDayDataArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_TokenDayDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_TokenDayData'] = ResolversParentTypes['MOONBEAM_TokenDayData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['MOONBEAM_Token'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  priceUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_TokenHourDataResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_TokenHourData'] = ResolversParentTypes['MOONBEAM_TokenHourData']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['MOONBEAM_Token'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  volumeUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  txCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  liquidity?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityETH?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  liquidityUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  priceUSD?: Resolver<ResolversTypes['MOONBEAM_BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_TransactionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_Transaction'] = ResolversParentTypes['MOONBEAM_Transaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mints?: Resolver<Array<Maybe<ResolversTypes['MOONBEAM_Mint']>>, ParentType, ContextType, RequireFields<MOONBEAM_TransactionmintsArgs, 'skip' | 'first'>>;
  burns?: Resolver<Array<Maybe<ResolversTypes['MOONBEAM_Burn']>>, ParentType, ContextType, RequireFields<MOONBEAM_TransactionburnsArgs, 'skip' | 'first'>>;
  swaps?: Resolver<Array<Maybe<ResolversTypes['MOONBEAM_Swap']>>, ParentType, ContextType, RequireFields<MOONBEAM_TransactionswapsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM_UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM_User'] = ResolversParentTypes['MOONBEAM_User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityPositions?: Resolver<Array<ResolversTypes['MOONBEAM_LiquidityPosition']>, ParentType, ContextType, RequireFields<MOONBEAM_UserliquidityPositionsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM__Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM__Block_'] = ResolversParentTypes['MOONBEAM__Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['MOONBEAM_Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MOONBEAM__Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MOONBEAM__Meta_'] = ResolversParentTypes['MOONBEAM__Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['MOONBEAM__Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  ETHEREUM_BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  ETHEREUM_Bundle?: ETHEREUM_BundleResolvers<ContextType>;
  ETHEREUM_Burn?: ETHEREUM_BurnResolvers<ContextType>;
  ETHEREUM_Bytes?: GraphQLScalarType;
  ETHEREUM_DayData?: ETHEREUM_DayDataResolvers<ContextType>;
  Factory?: FactoryResolvers<ContextType>;
  ETHEREUM_HourData?: ETHEREUM_HourDataResolvers<ContextType>;
  ETHEREUM_LiquidityPosition?: ETHEREUM_LiquidityPositionResolvers<ContextType>;
  ETHEREUM_LiquidityPositionSnapshot?: ETHEREUM_LiquidityPositionSnapshotResolvers<ContextType>;
  ETHEREUM_Mint?: ETHEREUM_MintResolvers<ContextType>;
  ETHEREUM_Pair?: ETHEREUM_PairResolvers<ContextType>;
  ETHEREUM_PairDayData?: ETHEREUM_PairDayDataResolvers<ContextType>;
  ETHEREUM_PairHourData?: ETHEREUM_PairHourDataResolvers<ContextType>;
  ETHEREUM_Swap?: ETHEREUM_SwapResolvers<ContextType>;
  ETHEREUM_Token?: ETHEREUM_TokenResolvers<ContextType>;
  ETHEREUM_TokenDayData?: ETHEREUM_TokenDayDataResolvers<ContextType>;
  ETHEREUM_TokenHourData?: ETHEREUM_TokenHourDataResolvers<ContextType>;
  ETHEREUM_Transaction?: ETHEREUM_TransactionResolvers<ContextType>;
  ETHEREUM_User?: ETHEREUM_UserResolvers<ContextType>;
  ETHEREUM__Block_?: ETHEREUM__Block_Resolvers<ContextType>;
  ETHEREUM__Meta_?: ETHEREUM__Meta_Resolvers<ContextType>;
  MOONBEAM_BigDecimal?: GraphQLScalarType;
  MOONBEAM_Bundle?: MOONBEAM_BundleResolvers<ContextType>;
  MOONBEAM_Burn?: MOONBEAM_BurnResolvers<ContextType>;
  MOONBEAM_Bytes?: GraphQLScalarType;
  MOONBEAM_DayData?: MOONBEAM_DayDataResolvers<ContextType>;
  MOONBEAM_HourData?: MOONBEAM_HourDataResolvers<ContextType>;
  MOONBEAM_LiquidityPosition?: MOONBEAM_LiquidityPositionResolvers<ContextType>;
  MOONBEAM_LiquidityPositionSnapshot?: MOONBEAM_LiquidityPositionSnapshotResolvers<ContextType>;
  MOONBEAM_Mint?: MOONBEAM_MintResolvers<ContextType>;
  MOONBEAM_Pair?: MOONBEAM_PairResolvers<ContextType>;
  MOONBEAM_PairDayData?: MOONBEAM_PairDayDataResolvers<ContextType>;
  MOONBEAM_PairHourData?: MOONBEAM_PairHourDataResolvers<ContextType>;
  MOONBEAM_Swap?: MOONBEAM_SwapResolvers<ContextType>;
  MOONBEAM_Token?: MOONBEAM_TokenResolvers<ContextType>;
  MOONBEAM_TokenDayData?: MOONBEAM_TokenDayDataResolvers<ContextType>;
  MOONBEAM_TokenHourData?: MOONBEAM_TokenHourDataResolvers<ContextType>;
  MOONBEAM_Transaction?: MOONBEAM_TransactionResolvers<ContextType>;
  MOONBEAM_User?: MOONBEAM_UserResolvers<ContextType>;
  MOONBEAM__Block_?: MOONBEAM__Block_Resolvers<ContextType>;
  MOONBEAM__Meta_?: MOONBEAM__Meta_Resolvers<ContextType>;
}>;


import { MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';

import { InContextSdkMethod } from '@graphql-mesh/types';


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
  ETHEREUM_BigDecimal: any;
  BigInt: any;
  ETHEREUM_Bytes: any;
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

export type ETHEREUM_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['ETHEREUM_BigDecimal'];
};

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

export type ETHEREUM_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type ETHEREUM_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type Factory = {
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


export type FactorypairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Pair_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Pair_filter>;
};


export type FactorytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_Token_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_Token_filter>;
};


export type FactoryhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_HourData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_HourData_filter>;
};


export type FactorydayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ETHEREUM_DayData_orderBy>;
  orderDirection?: InputMaybe<ETHEREUM_OrderDirection>;
  where?: InputMaybe<ETHEREUM_DayData_filter>;
};

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

export type ETHEREUM_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['ETHEREUM_BigDecimal'];
  volumeUSD: Scalars['ETHEREUM_BigDecimal'];
  untrackedVolume: Scalars['ETHEREUM_BigDecimal'];
  liquidityETH: Scalars['ETHEREUM_BigDecimal'];
  liquidityUSD: Scalars['ETHEREUM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
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
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type ETHEREUM_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

/** Defines the order direction, either ascending or descending */
export type ETHEREUM_OrderDirection =
  | 'asc'
  | 'desc';

export type ETHEREUM_Pair = {
  id: Scalars['ID'];
  factory: Factory;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type Query = {
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<Factory>;
  ETHEREUM_factories: Array<Factory>;
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

export type Subscription = {
  ETHEREUM_user?: Maybe<ETHEREUM_User>;
  ETHEREUM_users: Array<ETHEREUM_User>;
  ETHEREUM_bundle?: Maybe<ETHEREUM_Bundle>;
  ETHEREUM_bundles: Array<ETHEREUM_Bundle>;
  ETHEREUM_factory?: Maybe<Factory>;
  ETHEREUM_factories: Array<Factory>;
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
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

export type ETHEREUM_Token = {
  id: Scalars['ID'];
  factory: Factory;
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
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
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export type ETHEREUM_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

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

export type ETHEREUM_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type ETHEREUM__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['ETHEREUM_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
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

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

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


    export namespace MoonbeamExchangeTypes {
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
  MOONBEAM_BigDecimal: any;
  BigInt: any;
  MOONBEAM_Bytes: any;
};

/** The block at which the query should be executed. */
export type MOONBEAM_Block_height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
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

export type MOONBEAM_Bundle = {
  id: Scalars['ID'];
  ethPrice: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_Bundle_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ethPrice?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  ethPrice_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Bundle_orderBy =
  | 'id'
  | 'ethPrice';

export type MOONBEAM_Burn = {
  id: Scalars['ID'];
  transaction: MOONBEAM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MOONBEAM_Pair;
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  sender?: Maybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  to?: Maybe<Scalars['MOONBEAM_Bytes']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  complete: Scalars['Boolean'];
  feeTo?: Maybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
};

export type MOONBEAM_Burn_filter = {
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  to?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  complete?: InputMaybe<Scalars['Boolean']>;
  complete_not?: InputMaybe<Scalars['Boolean']>;
  complete_in?: InputMaybe<Array<Scalars['Boolean']>>;
  complete_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  feeTo?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Burn_orderBy =
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

export type MOONBEAM_DayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolume: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_DayData_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_DayData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type Factory = {
  id: Scalars['ID'];
  pairCount: Scalars['BigInt'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolumeUSD: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  tokenCount: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
  pairs: Array<MOONBEAM_Pair>;
  tokens: Array<MOONBEAM_Token>;
  hourData: Array<MOONBEAM_HourData>;
  dayData: Array<MOONBEAM_DayData>;
};


export type FactorypairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type FactorytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Token_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Token_filter>;
};


export type FactoryhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_HourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_HourData_filter>;
};


export type FactorydayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_DayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_DayData_filter>;
};

export type MOONBEAM_Factory_filter = {
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
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
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

export type MOONBEAM_Factory_orderBy =
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

export type MOONBEAM_HourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  factory: Factory;
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolume: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_HourData_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_HourData_orderBy =
  | 'id'
  | 'date'
  | 'factory'
  | 'volumeETH'
  | 'volumeUSD'
  | 'untrackedVolume'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount';

export type MOONBEAM_LiquidityPosition = {
  id: Scalars['ID'];
  user: MOONBEAM_User;
  pair: MOONBEAM_Pair;
  liquidityTokenBalance: Scalars['MOONBEAM_BigDecimal'];
  snapshots: Array<Maybe<MOONBEAM_LiquidityPositionSnapshot>>;
  block: Scalars['Int'];
  timestamp: Scalars['Int'];
};


export type MOONBEAM_LiquidityPositionsnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
};

export type MOONBEAM_LiquidityPositionSnapshot = {
  id: Scalars['ID'];
  liquidityPosition: MOONBEAM_LiquidityPosition;
  timestamp: Scalars['Int'];
  block: Scalars['Int'];
  user: MOONBEAM_User;
  pair: MOONBEAM_Pair;
  token0PriceUSD: Scalars['MOONBEAM_BigDecimal'];
  token1PriceUSD: Scalars['MOONBEAM_BigDecimal'];
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  liquidityTokenTotalSupply: Scalars['MOONBEAM_BigDecimal'];
  liquidityTokenBalance: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_LiquidityPositionSnapshot_filter = {
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
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']>;
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  token0PriceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1PriceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_LiquidityPositionSnapshot_orderBy =
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

export type MOONBEAM_LiquidityPosition_filter = {
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
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  pair?: InputMaybe<Scalars['String']>;
  pair_not?: InputMaybe<Scalars['String']>;
  pair_gt?: InputMaybe<Scalars['String']>;
  pair_lt?: InputMaybe<Scalars['String']>;
  pair_gte?: InputMaybe<Scalars['String']>;
  pair_lte?: InputMaybe<Scalars['String']>;
  pair_in?: InputMaybe<Array<Scalars['String']>>;
  pair_not_in?: InputMaybe<Array<Scalars['String']>>;
  pair_contains?: InputMaybe<Scalars['String']>;
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityTokenBalance?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
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

export type MOONBEAM_LiquidityPosition_orderBy =
  | 'id'
  | 'user'
  | 'pair'
  | 'liquidityTokenBalance'
  | 'snapshots'
  | 'block'
  | 'timestamp';

export type MOONBEAM_Mint = {
  id: Scalars['ID'];
  transaction: MOONBEAM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MOONBEAM_Pair;
  to: Scalars['MOONBEAM_Bytes'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  sender?: Maybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
  feeTo?: Maybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: Maybe<Scalars['MOONBEAM_BigDecimal']>;
};

export type MOONBEAM_Mint_filter = {
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  sender?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  amount0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  feeTo?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  feeTo_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeTo_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  feeLiquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Mint_orderBy =
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

/** Defines the order direction, either ascending or descending */
export type MOONBEAM_OrderDirection =
  | 'asc'
  | 'desc';

export type MOONBEAM_Pair = {
  id: Scalars['ID'];
  factory: Factory;
  name: Scalars['String'];
  token0: MOONBEAM_Token;
  token1: MOONBEAM_Token;
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  totalSupply: Scalars['MOONBEAM_BigDecimal'];
  reserveETH: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  trackedReserveETH: Scalars['MOONBEAM_BigDecimal'];
  token0Price: Scalars['MOONBEAM_BigDecimal'];
  token1Price: Scalars['MOONBEAM_BigDecimal'];
  volumeToken0: Scalars['MOONBEAM_BigDecimal'];
  volumeToken1: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
  liquidityPositionSnapshots: Array<MOONBEAM_LiquidityPositionSnapshot>;
  dayData: Array<MOONBEAM_PairDayData>;
  hourData: Array<MOONBEAM_PairHourData>;
  mints: Array<MOONBEAM_Mint>;
  burns: Array<MOONBEAM_Burn>;
  swaps: Array<MOONBEAM_Swap>;
  timestamp: Scalars['BigInt'];
  block: Scalars['BigInt'];
};


export type MOONBEAM_PairliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
};


export type MOONBEAM_PairliquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
};


export type MOONBEAM_PairdayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
};


export type MOONBEAM_PairhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairHourData_filter>;
};


export type MOONBEAM_PairmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
};


export type MOONBEAM_PairburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
};


export type MOONBEAM_PairswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
};

export type MOONBEAM_PairDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MOONBEAM_Pair;
  token0: MOONBEAM_Token;
  token1: MOONBEAM_Token;
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  totalSupply: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  volumeToken0: Scalars['MOONBEAM_BigDecimal'];
  volumeToken1: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_PairDayData_filter = {
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_PairDayData_orderBy =
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

export type MOONBEAM_PairHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  pair: MOONBEAM_Pair;
  reserve0: Scalars['MOONBEAM_BigDecimal'];
  reserve1: Scalars['MOONBEAM_BigDecimal'];
  reserveUSD: Scalars['MOONBEAM_BigDecimal'];
  volumeToken0: Scalars['MOONBEAM_BigDecimal'];
  volumeToken1: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
};

export type MOONBEAM_PairHourData_filter = {
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type MOONBEAM_PairHourData_orderBy =
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

export type MOONBEAM_Pair_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  reserve0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserve1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserve1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  totalSupply_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  trackedReserveETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token0Price?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token0Price_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token0Price_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1Price?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  token1Price_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  token1Price_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
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

export type MOONBEAM_Pair_orderBy =
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

export type Query = {
  MOONBEAM_user?: Maybe<MOONBEAM_User>;
  MOONBEAM_users: Array<MOONBEAM_User>;
  MOONBEAM_bundle?: Maybe<MOONBEAM_Bundle>;
  MOONBEAM_bundles: Array<MOONBEAM_Bundle>;
  MOONBEAM_factory?: Maybe<Factory>;
  MOONBEAM_factories: Array<Factory>;
  MOONBEAM_hourData?: Maybe<MOONBEAM_HourData>;
  MOONBEAM_hourDatas: Array<MOONBEAM_HourData>;
  MOONBEAM_dayData?: Maybe<MOONBEAM_DayData>;
  MOONBEAM_dayDatas: Array<MOONBEAM_DayData>;
  MOONBEAM_token?: Maybe<MOONBEAM_Token>;
  MOONBEAM_tokens: Array<MOONBEAM_Token>;
  MOONBEAM_tokenHourData?: Maybe<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenHourDatas: Array<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenDayData?: Maybe<MOONBEAM_TokenDayData>;
  MOONBEAM_tokenDayDatas: Array<MOONBEAM_TokenDayData>;
  MOONBEAM_pair?: Maybe<MOONBEAM_Pair>;
  MOONBEAM_pairs: Array<MOONBEAM_Pair>;
  MOONBEAM_pairHourData?: Maybe<MOONBEAM_PairHourData>;
  MOONBEAM_pairHourDatas: Array<MOONBEAM_PairHourData>;
  MOONBEAM_pairDayData?: Maybe<MOONBEAM_PairDayData>;
  MOONBEAM_pairDayDatas: Array<MOONBEAM_PairDayData>;
  MOONBEAM_liquidityPosition?: Maybe<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositionSnapshot?: Maybe<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_liquidityPositionSnapshots: Array<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_transaction?: Maybe<MOONBEAM_Transaction>;
  MOONBEAM_transactions: Array<MOONBEAM_Transaction>;
  MOONBEAM_mint?: Maybe<MOONBEAM_Mint>;
  MOONBEAM_mints: Array<MOONBEAM_Mint>;
  MOONBEAM_burn?: Maybe<MOONBEAM_Burn>;
  MOONBEAM_burns: Array<MOONBEAM_Burn>;
  MOONBEAM_swap?: Maybe<MOONBEAM_Swap>;
  MOONBEAM_swaps: Array<MOONBEAM_Swap>;
  /** Access to subgraph metadata */
  MOONBEAM__meta?: Maybe<MOONBEAM__Meta_>;
};


export type QueryMOONBEAM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_User_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_User_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Bundle_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Bundle_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Factory_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Factory_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_HourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_HourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_DayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_DayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Token_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Token_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Transaction_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Transaction_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMOONBEAM__metaArgs = {
  block?: InputMaybe<MOONBEAM_Block_height>;
};

export type Subscription = {
  MOONBEAM_user?: Maybe<MOONBEAM_User>;
  MOONBEAM_users: Array<MOONBEAM_User>;
  MOONBEAM_bundle?: Maybe<MOONBEAM_Bundle>;
  MOONBEAM_bundles: Array<MOONBEAM_Bundle>;
  MOONBEAM_factory?: Maybe<Factory>;
  MOONBEAM_factories: Array<Factory>;
  MOONBEAM_hourData?: Maybe<MOONBEAM_HourData>;
  MOONBEAM_hourDatas: Array<MOONBEAM_HourData>;
  MOONBEAM_dayData?: Maybe<MOONBEAM_DayData>;
  MOONBEAM_dayDatas: Array<MOONBEAM_DayData>;
  MOONBEAM_token?: Maybe<MOONBEAM_Token>;
  MOONBEAM_tokens: Array<MOONBEAM_Token>;
  MOONBEAM_tokenHourData?: Maybe<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenHourDatas: Array<MOONBEAM_TokenHourData>;
  MOONBEAM_tokenDayData?: Maybe<MOONBEAM_TokenDayData>;
  MOONBEAM_tokenDayDatas: Array<MOONBEAM_TokenDayData>;
  MOONBEAM_pair?: Maybe<MOONBEAM_Pair>;
  MOONBEAM_pairs: Array<MOONBEAM_Pair>;
  MOONBEAM_pairHourData?: Maybe<MOONBEAM_PairHourData>;
  MOONBEAM_pairHourDatas: Array<MOONBEAM_PairHourData>;
  MOONBEAM_pairDayData?: Maybe<MOONBEAM_PairDayData>;
  MOONBEAM_pairDayDatas: Array<MOONBEAM_PairDayData>;
  MOONBEAM_liquidityPosition?: Maybe<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
  MOONBEAM_liquidityPositionSnapshot?: Maybe<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_liquidityPositionSnapshots: Array<MOONBEAM_LiquidityPositionSnapshot>;
  MOONBEAM_transaction?: Maybe<MOONBEAM_Transaction>;
  MOONBEAM_transactions: Array<MOONBEAM_Transaction>;
  MOONBEAM_mint?: Maybe<MOONBEAM_Mint>;
  MOONBEAM_mints: Array<MOONBEAM_Mint>;
  MOONBEAM_burn?: Maybe<MOONBEAM_Burn>;
  MOONBEAM_burns: Array<MOONBEAM_Burn>;
  MOONBEAM_swap?: Maybe<MOONBEAM_Swap>;
  MOONBEAM_swaps: Array<MOONBEAM_Swap>;
  /** Access to subgraph metadata */
  MOONBEAM__meta?: Maybe<MOONBEAM__Meta_>;
};


export type SubscriptionMOONBEAM_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_User_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_User_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_bundleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_bundlesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Bundle_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Bundle_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_factoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_factoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Factory_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Factory_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_hourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_hourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_HourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_HourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_dayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_dayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_DayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_DayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Token_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Token_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_tokenDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairHourDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairHourDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairHourData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairDayDataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_pairDayDatasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionSnapshotArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_liquidityPositionSnapshotsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPositionSnapshot_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_transactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_transactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Transaction_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Transaction_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_mintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_mintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_burnArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_burnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_swapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM_swapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
  block?: InputMaybe<MOONBEAM_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMOONBEAM__metaArgs = {
  block?: InputMaybe<MOONBEAM_Block_height>;
};

export type MOONBEAM_Swap = {
  id: Scalars['ID'];
  transaction: MOONBEAM_Transaction;
  timestamp: Scalars['BigInt'];
  pair: MOONBEAM_Pair;
  sender: Scalars['MOONBEAM_Bytes'];
  amount0In: Scalars['MOONBEAM_BigDecimal'];
  amount1In: Scalars['MOONBEAM_BigDecimal'];
  amount0Out: Scalars['MOONBEAM_BigDecimal'];
  amount1Out: Scalars['MOONBEAM_BigDecimal'];
  to: Scalars['MOONBEAM_Bytes'];
  logIndex?: Maybe<Scalars['BigInt']>;
  amountUSD: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_Swap_filter = {
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
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
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
  pair_not_contains?: InputMaybe<Scalars['String']>;
  pair_starts_with?: InputMaybe<Scalars['String']>;
  pair_not_starts_with?: InputMaybe<Scalars['String']>;
  pair_ends_with?: InputMaybe<Scalars['String']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  sender_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  amount0In?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0In_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0In_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1In?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1In_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1In_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0Out?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount0Out_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1Out?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amount1Out_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  to?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['MOONBEAM_Bytes']>>;
  to_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['MOONBEAM_Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  amountUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_Swap_orderBy =
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

export type MOONBEAM_Token = {
  id: Scalars['ID'];
  factory: Factory;
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  volume: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  untrackedVolumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  derivedETH: Scalars['MOONBEAM_BigDecimal'];
  whitelistPairs: Array<MOONBEAM_Pair>;
  hourData: Array<MOONBEAM_TokenHourData>;
  dayData: Array<MOONBEAM_TokenDayData>;
  basePairs: Array<MOONBEAM_Pair>;
  quotePairs: Array<MOONBEAM_Pair>;
  basePairsDayData: Array<MOONBEAM_PairDayData>;
  quotePairsDayData: Array<MOONBEAM_PairDayData>;
};


export type MOONBEAM_TokenwhitelistPairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type MOONBEAM_TokenhourDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenHourData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenHourData_filter>;
};


export type MOONBEAM_TokendayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_TokenDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_TokenDayData_filter>;
};


export type MOONBEAM_TokenbasePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type MOONBEAM_TokenquotePairsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Pair_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Pair_filter>;
};


export type MOONBEAM_TokenbasePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
};


export type MOONBEAM_TokenquotePairsDayDataArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_PairDayData_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_PairDayData_filter>;
};

export type MOONBEAM_TokenDayData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MOONBEAM_Token;
  volume: Scalars['MOONBEAM_BigDecimal'];
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  priceUSD: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_TokenDayData_filter = {
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  volume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_TokenDayData_orderBy =
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

export type MOONBEAM_TokenHourData = {
  id: Scalars['ID'];
  date: Scalars['Int'];
  token: MOONBEAM_Token;
  volume: Scalars['MOONBEAM_BigDecimal'];
  volumeETH: Scalars['MOONBEAM_BigDecimal'];
  volumeUSD: Scalars['MOONBEAM_BigDecimal'];
  txCount: Scalars['BigInt'];
  liquidity: Scalars['MOONBEAM_BigDecimal'];
  liquidityETH: Scalars['MOONBEAM_BigDecimal'];
  liquidityUSD: Scalars['MOONBEAM_BigDecimal'];
  priceUSD: Scalars['MOONBEAM_BigDecimal'];
};

export type MOONBEAM_TokenHourData_filter = {
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
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  volume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  priceUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
};

export type MOONBEAM_TokenHourData_orderBy =
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

export type MOONBEAM_Token_filter = {
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
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
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
  volume?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volume_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volume_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  liquidity_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  liquidity_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  derivedETH?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_not?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_gt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_lt?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_gte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_lte?: InputMaybe<Scalars['MOONBEAM_BigDecimal']>;
  derivedETH_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['MOONBEAM_BigDecimal']>>;
  whitelistPairs?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_contains?: InputMaybe<Array<Scalars['String']>>;
  whitelistPairs_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export type MOONBEAM_Token_orderBy =
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

export type MOONBEAM_Transaction = {
  id: Scalars['ID'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  mints: Array<Maybe<MOONBEAM_Mint>>;
  burns: Array<Maybe<MOONBEAM_Burn>>;
  swaps: Array<Maybe<MOONBEAM_Swap>>;
};


export type MOONBEAM_TransactionmintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Mint_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Mint_filter>;
};


export type MOONBEAM_TransactionburnsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Burn_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Burn_filter>;
};


export type MOONBEAM_TransactionswapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_Swap_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_Swap_filter>;
};

export type MOONBEAM_Transaction_filter = {
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
  mints_not_contains?: InputMaybe<Array<Scalars['String']>>;
  burns?: InputMaybe<Array<Scalars['String']>>;
  burns_not?: InputMaybe<Array<Scalars['String']>>;
  burns_contains?: InputMaybe<Array<Scalars['String']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps?: InputMaybe<Array<Scalars['String']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']>>;
  swaps_contains?: InputMaybe<Array<Scalars['String']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export type MOONBEAM_Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'mints'
  | 'burns'
  | 'swaps';

export type MOONBEAM_User = {
  id: Scalars['ID'];
  liquidityPositions: Array<MOONBEAM_LiquidityPosition>;
};


export type MOONBEAM_UserliquidityPositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MOONBEAM_LiquidityPosition_orderBy>;
  orderDirection?: InputMaybe<MOONBEAM_OrderDirection>;
  where?: InputMaybe<MOONBEAM_LiquidityPosition_filter>;
};

export type MOONBEAM_User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export type MOONBEAM_User_orderBy =
  | 'id'
  | 'liquidityPositions';

export type MOONBEAM__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['MOONBEAM_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type MOONBEAM__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: MOONBEAM__Block_;
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
    export type QueryMoonbeamExchangeSdk = {
  /** null **/
  MOONBEAM_user: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_user'], MoonbeamExchangeTypes.QueryMOONBEAM_userArgs, MeshContext>,
  /** null **/
  MOONBEAM_users: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_users'], MoonbeamExchangeTypes.QueryMOONBEAM_usersArgs, MeshContext>,
  /** null **/
  MOONBEAM_bundle: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_bundle'], MoonbeamExchangeTypes.QueryMOONBEAM_bundleArgs, MeshContext>,
  /** null **/
  MOONBEAM_bundles: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_bundles'], MoonbeamExchangeTypes.QueryMOONBEAM_bundlesArgs, MeshContext>,
  /** null **/
  MOONBEAM_factory: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_factory'], MoonbeamExchangeTypes.QueryMOONBEAM_factoryArgs, MeshContext>,
  /** null **/
  MOONBEAM_factories: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_factories'], MoonbeamExchangeTypes.QueryMOONBEAM_factoriesArgs, MeshContext>,
  /** null **/
  MOONBEAM_hourData: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_hourData'], MoonbeamExchangeTypes.QueryMOONBEAM_hourDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_hourDatas: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_hourDatas'], MoonbeamExchangeTypes.QueryMOONBEAM_hourDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_dayData: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_dayData'], MoonbeamExchangeTypes.QueryMOONBEAM_dayDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_dayDatas: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_dayDatas'], MoonbeamExchangeTypes.QueryMOONBEAM_dayDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_token: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_token'], MoonbeamExchangeTypes.QueryMOONBEAM_tokenArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokens: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_tokens'], MoonbeamExchangeTypes.QueryMOONBEAM_tokensArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenHourData: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_tokenHourData'], MoonbeamExchangeTypes.QueryMOONBEAM_tokenHourDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenHourDatas: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_tokenHourDatas'], MoonbeamExchangeTypes.QueryMOONBEAM_tokenHourDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenDayData: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_tokenDayData'], MoonbeamExchangeTypes.QueryMOONBEAM_tokenDayDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenDayDatas: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_tokenDayDatas'], MoonbeamExchangeTypes.QueryMOONBEAM_tokenDayDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_pair: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_pair'], MoonbeamExchangeTypes.QueryMOONBEAM_pairArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairs: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_pairs'], MoonbeamExchangeTypes.QueryMOONBEAM_pairsArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairHourData: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_pairHourData'], MoonbeamExchangeTypes.QueryMOONBEAM_pairHourDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairHourDatas: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_pairHourDatas'], MoonbeamExchangeTypes.QueryMOONBEAM_pairHourDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairDayData: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_pairDayData'], MoonbeamExchangeTypes.QueryMOONBEAM_pairDayDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairDayDatas: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_pairDayDatas'], MoonbeamExchangeTypes.QueryMOONBEAM_pairDayDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPosition: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_liquidityPosition'], MoonbeamExchangeTypes.QueryMOONBEAM_liquidityPositionArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPositions: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_liquidityPositions'], MoonbeamExchangeTypes.QueryMOONBEAM_liquidityPositionsArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPositionSnapshot: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_liquidityPositionSnapshot'], MoonbeamExchangeTypes.QueryMOONBEAM_liquidityPositionSnapshotArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPositionSnapshots: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_liquidityPositionSnapshots'], MoonbeamExchangeTypes.QueryMOONBEAM_liquidityPositionSnapshotsArgs, MeshContext>,
  /** null **/
  MOONBEAM_transaction: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_transaction'], MoonbeamExchangeTypes.QueryMOONBEAM_transactionArgs, MeshContext>,
  /** null **/
  MOONBEAM_transactions: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_transactions'], MoonbeamExchangeTypes.QueryMOONBEAM_transactionsArgs, MeshContext>,
  /** null **/
  MOONBEAM_mint: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_mint'], MoonbeamExchangeTypes.QueryMOONBEAM_mintArgs, MeshContext>,
  /** null **/
  MOONBEAM_mints: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_mints'], MoonbeamExchangeTypes.QueryMOONBEAM_mintsArgs, MeshContext>,
  /** null **/
  MOONBEAM_burn: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_burn'], MoonbeamExchangeTypes.QueryMOONBEAM_burnArgs, MeshContext>,
  /** null **/
  MOONBEAM_burns: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_burns'], MoonbeamExchangeTypes.QueryMOONBEAM_burnsArgs, MeshContext>,
  /** null **/
  MOONBEAM_swap: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_swap'], MoonbeamExchangeTypes.QueryMOONBEAM_swapArgs, MeshContext>,
  /** null **/
  MOONBEAM_swaps: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM_swaps'], MoonbeamExchangeTypes.QueryMOONBEAM_swapsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  MOONBEAM__meta: InContextSdkMethod<MoonbeamExchangeTypes.Query['MOONBEAM__meta'], MoonbeamExchangeTypes.QueryMOONBEAM__metaArgs, MeshContext>
};

export type MutationMoonbeamExchangeSdk = {

};

export type SubscriptionMoonbeamExchangeSdk = {
  /** null **/
  MOONBEAM_user: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_user'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_userArgs, MeshContext>,
  /** null **/
  MOONBEAM_users: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_users'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_usersArgs, MeshContext>,
  /** null **/
  MOONBEAM_bundle: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_bundle'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_bundleArgs, MeshContext>,
  /** null **/
  MOONBEAM_bundles: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_bundles'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_bundlesArgs, MeshContext>,
  /** null **/
  MOONBEAM_factory: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_factory'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_factoryArgs, MeshContext>,
  /** null **/
  MOONBEAM_factories: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_factories'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_factoriesArgs, MeshContext>,
  /** null **/
  MOONBEAM_hourData: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_hourData'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_hourDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_hourDatas: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_hourDatas'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_hourDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_dayData: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_dayData'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_dayDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_dayDatas: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_dayDatas'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_dayDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_token: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_token'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_tokenArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokens: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_tokens'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_tokensArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenHourData: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_tokenHourData'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_tokenHourDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenHourDatas: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_tokenHourDatas'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_tokenHourDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenDayData: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_tokenDayData'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_tokenDayDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_tokenDayDatas: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_tokenDayDatas'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_tokenDayDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_pair: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_pair'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_pairArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairs: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_pairs'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_pairsArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairHourData: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_pairHourData'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_pairHourDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairHourDatas: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_pairHourDatas'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_pairHourDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairDayData: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_pairDayData'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_pairDayDataArgs, MeshContext>,
  /** null **/
  MOONBEAM_pairDayDatas: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_pairDayDatas'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_pairDayDatasArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPosition: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_liquidityPosition'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_liquidityPositionArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPositions: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_liquidityPositions'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_liquidityPositionsArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPositionSnapshot: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_liquidityPositionSnapshot'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_liquidityPositionSnapshotArgs, MeshContext>,
  /** null **/
  MOONBEAM_liquidityPositionSnapshots: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_liquidityPositionSnapshots'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_liquidityPositionSnapshotsArgs, MeshContext>,
  /** null **/
  MOONBEAM_transaction: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_transaction'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_transactionArgs, MeshContext>,
  /** null **/
  MOONBEAM_transactions: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_transactions'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_transactionsArgs, MeshContext>,
  /** null **/
  MOONBEAM_mint: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_mint'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_mintArgs, MeshContext>,
  /** null **/
  MOONBEAM_mints: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_mints'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_mintsArgs, MeshContext>,
  /** null **/
  MOONBEAM_burn: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_burn'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_burnArgs, MeshContext>,
  /** null **/
  MOONBEAM_burns: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_burns'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_burnsArgs, MeshContext>,
  /** null **/
  MOONBEAM_swap: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_swap'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_swapArgs, MeshContext>,
  /** null **/
  MOONBEAM_swaps: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM_swaps'], MoonbeamExchangeTypes.SubscriptionMOONBEAM_swapsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  MOONBEAM__meta: InContextSdkMethod<MoonbeamExchangeTypes.Subscription['MOONBEAM__meta'], MoonbeamExchangeTypes.SubscriptionMOONBEAM__metaArgs, MeshContext>
};

export type EthereumExchangeContext = {
      ["ethereum-exchange"]: { Query: QueryEthereumExchangeSdk, Mutation: MutationEthereumExchangeSdk, Subscription: SubscriptionEthereumExchangeSdk },
    };

export type MoonbeamExchangeContext = {
      ["moonbeam-exchange"]: { Query: QueryMoonbeamExchangeSdk, Mutation: MutationMoonbeamExchangeSdk, Subscription: SubscriptionMoonbeamExchangeSdk },
    };

export type MeshContext = EthereumExchangeContext & MoonbeamExchangeContext & BaseMeshContext;


import { getMesh } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import pathModule from 'path';
import { fileURLToPath } from '@graphql-mesh/utils';
import ExternalModule_0 from '@graphql-mesh/cache-inmemory-lru';
import ExternalModule_1 from '@graphql-mesh/graphql';
import ExternalModule_2 from '@graphql-mesh/merger-stitching';
import ExternalModule_3 from '@graphql-mesh/transform-prefix';
import ExternalModule_4 from '@graphql-mesh/transform-rename';
import ExternalModule_5 from '@graphql-mesh/transform-type-merging';
import ExternalModule_6 from './sources/ethereum-exchange/schema.graphql.ts';
import ExternalModule_7 from './sources/moonbeam-exchange/schema.graphql.ts';

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
  ["@graphql-mesh/transform-rename"]: ExternalModule_4,
  // @ts-ignore
  ["@graphql-mesh/transform-type-merging"]: ExternalModule_5,
  // @ts-ignore
  [".graphclient/sources/ethereum-exchange/schema.graphql.ts"]: ExternalModule_6,
  // @ts-ignore
  [".graphclient/sources/moonbeam-exchange/schema.graphql.ts"]: ExternalModule_7
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
import RenameTransform from '@graphql-mesh/transform-rename';
import TypeMergingTransform from '@graphql-mesh/transform-type-merging';
import { resolveAdditionalResolvers } from '@graphql-mesh/utils';
export const rawConfig: YamlConfig.Config = {"sources":[{"name":"ethereum-exchange","handler":{"graphql":{"endpoint":"https://api.thegraph.com/subgraphs/name/sushiswap/exchange"}},"transforms":[{"prefix":{"value":"ETHEREUM_","includeRootOperations":true,"ignore":["_SubgraphErrorPolicy_"]}},{"rename":[{"from":{"type":"ETHEREUM_Factory"},"to":{"type":"Factory"}}]},{"typeMerging":{"queryFields":[{"queryFieldName":"ETHEREUM_factory","keyField":"id","keyArg":"id"}]}}]},{"name":"moonbeam-exchange","handler":{"graphql":{"endpoint":"https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange"}},"transforms":[{"prefix":{"value":"MOONBEAM_","includeRootOperations":true,"ignore":["_SubgraphErrorPolicy_","Factory"]}},{"typeMerging":{"queryFields":[{"queryFieldName":"MOONBEAM_factory","keyField":"id","keyArg":"id"}]}}]}],"documents":["./factory-query.graphql"]} as any
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
const moonbeamExchangeTransforms = [];
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
const moonbeamExchangeHandler = new GraphqlHandler({
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
                new RenameTransform({
                  apiName: rawConfig.sources[0].name,
                  config: rawConfig.sources[0].transforms[1]["rename"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
ethereumExchangeTransforms.push(
                new TypeMergingTransform({
                  apiName: rawConfig.sources[0].name,
                  config: rawConfig.sources[0].transforms[2]["typeMerging"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
moonbeamExchangeTransforms.push(
                new PrefixTransform({
                  apiName: rawConfig.sources[1].name,
                  config: rawConfig.sources[1].transforms[0]["prefix"],
                  baseDir,
                  cache,
                  pubsub,
                  importFn
                })
              );
moonbeamExchangeTransforms.push(
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
          name: 'moonbeam-exchange',
          handler: moonbeamExchangeHandler,
          transforms: moonbeamExchangeTransforms
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
  MOONBEAM_factory(id: "0xc35dadb65012ec5796536bd9864ed8773abc74c4") {
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
    { __typename: 'Factory' }
    & Pick<Factory, 'id' | 'volumeETH' | 'liquidityETH'>
  )>, MOONBEAM_factory?: Maybe<(
    { __typename: 'Factory' }
    & Pick<Factory, 'id' | 'volumeETH' | 'liquidityETH'>
  )> };


export const FactoriesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FactoriesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ETHEREUM_factory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"volumeETH"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityETH"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MOONBEAM_factory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"0xc35dadb65012ec5796536bd9864ed8773abc74c4","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"volumeETH"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityETH"}}]}}]}}]} as unknown as DocumentNode<FactoriesQueryQuery, FactoriesQueryQueryVariables>;


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