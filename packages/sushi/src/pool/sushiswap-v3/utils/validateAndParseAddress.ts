import invariant from 'tiny-invariant'
import type { Address } from 'viem'
import { getAddress } from 'viem/utils'

// warns if addresses are not checksummed
export function validateAndParseAddress(address: string): Address {
  try {
    const checksummedAddress = getAddress(address)
    return checksummedAddress
  } catch (_error) {
    invariant(false, `${address} is not a valid address.`)
  }
}
