import type { XSwapSupportedChainId } from 'src/config'
import { nativeFromChainId, newToken } from 'src/lib/currency-from-chain-id'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import { Amount, getNativeAddress } from 'sushi'
import type { Step } from '~evm/api/cross-chain/schemas'
import type { CrossChainStep } from './types'

export function getCrossChainStepBreakdown(
  step?: UseCrossChainTradeStepReturn,
) {
  if (!step)
    return {
      srcStep: undefined,
      bridgeStep: undefined,
      dstStep: undefined,
    }

  const feeIndex = step.includedSteps.findIndex(
    (_step) => _step.type === 'protocol',
  )

  const steps =
    feeIndex === -1
      ? step.includedSteps
      : [
          ...step.includedSteps.slice(0, feeIndex),
          ...step.includedSteps.slice(feeIndex + 1),
        ]

  const bridgeIndex = steps.findIndex((_step) => _step.type === 'cross')
  return {
    srcStep: steps[bridgeIndex - 1],
    bridgeStep: steps[bridgeIndex],
    dstStep: steps[bridgeIndex + 1],
  }
}

interface FeeBreakdown {
  amount: Amount<CurrencyFor<XSwapSupportedChainId>>
  amountUSD: number
}

export interface FeesBreakdown {
  gas: Map<XSwapSupportedChainId, FeeBreakdown>
  protocol: Map<XSwapSupportedChainId, FeeBreakdown>
  ui: Map<XSwapSupportedChainId, FeeBreakdown>
}

enum FeeType {
  GAS = 'GAS',
  PROTOCOL = 'PROTOCOL',
  UI = 'UI',
}

const UI_FEE_NAME = 'LIFI Shared Fee'

export function getCrossChainFeesBreakdown(
  step: Step<XSwapSupportedChainId, XSwapSupportedChainId, 'lifi'>,
) {
  const steps = [step]
  const gasFeesBreakdown = getFeesBreakdown(steps, FeeType.GAS)
  const protocolFeesBreakdown = getFeesBreakdown(steps, FeeType.PROTOCOL)
  const gasFeesUSD = Array.from(gasFeesBreakdown.values()).reduce(
    (sum, gasCost) => sum + gasCost.amountUSD,
    0,
  )
  const protocolFeesUSD = Array.from(protocolFeesBreakdown.values()).reduce(
    (sum, feeCost) => sum + feeCost.amountUSD,
    0,
  )
  const totalFeesUSD = gasFeesUSD + protocolFeesUSD // does not include UI fees

  const uiFeesBreakdown = getFeesBreakdown(steps, FeeType.UI)
  const uiFeesUSD = Array.from(uiFeesBreakdown.values()).reduce(
    (sum, feeCost) => sum + feeCost.amountUSD,
    0,
  )

  return {
    feesBreakdown: {
      gas: gasFeesBreakdown,
      protocol: protocolFeesBreakdown,
      ui: uiFeesBreakdown,
    },
    totalFeesUSD,
    gasFeesUSD,
    protocolFeesUSD,
    uiFeesUSD,
  }
}

function getFeesBreakdown(
  steps: Step<XSwapSupportedChainId, XSwapSupportedChainId, 'lifi'>[],
  feeType: FeeType,
) {
  return steps.reduce((feesByChainId, step) => {
    const fees =
      feeType === FeeType.PROTOCOL
        ? step.estimate.feeCosts.filter((fee) => fee.included === false)
        : feeType === FeeType.UI
          ? step.estimate.feeCosts.filter((fee) => fee.name === UI_FEE_NAME)
          : step.estimate.gasCosts

    if (fees.length === 0) return feesByChainId

    const token =
      getNativeAddress(fees[0].token.chainId) === fees[0].token.address
        ? nativeFromChainId(fees[0].token.chainId)
        : newToken(fees[0].token as Parameters<typeof newToken>[0])

    const { amount, amountUSD } = fees.reduce(
      (acc, feeCost) => {
        const amount = new Amount(token, feeCost.amount)

        acc.amount = acc.amount.add(amount)
        acc.amountUSD += +feeCost.amountUSD
        return acc
      },
      { amount: new Amount(token, 0), amountUSD: 0 },
    )

    const feeByChainId = feesByChainId.get(
      amount.currency.chainId as XSwapSupportedChainId,
    )

    feesByChainId.set(amount.currency.chainId as XSwapSupportedChainId, {
      amount: feeByChainId ? feeByChainId.amount.add(amount) : amount,
      amountUSD: feeByChainId ? feeByChainId.amountUSD + amountUSD : amountUSD,
    })

    return feesByChainId
  }, new Map<XSwapSupportedChainId, FeeBreakdown>())
}
