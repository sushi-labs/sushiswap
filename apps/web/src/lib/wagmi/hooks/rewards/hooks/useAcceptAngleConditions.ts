'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo, useState } from 'react'
import { ChainId } from 'sushi/chain'
import { SendTransactionReturnType, UserRejectedRequestError } from 'viem'
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

export enum AngleConditionsState {
  LOADING = 'LOADING',
  UNKNOWN = 'UNKNOWN',
  NOT_ACCEPTED = 'NOT_ACCEPTED',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

export const useAcceptAngleConditions = (
  { enabled = true }: { enabled?: boolean } = { enabled: true },
) => {
  const { address, chainId } = useAccount()
  const [pending, setPending] = useState(false)
  const client = usePublicClient()
  const {
    data: userSignatureWhitelist,
    isLoading: isUserSignatureWhitelistLoading,
    refetch,
  } = useReadContract({
    address: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    abi: [
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'userSignatureWhitelist',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    functionName: 'userSignatureWhitelist',
    chainId: chainId as ChainId,
    args: [address!],
    query: {
      enabled: Boolean(enabled && address && chainId),
    },
  })

  const { data: simulation } = useSimulateContract({
    address: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    abi: [
      {
        inputs: [],
        name: 'acceptConditions',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
    functionName: 'acceptConditions',
    query: {
      enabled: Boolean(
        enabled &&
          userSignatureWhitelist === 0n &&
          !isUserSignatureWhitelistLoading,
      ),
    },
  })

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      setPending(true)
      try {
        const ts = new Date().getTime()
        const receiptPromise = client.waitForTransactionReceipt({
          hash: data,
        })

        void createToast({
          account: address,
          type: 'approval',
          chainId: client.chain.id,
          txHash: data,
          promise: receiptPromise,
          summary: {
            pending: `Accepting Merkl conditions`,
            completed: `Successfully accepted Merkl conditions`,
            failed: `Something went wrong accepting Merkl conditions`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })

        await receiptPromise
        await refetch()
      } finally {
        setPending(false)
      }
    },
    [refetch, client, address],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof Error) {
      if (!(e.cause instanceof UserRejectedRequestError)) {
        createErrorToast(e.message, true)
      }
    }
  }, [])

  const execute = useWriteContract({
    mutation: {
      onError,
      onSuccess,
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: Typecheck speedup
  const write = useMemo(
    () => {
      if (!simulation?.request) return

      return () => execute.writeContract(simulation.request as any)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [execute.writeContract, simulation?.request] as const,
  )

  return useMemo<
    [AngleConditionsState, { write: undefined | (() => void) }]
  >(() => {
    let state = AngleConditionsState.UNKNOWN
    if (userSignatureWhitelist === 1n) state = AngleConditionsState.ACCEPTED
    else if (pending) state = AngleConditionsState.PENDING
    else if (isUserSignatureWhitelistLoading)
      state = AngleConditionsState.LOADING
    else if (userSignatureWhitelist === 0n)
      state = AngleConditionsState.NOT_ACCEPTED

    return [state, { write }]
  }, [userSignatureWhitelist, write, isUserSignatureWhitelistLoading, pending])
}
