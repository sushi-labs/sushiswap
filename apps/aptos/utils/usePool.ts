import { useQuery } from '@tanstack/react-query'
import { Pool } from './usePools'
const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']
export const getPoolQueryFn = async (network: string, address: string) => {
  const CONTRACT_ADDRESS = network === 'testnet' ? TESTNET_CONTRACT : MAINNET_CONTRACT
  if (address) {
    const response = await fetch(`${CONTRACT_ADDRESS}::swap::TokenPairMetadata<${address}>`)
    if (response.status == 200) {
      const data = await response.json()
      return data
    }
  }
  return {} as Pool
}
export function usePool(network: string = 'mainnet', address: string) {
  return useQuery({
    queryKey: ['pool', { network, address }],
    queryFn: async () => getPoolQueryFn(network, address),
    keepPreviousData: true,
    enabled: Boolean(address),
  })
}
