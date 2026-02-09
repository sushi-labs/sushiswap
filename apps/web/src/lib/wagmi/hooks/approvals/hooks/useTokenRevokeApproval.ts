'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo, useState } from 'react'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { type EvmToken, erc20Abi_approve } from 'sushi/evm'
import { type Address, ContractFunctionZeroDataError } from 'viem'
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import {
  type ERC20ApproveABI,
  type ERC20ApproveArgs,
  type OLD_ERC20ApproveABI,
  old_erc20Abi_approve,
} from './types'

interface UseTokenRevokeApproval {
  account: Address | undefined
  spender: Address | undefined
  token: Omit<EvmToken, 'wrapped'> | undefined
  enabled?: boolean
}

export const useTokenRevokeApproval = ({
  account,
  spender,
  token,
  enabled = true,
}: UseTokenRevokeApproval) => {
  const [isPending, setPending] = useState(false)
  const client = usePublicClient()

  const [fallback, setFallback] = useState(false)

  const simulationEnabled = Boolean(
    enabled && account && spender && token?.address,
  )

  const standardSimulation = useSimulateContract<
    ERC20ApproveABI,
    'approve',
    ERC20ApproveArgs
  >({
    address: token?.address as Address,
    abi: erc20Abi_approve,
    chainId: token?.chainId,
    functionName: 'approve',
    args: [spender as Address, 0n],
    scopeKey: 'revoke-std',
    query: {
      enabled: simulationEnabled && !fallback,
      retry: (failureCount, error) => {
        if (
          error instanceof ContractFunctionZeroDataError ||
          error.cause instanceof ContractFunctionZeroDataError
        ) {
          setFallback(true)
          return false
        }
        return failureCount < 2
      },
    },
  })

  const fallbackSimulation = useSimulateContract<
    OLD_ERC20ApproveABI,
    'approve',
    ERC20ApproveArgs
  >({
    address: token?.address as Address,
    abi: old_erc20Abi_approve,
    chainId: token?.chainId,
    functionName: 'approve',
    args: [spender as Address, 0n],
    scopeKey: 'revoke-fallback',
    query: {
      enabled: simulationEnabled && fallback,
    },
  })

  const { data: simulation } = fallback
    ? fallbackSimulation
    : standardSimulation

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      if (!token) return

      setPending(true)
      try {
        const ts = new Date().getTime()
        const receiptPromise = client.waitForTransactionReceipt({
          hash: data,
        })

        void createToast({
          account,
          type: 'swap',
          chainId: token.chainId,
          txHash: data,
          promise: receiptPromise,
          summary: {
            pending: `Revoking approval for ${token.symbol}`,
            completed: `Successfully revoked approval for ${token.symbol}`,
            failed: `Failed to revoke approval for ${token.symbol}`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })

        await receiptPromise
      } finally {
        setPending(false)
      }
    },
    [token, account, client],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'useTokenRevokeApproval',
      action: 'mutationError',
    })
    createErrorToast(e.message, true)
  }, [])

  const { mutateAsync: writeContractAsync, ...rest } = useWriteContract({
    mutation: {
      onError,
      onSuccess,
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: Typecheck speedup
  const write = useMemo(
    () => {
      if (!simulation?.request) return undefined

      return async () => {
        try {
          await writeContractAsync(simulation.request as any)
        } catch {}
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [simulation?.request, writeContractAsync] as const,
  )

  return {
    ...rest,
    write,
    isPending: isPending || rest.isPending,
  }
}
