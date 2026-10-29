import {
  type SmartPoolChainId,
  type VaultV1,
  getVault,
  getVaults,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type { Address, Hex } from 'viem'

export async function getCachedVault({
  chainId,
  vaultAddress,
}: {
  chainId: SmartPoolChainId
  vaultAddress: Address
}): Promise<VaultV1 | null> {
  return unstable_cache(
    async () => getVault({ chainId, vaultAddress }),
    ['vault', `${chainId}:${vaultAddress}`],
    { revalidate: 60 * 15 },
  )()
}

export async function getCachedVaults({
  chainId,
  poolAddress,
}: {
  chainId: SmartPoolChainId
  poolAddress: Hex
}): Promise<VaultV1[]> {
  return unstable_cache(
    async () => getVaults({ chainId, poolAddress }),
    ['vaults', `${chainId}:${poolAddress}`],
    { revalidate: 60 * 15 },
  )()
}
