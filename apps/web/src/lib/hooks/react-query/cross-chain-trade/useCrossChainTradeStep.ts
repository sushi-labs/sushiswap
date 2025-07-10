import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { Amount, Percent } from 'sushi'
import { type EvmCurrency, EvmNative, EvmToken } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { stringify } from 'viem/utils'
import { crossChainStepSchema } from '../../../swap/cross-chain/schema'
import type { CrossChainStep } from '../../../swap/cross-chain/types'

export interface UseCrossChainTradeStepReturn extends CrossChainStep {
  tokenIn: EvmCurrency
  tokenOut: EvmCurrency
  amountIn?: Amount<EvmCurrency>
  amountOut?: Amount<EvmCurrency>
  amountOutMin?: Amount<EvmCurrency>
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
          ? EvmNative.fromChainId(parsedStep.action.fromToken.chainId)
          : new EvmToken(parsedStep.action.fromToken)

      const tokenOut =
        parsedStep.action.toToken.address === zeroAddress
          ? EvmNative.fromChainId(parsedStep.action.toToken.chainId)
          : new EvmToken(parsedStep.action.toToken)

      const amountIn = new Amount(tokenIn, parsedStep.action.fromAmount)
      const amountOut = new Amount(tokenOut, parsedStep.estimate.toAmount)
      const amountOutMin = new Amount(tokenOut, parsedStep.estimate.toAmountMin)

      const fromAmountUSD =
        (Number(parsedStep.action.fromToken.priceUSD) *
          Number(amountIn.amount)) /
        10 ** tokenIn.decimals

      const toAmountUSD =
        (Number(parsedStep.action.toToken.priceUSD) *
          Number(amountOut.amount)) /
        10 ** tokenOut.decimals

      const priceImpact = new Percent({
        numerator: Math.floor((fromAmountUSD / toAmountUSD - 1) * 10_000),
        denominator: 10_000,
      })

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
