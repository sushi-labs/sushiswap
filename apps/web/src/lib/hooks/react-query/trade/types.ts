import type { Amount, Percent, Price } from 'sushi'
import type {
  EvmChainId,
  EvmCurrency,
  RouterLiquiditySource,
  routeProcessor2Abi_processRoute,
  routeProcessor2Abi_transferValueAndprocessRoute,
} from 'sushi/evm'
import type { Address, Hex, WriteContractParameters } from 'viem'
import type z from 'zod'
import type { legValidator, tradeValidator01 } from './validator01'
import type { tradeValidator02 } from './validator02'

export interface UseTradeParams {
  chainId: EvmChainId
  fromToken: EvmCurrency | undefined
  toToken: EvmCurrency | undefined
  amount: Amount<EvmCurrency> | undefined
  gasPrice?: bigint | null | undefined
  fee?: number
  slippagePercentage: string
  onlyPools?: Address[]
  recipient: Address | undefined
  source?: RouterLiquiditySource
  enabled: boolean
  carbonOffset: boolean
  onError?(e: Error): void
  tokenTax?: Percent | false | undefined
}

export type UseTradeReturnWriteArgs =
  | WriteContractParameters<
      typeof routeProcessor2Abi_transferValueAndprocessRoute,
      'transferValueAndprocessRoute'
    >['args']
  | WriteContractParameters<
      typeof routeProcessor2Abi_processRoute,
      'processRoute'
    >['args']
  | undefined

export interface UseTradeReturn {
  swapPrice: Price<EvmCurrency, EvmCurrency> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<EvmCurrency> | undefined
  amountOut: Amount<EvmCurrency> | undefined
  minAmountOut: Amount<EvmCurrency> | undefined
  gasSpent: string | undefined
  gasSpentUsd: string | undefined
  route: TradeType1['route']
  tx:
    | {
        from: Address
        to: Address
        gas?: string | undefined
        gasPrice?: number | undefined
        data: Hex
        value?: bigint | undefined
      }
    | undefined
  tokenTax: Percent | false | undefined
  fee: string | undefined
}

export type UseTradeQuerySelect = (data: TradeType1) => UseTradeReturn
export type TradeType1 = z.infer<typeof tradeValidator01>
export type TradeType2 = z.infer<typeof tradeValidator02>
export type TradeLegType = z.infer<typeof legValidator>
