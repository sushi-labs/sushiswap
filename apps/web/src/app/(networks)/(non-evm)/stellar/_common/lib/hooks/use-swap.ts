'use client'

import { useMutation } from '@tanstack/react-query'
import { useSimpleSwapState } from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { useStellarWallet } from '~stellar/providers'
import { NETWORK_NAME } from '../constants'
import { executeSwap } from '../soroban/pool-helpers'
import { usePoolState } from './use-pool-state'

export const useSwap = ({ zeroForOne }: { zeroForOne: boolean }) => {
  const { amount, token0, token1 } = useSimpleSwapState()
  const { data: pool } = usePoolState()

  // TODO:support checking swap without being connected
  const { connectedAddress } = useStellarWallet()

  return useMutation({
    mutationKey: [
      'useSwap',
      {
        zeroForOne,
        token0,
        token1,
        amount,
        connectedAddress,
        network: NETWORK_NAME,
      },
    ],
    mutationFn: async () => {
      if (!connectedAddress) {
        throw new Error('No connected address')
      }

      if (!pool) {
        throw new Error('No pool found')
      }

      const amountIn = BigInt(Number(amount) * 10 ** token0.decimals)

      const swapAmounts = await executeSwap({
        sender: connectedAddress,
        recipient: connectedAddress,
        zeroForOne,
        amountIn,
      })

      return {
        amountIn: zeroForOne ? swapAmounts[0] : swapAmounts[1],
        amountOut: zeroForOne ? swapAmounts[1] : swapAmounts[0],
      }
    },
  })
}
