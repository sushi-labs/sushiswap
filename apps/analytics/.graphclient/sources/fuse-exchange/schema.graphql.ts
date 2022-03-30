import { buildSchema, Source } from 'graphql';

const source = new Source(/* GraphQL */`
schema {
  query: Query
  subscription: Subscription
}

"Marks the GraphQL type as indexable entity.  Each type that should be an entity is required to be annotated with this directive."
directive @entity on OBJECT

"Defined a Subgraph ID for an object type"
directive @subgraphId(id: String!) on OBJECT

"creates a virtual field on the entity that may be queried but cannot be set manually through the mappings API."
directive @derivedFrom(field: String!) on FIELD_DEFINITION

scalar BigDecimal

scalar BigInt

"""The block at which the query should be executed."""
input Block_height {
  """Value containing a block hash"""
  hash: Bytes
  """Value containing a block number"""
  number: Int
  """
  Value containing the minimum block number. 
  In the case of \`number_gte\`, the query will be executed on the latest block only if
  the subgraph has progressed to or past the minimum block number.
  Defaults to the latest block when omitted.
  
  """
  number_gte: Int
}

type Bundle {
  id: ID!
  ethPrice: BigDecimal!
}

input Bundle_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  ethPrice: BigDecimal
  ethPrice_not: BigDecimal
  ethPrice_gt: BigDecimal
  ethPrice_lt: BigDecimal
  ethPrice_gte: BigDecimal
  ethPrice_lte: BigDecimal
  ethPrice_in: [BigDecimal!]
  ethPrice_not_in: [BigDecimal!]
}

enum Bundle_orderBy {
  id
  ethPrice
}

type Burn {
  id: ID!
  transaction: Transaction!
  timestamp: BigInt!
  pair: Pair!
  liquidity: BigDecimal!
  sender: Bytes
  amount0: BigDecimal
  amount1: BigDecimal
  to: Bytes
  logIndex: BigInt
  amountUSD: BigDecimal
  complete: Boolean!
  feeTo: Bytes
  feeLiquidity: BigDecimal
}

input Burn_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  transaction: String
  transaction_not: String
  transaction_gt: String
  transaction_lt: String
  transaction_gte: String
  transaction_lte: String
  transaction_in: [String!]
  transaction_not_in: [String!]
  transaction_contains: String
  transaction_contains_nocase: String
  transaction_not_contains: String
  transaction_not_contains_nocase: String
  transaction_starts_with: String
  transaction_starts_with_nocase: String
  transaction_not_starts_with: String
  transaction_not_starts_with_nocase: String
  transaction_ends_with: String
  transaction_ends_with_nocase: String
  transaction_not_ends_with: String
  transaction_not_ends_with_nocase: String
  timestamp: BigInt
  timestamp_not: BigInt
  timestamp_gt: BigInt
  timestamp_lt: BigInt
  timestamp_gte: BigInt
  timestamp_lte: BigInt
  timestamp_in: [BigInt!]
  timestamp_not_in: [BigInt!]
  pair: String
  pair_not: String
  pair_gt: String
  pair_lt: String
  pair_gte: String
  pair_lte: String
  pair_in: [String!]
  pair_not_in: [String!]
  pair_contains: String
  pair_contains_nocase: String
  pair_not_contains: String
  pair_not_contains_nocase: String
  pair_starts_with: String
  pair_starts_with_nocase: String
  pair_not_starts_with: String
  pair_not_starts_with_nocase: String
  pair_ends_with: String
  pair_ends_with_nocase: String
  pair_not_ends_with: String
  pair_not_ends_with_nocase: String
  liquidity: BigDecimal
  liquidity_not: BigDecimal
  liquidity_gt: BigDecimal
  liquidity_lt: BigDecimal
  liquidity_gte: BigDecimal
  liquidity_lte: BigDecimal
  liquidity_in: [BigDecimal!]
  liquidity_not_in: [BigDecimal!]
  sender: Bytes
  sender_not: Bytes
  sender_in: [Bytes!]
  sender_not_in: [Bytes!]
  sender_contains: Bytes
  sender_not_contains: Bytes
  amount0: BigDecimal
  amount0_not: BigDecimal
  amount0_gt: BigDecimal
  amount0_lt: BigDecimal
  amount0_gte: BigDecimal
  amount0_lte: BigDecimal
  amount0_in: [BigDecimal!]
  amount0_not_in: [BigDecimal!]
  amount1: BigDecimal
  amount1_not: BigDecimal
  amount1_gt: BigDecimal
  amount1_lt: BigDecimal
  amount1_gte: BigDecimal
  amount1_lte: BigDecimal
  amount1_in: [BigDecimal!]
  amount1_not_in: [BigDecimal!]
  to: Bytes
  to_not: Bytes
  to_in: [Bytes!]
  to_not_in: [Bytes!]
  to_contains: Bytes
  to_not_contains: Bytes
  logIndex: BigInt
  logIndex_not: BigInt
  logIndex_gt: BigInt
  logIndex_lt: BigInt
  logIndex_gte: BigInt
  logIndex_lte: BigInt
  logIndex_in: [BigInt!]
  logIndex_not_in: [BigInt!]
  amountUSD: BigDecimal
  amountUSD_not: BigDecimal
  amountUSD_gt: BigDecimal
  amountUSD_lt: BigDecimal
  amountUSD_gte: BigDecimal
  amountUSD_lte: BigDecimal
  amountUSD_in: [BigDecimal!]
  amountUSD_not_in: [BigDecimal!]
  complete: Boolean
  complete_not: Boolean
  complete_in: [Boolean!]
  complete_not_in: [Boolean!]
  feeTo: Bytes
  feeTo_not: Bytes
  feeTo_in: [Bytes!]
  feeTo_not_in: [Bytes!]
  feeTo_contains: Bytes
  feeTo_not_contains: Bytes
  feeLiquidity: BigDecimal
  feeLiquidity_not: BigDecimal
  feeLiquidity_gt: BigDecimal
  feeLiquidity_lt: BigDecimal
  feeLiquidity_gte: BigDecimal
  feeLiquidity_lte: BigDecimal
  feeLiquidity_in: [BigDecimal!]
  feeLiquidity_not_in: [BigDecimal!]
}

enum Burn_orderBy {
  id
  transaction
  timestamp
  pair
  liquidity
  sender
  amount0
  amount1
  to
  logIndex
  amountUSD
  complete
  feeTo
  feeLiquidity
}

scalar Bytes

type DayData {
  id: ID!
  date: Int!
  factory: Factory!
  volumeETH: BigDecimal!
  volumeUSD: BigDecimal!
  untrackedVolume: BigDecimal!
  liquidityETH: BigDecimal!
  liquidityUSD: BigDecimal!
  txCount: BigInt!
}

input DayData_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  date: Int
  date_not: Int
  date_gt: Int
  date_lt: Int
  date_gte: Int
  date_lte: Int
  date_in: [Int!]
  date_not_in: [Int!]
  factory: String
  factory_not: String
  factory_gt: String
  factory_lt: String
  factory_gte: String
  factory_lte: String
  factory_in: [String!]
  factory_not_in: [String!]
  factory_contains: String
  factory_contains_nocase: String
  factory_not_contains: String
  factory_not_contains_nocase: String
  factory_starts_with: String
  factory_starts_with_nocase: String
  factory_not_starts_with: String
  factory_not_starts_with_nocase: String
  factory_ends_with: String
  factory_ends_with_nocase: String
  factory_not_ends_with: String
  factory_not_ends_with_nocase: String
  volumeETH: BigDecimal
  volumeETH_not: BigDecimal
  volumeETH_gt: BigDecimal
  volumeETH_lt: BigDecimal
  volumeETH_gte: BigDecimal
  volumeETH_lte: BigDecimal
  volumeETH_in: [BigDecimal!]
  volumeETH_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  untrackedVolume: BigDecimal
  untrackedVolume_not: BigDecimal
  untrackedVolume_gt: BigDecimal
  untrackedVolume_lt: BigDecimal
  untrackedVolume_gte: BigDecimal
  untrackedVolume_lte: BigDecimal
  untrackedVolume_in: [BigDecimal!]
  untrackedVolume_not_in: [BigDecimal!]
  liquidityETH: BigDecimal
  liquidityETH_not: BigDecimal
  liquidityETH_gt: BigDecimal
  liquidityETH_lt: BigDecimal
  liquidityETH_gte: BigDecimal
  liquidityETH_lte: BigDecimal
  liquidityETH_in: [BigDecimal!]
  liquidityETH_not_in: [BigDecimal!]
  liquidityUSD: BigDecimal
  liquidityUSD_not: BigDecimal
  liquidityUSD_gt: BigDecimal
  liquidityUSD_lt: BigDecimal
  liquidityUSD_gte: BigDecimal
  liquidityUSD_lte: BigDecimal
  liquidityUSD_in: [BigDecimal!]
  liquidityUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
}

enum DayData_orderBy {
  id
  date
  factory
  volumeETH
  volumeUSD
  untrackedVolume
  liquidityETH
  liquidityUSD
  txCount
}

type Factory {
  id: ID!
  pairCount: BigInt!
  volumeUSD: BigDecimal!
  volumeETH: BigDecimal!
  untrackedVolumeUSD: BigDecimal!
  liquidityUSD: BigDecimal!
  liquidityETH: BigDecimal!
  txCount: BigInt!
  tokenCount: BigInt!
  userCount: BigInt!
  pairs(skip: Int = 0, first: Int = 100, orderBy: Pair_orderBy, orderDirection: OrderDirection, where: Pair_filter): [Pair!]!
  tokens(skip: Int = 0, first: Int = 100, orderBy: Token_orderBy, orderDirection: OrderDirection, where: Token_filter): [Token!]!
  hourData(skip: Int = 0, first: Int = 100, orderBy: HourData_orderBy, orderDirection: OrderDirection, where: HourData_filter): [HourData!]!
  dayData(skip: Int = 0, first: Int = 100, orderBy: DayData_orderBy, orderDirection: OrderDirection, where: DayData_filter): [DayData!]!
}

input Factory_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  pairCount: BigInt
  pairCount_not: BigInt
  pairCount_gt: BigInt
  pairCount_lt: BigInt
  pairCount_gte: BigInt
  pairCount_lte: BigInt
  pairCount_in: [BigInt!]
  pairCount_not_in: [BigInt!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  volumeETH: BigDecimal
  volumeETH_not: BigDecimal
  volumeETH_gt: BigDecimal
  volumeETH_lt: BigDecimal
  volumeETH_gte: BigDecimal
  volumeETH_lte: BigDecimal
  volumeETH_in: [BigDecimal!]
  volumeETH_not_in: [BigDecimal!]
  untrackedVolumeUSD: BigDecimal
  untrackedVolumeUSD_not: BigDecimal
  untrackedVolumeUSD_gt: BigDecimal
  untrackedVolumeUSD_lt: BigDecimal
  untrackedVolumeUSD_gte: BigDecimal
  untrackedVolumeUSD_lte: BigDecimal
  untrackedVolumeUSD_in: [BigDecimal!]
  untrackedVolumeUSD_not_in: [BigDecimal!]
  liquidityUSD: BigDecimal
  liquidityUSD_not: BigDecimal
  liquidityUSD_gt: BigDecimal
  liquidityUSD_lt: BigDecimal
  liquidityUSD_gte: BigDecimal
  liquidityUSD_lte: BigDecimal
  liquidityUSD_in: [BigDecimal!]
  liquidityUSD_not_in: [BigDecimal!]
  liquidityETH: BigDecimal
  liquidityETH_not: BigDecimal
  liquidityETH_gt: BigDecimal
  liquidityETH_lt: BigDecimal
  liquidityETH_gte: BigDecimal
  liquidityETH_lte: BigDecimal
  liquidityETH_in: [BigDecimal!]
  liquidityETH_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
  tokenCount: BigInt
  tokenCount_not: BigInt
  tokenCount_gt: BigInt
  tokenCount_lt: BigInt
  tokenCount_gte: BigInt
  tokenCount_lte: BigInt
  tokenCount_in: [BigInt!]
  tokenCount_not_in: [BigInt!]
  userCount: BigInt
  userCount_not: BigInt
  userCount_gt: BigInt
  userCount_lt: BigInt
  userCount_gte: BigInt
  userCount_lte: BigInt
  userCount_in: [BigInt!]
  userCount_not_in: [BigInt!]
}

enum Factory_orderBy {
  id
  pairCount
  volumeUSD
  volumeETH
  untrackedVolumeUSD
  liquidityUSD
  liquidityETH
  txCount
  tokenCount
  userCount
  pairs
  tokens
  hourData
  dayData
}

type HourData {
  id: ID!
  date: Int!
  factory: Factory!
  volumeETH: BigDecimal!
  volumeUSD: BigDecimal!
  untrackedVolume: BigDecimal!
  liquidityETH: BigDecimal!
  liquidityUSD: BigDecimal!
  txCount: BigInt!
}

input HourData_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  date: Int
  date_not: Int
  date_gt: Int
  date_lt: Int
  date_gte: Int
  date_lte: Int
  date_in: [Int!]
  date_not_in: [Int!]
  factory: String
  factory_not: String
  factory_gt: String
  factory_lt: String
  factory_gte: String
  factory_lte: String
  factory_in: [String!]
  factory_not_in: [String!]
  factory_contains: String
  factory_contains_nocase: String
  factory_not_contains: String
  factory_not_contains_nocase: String
  factory_starts_with: String
  factory_starts_with_nocase: String
  factory_not_starts_with: String
  factory_not_starts_with_nocase: String
  factory_ends_with: String
  factory_ends_with_nocase: String
  factory_not_ends_with: String
  factory_not_ends_with_nocase: String
  volumeETH: BigDecimal
  volumeETH_not: BigDecimal
  volumeETH_gt: BigDecimal
  volumeETH_lt: BigDecimal
  volumeETH_gte: BigDecimal
  volumeETH_lte: BigDecimal
  volumeETH_in: [BigDecimal!]
  volumeETH_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  untrackedVolume: BigDecimal
  untrackedVolume_not: BigDecimal
  untrackedVolume_gt: BigDecimal
  untrackedVolume_lt: BigDecimal
  untrackedVolume_gte: BigDecimal
  untrackedVolume_lte: BigDecimal
  untrackedVolume_in: [BigDecimal!]
  untrackedVolume_not_in: [BigDecimal!]
  liquidityETH: BigDecimal
  liquidityETH_not: BigDecimal
  liquidityETH_gt: BigDecimal
  liquidityETH_lt: BigDecimal
  liquidityETH_gte: BigDecimal
  liquidityETH_lte: BigDecimal
  liquidityETH_in: [BigDecimal!]
  liquidityETH_not_in: [BigDecimal!]
  liquidityUSD: BigDecimal
  liquidityUSD_not: BigDecimal
  liquidityUSD_gt: BigDecimal
  liquidityUSD_lt: BigDecimal
  liquidityUSD_gte: BigDecimal
  liquidityUSD_lte: BigDecimal
  liquidityUSD_in: [BigDecimal!]
  liquidityUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
}

enum HourData_orderBy {
  id
  date
  factory
  volumeETH
  volumeUSD
  untrackedVolume
  liquidityETH
  liquidityUSD
  txCount
}

type LiquidityPosition {
  id: ID!
  user: User!
  pair: Pair!
  liquidityTokenBalance: BigDecimal!
  snapshots(skip: Int = 0, first: Int = 100, orderBy: LiquidityPositionSnapshot_orderBy, orderDirection: OrderDirection, where: LiquidityPositionSnapshot_filter): [LiquidityPositionSnapshot]!
  block: Int!
  timestamp: Int!
}

type LiquidityPositionSnapshot {
  id: ID!
  liquidityPosition: LiquidityPosition!
  timestamp: Int!
  block: Int!
  user: User!
  pair: Pair!
  token0PriceUSD: BigDecimal!
  token1PriceUSD: BigDecimal!
  reserve0: BigDecimal!
  reserve1: BigDecimal!
  reserveUSD: BigDecimal!
  liquidityTokenTotalSupply: BigDecimal!
  liquidityTokenBalance: BigDecimal!
}

input LiquidityPositionSnapshot_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  liquidityPosition: String
  liquidityPosition_not: String
  liquidityPosition_gt: String
  liquidityPosition_lt: String
  liquidityPosition_gte: String
  liquidityPosition_lte: String
  liquidityPosition_in: [String!]
  liquidityPosition_not_in: [String!]
  liquidityPosition_contains: String
  liquidityPosition_contains_nocase: String
  liquidityPosition_not_contains: String
  liquidityPosition_not_contains_nocase: String
  liquidityPosition_starts_with: String
  liquidityPosition_starts_with_nocase: String
  liquidityPosition_not_starts_with: String
  liquidityPosition_not_starts_with_nocase: String
  liquidityPosition_ends_with: String
  liquidityPosition_ends_with_nocase: String
  liquidityPosition_not_ends_with: String
  liquidityPosition_not_ends_with_nocase: String
  timestamp: Int
  timestamp_not: Int
  timestamp_gt: Int
  timestamp_lt: Int
  timestamp_gte: Int
  timestamp_lte: Int
  timestamp_in: [Int!]
  timestamp_not_in: [Int!]
  block: Int
  block_not: Int
  block_gt: Int
  block_lt: Int
  block_gte: Int
  block_lte: Int
  block_in: [Int!]
  block_not_in: [Int!]
  user: String
  user_not: String
  user_gt: String
  user_lt: String
  user_gte: String
  user_lte: String
  user_in: [String!]
  user_not_in: [String!]
  user_contains: String
  user_contains_nocase: String
  user_not_contains: String
  user_not_contains_nocase: String
  user_starts_with: String
  user_starts_with_nocase: String
  user_not_starts_with: String
  user_not_starts_with_nocase: String
  user_ends_with: String
  user_ends_with_nocase: String
  user_not_ends_with: String
  user_not_ends_with_nocase: String
  pair: String
  pair_not: String
  pair_gt: String
  pair_lt: String
  pair_gte: String
  pair_lte: String
  pair_in: [String!]
  pair_not_in: [String!]
  pair_contains: String
  pair_contains_nocase: String
  pair_not_contains: String
  pair_not_contains_nocase: String
  pair_starts_with: String
  pair_starts_with_nocase: String
  pair_not_starts_with: String
  pair_not_starts_with_nocase: String
  pair_ends_with: String
  pair_ends_with_nocase: String
  pair_not_ends_with: String
  pair_not_ends_with_nocase: String
  token0PriceUSD: BigDecimal
  token0PriceUSD_not: BigDecimal
  token0PriceUSD_gt: BigDecimal
  token0PriceUSD_lt: BigDecimal
  token0PriceUSD_gte: BigDecimal
  token0PriceUSD_lte: BigDecimal
  token0PriceUSD_in: [BigDecimal!]
  token0PriceUSD_not_in: [BigDecimal!]
  token1PriceUSD: BigDecimal
  token1PriceUSD_not: BigDecimal
  token1PriceUSD_gt: BigDecimal
  token1PriceUSD_lt: BigDecimal
  token1PriceUSD_gte: BigDecimal
  token1PriceUSD_lte: BigDecimal
  token1PriceUSD_in: [BigDecimal!]
  token1PriceUSD_not_in: [BigDecimal!]
  reserve0: BigDecimal
  reserve0_not: BigDecimal
  reserve0_gt: BigDecimal
  reserve0_lt: BigDecimal
  reserve0_gte: BigDecimal
  reserve0_lte: BigDecimal
  reserve0_in: [BigDecimal!]
  reserve0_not_in: [BigDecimal!]
  reserve1: BigDecimal
  reserve1_not: BigDecimal
  reserve1_gt: BigDecimal
  reserve1_lt: BigDecimal
  reserve1_gte: BigDecimal
  reserve1_lte: BigDecimal
  reserve1_in: [BigDecimal!]
  reserve1_not_in: [BigDecimal!]
  reserveUSD: BigDecimal
  reserveUSD_not: BigDecimal
  reserveUSD_gt: BigDecimal
  reserveUSD_lt: BigDecimal
  reserveUSD_gte: BigDecimal
  reserveUSD_lte: BigDecimal
  reserveUSD_in: [BigDecimal!]
  reserveUSD_not_in: [BigDecimal!]
  liquidityTokenTotalSupply: BigDecimal
  liquidityTokenTotalSupply_not: BigDecimal
  liquidityTokenTotalSupply_gt: BigDecimal
  liquidityTokenTotalSupply_lt: BigDecimal
  liquidityTokenTotalSupply_gte: BigDecimal
  liquidityTokenTotalSupply_lte: BigDecimal
  liquidityTokenTotalSupply_in: [BigDecimal!]
  liquidityTokenTotalSupply_not_in: [BigDecimal!]
  liquidityTokenBalance: BigDecimal
  liquidityTokenBalance_not: BigDecimal
  liquidityTokenBalance_gt: BigDecimal
  liquidityTokenBalance_lt: BigDecimal
  liquidityTokenBalance_gte: BigDecimal
  liquidityTokenBalance_lte: BigDecimal
  liquidityTokenBalance_in: [BigDecimal!]
  liquidityTokenBalance_not_in: [BigDecimal!]
}

enum LiquidityPositionSnapshot_orderBy {
  id
  liquidityPosition
  timestamp
  block
  user
  pair
  token0PriceUSD
  token1PriceUSD
  reserve0
  reserve1
  reserveUSD
  liquidityTokenTotalSupply
  liquidityTokenBalance
}

input LiquidityPosition_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  user: String
  user_not: String
  user_gt: String
  user_lt: String
  user_gte: String
  user_lte: String
  user_in: [String!]
  user_not_in: [String!]
  user_contains: String
  user_contains_nocase: String
  user_not_contains: String
  user_not_contains_nocase: String
  user_starts_with: String
  user_starts_with_nocase: String
  user_not_starts_with: String
  user_not_starts_with_nocase: String
  user_ends_with: String
  user_ends_with_nocase: String
  user_not_ends_with: String
  user_not_ends_with_nocase: String
  pair: String
  pair_not: String
  pair_gt: String
  pair_lt: String
  pair_gte: String
  pair_lte: String
  pair_in: [String!]
  pair_not_in: [String!]
  pair_contains: String
  pair_contains_nocase: String
  pair_not_contains: String
  pair_not_contains_nocase: String
  pair_starts_with: String
  pair_starts_with_nocase: String
  pair_not_starts_with: String
  pair_not_starts_with_nocase: String
  pair_ends_with: String
  pair_ends_with_nocase: String
  pair_not_ends_with: String
  pair_not_ends_with_nocase: String
  liquidityTokenBalance: BigDecimal
  liquidityTokenBalance_not: BigDecimal
  liquidityTokenBalance_gt: BigDecimal
  liquidityTokenBalance_lt: BigDecimal
  liquidityTokenBalance_gte: BigDecimal
  liquidityTokenBalance_lte: BigDecimal
  liquidityTokenBalance_in: [BigDecimal!]
  liquidityTokenBalance_not_in: [BigDecimal!]
  block: Int
  block_not: Int
  block_gt: Int
  block_lt: Int
  block_gte: Int
  block_lte: Int
  block_in: [Int!]
  block_not_in: [Int!]
  timestamp: Int
  timestamp_not: Int
  timestamp_gt: Int
  timestamp_lt: Int
  timestamp_gte: Int
  timestamp_lte: Int
  timestamp_in: [Int!]
  timestamp_not_in: [Int!]
}

enum LiquidityPosition_orderBy {
  id
  user
  pair
  liquidityTokenBalance
  snapshots
  block
  timestamp
}

type Mint {
  id: ID!
  transaction: Transaction!
  timestamp: BigInt!
  pair: Pair!
  to: Bytes!
  liquidity: BigDecimal!
  sender: Bytes
  amount0: BigDecimal
  amount1: BigDecimal
  logIndex: BigInt
  amountUSD: BigDecimal
  feeTo: Bytes
  feeLiquidity: BigDecimal
}

input Mint_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  transaction: String
  transaction_not: String
  transaction_gt: String
  transaction_lt: String
  transaction_gte: String
  transaction_lte: String
  transaction_in: [String!]
  transaction_not_in: [String!]
  transaction_contains: String
  transaction_contains_nocase: String
  transaction_not_contains: String
  transaction_not_contains_nocase: String
  transaction_starts_with: String
  transaction_starts_with_nocase: String
  transaction_not_starts_with: String
  transaction_not_starts_with_nocase: String
  transaction_ends_with: String
  transaction_ends_with_nocase: String
  transaction_not_ends_with: String
  transaction_not_ends_with_nocase: String
  timestamp: BigInt
  timestamp_not: BigInt
  timestamp_gt: BigInt
  timestamp_lt: BigInt
  timestamp_gte: BigInt
  timestamp_lte: BigInt
  timestamp_in: [BigInt!]
  timestamp_not_in: [BigInt!]
  pair: String
  pair_not: String
  pair_gt: String
  pair_lt: String
  pair_gte: String
  pair_lte: String
  pair_in: [String!]
  pair_not_in: [String!]
  pair_contains: String
  pair_contains_nocase: String
  pair_not_contains: String
  pair_not_contains_nocase: String
  pair_starts_with: String
  pair_starts_with_nocase: String
  pair_not_starts_with: String
  pair_not_starts_with_nocase: String
  pair_ends_with: String
  pair_ends_with_nocase: String
  pair_not_ends_with: String
  pair_not_ends_with_nocase: String
  to: Bytes
  to_not: Bytes
  to_in: [Bytes!]
  to_not_in: [Bytes!]
  to_contains: Bytes
  to_not_contains: Bytes
  liquidity: BigDecimal
  liquidity_not: BigDecimal
  liquidity_gt: BigDecimal
  liquidity_lt: BigDecimal
  liquidity_gte: BigDecimal
  liquidity_lte: BigDecimal
  liquidity_in: [BigDecimal!]
  liquidity_not_in: [BigDecimal!]
  sender: Bytes
  sender_not: Bytes
  sender_in: [Bytes!]
  sender_not_in: [Bytes!]
  sender_contains: Bytes
  sender_not_contains: Bytes
  amount0: BigDecimal
  amount0_not: BigDecimal
  amount0_gt: BigDecimal
  amount0_lt: BigDecimal
  amount0_gte: BigDecimal
  amount0_lte: BigDecimal
  amount0_in: [BigDecimal!]
  amount0_not_in: [BigDecimal!]
  amount1: BigDecimal
  amount1_not: BigDecimal
  amount1_gt: BigDecimal
  amount1_lt: BigDecimal
  amount1_gte: BigDecimal
  amount1_lte: BigDecimal
  amount1_in: [BigDecimal!]
  amount1_not_in: [BigDecimal!]
  logIndex: BigInt
  logIndex_not: BigInt
  logIndex_gt: BigInt
  logIndex_lt: BigInt
  logIndex_gte: BigInt
  logIndex_lte: BigInt
  logIndex_in: [BigInt!]
  logIndex_not_in: [BigInt!]
  amountUSD: BigDecimal
  amountUSD_not: BigDecimal
  amountUSD_gt: BigDecimal
  amountUSD_lt: BigDecimal
  amountUSD_gte: BigDecimal
  amountUSD_lte: BigDecimal
  amountUSD_in: [BigDecimal!]
  amountUSD_not_in: [BigDecimal!]
  feeTo: Bytes
  feeTo_not: Bytes
  feeTo_in: [Bytes!]
  feeTo_not_in: [Bytes!]
  feeTo_contains: Bytes
  feeTo_not_contains: Bytes
  feeLiquidity: BigDecimal
  feeLiquidity_not: BigDecimal
  feeLiquidity_gt: BigDecimal
  feeLiquidity_lt: BigDecimal
  feeLiquidity_gte: BigDecimal
  feeLiquidity_lte: BigDecimal
  feeLiquidity_in: [BigDecimal!]
  feeLiquidity_not_in: [BigDecimal!]
}

enum Mint_orderBy {
  id
  transaction
  timestamp
  pair
  to
  liquidity
  sender
  amount0
  amount1
  logIndex
  amountUSD
  feeTo
  feeLiquidity
}

"""Defines the order direction, either ascending or descending"""
enum OrderDirection {
  asc
  desc
}

type Pair {
  id: ID!
  factory: Factory!
  name: String!
  token0: Token!
  token1: Token!
  reserve0: BigDecimal!
  reserve1: BigDecimal!
  totalSupply: BigDecimal!
  reserveETH: BigDecimal!
  reserveUSD: BigDecimal!
  trackedReserveETH: BigDecimal!
  token0Price: BigDecimal!
  token1Price: BigDecimal!
  volumeToken0: BigDecimal!
  volumeToken1: BigDecimal!
  volumeUSD: BigDecimal!
  untrackedVolumeUSD: BigDecimal!
  txCount: BigInt!
  liquidityProviderCount: BigInt!
  liquidityPositions(skip: Int = 0, first: Int = 100, orderBy: LiquidityPosition_orderBy, orderDirection: OrderDirection, where: LiquidityPosition_filter): [LiquidityPosition!]!
  liquidityPositionSnapshots(skip: Int = 0, first: Int = 100, orderBy: LiquidityPositionSnapshot_orderBy, orderDirection: OrderDirection, where: LiquidityPositionSnapshot_filter): [LiquidityPositionSnapshot!]!
  dayData(skip: Int = 0, first: Int = 100, orderBy: PairDayData_orderBy, orderDirection: OrderDirection, where: PairDayData_filter): [PairDayData!]!
  hourData(skip: Int = 0, first: Int = 100, orderBy: PairHourData_orderBy, orderDirection: OrderDirection, where: PairHourData_filter): [PairHourData!]!
  mints(skip: Int = 0, first: Int = 100, orderBy: Mint_orderBy, orderDirection: OrderDirection, where: Mint_filter): [Mint!]!
  burns(skip: Int = 0, first: Int = 100, orderBy: Burn_orderBy, orderDirection: OrderDirection, where: Burn_filter): [Burn!]!
  swaps(skip: Int = 0, first: Int = 100, orderBy: Swap_orderBy, orderDirection: OrderDirection, where: Swap_filter): [Swap!]!
  timestamp: BigInt!
  block: BigInt!
}

type PairDayData {
  id: ID!
  date: Int!
  pair: Pair!
  token0: Token!
  token1: Token!
  reserve0: BigDecimal!
  reserve1: BigDecimal!
  totalSupply: BigDecimal!
  reserveUSD: BigDecimal!
  volumeToken0: BigDecimal!
  volumeToken1: BigDecimal!
  volumeUSD: BigDecimal!
  txCount: BigInt!
}

input PairDayData_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  date: Int
  date_not: Int
  date_gt: Int
  date_lt: Int
  date_gte: Int
  date_lte: Int
  date_in: [Int!]
  date_not_in: [Int!]
  pair: String
  pair_not: String
  pair_gt: String
  pair_lt: String
  pair_gte: String
  pair_lte: String
  pair_in: [String!]
  pair_not_in: [String!]
  pair_contains: String
  pair_contains_nocase: String
  pair_not_contains: String
  pair_not_contains_nocase: String
  pair_starts_with: String
  pair_starts_with_nocase: String
  pair_not_starts_with: String
  pair_not_starts_with_nocase: String
  pair_ends_with: String
  pair_ends_with_nocase: String
  pair_not_ends_with: String
  pair_not_ends_with_nocase: String
  token0: String
  token0_not: String
  token0_gt: String
  token0_lt: String
  token0_gte: String
  token0_lte: String
  token0_in: [String!]
  token0_not_in: [String!]
  token0_contains: String
  token0_contains_nocase: String
  token0_not_contains: String
  token0_not_contains_nocase: String
  token0_starts_with: String
  token0_starts_with_nocase: String
  token0_not_starts_with: String
  token0_not_starts_with_nocase: String
  token0_ends_with: String
  token0_ends_with_nocase: String
  token0_not_ends_with: String
  token0_not_ends_with_nocase: String
  token1: String
  token1_not: String
  token1_gt: String
  token1_lt: String
  token1_gte: String
  token1_lte: String
  token1_in: [String!]
  token1_not_in: [String!]
  token1_contains: String
  token1_contains_nocase: String
  token1_not_contains: String
  token1_not_contains_nocase: String
  token1_starts_with: String
  token1_starts_with_nocase: String
  token1_not_starts_with: String
  token1_not_starts_with_nocase: String
  token1_ends_with: String
  token1_ends_with_nocase: String
  token1_not_ends_with: String
  token1_not_ends_with_nocase: String
  reserve0: BigDecimal
  reserve0_not: BigDecimal
  reserve0_gt: BigDecimal
  reserve0_lt: BigDecimal
  reserve0_gte: BigDecimal
  reserve0_lte: BigDecimal
  reserve0_in: [BigDecimal!]
  reserve0_not_in: [BigDecimal!]
  reserve1: BigDecimal
  reserve1_not: BigDecimal
  reserve1_gt: BigDecimal
  reserve1_lt: BigDecimal
  reserve1_gte: BigDecimal
  reserve1_lte: BigDecimal
  reserve1_in: [BigDecimal!]
  reserve1_not_in: [BigDecimal!]
  totalSupply: BigDecimal
  totalSupply_not: BigDecimal
  totalSupply_gt: BigDecimal
  totalSupply_lt: BigDecimal
  totalSupply_gte: BigDecimal
  totalSupply_lte: BigDecimal
  totalSupply_in: [BigDecimal!]
  totalSupply_not_in: [BigDecimal!]
  reserveUSD: BigDecimal
  reserveUSD_not: BigDecimal
  reserveUSD_gt: BigDecimal
  reserveUSD_lt: BigDecimal
  reserveUSD_gte: BigDecimal
  reserveUSD_lte: BigDecimal
  reserveUSD_in: [BigDecimal!]
  reserveUSD_not_in: [BigDecimal!]
  volumeToken0: BigDecimal
  volumeToken0_not: BigDecimal
  volumeToken0_gt: BigDecimal
  volumeToken0_lt: BigDecimal
  volumeToken0_gte: BigDecimal
  volumeToken0_lte: BigDecimal
  volumeToken0_in: [BigDecimal!]
  volumeToken0_not_in: [BigDecimal!]
  volumeToken1: BigDecimal
  volumeToken1_not: BigDecimal
  volumeToken1_gt: BigDecimal
  volumeToken1_lt: BigDecimal
  volumeToken1_gte: BigDecimal
  volumeToken1_lte: BigDecimal
  volumeToken1_in: [BigDecimal!]
  volumeToken1_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
}

enum PairDayData_orderBy {
  id
  date
  pair
  token0
  token1
  reserve0
  reserve1
  totalSupply
  reserveUSD
  volumeToken0
  volumeToken1
  volumeUSD
  txCount
}

type PairHourData {
  id: ID!
  date: Int!
  pair: Pair!
  reserve0: BigDecimal!
  reserve1: BigDecimal!
  reserveUSD: BigDecimal!
  volumeToken0: BigDecimal!
  volumeToken1: BigDecimal!
  volumeUSD: BigDecimal!
  txCount: BigInt!
}

input PairHourData_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  date: Int
  date_not: Int
  date_gt: Int
  date_lt: Int
  date_gte: Int
  date_lte: Int
  date_in: [Int!]
  date_not_in: [Int!]
  pair: String
  pair_not: String
  pair_gt: String
  pair_lt: String
  pair_gte: String
  pair_lte: String
  pair_in: [String!]
  pair_not_in: [String!]
  pair_contains: String
  pair_contains_nocase: String
  pair_not_contains: String
  pair_not_contains_nocase: String
  pair_starts_with: String
  pair_starts_with_nocase: String
  pair_not_starts_with: String
  pair_not_starts_with_nocase: String
  pair_ends_with: String
  pair_ends_with_nocase: String
  pair_not_ends_with: String
  pair_not_ends_with_nocase: String
  reserve0: BigDecimal
  reserve0_not: BigDecimal
  reserve0_gt: BigDecimal
  reserve0_lt: BigDecimal
  reserve0_gte: BigDecimal
  reserve0_lte: BigDecimal
  reserve0_in: [BigDecimal!]
  reserve0_not_in: [BigDecimal!]
  reserve1: BigDecimal
  reserve1_not: BigDecimal
  reserve1_gt: BigDecimal
  reserve1_lt: BigDecimal
  reserve1_gte: BigDecimal
  reserve1_lte: BigDecimal
  reserve1_in: [BigDecimal!]
  reserve1_not_in: [BigDecimal!]
  reserveUSD: BigDecimal
  reserveUSD_not: BigDecimal
  reserveUSD_gt: BigDecimal
  reserveUSD_lt: BigDecimal
  reserveUSD_gte: BigDecimal
  reserveUSD_lte: BigDecimal
  reserveUSD_in: [BigDecimal!]
  reserveUSD_not_in: [BigDecimal!]
  volumeToken0: BigDecimal
  volumeToken0_not: BigDecimal
  volumeToken0_gt: BigDecimal
  volumeToken0_lt: BigDecimal
  volumeToken0_gte: BigDecimal
  volumeToken0_lte: BigDecimal
  volumeToken0_in: [BigDecimal!]
  volumeToken0_not_in: [BigDecimal!]
  volumeToken1: BigDecimal
  volumeToken1_not: BigDecimal
  volumeToken1_gt: BigDecimal
  volumeToken1_lt: BigDecimal
  volumeToken1_gte: BigDecimal
  volumeToken1_lte: BigDecimal
  volumeToken1_in: [BigDecimal!]
  volumeToken1_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
}

enum PairHourData_orderBy {
  id
  date
  pair
  reserve0
  reserve1
  reserveUSD
  volumeToken0
  volumeToken1
  volumeUSD
  txCount
}

input Pair_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  factory: String
  factory_not: String
  factory_gt: String
  factory_lt: String
  factory_gte: String
  factory_lte: String
  factory_in: [String!]
  factory_not_in: [String!]
  factory_contains: String
  factory_contains_nocase: String
  factory_not_contains: String
  factory_not_contains_nocase: String
  factory_starts_with: String
  factory_starts_with_nocase: String
  factory_not_starts_with: String
  factory_not_starts_with_nocase: String
  factory_ends_with: String
  factory_ends_with_nocase: String
  factory_not_ends_with: String
  factory_not_ends_with_nocase: String
  name: String
  name_not: String
  name_gt: String
  name_lt: String
  name_gte: String
  name_lte: String
  name_in: [String!]
  name_not_in: [String!]
  name_contains: String
  name_contains_nocase: String
  name_not_contains: String
  name_not_contains_nocase: String
  name_starts_with: String
  name_starts_with_nocase: String
  name_not_starts_with: String
  name_not_starts_with_nocase: String
  name_ends_with: String
  name_ends_with_nocase: String
  name_not_ends_with: String
  name_not_ends_with_nocase: String
  token0: String
  token0_not: String
  token0_gt: String
  token0_lt: String
  token0_gte: String
  token0_lte: String
  token0_in: [String!]
  token0_not_in: [String!]
  token0_contains: String
  token0_contains_nocase: String
  token0_not_contains: String
  token0_not_contains_nocase: String
  token0_starts_with: String
  token0_starts_with_nocase: String
  token0_not_starts_with: String
  token0_not_starts_with_nocase: String
  token0_ends_with: String
  token0_ends_with_nocase: String
  token0_not_ends_with: String
  token0_not_ends_with_nocase: String
  token1: String
  token1_not: String
  token1_gt: String
  token1_lt: String
  token1_gte: String
  token1_lte: String
  token1_in: [String!]
  token1_not_in: [String!]
  token1_contains: String
  token1_contains_nocase: String
  token1_not_contains: String
  token1_not_contains_nocase: String
  token1_starts_with: String
  token1_starts_with_nocase: String
  token1_not_starts_with: String
  token1_not_starts_with_nocase: String
  token1_ends_with: String
  token1_ends_with_nocase: String
  token1_not_ends_with: String
  token1_not_ends_with_nocase: String
  reserve0: BigDecimal
  reserve0_not: BigDecimal
  reserve0_gt: BigDecimal
  reserve0_lt: BigDecimal
  reserve0_gte: BigDecimal
  reserve0_lte: BigDecimal
  reserve0_in: [BigDecimal!]
  reserve0_not_in: [BigDecimal!]
  reserve1: BigDecimal
  reserve1_not: BigDecimal
  reserve1_gt: BigDecimal
  reserve1_lt: BigDecimal
  reserve1_gte: BigDecimal
  reserve1_lte: BigDecimal
  reserve1_in: [BigDecimal!]
  reserve1_not_in: [BigDecimal!]
  totalSupply: BigDecimal
  totalSupply_not: BigDecimal
  totalSupply_gt: BigDecimal
  totalSupply_lt: BigDecimal
  totalSupply_gte: BigDecimal
  totalSupply_lte: BigDecimal
  totalSupply_in: [BigDecimal!]
  totalSupply_not_in: [BigDecimal!]
  reserveETH: BigDecimal
  reserveETH_not: BigDecimal
  reserveETH_gt: BigDecimal
  reserveETH_lt: BigDecimal
  reserveETH_gte: BigDecimal
  reserveETH_lte: BigDecimal
  reserveETH_in: [BigDecimal!]
  reserveETH_not_in: [BigDecimal!]
  reserveUSD: BigDecimal
  reserveUSD_not: BigDecimal
  reserveUSD_gt: BigDecimal
  reserveUSD_lt: BigDecimal
  reserveUSD_gte: BigDecimal
  reserveUSD_lte: BigDecimal
  reserveUSD_in: [BigDecimal!]
  reserveUSD_not_in: [BigDecimal!]
  trackedReserveETH: BigDecimal
  trackedReserveETH_not: BigDecimal
  trackedReserveETH_gt: BigDecimal
  trackedReserveETH_lt: BigDecimal
  trackedReserveETH_gte: BigDecimal
  trackedReserveETH_lte: BigDecimal
  trackedReserveETH_in: [BigDecimal!]
  trackedReserveETH_not_in: [BigDecimal!]
  token0Price: BigDecimal
  token0Price_not: BigDecimal
  token0Price_gt: BigDecimal
  token0Price_lt: BigDecimal
  token0Price_gte: BigDecimal
  token0Price_lte: BigDecimal
  token0Price_in: [BigDecimal!]
  token0Price_not_in: [BigDecimal!]
  token1Price: BigDecimal
  token1Price_not: BigDecimal
  token1Price_gt: BigDecimal
  token1Price_lt: BigDecimal
  token1Price_gte: BigDecimal
  token1Price_lte: BigDecimal
  token1Price_in: [BigDecimal!]
  token1Price_not_in: [BigDecimal!]
  volumeToken0: BigDecimal
  volumeToken0_not: BigDecimal
  volumeToken0_gt: BigDecimal
  volumeToken0_lt: BigDecimal
  volumeToken0_gte: BigDecimal
  volumeToken0_lte: BigDecimal
  volumeToken0_in: [BigDecimal!]
  volumeToken0_not_in: [BigDecimal!]
  volumeToken1: BigDecimal
  volumeToken1_not: BigDecimal
  volumeToken1_gt: BigDecimal
  volumeToken1_lt: BigDecimal
  volumeToken1_gte: BigDecimal
  volumeToken1_lte: BigDecimal
  volumeToken1_in: [BigDecimal!]
  volumeToken1_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  untrackedVolumeUSD: BigDecimal
  untrackedVolumeUSD_not: BigDecimal
  untrackedVolumeUSD_gt: BigDecimal
  untrackedVolumeUSD_lt: BigDecimal
  untrackedVolumeUSD_gte: BigDecimal
  untrackedVolumeUSD_lte: BigDecimal
  untrackedVolumeUSD_in: [BigDecimal!]
  untrackedVolumeUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
  liquidityProviderCount: BigInt
  liquidityProviderCount_not: BigInt
  liquidityProviderCount_gt: BigInt
  liquidityProviderCount_lt: BigInt
  liquidityProviderCount_gte: BigInt
  liquidityProviderCount_lte: BigInt
  liquidityProviderCount_in: [BigInt!]
  liquidityProviderCount_not_in: [BigInt!]
  timestamp: BigInt
  timestamp_not: BigInt
  timestamp_gt: BigInt
  timestamp_lt: BigInt
  timestamp_gte: BigInt
  timestamp_lte: BigInt
  timestamp_in: [BigInt!]
  timestamp_not_in: [BigInt!]
  block: BigInt
  block_not: BigInt
  block_gt: BigInt
  block_lt: BigInt
  block_gte: BigInt
  block_lte: BigInt
  block_in: [BigInt!]
  block_not_in: [BigInt!]
}

enum Pair_orderBy {
  id
  factory
  name
  token0
  token1
  reserve0
  reserve1
  totalSupply
  reserveETH
  reserveUSD
  trackedReserveETH
  token0Price
  token1Price
  volumeToken0
  volumeToken1
  volumeUSD
  untrackedVolumeUSD
  txCount
  liquidityProviderCount
  liquidityPositions
  liquidityPositionSnapshots
  dayData
  hourData
  mints
  burns
  swaps
  timestamp
  block
}

type Query {
  user(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): User
  users(
    skip: Int = 0
    first: Int = 100
    orderBy: User_orderBy
    orderDirection: OrderDirection
    where: User_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [User!]!
  bundle(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Bundle
  bundles(
    skip: Int = 0
    first: Int = 100
    orderBy: Bundle_orderBy
    orderDirection: OrderDirection
    where: Bundle_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Bundle!]!
  factory(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Factory
  factories(
    skip: Int = 0
    first: Int = 100
    orderBy: Factory_orderBy
    orderDirection: OrderDirection
    where: Factory_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Factory!]!
  hourData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): HourData
  hourDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: HourData_orderBy
    orderDirection: OrderDirection
    where: HourData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [HourData!]!
  dayData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): DayData
  dayDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: DayData_orderBy
    orderDirection: OrderDirection
    where: DayData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [DayData!]!
  token(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Token
  tokens(
    skip: Int = 0
    first: Int = 100
    orderBy: Token_orderBy
    orderDirection: OrderDirection
    where: Token_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Token!]!
  tokenHourData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): TokenHourData
  tokenHourDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: TokenHourData_orderBy
    orderDirection: OrderDirection
    where: TokenHourData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [TokenHourData!]!
  tokenDayData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): TokenDayData
  tokenDayDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: TokenDayData_orderBy
    orderDirection: OrderDirection
    where: TokenDayData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [TokenDayData!]!
  pair(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Pair
  pairs(
    skip: Int = 0
    first: Int = 100
    orderBy: Pair_orderBy
    orderDirection: OrderDirection
    where: Pair_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Pair!]!
  pairHourData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): PairHourData
  pairHourDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: PairHourData_orderBy
    orderDirection: OrderDirection
    where: PairHourData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [PairHourData!]!
  pairDayData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): PairDayData
  pairDayDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: PairDayData_orderBy
    orderDirection: OrderDirection
    where: PairDayData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [PairDayData!]!
  liquidityPosition(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): LiquidityPosition
  liquidityPositions(
    skip: Int = 0
    first: Int = 100
    orderBy: LiquidityPosition_orderBy
    orderDirection: OrderDirection
    where: LiquidityPosition_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [LiquidityPosition!]!
  liquidityPositionSnapshot(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): LiquidityPositionSnapshot
  liquidityPositionSnapshots(
    skip: Int = 0
    first: Int = 100
    orderBy: LiquidityPositionSnapshot_orderBy
    orderDirection: OrderDirection
    where: LiquidityPositionSnapshot_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [LiquidityPositionSnapshot!]!
  transaction(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Transaction
  transactions(
    skip: Int = 0
    first: Int = 100
    orderBy: Transaction_orderBy
    orderDirection: OrderDirection
    where: Transaction_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Transaction!]!
  mint(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Mint
  mints(
    skip: Int = 0
    first: Int = 100
    orderBy: Mint_orderBy
    orderDirection: OrderDirection
    where: Mint_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Mint!]!
  burn(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Burn
  burns(
    skip: Int = 0
    first: Int = 100
    orderBy: Burn_orderBy
    orderDirection: OrderDirection
    where: Burn_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Burn!]!
  swap(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Swap
  swaps(
    skip: Int = 0
    first: Int = 100
    orderBy: Swap_orderBy
    orderDirection: OrderDirection
    where: Swap_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Swap!]!
  """Access to subgraph metadata"""
  _meta(block: Block_height): _Meta_
}

type Subscription {
  user(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): User
  users(
    skip: Int = 0
    first: Int = 100
    orderBy: User_orderBy
    orderDirection: OrderDirection
    where: User_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [User!]!
  bundle(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Bundle
  bundles(
    skip: Int = 0
    first: Int = 100
    orderBy: Bundle_orderBy
    orderDirection: OrderDirection
    where: Bundle_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Bundle!]!
  factory(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Factory
  factories(
    skip: Int = 0
    first: Int = 100
    orderBy: Factory_orderBy
    orderDirection: OrderDirection
    where: Factory_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Factory!]!
  hourData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): HourData
  hourDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: HourData_orderBy
    orderDirection: OrderDirection
    where: HourData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [HourData!]!
  dayData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): DayData
  dayDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: DayData_orderBy
    orderDirection: OrderDirection
    where: DayData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [DayData!]!
  token(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Token
  tokens(
    skip: Int = 0
    first: Int = 100
    orderBy: Token_orderBy
    orderDirection: OrderDirection
    where: Token_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Token!]!
  tokenHourData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): TokenHourData
  tokenHourDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: TokenHourData_orderBy
    orderDirection: OrderDirection
    where: TokenHourData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [TokenHourData!]!
  tokenDayData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): TokenDayData
  tokenDayDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: TokenDayData_orderBy
    orderDirection: OrderDirection
    where: TokenDayData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [TokenDayData!]!
  pair(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Pair
  pairs(
    skip: Int = 0
    first: Int = 100
    orderBy: Pair_orderBy
    orderDirection: OrderDirection
    where: Pair_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Pair!]!
  pairHourData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): PairHourData
  pairHourDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: PairHourData_orderBy
    orderDirection: OrderDirection
    where: PairHourData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [PairHourData!]!
  pairDayData(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): PairDayData
  pairDayDatas(
    skip: Int = 0
    first: Int = 100
    orderBy: PairDayData_orderBy
    orderDirection: OrderDirection
    where: PairDayData_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [PairDayData!]!
  liquidityPosition(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): LiquidityPosition
  liquidityPositions(
    skip: Int = 0
    first: Int = 100
    orderBy: LiquidityPosition_orderBy
    orderDirection: OrderDirection
    where: LiquidityPosition_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [LiquidityPosition!]!
  liquidityPositionSnapshot(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): LiquidityPositionSnapshot
  liquidityPositionSnapshots(
    skip: Int = 0
    first: Int = 100
    orderBy: LiquidityPositionSnapshot_orderBy
    orderDirection: OrderDirection
    where: LiquidityPositionSnapshot_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [LiquidityPositionSnapshot!]!
  transaction(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Transaction
  transactions(
    skip: Int = 0
    first: Int = 100
    orderBy: Transaction_orderBy
    orderDirection: OrderDirection
    where: Transaction_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Transaction!]!
  mint(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Mint
  mints(
    skip: Int = 0
    first: Int = 100
    orderBy: Mint_orderBy
    orderDirection: OrderDirection
    where: Mint_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Mint!]!
  burn(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Burn
  burns(
    skip: Int = 0
    first: Int = 100
    orderBy: Burn_orderBy
    orderDirection: OrderDirection
    where: Burn_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Burn!]!
  swap(
    id: ID!
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): Swap
  swaps(
    skip: Int = 0
    first: Int = 100
    orderBy: Swap_orderBy
    orderDirection: OrderDirection
    where: Swap_filter
    """
    The block at which the query should be executed. Can either be a \`{ hash: Bytes }\` value containing a block hash, a \`{ number: Int }\` containing the block number, or a \`{ number_gte: Int }\` containing the minimum block number. In the case of \`number_gte\`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
    """
    block: Block_height
    """
    Set to \`allow\` to receive data even if the subgraph has skipped over errors while syncing.
    """
    subgraphError: _SubgraphErrorPolicy_! = deny
  ): [Swap!]!
  """Access to subgraph metadata"""
  _meta(block: Block_height): _Meta_
}

type Swap {
  id: ID!
  transaction: Transaction!
  timestamp: BigInt!
  pair: Pair!
  sender: Bytes!
  amount0In: BigDecimal!
  amount1In: BigDecimal!
  amount0Out: BigDecimal!
  amount1Out: BigDecimal!
  to: Bytes!
  logIndex: BigInt
  amountUSD: BigDecimal!
}

input Swap_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  transaction: String
  transaction_not: String
  transaction_gt: String
  transaction_lt: String
  transaction_gte: String
  transaction_lte: String
  transaction_in: [String!]
  transaction_not_in: [String!]
  transaction_contains: String
  transaction_contains_nocase: String
  transaction_not_contains: String
  transaction_not_contains_nocase: String
  transaction_starts_with: String
  transaction_starts_with_nocase: String
  transaction_not_starts_with: String
  transaction_not_starts_with_nocase: String
  transaction_ends_with: String
  transaction_ends_with_nocase: String
  transaction_not_ends_with: String
  transaction_not_ends_with_nocase: String
  timestamp: BigInt
  timestamp_not: BigInt
  timestamp_gt: BigInt
  timestamp_lt: BigInt
  timestamp_gte: BigInt
  timestamp_lte: BigInt
  timestamp_in: [BigInt!]
  timestamp_not_in: [BigInt!]
  pair: String
  pair_not: String
  pair_gt: String
  pair_lt: String
  pair_gte: String
  pair_lte: String
  pair_in: [String!]
  pair_not_in: [String!]
  pair_contains: String
  pair_contains_nocase: String
  pair_not_contains: String
  pair_not_contains_nocase: String
  pair_starts_with: String
  pair_starts_with_nocase: String
  pair_not_starts_with: String
  pair_not_starts_with_nocase: String
  pair_ends_with: String
  pair_ends_with_nocase: String
  pair_not_ends_with: String
  pair_not_ends_with_nocase: String
  sender: Bytes
  sender_not: Bytes
  sender_in: [Bytes!]
  sender_not_in: [Bytes!]
  sender_contains: Bytes
  sender_not_contains: Bytes
  amount0In: BigDecimal
  amount0In_not: BigDecimal
  amount0In_gt: BigDecimal
  amount0In_lt: BigDecimal
  amount0In_gte: BigDecimal
  amount0In_lte: BigDecimal
  amount0In_in: [BigDecimal!]
  amount0In_not_in: [BigDecimal!]
  amount1In: BigDecimal
  amount1In_not: BigDecimal
  amount1In_gt: BigDecimal
  amount1In_lt: BigDecimal
  amount1In_gte: BigDecimal
  amount1In_lte: BigDecimal
  amount1In_in: [BigDecimal!]
  amount1In_not_in: [BigDecimal!]
  amount0Out: BigDecimal
  amount0Out_not: BigDecimal
  amount0Out_gt: BigDecimal
  amount0Out_lt: BigDecimal
  amount0Out_gte: BigDecimal
  amount0Out_lte: BigDecimal
  amount0Out_in: [BigDecimal!]
  amount0Out_not_in: [BigDecimal!]
  amount1Out: BigDecimal
  amount1Out_not: BigDecimal
  amount1Out_gt: BigDecimal
  amount1Out_lt: BigDecimal
  amount1Out_gte: BigDecimal
  amount1Out_lte: BigDecimal
  amount1Out_in: [BigDecimal!]
  amount1Out_not_in: [BigDecimal!]
  to: Bytes
  to_not: Bytes
  to_in: [Bytes!]
  to_not_in: [Bytes!]
  to_contains: Bytes
  to_not_contains: Bytes
  logIndex: BigInt
  logIndex_not: BigInt
  logIndex_gt: BigInt
  logIndex_lt: BigInt
  logIndex_gte: BigInt
  logIndex_lte: BigInt
  logIndex_in: [BigInt!]
  logIndex_not_in: [BigInt!]
  amountUSD: BigDecimal
  amountUSD_not: BigDecimal
  amountUSD_gt: BigDecimal
  amountUSD_lt: BigDecimal
  amountUSD_gte: BigDecimal
  amountUSD_lte: BigDecimal
  amountUSD_in: [BigDecimal!]
  amountUSD_not_in: [BigDecimal!]
}

enum Swap_orderBy {
  id
  transaction
  timestamp
  pair
  sender
  amount0In
  amount1In
  amount0Out
  amount1Out
  to
  logIndex
  amountUSD
}

type Token {
  id: ID!
  factory: Factory!
  symbol: String!
  name: String!
  decimals: BigInt!
  totalSupply: BigInt!
  volume: BigDecimal!
  volumeUSD: BigDecimal!
  untrackedVolumeUSD: BigDecimal!
  txCount: BigInt!
  liquidity: BigDecimal!
  derivedETH: BigDecimal!
  whitelistPairs(skip: Int = 0, first: Int = 100, orderBy: Pair_orderBy, orderDirection: OrderDirection, where: Pair_filter): [Pair!]!
  hourData(skip: Int = 0, first: Int = 100, orderBy: TokenHourData_orderBy, orderDirection: OrderDirection, where: TokenHourData_filter): [TokenHourData!]!
  dayData(skip: Int = 0, first: Int = 100, orderBy: TokenDayData_orderBy, orderDirection: OrderDirection, where: TokenDayData_filter): [TokenDayData!]!
  basePairs(skip: Int = 0, first: Int = 100, orderBy: Pair_orderBy, orderDirection: OrderDirection, where: Pair_filter): [Pair!]!
  quotePairs(skip: Int = 0, first: Int = 100, orderBy: Pair_orderBy, orderDirection: OrderDirection, where: Pair_filter): [Pair!]!
  basePairsDayData(skip: Int = 0, first: Int = 100, orderBy: PairDayData_orderBy, orderDirection: OrderDirection, where: PairDayData_filter): [PairDayData!]!
  quotePairsDayData(skip: Int = 0, first: Int = 100, orderBy: PairDayData_orderBy, orderDirection: OrderDirection, where: PairDayData_filter): [PairDayData!]!
}

type TokenDayData {
  id: ID!
  date: Int!
  token: Token!
  volume: BigDecimal!
  volumeETH: BigDecimal!
  volumeUSD: BigDecimal!
  txCount: BigInt!
  liquidity: BigDecimal!
  liquidityETH: BigDecimal!
  liquidityUSD: BigDecimal!
  priceUSD: BigDecimal!
}

input TokenDayData_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  date: Int
  date_not: Int
  date_gt: Int
  date_lt: Int
  date_gte: Int
  date_lte: Int
  date_in: [Int!]
  date_not_in: [Int!]
  token: String
  token_not: String
  token_gt: String
  token_lt: String
  token_gte: String
  token_lte: String
  token_in: [String!]
  token_not_in: [String!]
  token_contains: String
  token_contains_nocase: String
  token_not_contains: String
  token_not_contains_nocase: String
  token_starts_with: String
  token_starts_with_nocase: String
  token_not_starts_with: String
  token_not_starts_with_nocase: String
  token_ends_with: String
  token_ends_with_nocase: String
  token_not_ends_with: String
  token_not_ends_with_nocase: String
  volume: BigDecimal
  volume_not: BigDecimal
  volume_gt: BigDecimal
  volume_lt: BigDecimal
  volume_gte: BigDecimal
  volume_lte: BigDecimal
  volume_in: [BigDecimal!]
  volume_not_in: [BigDecimal!]
  volumeETH: BigDecimal
  volumeETH_not: BigDecimal
  volumeETH_gt: BigDecimal
  volumeETH_lt: BigDecimal
  volumeETH_gte: BigDecimal
  volumeETH_lte: BigDecimal
  volumeETH_in: [BigDecimal!]
  volumeETH_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
  liquidity: BigDecimal
  liquidity_not: BigDecimal
  liquidity_gt: BigDecimal
  liquidity_lt: BigDecimal
  liquidity_gte: BigDecimal
  liquidity_lte: BigDecimal
  liquidity_in: [BigDecimal!]
  liquidity_not_in: [BigDecimal!]
  liquidityETH: BigDecimal
  liquidityETH_not: BigDecimal
  liquidityETH_gt: BigDecimal
  liquidityETH_lt: BigDecimal
  liquidityETH_gte: BigDecimal
  liquidityETH_lte: BigDecimal
  liquidityETH_in: [BigDecimal!]
  liquidityETH_not_in: [BigDecimal!]
  liquidityUSD: BigDecimal
  liquidityUSD_not: BigDecimal
  liquidityUSD_gt: BigDecimal
  liquidityUSD_lt: BigDecimal
  liquidityUSD_gte: BigDecimal
  liquidityUSD_lte: BigDecimal
  liquidityUSD_in: [BigDecimal!]
  liquidityUSD_not_in: [BigDecimal!]
  priceUSD: BigDecimal
  priceUSD_not: BigDecimal
  priceUSD_gt: BigDecimal
  priceUSD_lt: BigDecimal
  priceUSD_gte: BigDecimal
  priceUSD_lte: BigDecimal
  priceUSD_in: [BigDecimal!]
  priceUSD_not_in: [BigDecimal!]
}

enum TokenDayData_orderBy {
  id
  date
  token
  volume
  volumeETH
  volumeUSD
  txCount
  liquidity
  liquidityETH
  liquidityUSD
  priceUSD
}

type TokenHourData {
  id: ID!
  date: Int!
  token: Token!
  volume: BigDecimal!
  volumeETH: BigDecimal!
  volumeUSD: BigDecimal!
  txCount: BigInt!
  liquidity: BigDecimal!
  liquidityETH: BigDecimal!
  liquidityUSD: BigDecimal!
  priceUSD: BigDecimal!
}

input TokenHourData_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  date: Int
  date_not: Int
  date_gt: Int
  date_lt: Int
  date_gte: Int
  date_lte: Int
  date_in: [Int!]
  date_not_in: [Int!]
  token: String
  token_not: String
  token_gt: String
  token_lt: String
  token_gte: String
  token_lte: String
  token_in: [String!]
  token_not_in: [String!]
  token_contains: String
  token_contains_nocase: String
  token_not_contains: String
  token_not_contains_nocase: String
  token_starts_with: String
  token_starts_with_nocase: String
  token_not_starts_with: String
  token_not_starts_with_nocase: String
  token_ends_with: String
  token_ends_with_nocase: String
  token_not_ends_with: String
  token_not_ends_with_nocase: String
  volume: BigDecimal
  volume_not: BigDecimal
  volume_gt: BigDecimal
  volume_lt: BigDecimal
  volume_gte: BigDecimal
  volume_lte: BigDecimal
  volume_in: [BigDecimal!]
  volume_not_in: [BigDecimal!]
  volumeETH: BigDecimal
  volumeETH_not: BigDecimal
  volumeETH_gt: BigDecimal
  volumeETH_lt: BigDecimal
  volumeETH_gte: BigDecimal
  volumeETH_lte: BigDecimal
  volumeETH_in: [BigDecimal!]
  volumeETH_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
  liquidity: BigDecimal
  liquidity_not: BigDecimal
  liquidity_gt: BigDecimal
  liquidity_lt: BigDecimal
  liquidity_gte: BigDecimal
  liquidity_lte: BigDecimal
  liquidity_in: [BigDecimal!]
  liquidity_not_in: [BigDecimal!]
  liquidityETH: BigDecimal
  liquidityETH_not: BigDecimal
  liquidityETH_gt: BigDecimal
  liquidityETH_lt: BigDecimal
  liquidityETH_gte: BigDecimal
  liquidityETH_lte: BigDecimal
  liquidityETH_in: [BigDecimal!]
  liquidityETH_not_in: [BigDecimal!]
  liquidityUSD: BigDecimal
  liquidityUSD_not: BigDecimal
  liquidityUSD_gt: BigDecimal
  liquidityUSD_lt: BigDecimal
  liquidityUSD_gte: BigDecimal
  liquidityUSD_lte: BigDecimal
  liquidityUSD_in: [BigDecimal!]
  liquidityUSD_not_in: [BigDecimal!]
  priceUSD: BigDecimal
  priceUSD_not: BigDecimal
  priceUSD_gt: BigDecimal
  priceUSD_lt: BigDecimal
  priceUSD_gte: BigDecimal
  priceUSD_lte: BigDecimal
  priceUSD_in: [BigDecimal!]
  priceUSD_not_in: [BigDecimal!]
}

enum TokenHourData_orderBy {
  id
  date
  token
  volume
  volumeETH
  volumeUSD
  txCount
  liquidity
  liquidityETH
  liquidityUSD
  priceUSD
}

input Token_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  factory: String
  factory_not: String
  factory_gt: String
  factory_lt: String
  factory_gte: String
  factory_lte: String
  factory_in: [String!]
  factory_not_in: [String!]
  factory_contains: String
  factory_contains_nocase: String
  factory_not_contains: String
  factory_not_contains_nocase: String
  factory_starts_with: String
  factory_starts_with_nocase: String
  factory_not_starts_with: String
  factory_not_starts_with_nocase: String
  factory_ends_with: String
  factory_ends_with_nocase: String
  factory_not_ends_with: String
  factory_not_ends_with_nocase: String
  symbol: String
  symbol_not: String
  symbol_gt: String
  symbol_lt: String
  symbol_gte: String
  symbol_lte: String
  symbol_in: [String!]
  symbol_not_in: [String!]
  symbol_contains: String
  symbol_contains_nocase: String
  symbol_not_contains: String
  symbol_not_contains_nocase: String
  symbol_starts_with: String
  symbol_starts_with_nocase: String
  symbol_not_starts_with: String
  symbol_not_starts_with_nocase: String
  symbol_ends_with: String
  symbol_ends_with_nocase: String
  symbol_not_ends_with: String
  symbol_not_ends_with_nocase: String
  name: String
  name_not: String
  name_gt: String
  name_lt: String
  name_gte: String
  name_lte: String
  name_in: [String!]
  name_not_in: [String!]
  name_contains: String
  name_contains_nocase: String
  name_not_contains: String
  name_not_contains_nocase: String
  name_starts_with: String
  name_starts_with_nocase: String
  name_not_starts_with: String
  name_not_starts_with_nocase: String
  name_ends_with: String
  name_ends_with_nocase: String
  name_not_ends_with: String
  name_not_ends_with_nocase: String
  decimals: BigInt
  decimals_not: BigInt
  decimals_gt: BigInt
  decimals_lt: BigInt
  decimals_gte: BigInt
  decimals_lte: BigInt
  decimals_in: [BigInt!]
  decimals_not_in: [BigInt!]
  totalSupply: BigInt
  totalSupply_not: BigInt
  totalSupply_gt: BigInt
  totalSupply_lt: BigInt
  totalSupply_gte: BigInt
  totalSupply_lte: BigInt
  totalSupply_in: [BigInt!]
  totalSupply_not_in: [BigInt!]
  volume: BigDecimal
  volume_not: BigDecimal
  volume_gt: BigDecimal
  volume_lt: BigDecimal
  volume_gte: BigDecimal
  volume_lte: BigDecimal
  volume_in: [BigDecimal!]
  volume_not_in: [BigDecimal!]
  volumeUSD: BigDecimal
  volumeUSD_not: BigDecimal
  volumeUSD_gt: BigDecimal
  volumeUSD_lt: BigDecimal
  volumeUSD_gte: BigDecimal
  volumeUSD_lte: BigDecimal
  volumeUSD_in: [BigDecimal!]
  volumeUSD_not_in: [BigDecimal!]
  untrackedVolumeUSD: BigDecimal
  untrackedVolumeUSD_not: BigDecimal
  untrackedVolumeUSD_gt: BigDecimal
  untrackedVolumeUSD_lt: BigDecimal
  untrackedVolumeUSD_gte: BigDecimal
  untrackedVolumeUSD_lte: BigDecimal
  untrackedVolumeUSD_in: [BigDecimal!]
  untrackedVolumeUSD_not_in: [BigDecimal!]
  txCount: BigInt
  txCount_not: BigInt
  txCount_gt: BigInt
  txCount_lt: BigInt
  txCount_gte: BigInt
  txCount_lte: BigInt
  txCount_in: [BigInt!]
  txCount_not_in: [BigInt!]
  liquidity: BigDecimal
  liquidity_not: BigDecimal
  liquidity_gt: BigDecimal
  liquidity_lt: BigDecimal
  liquidity_gte: BigDecimal
  liquidity_lte: BigDecimal
  liquidity_in: [BigDecimal!]
  liquidity_not_in: [BigDecimal!]
  derivedETH: BigDecimal
  derivedETH_not: BigDecimal
  derivedETH_gt: BigDecimal
  derivedETH_lt: BigDecimal
  derivedETH_gte: BigDecimal
  derivedETH_lte: BigDecimal
  derivedETH_in: [BigDecimal!]
  derivedETH_not_in: [BigDecimal!]
  whitelistPairs: [String!]
  whitelistPairs_not: [String!]
  whitelistPairs_contains: [String!]
  whitelistPairs_contains_nocase: [String!]
  whitelistPairs_not_contains: [String!]
  whitelistPairs_not_contains_nocase: [String!]
}

enum Token_orderBy {
  id
  factory
  symbol
  name
  decimals
  totalSupply
  volume
  volumeUSD
  untrackedVolumeUSD
  txCount
  liquidity
  derivedETH
  whitelistPairs
  hourData
  dayData
  basePairs
  quotePairs
  basePairsDayData
  quotePairsDayData
}

type Transaction {
  id: ID!
  blockNumber: BigInt!
  timestamp: BigInt!
  mints(skip: Int = 0, first: Int = 100, orderBy: Mint_orderBy, orderDirection: OrderDirection, where: Mint_filter): [Mint]!
  burns(skip: Int = 0, first: Int = 100, orderBy: Burn_orderBy, orderDirection: OrderDirection, where: Burn_filter): [Burn]!
  swaps(skip: Int = 0, first: Int = 100, orderBy: Swap_orderBy, orderDirection: OrderDirection, where: Swap_filter): [Swap]!
}

input Transaction_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
  blockNumber: BigInt
  blockNumber_not: BigInt
  blockNumber_gt: BigInt
  blockNumber_lt: BigInt
  blockNumber_gte: BigInt
  blockNumber_lte: BigInt
  blockNumber_in: [BigInt!]
  blockNumber_not_in: [BigInt!]
  timestamp: BigInt
  timestamp_not: BigInt
  timestamp_gt: BigInt
  timestamp_lt: BigInt
  timestamp_gte: BigInt
  timestamp_lte: BigInt
  timestamp_in: [BigInt!]
  timestamp_not_in: [BigInt!]
  mints: [String!]
  mints_not: [String!]
  mints_contains: [String!]
  mints_contains_nocase: [String!]
  mints_not_contains: [String!]
  mints_not_contains_nocase: [String!]
  burns: [String!]
  burns_not: [String!]
  burns_contains: [String!]
  burns_contains_nocase: [String!]
  burns_not_contains: [String!]
  burns_not_contains_nocase: [String!]
  swaps: [String!]
  swaps_not: [String!]
  swaps_contains: [String!]
  swaps_contains_nocase: [String!]
  swaps_not_contains: [String!]
  swaps_not_contains_nocase: [String!]
}

enum Transaction_orderBy {
  id
  blockNumber
  timestamp
  mints
  burns
  swaps
}

type User {
  id: ID!
  liquidityPositions(skip: Int = 0, first: Int = 100, orderBy: LiquidityPosition_orderBy, orderDirection: OrderDirection, where: LiquidityPosition_filter): [LiquidityPosition!]!
}

input User_filter {
  id: ID
  id_not: ID
  id_gt: ID
  id_lt: ID
  id_gte: ID
  id_lte: ID
  id_in: [ID!]
  id_not_in: [ID!]
}

enum User_orderBy {
  id
  liquidityPositions
}

type _Block_ {
  """The hash of the block"""
  hash: Bytes
  """The block number"""
  number: Int!
}

"""The type for the top-level _meta field"""
type _Meta_ {
  """
  Information about a specific subgraph block. The hash of the block
  will be null if the _meta field has a block constraint that asks for
  a block number. It will be filled if the _meta field has no block constraint
  and therefore asks for the latest  block
  
  """
  block: _Block_!
  """The deployment ID"""
  deployment: String!
  """If \`true\`, the subgraph encountered indexing errors at some past block"""
  hasIndexingErrors: Boolean!
}

enum _SubgraphErrorPolicy_ {
  """Data will be returned even if the subgraph has indexing errors"""
  allow
  """
  If the subgraph has indexing errors, data will be omitted. The default.
  """
  deny
}
`, `.graphclient/sources/fuse-exchange/schema.graphql`);

export default buildSchema(source, {
  assumeValid: true,
  assumeValidSDL: true
});