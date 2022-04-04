import { getAddress } from '@ethersproject/address'

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, characters = 4): string {
  try {
    const parsed = getAddress(address)
    return `${parsed.substring(0, characters + 2)}...${parsed.substring(42 - characters)}`
  } catch (error) {
    throw `Invalid 'address' parameter '${address}'.`
  }
}
