'use client'

import type { LaunchpadToken } from '@sushiswap/graph-client/data-api'
import { createToast } from '@sushiswap/notifications'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ms from 'ms'
import { useEffect, useState } from 'react'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { EvmAddress, LaunchpadV2ChainId } from 'sushi/evm'
import { useConnection, usePublicClient, useWriteContract } from 'wagmi'
import { readContractsQueryKey } from 'wagmi/query'
import { SUSHI_V1_LAUNCHPAD_ABI } from '../_providers/sushi-v1/contract'
import {
  SUSHI_V2_LAUNCHPAD_ABI,
  normalizeSushiV2Distribution,
} from '../_providers/sushi-v2/contract'

export function useFeeDistribution({
  chainId,
  address,
  token,
}: {
  chainId: LaunchpadV2ChainId
  address: EvmAddress
  token:
    | Pick<LaunchpadToken, '__typename' | 'factoryAddress' | 'symbol'>
    | null
    | undefined
}) {
  const queryClient = useQueryClient()
  const client = usePublicClient({ chainId })
  const { address: account, chainId: connectedChainId } = useConnection()
  const { mutateAsync: writeContractAsync } = useWriteContract()
  const enabled =
    token?.__typename === 'SushiV1LaunchpadToken' ||
    token?.__typename === 'SushiV2LaunchpadToken'
  const parameters = {
    chainId,
    address: token?.factoryAddress,
    abi:
      token?.__typename === 'SushiV2LaunchpadToken'
        ? SUSHI_V2_LAUNCHPAD_ABI
        : SUSHI_V1_LAUNCHPAD_ABI,
    functionName: 'distributeFees',
    args: [address],
  } as const
  const queryKey = [
    'launchpad',
    'fee-distribution',
    chainId,
    token?.factoryAddress,
    address,
    token?.__typename,
  ] as const
  const simulation = useQuery({
    queryKey,
    queryFn: async () => {
      if (!client || !token || !enabled)
        throw new Error('Fee preview is unavailable')
      const { result } = await client.simulateContract({
        ...parameters,
        address: token.factoryAddress,
      })
      return { result }
    },
    enabled: enabled && Boolean(client),
    retry: false,
    staleTime: 0,
    refetchInterval: ms('1m'),
    refetchOnWindowFocus: true,
  })
  const result = simulation.isError ? undefined : simulation.data?.result
  const preview = result
    ? normalizeSushiV2Distribution(
        'quoteToSushi' in result
          ? result
          : {
              quoteToSushi: result[2],
              launchTokenToSushi: result[3],
              quoteToReceiver: result[0] - result[2],
              launchTokenToReceiver: result[1] - result[3],
              launchTokenFeesBurned: 0n,
              quoteUsedForBuyback: 0n,
              launchTokenBoughtAndBurned: 0n,
            },
      )
    : null
  const [isDistributing, setIsDistributing] = useState(false)
  const [distributed, setDistributed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!distributed) return
    const timeout = setTimeout(() => setDistributed(false), ms('3s'))
    return () => clearTimeout(timeout)
  }, [distributed])

  async function distributeFees(): Promise<boolean> {
    setError(null)
    setDistributed(false)
    setIsDistributing(true)
    try {
      if (!enabled || !token) throw new Error('This is not a Sushi launch')
      if (!account) throw new Error('Connect a wallet to distribute fees')
      if (connectedChainId !== chainId)
        throw new Error('Switch to the launch network to distribute fees')
      if (!client) throw new Error('Could not connect to the launch network')

      // Refresh the preview immediately, without delaying the wallet prompt.
      void queryClient.invalidateQueries({ queryKey })
      const transaction = {
        ...parameters,
        address: token.factoryAddress,
        account,
      }
      await client.simulateContract(transaction)
      const hash = await writeContractAsync(transaction)
      const receiptPromise = client.waitForTransactionReceipt({ hash })
      const timestamp = Date.now()
      void createToast({
        account,
        chainId,
        txHash: hash,
        type: 'claimRewards',
        promise: receiptPromise,
        summary: {
          pending: `Distributing ${token.symbol} trading fees`,
          completed: `${token.symbol} trading fees distributed`,
          failed: `Failed to distribute ${token.symbol} trading fees`,
        },
        timestamp,
        groupTimestamp: timestamp,
        variant: 'perps',
      })
      const receipt = await receiptPromise
      if (receipt.status !== 'success')
        throw new Error('Fee distribution failed')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({
          queryKey: readContractsQueryKey({
            scopeKey: `holder-rewards:${chainId}:${address}`,
          }),
        }),
      ])
      setDistributed(true)
      return true
    } catch (error) {
      if (!isUserRejectedError(error)) {
        const message =
          error instanceof Error ? error.message : 'Fee distribution failed'
        setError(
          message.includes('NothingToWithdraw')
            ? 'No fees are available to distribute.'
            : message,
        )
      }
      return false
    } finally {
      setIsDistributing(false)
    }
  }

  return {
    preview,
    isSimulating: simulation.isPending,
    isPreviewError: simulation.isError,
    refetch: simulation.refetch,
    isDistributing,
    distributed,
    error,
    distributeFees,
  }
}
