import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { getAddress } from 'viem/utils'

// warns if addresses are not checksummed
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (_error) {
    invariant(false, `${address} is not a valid address.`)
  }
}
