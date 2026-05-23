import type { CrossChainStepResponse as CrossChainStepSchemaResponse } from 'src/app/(networks)/(evm)/api/cross-chain/step/route'
import {} from 'src/app/(networks)/(evm)/api/cross-chain/step/route'
import type { LifiXSwapSupportedChainId } from 'src/config'

type CrossChainType = 'swap' | 'cross' | 'lifi' | 'protocol'
type CrossChainRouteOrder = 'CHEAPEST' | 'FASTEST'

type StepSchema<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = CrossChainStepSchemaResponse<TChainId0, TChainId1>

type AnyStep = StepSchema<LifiXSwapSupportedChainId, LifiXSwapSupportedChainId>

type CrossChainToken<
  TChainId extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = Omit<StepSchema<TChainId, TChainId>['action']['fromToken'], 'chainId'> & {
  chainId: TChainId
}

type CrossChainAction<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = Omit<
  StepSchema<TChainId0, TChainId1>['action'],
  | 'fromChainId'
  | 'toChainId'
  | 'fromToken'
  | 'toToken'
  | 'fromAddress'
  | 'toAddress'
> & {
  fromChainId: TChainId0
  fromToken: CrossChainToken<TChainId0>
  toChainId: TChainId1
  toToken: CrossChainToken<TChainId1>
  fromAddress?: CrossChainToken<TChainId0>['address']
  toAddress?: CrossChainToken<TChainId1>['address']
}

type CrossChainEstimate = Omit<
  AnyStep['estimate'],
  'approvalAddress' | 'feeCosts' | 'gasCosts'
> & {
  approvalAddress: CrossChainToken<LifiXSwapSupportedChainId>['address']
  feeCosts: (Omit<AnyStep['estimate']['feeCosts'][number], 'token'> & {
    token: CrossChainToken<LifiXSwapSupportedChainId>
  })[]
  gasCosts: (Omit<AnyStep['estimate']['gasCosts'][number], 'token'> & {
    token: CrossChainToken<LifiXSwapSupportedChainId>
  })[]
}

type CrossChainToolDetails = AnyStep['toolDetails']

type CrossChainTransactionRequest<
  TChainId extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = NonNullable<StepSchema<TChainId, TChainId>['transactionRequest']>

type CrossChainStep<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = Omit<
  StepSchema<TChainId0, TChainId1>,
  'type' | 'action' | 'estimate' | 'transactionRequest' | 'includedSteps'
> & {
  type: CrossChainType
  action: CrossChainAction<TChainId0, TChainId1>
  estimate: CrossChainEstimate
  transactionRequest?: CrossChainTransactionRequest<TChainId0>
  includedSteps: CrossChainStep<TChainId0, TChainId1>[]
  includedStepsWithoutFees: CrossChainStep<TChainId0, TChainId1>[]
}

type CrossChainRoute<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = {
  id: string
  fromChainId: TChainId0
  fromAmount: string
  fromToken: CrossChainToken<TChainId0>
  toChainId: TChainId1
  toAmount: string
  toAmountMin: string
  toToken: CrossChainToken<TChainId1>
  gasCostUSD?: string
  step: CrossChainStep<TChainId0, TChainId1>
  tags?: string[]
  transactionRequest?: CrossChainTransactionRequest<TChainId0>
}

type CrossChainRoutesResponse<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = {
  routes: CrossChainRoute<TChainId0, TChainId1>[]
}

type CrossChainStepResponse<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = CrossChainStep<TChainId0, TChainId1>

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
