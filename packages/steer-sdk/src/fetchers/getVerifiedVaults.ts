import { getIdFromChainIdAddress } from 'sushi/format'
import type { Address } from 'viem'
import type { SteerChainId } from '../constants.js'

interface GetVerifiedVaults {
  chainId: SteerChainId
}

type VaultData = {
  pools: Record<
    Address,
    {
      vaultAddress: Address
      strategyIpfsHash: string
    }[]
  >
}

export async function getVerifiedVaults({ chainId }: GetVerifiedVaults) {
  const result = await fetch(
    `https://api.steer.finance/getSmartPools?chainId=${chainId}&dexName=sushi`,
  )

  if (!result.ok)
    throw new Error(`Failed to fetch verified vaults for chainId: ${chainId}`)

  const { pools } = (await result.json()) as VaultData

  const vaultIds = Object.values(pools).flatMap((pool) =>
    pool.map((p) => getIdFromChainIdAddress(chainId, p.vaultAddress)),
  )

  return vaultIds
}
