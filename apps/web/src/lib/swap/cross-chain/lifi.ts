import { type XSwapSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import { SvmChainId, isSvmChainId } from 'sushi/svm'

export const LIFI_SOLANA_CHAIN_ID = 1151111081099710 as const

type LifiTokenLike = { chainId: number }
type LifiStepLike = {
  action: {
    fromChainId: number
    toChainId: number
    fromToken: LifiTokenLike
    toToken: LifiTokenLike
  }
  estimate: {
    feeCosts: Array<{ token: LifiTokenLike }>
    gasCosts: Array<{ token: LifiTokenLike }>
  }
  includedSteps?: LifiStepLike[]
  transactionRequest?: { chainId?: number } & Record<string, unknown>
}

export function sushiToLifiChainId(chainId: number) {
  if (isSvmChainId(chainId)) {
    return LIFI_SOLANA_CHAIN_ID
  }
  if (isXSwapSupportedChainId(chainId)) {
    return chainId
  }
  throw new Error('chainId not supported in XSwapSupportedChainId')
}

export function lifiToSushiChainId(
  chainId: XSwapSupportedChainId | typeof LIFI_SOLANA_CHAIN_ID,
): XSwapSupportedChainId {
  if (chainId === LIFI_SOLANA_CHAIN_ID) {
    return SvmChainId.SOLANA
  }
  return chainId
}

function mapTokenChainId<T extends LifiTokenLike>(token: T): T {
  return {
    ...token,
    chainId: sushiToLifiChainId(token.chainId),
  }
}

export function mapStepToLifi<T extends LifiStepLike>(step: T): T {
  return {
    ...step,
    action: {
      ...step.action,
      fromChainId: sushiToLifiChainId(step.action.fromChainId),
      toChainId: sushiToLifiChainId(step.action.toChainId),
      fromToken: mapTokenChainId(step.action.fromToken),
      toToken: mapTokenChainId(step.action.toToken),
    },
    estimate: {
      ...step.estimate,
      feeCosts: step.estimate.feeCosts.map((fee) => ({
        ...fee,
        token: mapTokenChainId(fee.token),
      })),
      gasCosts: step.estimate.gasCosts.map((cost) => ({
        ...cost,
        token: mapTokenChainId(cost.token),
      })),
    },
    transactionRequest: step.transactionRequest
      ? {
          ...step.transactionRequest,
          chainId: step.transactionRequest.chainId
            ? sushiToLifiChainId(step.transactionRequest.chainId)
            : undefined,
        }
      : step.transactionRequest,
    includedSteps: step.includedSteps?.map((includedStep) =>
      mapStepToLifi(includedStep),
    ) as T['includedSteps'],
  }
}
