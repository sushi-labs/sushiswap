'use client'

import { useMutation } from '@tanstack/react-query'
import { useSimpleSwapState } from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { useStellarWallet } from '~stellar/providers'
import {
  type QuoteExactInputParams,
  quoteExactInput,
} from '../../soroban/dex-router-helpers'

export interface PoolQuoteParams {
  address: string
  zeroForOne: boolean
  amountIn?: bigint
  amountOut?: bigint
}

export const useQuoteExactInput = () => {
  const { amount, token0, token1 } = useSimpleSwapState()
  const { connectedAddress } = useStellarWallet()
  return useMutation({
    mutationKey: ['pool', 'quote', amount, token0, token1],
    mutationFn: async () => {
      const params: QuoteExactInputParams = {
        userAddress: connectedAddress ?? undefined,
        fromToken: token0,
        toToken: token1,
        amountIn: BigInt(Number(amount) * 10 ** token0.decimals),
      }
      return await quoteExactInput(params)
    },
    onSuccess: (result) => {
      console.log('Pool quote executed successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to execute pool quote:', error)
    },
  })
}
