'use client'

import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { parseAbiItem, zeroAddress } from 'viem'
import { usePublicClient } from 'wagmi'
import type { SushiSwapV4ChainId } from './config'
import type { SushiSwapV4Deployment } from './types'

const TRANSFER_EVENT = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
)

export function useSushiSwapV4PositionIds({
  account,
  chainId,
  deployment,
}: {
  account: EvmAddress | undefined
  chainId: SushiSwapV4ChainId
  deployment: SushiSwapV4Deployment | undefined
}) {
  const client = usePublicClient({ chainId })

  return useQuery({
    queryKey: [
      'sushiswap-v4-position-ids',
      { account, chainId, positionManager: deployment?.clPositionManager },
    ],
    queryFn: async () => {
      if (!account || !client || !deployment) return []

      const logs = await client.getLogs({
        address: deployment.clPositionManager,
        event: TRANSFER_EVENT,
        args: { to: account },
        fromBlock: deployment.deploymentBlock,
        toBlock: 'latest',
      })
      const candidateIds = [
        ...new Set(logs.map((log) => log.args.tokenId)),
      ].filter((tokenId): tokenId is bigint => tokenId !== undefined)

      const owners = await client.multicall({
        allowFailure: true,
        contracts: candidateIds.map((tokenId) => ({
          address: deployment.clPositionManager,
          abi: [
            {
              type: 'function',
              name: 'ownerOf',
              stateMutability: 'view',
              inputs: [{ name: 'id', type: 'uint256' }],
              outputs: [{ name: 'owner', type: 'address' }],
            },
          ] as const,
          functionName: 'ownerOf',
          args: [tokenId],
        })),
      })

      return candidateIds.filter((_, index) => {
        const owner = owners[index]
        return (
          owner?.status === 'success' &&
          owner.result !== zeroAddress &&
          owner.result.toLowerCase() === account.toLowerCase()
        )
      })
    },
    enabled: Boolean(account && client && deployment),
    staleTime: 30_000,
  })
}
