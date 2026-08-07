import { getPublicClient } from '@wagmi/core/actions'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { EvmAddress } from 'sushi/evm'
import { parseAbiItem } from 'viem'
import type { SushiSwapV4ChainId } from './config'
import { INFINITY_CL_POSITION_MANAGER_ABI } from './contract-abi'
import type { SushiSwapV4Deployment } from './types'

const TRANSFER_EVENT = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
)

export async function getSushiSwapV4PositionIds({
  account,
  chainId,
  config,
  deployment,
}: {
  account: EvmAddress
  chainId: SushiSwapV4ChainId
  config: PublicWagmiConfig
  deployment: SushiSwapV4Deployment
}): Promise<bigint[]> {
  const client = getPublicClient(config, { chainId })
  if (!client) return []

  const logs = await client.getLogs({
    address: deployment.clPositionManager,
    event: TRANSFER_EVENT,
    args: { to: account },
    fromBlock: deployment.deploymentBlock,
    toBlock: 'latest',
  })
  const candidateIds = [...new Set(logs.map((log) => log.args.tokenId))].filter(
    (tokenId): tokenId is bigint => tokenId !== undefined,
  )

  if (candidateIds.length === 0) return []

  const owners = await Promise.allSettled(
    candidateIds.map((tokenId) =>
      client.readContract({
        address: deployment.clPositionManager,
        abi: INFINITY_CL_POSITION_MANAGER_ABI,
        functionName: 'ownerOf',
        args: [tokenId],
      }),
    ),
  )

  return candidateIds.filter((_, index) => {
    const owner = owners[index]
    return (
      owner?.status === 'fulfilled' &&
      owner.value.toLowerCase() === account.toLowerCase()
    )
  })
}
