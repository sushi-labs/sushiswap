import type { Address } from 'viem'
import type { ChainId } from '../chain/index.js'
import { unsanitize } from './unsanitize.js'

export const getIdFromChainIdAddress = (
  chainId: string | number,
  address: Address,
) => `${chainId}:${address.toLowerCase()}`

export const getChainIdAddressFromId = (id: string) => {
  const [chainId, address] = unsanitize(id).split(':') as [string, Address]

  if (!chainId || !address) throw new Error(`Invalid id: ${id}`)

  return { chainId: Number(chainId) as ChainId, address }
}
