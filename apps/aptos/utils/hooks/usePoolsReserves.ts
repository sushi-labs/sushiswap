import { useQuery } from '@tanstack/react-query'
import { NetworkConfig } from 'config/chains'
import fromPairs from 'lodash.frompairs'
import { useNetwork } from './useNetwork'

interface UsePoolsReserves {
  poolAddresses: string[] | undefined
  ledgerVersion?: number
}

interface GetPairReserves extends UsePoolsReserves {
  poolAddresses: string[]
  network: NetworkConfig
}

export type PoolReserve = Awaited<ReturnType<typeof getPoolReserves>>[number]

export async function getPoolReserves({
  poolAddresses,
  ledgerVersion,
  network,
}: GetPairReserves) {
  const {
    api: { fetchUrlPrefix },
    contracts: { swap: swapContract },
  } = network

  const get = async (pairAddress: string | undefined) => {
    if (!pairAddress) throw new Error('No pair address')

    let url = `${fetchUrlPrefix}/v1/accounts/${swapContract}/resource/${pairAddress}`
    if (ledgerVersion) {
      url += `?ledger_version=${ledgerVersion}`
    }

    const response = await fetch(url)
    if (response.status === 200) {
      const data = response.json()
      return data
    }

    throw new Error('Failed to fetch pair reserves')
  }

  const pairReservesQueries = await Promise.allSettled(poolAddresses.map(get))

  const pairReserves = pairReservesQueries.flatMap((p) => {
    if (p.status === 'fulfilled') {
      return p.value
    }
    return []
  })

  return fromPairs(
    pairReserves.map(
      (p) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [p.type, p] as [
          string,
          {
            type: string
            data: {
              reserve_x: string
              reserve_y: string
              block_timestamp_last: string
            }
          },
        ],
    ),
  )
}

export function usePoolsReserves({
  poolAddresses,
  ledgerVersion,
}: UsePoolsReserves) {
  const network = useNetwork()

  return useQuery({
    queryKey: ['poolsReserves', { poolAddresses, ledgerVersion, network }],
    queryFn: async () => {
      if (!poolAddresses) throw new Error('No pool addresses')

      return getPoolReserves({ poolAddresses, ledgerVersion, network })
    },
    enabled: Boolean(poolAddresses),
    staleTime: Infinity,
  })
}
