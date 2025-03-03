import { getIdFromChainIdAddress } from 'sushi/format'
import type { Address } from 'viem'
import type { SteerChainId } from '../constants.js'

interface GetVaultAprs {
  chainId: SteerChainId
}

type AprEntry = {
  apr: string
  vault: Address
}

type AprData = {
  message: string
  data: {
    daily: AprEntry[]
    weekly: AprEntry[]
    monthly: AprEntry[]
    default: AprEntry[]
  }
}

export async function getVaultAprs({ chainId }: GetVaultAprs) {
  const result = await fetch(
    `https://vdly0xv0a5.execute-api.us-east-1.amazonaws.com/dev/fee-aprs?chainId=${chainId}&dex=sushi`,
  )

  if (!result.ok)
    throw new Error(`Failed to fetch aprs for chainId: ${chainId}`)

  const { message, data } = (await result.json()) as AprData

  if (message !== 'Success')
    throw new Error(`Failed to fetch aprs for chainId: ${chainId}`)

  const map = new Map<
    string,
    { apr1d?: number; apr1w?: number; apr1m?: number; apr?: number }
  >()

  for (const apr of data.daily) {
    const vaultId = getIdFromChainIdAddress(chainId, apr.vault)
    map.set(vaultId, { apr1d: Number.parseFloat(apr.apr) })
  }

  for (const apr of data.weekly) {
    const vaultId = getIdFromChainIdAddress(chainId, apr.vault)
    map.set(vaultId, { ...map.get(vaultId), apr1w: Number.parseFloat(apr.apr) })
  }

  for (const apr of data.monthly) {
    const vaultId = getIdFromChainIdAddress(chainId, apr.vault)
    map.set(vaultId, { ...map.get(vaultId), apr1m: Number.parseFloat(apr.apr) })
  }

  for (const apr of data.default) {
    const vaultId = getIdFromChainIdAddress(chainId, apr.vault)
    map.set(vaultId, { ...map.get(vaultId), apr: Number.parseFloat(apr.apr) })
  }

  return Object.fromEntries(map)
}
