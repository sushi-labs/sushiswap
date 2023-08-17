import { SushiSwapV2Pool, TradeType, TridentConstantPool, TridentStablePool } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { BridgeBento, UniV3Pool } from '@sushiswap/tines'

export enum PoolType {
  SushiSwapV2Pool = 'SushiSwapV2',
  TridentConstantPool = 'TridentConstant',
  TridentStablePool = 'TridentStable',
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
  sushiSwapV2Pools: SushiSwapV2Pool[] | undefined
  tridentConstantPools: TridentConstantPool[] | undefined
  tridentStablePools: TridentStablePool[] | undefined
  bridgeBentoPools: BridgeBento[] | undefined
  sushiSwapV3Pools: UniV3Pool[] | undefined
}
