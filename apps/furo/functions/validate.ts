// CONVENTION isFoo -> boolean

import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { Token } from '@sushiswap/core-sdk'
import { TokenAddressMap } from 'app/state/lists/hooks'

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string): boolean {
  return /^0x0*$/.test(hexNumberString)
}

export const isEmptyValue = (text: string) =>
  BigNumber.isBigNumber(text)
    ? BigNumber.from(text).isZero()
    : text === '' || text.replace(/0/g, '').replace(/\./, '') === ''

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function isTokenOnList(tokenAddressMap: TokenAddressMap, token?: Token): boolean {
  return Boolean(token?.isToken && tokenAddressMap[token.chainId]?.[token.address])
}
