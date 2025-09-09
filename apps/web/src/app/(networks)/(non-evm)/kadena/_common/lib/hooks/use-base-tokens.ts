import { useQuery } from '@tanstack/react-query'
import { parse } from 'yaml'
import type { KadenaToken } from '~kadena/_common/types/token-type'

const TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/Mercatus-Kadena/kadena_tokens/refs/heads/main/tokens.yaml'

const TOKEN_IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/Mercatus-Kadena/kadena_tokens/refs/heads/main/'

type RawTokenType = Record<
  string,
  {
    description: string | null
    img: string
    name: string
    socials?: {
      type: 'website' | 'twitter' | 'discord' | 'github' | 'telegram'
      url: string
    }[]
    symbol: string
    totalSupply?: number
    circulatingSupply?: number
    precision: number
    color: string
  }
>

type BlackListType = string[]
type TestnetType = Exclude<RawTokenType, 'color' | 'precision'>
type MainnetType = RawTokenType

type RawListReturnType = {
  mainnet: MainnetType
  testnet: TestnetType
  blacklist: BlackListType
}

export const useBaseTokens = () => {
  return useQuery({
    queryKey: ['base-tokens-kadena'],
    queryFn: async (): Promise<KadenaToken[]> => {
      const response = await fetch(TOKEN_LIST_URL)
      const data = await response.text()

      const rawList = data
      const parsed = parse(rawList) as RawListReturnType
      const mainnetTokens = parsed?.mainnet

      const cleanedTokens = Object.entries(mainnetTokens).map(
        ([address, token]) => {
          return {
            tokenAddress: address,
            isNative: address === 'coin',
            tokenName: token.name,
            tokenSymbol: token.symbol,
            tokenDecimals: token.precision,
            tokenImage: `${TOKEN_IMAGE_BASE_URL}${token.img}`,
            validated: true,
          }
        },
      )

      return cleanedTokens
    },
  })
}
