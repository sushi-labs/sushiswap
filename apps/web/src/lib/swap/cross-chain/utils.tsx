import { ChainId } from 'sushi/chain'
import { Amount, Native, Token, Type } from 'sushi/currency'
import { zeroAddress } from 'viem'
import { CrossChainStep } from './types'

interface FeeBreakdown {
  amount: Amount<Type>
  amountUSD: number
}

export interface FeesBreakdown {
  gas: Map<ChainId, FeeBreakdown>
  protocol: Map<ChainId, FeeBreakdown>
}

enum FeeType {
  GAS = 'GAS',
  PROTOCOL = 'PROTOCOL',
}

export const getCrossChainFeesBreakdown = (route: CrossChainStep[]) => {
  const gasFeesBreakdown = getFeesBreakdown(route, FeeType.GAS)
  const protocolFeesBreakdown = getFeesBreakdown(route, FeeType.PROTOCOL)
  const gasFeesUSD = Array.from(gasFeesBreakdown.values()).reduce(
    (sum, gasCost) => sum + gasCost.amountUSD,
    0,
  )
  const protocolFeesUSD = Array.from(protocolFeesBreakdown.values()).reduce(
    (sum, feeCost) => sum + feeCost.amountUSD,
    0,
  )
  const totalFeesUSD = gasFeesUSD + protocolFeesUSD

  return {
    feesBreakdown: {
      gas: gasFeesBreakdown,
      protocol: protocolFeesBreakdown,
    },
    totalFeesUSD,
    gasFeesUSD,
    protocolFeesUSD,
  }
}

const getFeesBreakdown = (route: CrossChainStep[], feeType: FeeType) => {
  return route.reduce((feesByChainId, step) => {
    const fees =
      feeType === FeeType.PROTOCOL
        ? step.estimate.feeCosts.filter((fee) => fee.included === false)
        : step.estimate.gasCosts

    if (fees.length === 0) return feesByChainId

    const token =
      fees[0].token.address === zeroAddress
        ? Native.onChain(fees[0].token.chainId)
        : new Token(fees[0].token)

    const { amount, amountUSD } = fees.reduce(
      (acc, feeCost) => {
        const amount = Amount.fromRawAmount(token, feeCost.amount)

        acc.amount = acc.amount.add(amount)
        acc.amountUSD += +feeCost.amountUSD
        return acc
      },
      { amount: Amount.fromRawAmount(token, 0), amountUSD: 0 },
    )

    const feeByChainId = feesByChainId.get(amount.currency.chainId)

    feesByChainId.set(amount.currency.chainId, {
      amount: feeByChainId ? feeByChainId.amount.add(amount) : amount,
      amountUSD: feeByChainId ? feeByChainId.amountUSD + amountUSD : amountUSD,
    })

    return feesByChainId
  }, new Map<ChainId, FeeBreakdown>())
}
