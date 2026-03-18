import type { SolanaTransaction } from '@solana/connector'
import type {
  Base64EncodedWireTransaction,
  ReadonlyUint8Array,
} from '@solana/kit'
import type { Amount, Percent, Price } from 'sushi'
import type { EvmChainId, EvmCurrency, RouterLiquiditySource } from 'sushi/evm'
import type { SvmAddress, SvmChainId, SvmCurrency } from 'sushi/svm'
import type { Address, Hex } from 'viem'
import type * as z from 'zod'
import type { SvmExecuteResponse, SvmOrderResponse } from './svmUltraValidator'
import type { legValidator, tradeValidator01 } from './validator01'
import type { tradeValidator02 } from './validator02'

export interface UseEvmTradeParams {
  chainId: EvmChainId | undefined
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

export interface UseEvmTradeReturn {
  swapPrice: Price<EvmCurrency, EvmCurrency> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<EvmCurrency> | undefined
  amountOut: Amount<EvmCurrency> | undefined
  minAmountOut: Amount<EvmCurrency> | undefined
  gasSpent: string | undefined
  gasSpentUsd: string | undefined
  route: TradeType1['route']
  status: NonNullable<TradeType1['route']>['status'] | undefined
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
  routingSource: string | undefined
}

export interface UseSvmTradeParams {
  chainId: SvmChainId | undefined
  fromToken: SvmCurrency | undefined
  toToken: SvmCurrency | undefined
  amount: Amount<SvmCurrency> | undefined
  recipient: SvmAddress | undefined
  enabled: boolean
  onError?(e: Error): void
  order?: SvmOrderResponse
  requestId?: string
  unsignedBytes?: ReadonlyUint8Array<ArrayBuffer>
}

export type UseSvmTradeReturn = {
  swapPrice: Price<SvmCurrency, SvmCurrency> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<SvmCurrency> | undefined
  amountOut: Amount<SvmCurrency> | undefined
  minAmountOut: Amount<SvmCurrency> | undefined
  gasSpent: string | undefined
  gasSpentUsd: string | undefined
  route: SvmOrderResponse | undefined
  status: NonNullable<TradeType1['route']>['status'] | undefined
  tokenTax: Percent | false | undefined
  fee: string | undefined
  routingSource: string | undefined
} & (
  | {
      tx: SvmExecuteResponse | undefined
      type: 'swap' | undefined
    }
  | {
      tx: Base64EncodedWireTransaction | undefined
      type: 'wrap/unwrap' | undefined
    }
)

export type UseEvmTradeQuerySelect = (data: TradeType1) => UseEvmTradeReturn
export type UseSvmTradeQuoteQuerySelect = (
  data: SvmOrderResponse,
) => UseSvmTradeReturn
export type TradeType1 = z.infer<typeof tradeValidator01>
export type TradeType2 = z.infer<typeof tradeValidator02>
export type TradeLegType = z.infer<typeof legValidator>
