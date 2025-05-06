import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { Amount, Native, Token, type Type } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { zeroAddress } from 'viem'
import { stringify } from 'viem/utils'
import { crossChainStepSchema } from '../../../swap/cross-chain/schema'
import type { CrossChainStep } from '../../../swap/cross-chain/types'

export interface UseCrossChainTradeStepReturn extends CrossChainStep {
  tokenIn: Type
  tokenOut: Type
  amountIn?: Amount<Type>
  amountOut?: Amount<Type>
  amountOutMin?: Amount<Type>
  priceImpact?: Percent
}

export interface UseCrossChainTradeStepParms {
  step: CrossChainStep | undefined
  query?: Omit<
    UseQueryOptions<UseCrossChainTradeStepReturn>,
    'queryFn' | 'queryKey' | 'queryKeyFn'
  >
}

export const useCrossChainTradeStep = ({
  query,
  ...params
}: UseCrossChainTradeStepParms) => {
  return useQuery<UseCrossChainTradeStepReturn>({
    queryKey: ['cross-chain/step', params],
    queryFn: async () => {
      const { step } = params

      if (!step) throw new Error()

      const url = new URL('/api/cross-chain/step', window.location.origin)

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: stringify(step),
      }

      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const json = await response.json()

      const parsedStep = crossChainStepSchema.parse(json)

      const tokenIn =
        parsedStep.action.fromToken.address === zeroAddress
          ? Native.onChain(parsedStep.action.fromToken.chainId)
          : new Token(parsedStep.action.fromToken)

      const tokenOut =
        parsedStep.action.toToken.address === zeroAddress
          ? Native.onChain(parsedStep.action.toToken.chainId)
          : new Token(parsedStep.action.toToken)

      const amountIn = Amount.fromRawAmount(
        tokenIn,
        parsedStep.action.fromAmount,
      )
      const amountOut = Amount.fromRawAmount(
        tokenOut,
        parsedStep.estimate.toAmount,
      )
      const amountOutMin = Amount.fromRawAmount(
        tokenOut,
        parsedStep.estimate.toAmountMin,
      )

      const fromAmountUSD =
        (Number(parsedStep.action.fromToken.priceUSD) *
          Number(amountIn.quotient)) /
        10 ** tokenIn.decimals

      const toAmountUSD =
        (Number(parsedStep.action.toToken.priceUSD) *
          Number(amountOut.quotient)) /
        10 ** tokenOut.decimals

      const priceImpact = new Percent(
        Math.floor((fromAmountUSD / toAmountUSD - 1) * 10_000),
        10_000,
      )

      return {
        ...parsedStep,
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        amountOutMin,
        priceImpact,
      }
    },
    refetchInterval: query?.refetchInterval ?? 1000 * 10, // 10s
    enabled: query?.enabled !== false && Boolean(params.step),
    queryKeyHashFn: stringify,
    ...query,
  })
}
