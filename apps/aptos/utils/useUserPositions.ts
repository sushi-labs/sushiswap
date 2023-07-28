import { useQuery } from '@tanstack/react-query'
import { Pool, usePools } from './usePools'

export type CoinStore = {
  type: string
  data: {
    coin: {
      value: number
    }
    deposit_events: {
      counter: string
      guid: {
        id: {
          addr: string
          creation_num: string
        }
      }
    }
    frozen: boolean
    withdraw_events: {
      counter: string
      guid: {
        id: {
          addr: string
          creation_num: string
        }
      }
    }
  }
}
const userPositionsQueryFn = async (network: string, address: string, allPools: Pool[] = []) => {
  const CONTRACT =
    network == 'testnet' ? process.env.NEXT_PUBLIC_TESTNET_CONTRACT : process.env.NEXT_PUBLIC_MAINNET_CONTRACT
  if (address) {
    const response = await fetch(`https://fullnode.${network}.aptoslabs.com/v1/accounts/${address}/resources`)
    if (response.status == 200) {
      const data = await response.json()
      const userLPTokens: CoinStore[] = data?.filter((coin: CoinStore) => {
        return coin?.type.includes(`0x1::coin::CoinStore<${CONTRACT}::swap::LPToken`)
      })
      if (allPools.length) {
        const userPositions = allPools.filter((pool: Pool) => {
          const [, ...address] = pool.id.split(':')
          const poolAddress = address.join(':')
          return userLPTokens.some((userLPToken) => {
            const tokenAddress = userLPToken.type
              .replaceAll(`0x1::coin::CoinStore<${CONTRACT}::swap::LPToken<`, '')
              .slice(0, -2)
            return tokenAddress === poolAddress
          })
        })
        return userPositions
      } else {
        return [] as Pool[]
      }
    } else {
      return [] as Pool[]
    }
  }
  return [] as Pool[]
}

export function useUserPositions(network: string = 'mainnet', address: string, enabled: boolean = true) {
  const chainId = network == 'testnet' ? 2 : 1
  const { data: allPools } = usePools(chainId)
  return useQuery({
    queryKey: ['userPositions', { network, address, allPools }],
    queryFn: async () => userPositionsQueryFn(network, address, allPools as Pool[]),
    enabled: Boolean(enabled && network && address),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
