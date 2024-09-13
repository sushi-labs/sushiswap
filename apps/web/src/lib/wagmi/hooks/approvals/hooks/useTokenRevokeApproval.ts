'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo, useState } from 'react'
import { Token } from 'sushi/currency'
import { Address, UserRejectedRequestError, erc20Abi } from 'viem'
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi'
import { SendTransactionReturnType } from 'wagmi/actions'

interface UseTokenRevokeApproval {
  account: Address | undefined
  spender: Address
  token: Token | undefined
}

export const useTokenRevokeApproval = ({
  account,
  spender,
  token,
}: UseTokenRevokeApproval) => {
  const [isPending, setPending] = useState(false)
  const client = usePublicClient()
  const { data: simulation } = useSimulateContract({
    address: token?.wrapped.address as Address,
    abi: erc20Abi,
    chainId: token?.chainId,
    functionName: 'approve',
    args: [spender, 0n],
    query: { enabled: Boolean(token) },
  })

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
    if (e instanceof Error) {
      if (!(e.cause instanceof UserRejectedRequestError)) {
        createErrorToast(e.message, true)
      }
    }
  }, [])

  const { writeContractAsync, ...rest } = useWriteContract({
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
