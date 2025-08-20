'use client'

import { useMutation } from '@tanstack/react-query'
import { useSimpleSwapState } from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { NETWORK_NAME } from '../constants'
import { quoteExactInput } from '../soroban/pool-helpers'
import { usePoolState } from './use-pool-state'

export const useQuote = ({ zeroForOne }: { zeroForOne: boolean }) => {
  const { amount, token0 } = useSimpleSwapState()
  const { data: pool } = usePoolState()

  return useMutation({
    mutationKey: [
      'useQuote',
      {
        zeroForOne,
        token0,
        amount,
        network: NETWORK_NAME,
      },
    ],
    mutationFn: async () => {
      if (!pool) {
        throw new Error('No pool found')
      }

      const amountIn = BigInt(Number(amount) * 10 ** token0.decimals)

      const amountOut = await quoteExactInput({
        zeroForOne,
        amountIn,
      })

      return amountOut
    },
  })
}
