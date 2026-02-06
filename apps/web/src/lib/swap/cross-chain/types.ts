import type { CrossChainRoutesResponse } from 'src/app/(networks)/(evm)/api/cross-chain/routes/route'
import type { CrossChainStepResponse } from 'src/app/(networks)/(evm)/api/cross-chain/step/route'

type CrossChainRoute = CrossChainRoutesResponse['routes'][number]

type CrossChainStep = CrossChainStepResponse

type CrossChainAction = CrossChainStep['action']

type CrossChainEstimate = CrossChainStep['estimate']

type CrossChainToolDetails = CrossChainStep['toolDetails']

type CrossChainTransactionRequest = CrossChainStep['transactionRequest']

type CrossChainRouteOrder = 'CHEAPEST' | 'FASTEST'

export type {
  CrossChainAction,
  CrossChainEstimate,
  CrossChainRoute,
  CrossChainStep,
  CrossChainToolDetails,
  CrossChainTransactionRequest,
  CrossChainRouteOrder,
  CrossChainRoutesResponse,
  CrossChainStepResponse,
}
