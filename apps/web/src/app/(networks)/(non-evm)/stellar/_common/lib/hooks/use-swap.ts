'use client'

import { useSlippageTolerance } from '@sushiswap/hooks'
import { useMutation } from '@tanstack/react-query'
import { useSimpleSwapState } from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { useStellarWallet } from '~stellar/providers'
import { NETWORK_NAME } from '../constants'
import { executeSwap } from '../soroban/pool-helpers'

export const useSwap = ({ zeroForOne }: { zeroForOne: boolean }) => {
  const { amount, token0, token1 } = useSimpleSwapState()
  const { connectedAddress } = useStellarWallet()
  const [slippageTolerance] = useSlippageTolerance()

  const pool = true //await getPoolState()

  return useMutation({
    mutationKey: [
      'useSwap',
      {
        amount,
        token0,
        token1,
        connectedAddress,
        slippageTolerance,
        network: NETWORK_NAME,
      },
    ],
    mutationFn: async () => {
      if (!pool) {
        throw new Error('No pool found')
      }

      if (!connectedAddress) {
        throw new Error('No connected address')
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
