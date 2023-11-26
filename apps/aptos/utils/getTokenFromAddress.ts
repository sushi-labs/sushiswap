import { SupportedNetwork } from 'config/chains'
import { getTokensWithoutKey } from './useTokens'

interface GetTokenFromAddress {
  address: string | null
  network: SupportedNetwork
}

export default function getTokenFromAddress({ address, network }: GetTokenFromAddress) {
  const tokens = getTokensWithoutKey({ network })
  if (!address) return
  return tokens.find((token) => token.address === address)
}
