import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
import { useNetwork } from './useNetwork'

export type Pool = {
  id: string
  type: string
  data: {
    balance_x: {
      value: string
    }
    balance_y: {
      value: string
    }
    burn_cap: {
      dummy_field: boolean
    }
    creator: string
    fee_amount: {
      value: string
    }
    freeze_cap: {
      dummy_field: boolean
    }
    k_last: string
    mint_cap: {
      dummy_field: boolean
    }
    token_x_details: {
      decimals: number
      name: string
      symbol: string
      token_address: string
    }
    token_y_details: {
      decimals: number
      name: string
      symbol: string
      token_address: string
    }
  }
}

interface FetchPoolsQueryFn {
  network: SupportedNetwork
}

export async function fetchPoolsQueryFn({ network }: FetchPoolsQueryFn) {
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${chains[network].contracts.swap}/resources`
  )

  if (response.status === 200) {
    const data = await response.json()
    const coinPair: Pool[] = data.filter((pair: Pool) => {
      pair.id = `${pair?.data?.token_x_details?.token_address}, ${pair?.data?.token_y_details?.token_address}`
      return pair.type.includes(`${chains[network].contracts.swap}::swap::TokenPairMetadata`)
    })

    return coinPair
  }

  return []
}

export function usePools(enable = true) {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['pools', { network }],
    queryFn: async () => fetchPoolsQueryFn({ network }),
    keepPreviousData: true,
    enabled: Boolean(enable),
  })
}
