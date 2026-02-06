import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { XSwapSupportedChainId } from 'src/config'
import { nativeFromChainId, newToken } from 'src/lib/currency-from-chain-id'
import { Amount, Percent, getNativeAddress } from 'sushi'
import { stringify } from 'viem/utils'
import type {
  CrossChainStep,
  CrossChainStepResponse,
} from '../../../swap/cross-chain/types'

type NewTokenInput = Parameters<typeof newToken>[0]

export interface UseCrossChainTradeStepReturn<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> extends CrossChainStep<TChainId0, TChainId1> {
  tokenIn: CurrencyFor<TChainId0>
  tokenOut: CurrencyFor<TChainId1>
  amountIn?: Amount<CurrencyFor<TChainId0>>
  amountOut?: Amount<CurrencyFor<TChainId1>>
  amountOutMin?: Amount<CurrencyFor<TChainId1>>
  priceImpact?: Percent
}

export interface UseCrossChainTradeStepParams<
  TChainId0 extends XSwapSupportedChainId = XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId = XSwapSupportedChainId,
> {
  step: CrossChainStep<TChainId0, TChainId1> | undefined
  enabled?: boolean
}

export function useCrossChainTradeStep<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>({
  step,
  enabled = true,
}: UseCrossChainTradeStepParams<TChainId0, TChainId1>) {
  return useQuery<UseCrossChainTradeStepReturn<TChainId0, TChainId1>>({
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

      const tokenIn = (
        getNativeAddress(parsedStep.action.fromToken.chainId) ===
        parsedStep.action.fromToken.address
          ? nativeFromChainId(parsedStep.action.fromToken.chainId)
          : newToken(parsedStep.action.fromToken as NewTokenInput)
      ) as CurrencyFor<TChainId0>

      const tokenOut = (
        getNativeAddress(parsedStep.action.toToken.chainId) ===
        parsedStep.action.toToken.address
          ? nativeFromChainId(parsedStep.action.toToken.chainId)
          : newToken(parsedStep.action.toToken as NewTokenInput)
      ) as CurrencyFor<TChainId1>

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
    refetchInterval: ms('10s'),
    enabled: Boolean(enabled && step),
    queryKeyHashFn: stringify,
  })
}
