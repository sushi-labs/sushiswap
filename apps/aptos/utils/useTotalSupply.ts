import { useQuery } from '@tanstack/react-query'

const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']

export type CoinInfo = {
  type: string
  data: {
    decimals: number
    name: string
    supply: {
      vec: [
        {
          aggregator: {
            vec: []
          }
          integer: {
            vec: [
              {
                limit: string
                value: string
              }
            ]
          }
        }
      ]
    }
    symbol: string
  }
}

const totalSupplyQueryFn = async (chainId: string, tokenAddress: string) => {
  const CONTRACT_ADDRESS = chainId === '2' ? TESTNET_CONTRACT : MAINNET_CONTRACT
  const network = chainId === '2' ? 'testnet' : 'mainnet'
  if (tokenAddress) {
    const response = await fetch(
      `https://fullnode.${network}.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/resource/0x1::coin::CoinInfo<${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>>`
    )
    if (response.status == 200) {
      const data = await response.json()
      return data as CoinInfo
    }
  }
  return {} as CoinInfo
}

export function useTotalSupply(chainId: string, tokenAddress: string) {
  return useQuery({
    queryKey: ['totalSupply', { chainId, tokenAddress }],
    queryFn: async () => totalSupplyQueryFn(chainId, tokenAddress),
  })
}
