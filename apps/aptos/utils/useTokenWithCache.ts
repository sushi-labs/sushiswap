import { useQuery } from '@tanstack/react-query'
import { Token } from './tokenType'
import { useCustomTokens } from './useCustomTokens'
interface GetTokenWithQueryCacheFn {
  chainId: number | undefined
  address: string | undefined
  hasToken: (currency: string | Token) => boolean
  customTokens: Record<string, Token>
}

export const getTokenDetails = async ({ chainId, address, hasToken, customTokens }: GetTokenWithQueryCacheFn) => {
  const network = chainId == 1 ? 'mainnet' : 'testnet'
  if (chainId && hasToken(`${chainId}:${address}`)) {
    const { address: tokenAddress, name, symbol, decimals } = customTokens[`${chainId}:${address}`]
    return {
      address: tokenAddress,
      chainId,
      name,
      symbol,
      decimals,
    } as Token
  }
  if (address) {
    const tokenAddress = address.split(':')
    const response = await fetch(
      `https://fullnode.${network}.aptoslabs.com/v1/accounts/${tokenAddress[0]}/resource/0x1::coin::CoinInfo<${address}>`
    )
    if (response.status == 200) {
      const data = await response.json()
      const tokenAddress = data?.type.slice(20).slice(0, -1)
      return {
        address: tokenAddress,
        chainId,
        decimals: data.data.decimals,
        name: data.data.name,
        symbol: data.data.symbol,
      } as Token
    } else {
      return null
    }
  } else {
    return null
  }
}

interface UseTokenParams {
  chainId: number
  address: string
  enabled?: boolean
  keepPreviousData?: boolean
}

export default function useTokenWithCache({
  chainId = 1,
  address,
  enabled = true,
  keepPreviousData = true,
}: UseTokenParams) {
  const { data: customTokens, hasToken } = useCustomTokens()
  return useQuery({
    queryKey: ['token', { chainId, address }],
    queryFn: async () => address && getTokenDetails({ chainId, address, hasToken, customTokens }),
    enabled: Boolean(enabled && chainId && address),
    refetchOnWindowFocus: false,
    keepPreviousData,
    retry: false,
  })
}
