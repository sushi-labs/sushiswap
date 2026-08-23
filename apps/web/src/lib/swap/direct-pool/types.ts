import type {
  UseEvmTradeParams,
  UseEvmTradeReturn,
} from 'src/lib/hooks/react-query/trade/types'
import type { Amount, Fraction } from 'sushi'
import type { EvmAddress, EvmChainId, EvmCurrency } from 'sushi/evm'

export interface DirectPool {
  address: EvmAddress
  quoteTokenAddress: EvmAddress
  launchTokenAddress: EvmAddress
  feeTier: number
}

export type UseDirectPoolTradeParams = UseEvmTradeParams & {
  directPool: DirectPool | undefined
}

export interface CreateDirectPoolTradeParams {
  amount: Amount<EvmCurrency>
  chainId: EvmChainId
  effectiveFee: number
  estimatedGas: bigint
  fromToken: EvmCurrency
  gasPrice: bigint | null | undefined
  grossAmountOut: bigint
  nativePrice: Fraction | undefined
  slippagePercentage: string
  toToken: EvmCurrency
  tx?: UseEvmTradeReturn['tx']
}
