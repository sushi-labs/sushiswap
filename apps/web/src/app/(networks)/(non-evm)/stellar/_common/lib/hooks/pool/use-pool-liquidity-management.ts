'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collectFees,
  decreaseLiquidity,
} from '~stellar/_common/lib/soroban/position-manager-helpers'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useStellarWallet } from '~stellar/providers'

export interface RemovePoolLiquidityParams {
  tokenId: number
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  token0Code: string
  token1Code: string
}

export const useRemoveLiquidity = () => {
  const { signTransaction, connectedAddress } = useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pool', 'removeLiquidity'],
    onMutate: async () => {
      // Show "in progress" toast immediately before transaction starts
      const timestamp = Date.now()
      if (connectedAddress) {
        createInfoToast({
          summary: 'Removing liquidity...',
          type: 'burn',
          account: connectedAddress,
          chainId: 1,
          groupTimestamp: timestamp,
          timestamp,
        })
      }
    },
    mutationFn: async (params: RemovePoolLiquidityParams) => {
      if (!connectedAddress) {
        throw new Error('Wallet not connected')
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 300)

      const decreaseResult = await decreaseLiquidity({
        tokenId: params.tokenId,
        liquidity: params.liquidity,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
        deadline,
        operator: connectedAddress,
        sourceAccount: connectedAddress,
        signTransaction,
      })

      const collectResult = await collectFees({
        tokenId: params.tokenId,
        recipient: connectedAddress,
        amount0Max: BigInt('18446744073709551615'), // uint128 max
        amount1Max: BigInt('18446744073709551615'), // uint128 max
        operator: connectedAddress,
        signTransaction,
      })

      return {
        decreaseHash: decreaseResult.hash,
        collectHash: collectResult.txHash,
        amount0: collectResult.amount0,
        amount1: collectResult.amount1,
      }
    },
    onSuccess: (result, variables) => {
      const formatAmount = (amount: bigint) => {
        const num = Number(amount) / 1e7
        return num.toFixed(4)
      }

      createSuccessToast({
        summary: `Liquidity removed! Collected ${formatAmount(result.amount0)} ${variables.token0Code}, ${formatAmount(result.amount1)} ${variables.token1Code}`,
        type: 'burn',
        account: connectedAddress || undefined,
        chainId: 1,
        txHash: result.collectHash,
        href: getStellarTxnLink(result.collectHash),
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'user', connectedAddress],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-pool'],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principals-batch'],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'token', variables.tokenId],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principal', variables.tokenId],
      })

      queryClient.invalidateQueries({
        queryKey: ['pool', 'info'],
      })

      queryClient.invalidateQueries({
        queryKey: ['pool', 'balances'],
      })
    },
    onError: (error) => {
      console.error('Failed to remove liquidity:', error)
      createErrorToast(error.message || 'Failed to remove liquidity', false)
    },
  })
}
