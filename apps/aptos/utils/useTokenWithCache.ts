import { useQuery } from '@tanstack/react-query'
import { Token } from './tokenType'

export const getTokenDetails = async (chainId: number, address: string) => {
  const tokenAddress = address.split(':')
  console.log(tokenAddress[0], address)
  const response = await fetch(
    `https://fullnode.testnet.aptoslabs.com/v1/accounts/${tokenAddress[0]}/resource/0x1::coin::CoinInfo<${address}>`
  )
  console.log(response)
  if (response.status == 200) {
    const data = await response.json()
    console.log(data)
    return { address, chainId, decimals: data.data.decimals, name: data.data.name, symbol: data.data.symbol } as Token
  } else {
    return null
  }
}

export default function useCustomToken(chainId: number = 1, address: string) {
  return useQuery({
    queryKey: ['token', { chainId, address }],
    queryFn: async () => address && getTokenDetails(chainId, address),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 900000, // 15 mins
    cacheTime: 86400000, // 24hs
  })
}
