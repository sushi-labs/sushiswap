'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMinutes } from 'date-fns'
import { ChainId, MAX_UINT128 } from 'sushi'
import { formatUnits } from 'viem'
import { decreaseLiquidity } from '~stellar/_common/lib/soroban/position-manager-helpers'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useStellarWallet } from '~stellar/providers'
import { waitForTransaction } from '../../soroban/transaction-helpers'
import type { Token } from '../../types/token.type'
import { useCollectFees } from '../position/use-positions'

export interface RemovePoolLiquidityParams {
  tokenId: number
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  token0: Token
  token1: Token
  poolAddress: string
}

export const useRemoveLiquidity = () => {
  const { signTransaction, signAuthEntry, connectedAddress } =
    useStellarWallet()
  const queryClient = useQueryClient()
  const collectFeesMutation = useCollectFees()

  // This just decreases the pool liquidity
  // The rest of the useRemoveLiquidity below handles
  // collecting the principal and fees after decreasing liquidity
  const decreaseLiquidityMutation = useMutation({
    mutationKey: ['stellar', 'pool', 'decreaseLiquidity'],
    onMutate: async () => {
      // Show "in progress" toast immediately before transaction starts
      const timestamp = Date.now()
      if (connectedAddress) {
        createInfoToast({
          summary: 'Removing liquidity...',
          type: 'burn',
          account: connectedAddress,
          chainId: ChainId.STELLAR,
          groupTimestamp: timestamp,
          timestamp,
        })
      }
    },
    mutationFn: async (params: RemovePoolLiquidityParams) => {
      if (!connectedAddress) {
        throw new Error('Wallet not connected')
      }

      const deadline = BigInt(
        Math.floor(addMinutes(new Date(), 5).valueOf() / 1000),
      )
      const decreaseResult = await decreaseLiquidity({
        tokenId: params.tokenId,
        liquidity: params.liquidity,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
        deadline,
        operator: connectedAddress,
        sourceAccount: connectedAddress,
        signTransaction,
        signAuthEntry,
      })

      await waitForTransaction(decreaseResult.hash)

      return {
        decreaseHash: decreaseResult.hash,
      }
    },
    onSuccess: (result, variables) => {
      const timestamp = Date.now()
      createSuccessToast({
        summary: `Liquidity ready to collect!`,
        type: 'burn',
        account: connectedAddress || undefined,
        chainId: ChainId.STELLAR,
        txHash: result.decreaseHash,
        href: getStellarTxnLink(result.decreaseHash),
        groupTimestamp: timestamp,
        timestamp,
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
        queryKey: ['stellar', 'pool', 'ticks', variables.poolAddress],
      })
    },
  })

  const collectFeesMutationToastWrapper = useMutation({
    mutationKey: ['stellar', 'pool', 'collectFeesToastWrapper'],
    onMutate: async () => {
      // Show "in progress" toast immediately before transaction starts
      const timestamp = Date.now()
      if (connectedAddress) {
        createInfoToast({
          summary: 'Collecting liquidity...',
          type: 'claimRewards',
          account: connectedAddress,
          chainId: ChainId.STELLAR,
          groupTimestamp: timestamp,
          timestamp,
        })
      }
    },
    mutationFn: async (params: {
      tokenId: number
      recipient: string
      amount0Max: bigint
      amount1Max: bigint
      signTransaction: (xdr: string) => Promise<string>
      signAuthEntry: (entryPreimageXdr: string) => Promise<string>
      token0: Token
      token1: Token
    }) => {
      const collectResult = await collectFeesMutation.mutateAsync(params)
      return { collectResult }
    },
    onSuccess: ({ collectResult }, variables) => {
      const token0Amount = formatUnits(
        collectResult.amount0,
        variables.token0.decimals,
      )
      const token1Amount = formatUnits(
        collectResult.amount1,
        variables.token1.decimals,
      )

      let summary = 'Liquidity collected successfully'
      if (collectResult.amount0 > 0n && collectResult.amount1 > 0n) {
        summary = `Collected ${token0Amount} ${variables.token0.code} and ${token1Amount} ${variables.token1.code}`
      } else if (collectResult.amount0 > 0n) {
        summary = `Collected ${token0Amount} ${variables.token0.code}`
      } else if (collectResult.amount1 > 0n) {
        summary = `Collected ${token1Amount} ${variables.token1.code}`
      }
      const timestamp = Date.now()
      createSuccessToast({
        summary,
        type: 'claimRewards',
        account: connectedAddress || undefined,
        chainId: ChainId.STELLAR,
        txHash: collectResult.txHash,
        href: getStellarTxnLink(collectResult.txHash),
        groupTimestamp: timestamp,
        timestamp,
      })
    },
  })

  return useMutation({
    mutationKey: ['stellar', 'pool', 'removeLiquidity'],
    mutationFn: async (params: RemovePoolLiquidityParams) => {
      if (!connectedAddress) {
        throw new Error('Wallet not connected')
      }
      let decreaseResult: Awaited<
        ReturnType<typeof decreaseLiquidityMutation.mutateAsync>
      > | null = null
      if (params.liquidity > 0n) {
        decreaseResult = await decreaseLiquidityMutation.mutateAsync(params)
      }
      const { collectResult } =
        await collectFeesMutationToastWrapper.mutateAsync({
          tokenId: params.tokenId,
          recipient: connectedAddress,
          amount0Max: MAX_UINT128,
          amount1Max: MAX_UINT128,
          signTransaction,
          signAuthEntry,
          token0: params.token0,
          token1: params.token1,
        })
      return { decreaseResult, collectResult }
    },
    onSuccess: (_result) => {
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'pool', 'info'],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'pool', 'balances'],
      })
    },
    onError: (error) => {
      console.error('Failed to remove liquidity:', error)
      createErrorToast(error.message || 'Failed to remove liquidity', false)
    },
  })
}
