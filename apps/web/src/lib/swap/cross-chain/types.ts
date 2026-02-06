import type { XSwapSupportedChainId } from 'src/config'
import type { EvmChainId } from 'sushi/evm'
import type { SvmAddress, SvmChainId } from 'sushi/svm'
import type { Hex } from 'viem'

type CrossChainType = 'swap' | 'cross' | 'lifi' | 'protocol'

type CrossChainToken<
  TChainId extends XSwapSupportedChainId = XSwapSupportedChainId,
> = {
  address: TChainId extends SvmChainId ? SvmAddress : `0x${string}`
  chainId: TChainId
  decimals: number
  symbol: string
  name: string
  priceUSD: string
}

type CrossChainAction<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> = {
  fromChainId: TChainId0
  fromAmount: string
  fromToken: CrossChainToken<TChainId0>
  toChainId: TChainId1
  toToken: CrossChainToken<TChainId1>
  slippage: number
  fromAddress?: CrossChainToken<TChainId0>['address']
  toAddress?: CrossChainToken<TChainId1>['address']
}

type CrossChainEstimate = {
  tool: string
  fromAmount: string
  toAmount: string
  toAmountMin: string
  approvalAddress:
    | CrossChainToken<XSwapSupportedChainId & EvmChainId>['address']
    | CrossChainToken<XSwapSupportedChainId & SvmChainId>['address']
  feeCosts: {
    name: string
    description: string
    percentage: string
    token: CrossChainToken<XSwapSupportedChainId>
    amount: string
    amountUSD: string
    included: boolean
  }[]
  gasCosts: {
    type: 'SUM' | 'APPROVE' | 'SEND'
    price: string
    estimate: string
    limit: string
    amount: string
    amountUSD: string
    token: CrossChainToken<XSwapSupportedChainId>
  }[]
  executionDuration: number
}

type CrossChainToolDetails = {
  key: string
  name: string
  logoURI: string
}

type CrossChainTransactionRequest = {
  chainId?: XSwapSupportedChainId & (EvmChainId | SvmChainId)
  to?: `0x${string}` | null
  from?: `0x${string}`
  data?: Hex
  gasLimit?: Hex | bigint
  gasPrice?: Hex | bigint
  value?: Hex | bigint
  [key: string]: any
}

type CrossChainStep<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> = {
  id: string
  type: CrossChainType
  tool: string
  toolDetails: CrossChainToolDetails
  action: CrossChainAction<TChainId0, TChainId1>
  estimate: CrossChainEstimate
  transactionRequest?: CrossChainTransactionRequest
  includedSteps: CrossChainStep<TChainId0, TChainId1>[]
  includedStepsWithoutFees: CrossChainStep<TChainId0, TChainId1>[]
}

type CrossChainRoute<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> = {
  id: string
  fromChainId: TChainId0
  fromAmount: string
  fromToken: CrossChainToken<TChainId0>
  toChainId: TChainId1
  toAmount: string
  toAmountMin: string
  toToken: CrossChainToken<TChainId1>
  gasCostUSD: string
  step: CrossChainStep<TChainId0, TChainId1>
  tags?: string[]
  transactionRequest?: CrossChainTransactionRequest
}

type CrossChainRoutesResponse<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> = {
  routes: CrossChainRoute<TChainId0, TChainId1>[]
}

type CrossChainStepResponse<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> = CrossChainStep<TChainId0, TChainId1>

type CrossChainRouteOrder = 'CHEAPEST' | 'FASTEST'

export type {
  CrossChainAction,
  CrossChainEstimate,
  CrossChainRoute,
  CrossChainRouteOrder,
  CrossChainRoutesResponse,
  CrossChainStep,
  CrossChainStepResponse,
  CrossChainToken,
  CrossChainToolDetails,
  CrossChainTransactionRequest,
}
