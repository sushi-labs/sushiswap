import { useQuery } from '@tanstack/react-query'
import { KvmChainId, KvmToken, type KvmTokenAddress } from 'sushi/kvm'
import { parse } from 'yaml'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'

const KADENA_TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/Mercatus-Kadena/kadena_tokens/refs/heads/main/tokens.yaml'

export const KADENA_TOKEN_IMAGE_BASE_URL =
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

const cleanTokens = (tokens: RawTokenType): KvmToken[] => {
  return Object.entries(tokens).map(([address, token]) => {
    return new KvmToken({
      chainId: KvmChainId.KADENA,
      address: address as KvmTokenAddress,
      name: token.name,
      symbol: token.symbol,
      decimals: token.precision,
      metadata: {
        imageUrl: `${KADENA_TOKEN_IMAGE_BASE_URL}${token.img}`,
        validated: true,
        kadenaChainId: KADENA_CHAIN_ID,
        kadenaNetworkId: KADENA_NETWORK_ID,
      },
    })
  })
}

export const getKadenaBaseTokens = async (): Promise<KvmToken[]> => {
  const response = await fetch(KADENA_TOKEN_LIST_URL)
  const data = await response.text()

  const rawList = data
  const parsed = parse(rawList) as RawListReturnType
  const mainnetTokens = parsed?.mainnet

  return cleanTokens(mainnetTokens)
}

export const useBaseTokens = () => {
  return useQuery({
    queryKey: ['base-tokens-kadena'],
    queryFn: async (): Promise<KvmToken[]> => {
      return await getKadenaBaseTokens()
    },
  })
}
