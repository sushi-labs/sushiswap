import { ChainId } from 'sushi/chain'
import { Type } from 'sushi/currency'
import { TradeType } from 'sushi/dex'
import { SushiSwapV2Pool } from 'sushi/pool'
import { UniV3Pool } from 'sushi/tines'
import { PublicWagmiConfig } from '../../../config/public'

export enum PoolType {
  SushiSwapV2Pool = 'SushiSwapV2',
}

export interface UsePoolsParams {
  chainId: ChainId
  currencyA: Type | undefined
  currencyB: Type | undefined
  tradeType?: TradeType
  enabled?: boolean
  withBentoPools?: boolean
  withCombinations?: boolean
  config: PublicWagmiConfig
}

export type UsePoolsReturn = {
  sushiSwapV2Pools: SushiSwapV2Pool[] | undefined
  sushiSwapV3Pools: UniV3Pool[] | undefined
}
