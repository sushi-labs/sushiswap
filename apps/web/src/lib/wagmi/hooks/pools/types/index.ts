import type {
  EvmChainId,
  EvmCurrency,
  SushiSwapV2Pool,
  SushiSwapV3Pool,
  TradeType,
} from 'sushi/evm'
import type { PublicWagmiConfig } from '../../../config/public'

export enum PoolType {
  SushiSwapV2Pool = 'SushiSwapV2',
}

export interface UsePoolsParams {
  chainId: EvmChainId
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  tradeType?: TradeType
  enabled?: boolean
  withBentoPools?: boolean
  withCombinations?: boolean
  config: PublicWagmiConfig
}

export type UsePoolsReturn = {
  sushiSwapV2Pools: SushiSwapV2Pool[] | undefined
  sushiSwapV3Pools: SushiSwapV3Pool[] | undefined
}
