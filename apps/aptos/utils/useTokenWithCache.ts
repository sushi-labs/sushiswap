import { useQuery } from '@tanstack/react-query'
import { Token } from './tokenType'
import { useCustomTokens } from './useCustomTokens'
import { useNetwork } from './useNetwork'
import { SupportedNetwork, chains } from 'config/chains'

interface GetTokenWithQueryCacheFn {
  address: string | undefined
  hasToken: (currency: string | Token) => boolean
  customTokens: Record<string, Token>
  network: SupportedNetwork
}
export const getTokenDetails = async ({ address, hasToken, customTokens, network }: GetTokenWithQueryCacheFn) => {
  if (hasToken(`${address}`)) {
    const { address: tokenAddress, name, symbol, decimals } = customTokens[`${address}`]
    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
    } as Token
  }
  if (!address) return undefined

  const tokenAddress = address.split(':')

  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${tokenAddress[0]}/resource/0x1::coin::CoinInfo<${address}>`
  )
  if (response.status === 200) {
    const data = await response.json()
    const tokenAddress = data?.type.slice(20).slice(0, -1)
    return {
      address: tokenAddress,
      decimals: data.data.decimals,
      name: data.data.name,
      symbol: data.data.symbol,
    } as Token
  }

  return null
}

interface UseTokenParams {
  address: string
  enabled?: boolean
  keepPreviousData?: boolean
}

export default function useTokenWithCache({ address, enabled = true, keepPreviousData = true }: UseTokenParams) {
  const { data: customTokens, hasToken } = useCustomTokens()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['token', { address, network }],
    queryFn: async () => address && getTokenDetails({ address, hasToken, customTokens, network }),
    enabled: Boolean(enabled && address),
    refetchOnWindowFocus: false,
    keepPreviousData,
    retry: false,
  })
}
