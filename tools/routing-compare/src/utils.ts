import { Token } from 'sushi/currency'

export function isNative(t: Token) {
  return t.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
}
