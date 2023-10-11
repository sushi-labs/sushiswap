import { getChainIdAddressFromId } from '@sushiswap/format'
import { getPublicClient, PublicClient } from '@wagmi/core'

function clientsFromIds(ids: string[]): PublicClient[] {
  const chainIds = Array.from(
    new Set(ids.map((id) => getChainIdAddressFromId(id).chainId)),
  )
  return chainIds.map((chainId) => getPublicClient({ chainId: chainId }))
}

export { clientsFromIds }
