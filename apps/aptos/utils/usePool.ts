import { useQuery } from '@tanstack/react-query'
import { Pool } from './usePools'
const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']
export const getPoolQueryFn = async (chainId: number, address: string) => {
  const CONTRACT_ADDRESS = chainId === 2 ? TESTNET_CONTRACT : MAINNET_CONTRACT
  const network = chainId === 2 ? 'testnet' : 'mainnet'
  console.log(network)
  if (address) {
    const response = await fetch(
      `https://fullnode.${network}.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/resource/${CONTRACT_ADDRESS}::swap::TokenPairMetadata<${address}>`
    )
    if (response.status == 200) {
      console.log(response)
      const pair = await response.json()
      pair.id =
        chainId + ':' + pair?.data?.token_x_details?.token_address + ', ' + pair?.data?.token_y_details?.token_address
      console.log(pair)
      return pair as Pool
    }
  }
  return {} as Pool
}
export function usePool(chainId: number, address: string) {
  return useQuery({
    queryKey: ['pool', { chainId, address }],
    queryFn: async () => getPoolQueryFn(chainId, address),
    keepPreviousData: true,
    enabled: Boolean(address),
  })
}
