import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
import { useNetwork } from './useNetwork'
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

interface UserPositionsQueryFn {
  address: string
  allPools: Pool[]
  network: SupportedNetwork
}

const userPositionsQueryFn = async ({
  address,
  allPools = [],
  network,
}: UserPositionsQueryFn) => {
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${address}/resources`,
  )

  if (response.status === 200) {
    const data = await response.json()
    const userLPTokens: CoinStore[] = data?.filter((coin: CoinStore) => {
      return coin?.type.includes(
        `0x1::coin::CoinStore<${chains[network].contracts.swap}::swap::LPToken`,
      )
    })

    if (allPools.length) {
      const userPositions = allPools.filter((pool) => {
        const poolAddress = pool.id
        return userLPTokens.some((userLPToken) => {
          const tokenAddress = userLPToken.type
            .replaceAll(
              `0x1::coin::CoinStore<${chains[network].contracts.swap}::swap::LPToken<`,
              '',
            )
            .slice(0, -2)
          return tokenAddress === poolAddress
        })
      })

      return userPositions
    } else {
      return [] as Pool[]
    }
  }

  return [] as Pool[]
}

export function useUserPositions(address: string, enabled = true) {
  const { data: allPools } = usePools()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['userPositions', { address, allPools, network }],
    queryFn: async () =>
      userPositionsQueryFn({ address, allPools: allPools as Pool[], network }),
    enabled: Boolean(enabled && address),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
