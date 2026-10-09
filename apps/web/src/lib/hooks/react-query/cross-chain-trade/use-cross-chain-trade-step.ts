import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { getLifiCurrency } from 'src/lib/swap/cross-chain/get-lifi-currency'
import { Amount } from 'sushi'
import { stringify } from 'viem/utils'
import type { Step } from '~evm/api/cross-chain/schemas'
import type { CrossChainStepResponse } from '~evm/api/cross-chain/step/route'
import { useCrossChainPriceImpact } from './use-cross-chain-price-impact'

export type UseCrossChainTradeStepReturn<
  TChainId0 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId = LifiXSwapSupportedChainId,
> = NonNullable<
  ReturnType<typeof useCrossChainTradeStep<TChainId0, TChainId1>>['data']
>

export interface UseCrossChainTradeStepParams<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> {
  step: Step<TChainId0, TChainId1, 'lifi'> | undefined
  enabled?: boolean
}

export function useCrossChainTradeStep<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  step,
  enabled = true,
}: UseCrossChainTradeStepParams<TChainId0, TChainId1>) {
  const query = useQuery({
    queryKey: ['cross-chain/step', step],
    queryFn: async () => {
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

      const parsedStep = json as CrossChainStepResponse<TChainId0, TChainId1>

      const tokenIn = getLifiCurrency(
        parsedStep.action.fromToken,
      ) as CurrencyFor<TChainId0>
      const tokenOut = getLifiCurrency(
        parsedStep.action.toToken,
      ) as CurrencyFor<TChainId1>

      const amountIn = new Amount(tokenIn, parsedStep.action.fromAmount)
      const amountOut = new Amount(tokenOut, parsedStep.estimate.toAmount)
      const amountOutMin = new Amount(tokenOut, parsedStep.estimate.toAmountMin)

      return {
        ...parsedStep,
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        amountOutMin,
      }
    },
    refetchInterval: ms('10s'),
    enabled: Boolean(enabled && step),
    queryKeyHashFn: stringify,
  })

  const priceImpact = useCrossChainPriceImpact({
    amountIn: query.data?.amountIn,
    amountOut: query.data?.amountOut,
  })

  return useMemo(
    () => ({
      ...query,
      data: query.data ? { ...query.data, priceImpact } : undefined,
    }),
    [query, priceImpact],
  )
}
