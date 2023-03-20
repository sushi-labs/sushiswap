import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { ConstantProductPool, Pair, StablePool, TradeType } from '@sushiswap/amm'
import { BridgeBento } from '@sushiswap/tines'

export enum PoolType {
  V2,
  ConstantProduct,
  StablePool,
}

export interface UsePoolsParams {
  chainId: ChainId
  currencyA: Type | undefined
  currencyB: Type | undefined
  tradeType?: TradeType
  enabled?: boolean
  withBentoPools?: boolean
  withCombinations?: boolean
}

export type UsePoolsReturn = {
  pairs: Pair[] | undefined
  constantProductPools: ConstantProductPool[] | undefined
  stablePools: StablePool[] | undefined
  bridgeBentoPools: BridgeBento[] | undefined
}
