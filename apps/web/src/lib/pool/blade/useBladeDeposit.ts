'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { BladeChainId } from 'sushi/config'
import {
  useBlockNumber,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { useAccount } from 'wagmi'
import { clipperCommonExchangeAbi } from './abi/clipperCommonExchange'

const BLADE_API_HOST =
  process.env['BLADE_API_HOST'] ||
  process.env['NEXT_PUBLIC_BLADE_API_HOST'] ||
  'https://api.clipper.exchange'

const BLADE_API_KEY =
  process.env['BLADE_API_KEY'] || process.env['NEXT_PUBLIC_BLADE_API_KEY']

interface RfqAllowDepositPayload {
  sender: string
  chain_id: number
  pool_address: string
}

interface RfqAllowDepositResponse {
  allow: boolean
  usd_limit: number
  min_lock_time?: number
  min_days_to_lock?: number
}

interface RfqDepositPayload {
  sender: string
  deposit: { [address: string]: string }
  chain_id: number
  single_asset?: boolean
  pool_address: string
  lock_time?: number
  days_to_lock?: number
}

type RfqDepositResponse = {
  sender: string
  pool_tokens: string
  good_until: number
  signature: {
    v: number
    r: string
    s: string
  }
  clipper_exchange_address: string
  extra_data: string
  deposit_amounts: string[]
  amount?: string
  token?: string
} & (
  | {
      lock_time: number
    }
  | {
      n_days: number
    }
)

export const useBladeAllowDeposit = ({
  chainId,
  poolAddress,
  enabled = true,
}: {
  chainId: BladeChainId
  poolAddress: string
  enabled?: boolean
}) => {
  const { address } = useAccount()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [
      'blade',
      'pool',
      `${chainId}:${poolAddress}`,
      'allow-deposit',
      address,
    ],
    queryFn: async (): Promise<RfqAllowDepositResponse> => {
      if (!address) throw new Error('No address provided')

      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/allow-deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'x-api-key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify({
          chain_id: chainId,
          sender: address,
          pool_address: poolAddress,
        } satisfies RfqAllowDepositPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to check deposit permission')
      }

      return response.json()
    },
    enabled: Boolean(enabled && address && chainId && poolAddress),
  })

  const { data: blockNumber } = useBlockNumber({
    chainId,
    watch: {
      pollingInterval: 15_000,
      poll: true,
    },
  })

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({
        queryKey: [
          'blade',
          'pool',
          `${chainId}:${poolAddress}`,
          'allow-deposit',
          address,
        ],
      })
    }
  }, [blockNumber, queryClient, chainId, poolAddress, address])

  return query
}

export const useBladeDepositRequest = () => {
  return useMutation({
    mutationFn: async (
      payload: RfqDepositPayload,
    ): Promise<RfqDepositResponse> => {
      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'x-api-key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create deposit signature')
      }

      return response.json()
    },
  })
}

export const useBladeDepositTransaction = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (hash: string) => void
  onError?: (error: Error) => void
} = {}) => {
  const {
    writeContract,
    writeContractAsync,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        onSuccess?.(hash)
      },
      onError: (error) => {
        onError?.(error as Error)
      },
    },
  })

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const depositTransaction = useMutation({
    mutationFn: async (deposit: RfqDepositResponse) => {
      const {
        signature,
        clipper_exchange_address,
        deposit_amounts,
        pool_tokens,
        good_until,
        amount,
        token,
      } = deposit
      const lockTimeParam =
        'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0)

      if (amount && token) {
        // TODO-BLADE: Handle single asset deposit
        throw new Error('Single asset deposit not supported yet')
      } else {
        const amounts = deposit_amounts.map((amount) => BigInt(amount))

        const txHash = await writeContractAsync({
          address: clipper_exchange_address as `0x${string}`,
          abi: clipperCommonExchangeAbi,
          functionName: 'transmitAndDeposit',
          args: [
            amounts,
            BigInt(lockTimeParam),
            BigInt(pool_tokens),
            BigInt(good_until),
            {
              v: signature.v,
              r: signature.r as `0x${string}`,
              s: signature.s as `0x${string}`,
            },
          ],
        })

        return txHash
      }
    },
  })

  return {
    ...depositTransaction,
    writeContract,
    hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    isPending: isWritePending || isConfirming,
    error: writeError || confirmError || depositTransaction.error,
    reset: () => {
      reset()
      depositTransaction.reset()
    },
  }
}
