import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
import { Token } from 'utils/tokenType'
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
    token_x_details: Token
    token_y_details: Token
  }
}

interface FetchPoolsQueryFn {
  network: SupportedNetwork
}

export async function fetchPoolsQueryFn({ network }: FetchPoolsQueryFn) {
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${chains[network].contracts.swap}/resources`,
  )

  if (response.status === 200) {
    const data = await response.json()
    const coinPair: Pool[] = data.flatMap((pair: any) => {
      if (!pair.type.includes(`::swap::TokenPairMetadata`)) {
        return []
      }

      pair.id = `${pair?.data?.token_x_details?.token_address}, ${pair?.data?.token_y_details?.token_address}`

      pair.data.token_x_details = {
        address: pair.data.token_x_details.token_address,
        decimals: pair.data.token_x_details.decimals,
        name: pair.data.token_x_details.name,
        symbol: pair.data.token_x_details.symbol,
      }

      pair.data.token_y_details = {
        address: pair.data.token_y_details.token_address,
        decimals: pair.data.token_y_details.decimals,
        name: pair.data.token_y_details.name,
        symbol: pair.data.token_y_details.symbol,
      }

      return pair as Pool
    })

    return coinPair
  }

  return []
}

interface UsePools {
  enabled?: boolean
}

export function usePools({ enabled = true }: UsePools = { enabled: true }) {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['pools', { network }],
    queryFn: async () => fetchPoolsQueryFn({ network }),
    keepPreviousData: true,
    enabled: Boolean(enabled),
  })
}
