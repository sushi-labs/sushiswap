import { PublicClient, getPublicClient } from '@wagmi/core'
import { getChainIdAddressFromId } from 'sushi/format'

function clientsFromIds(ids: string[]): PublicClient[] {
  const chainIds = Array.from(
    new Set(ids.map((id) => getChainIdAddressFromId(id).chainId)),
  )
  return chainIds.map((chainId) => getPublicClient({ chainId: chainId }))
}

export { clientsFromIds }
