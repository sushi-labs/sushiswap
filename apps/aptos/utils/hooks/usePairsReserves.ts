import { useQuery } from '@tanstack/react-query'
import { NetworkConfig } from 'config/chains'
import fromPairs from 'lodash.frompairs'
import { useNetwork } from './useNetwork'

interface UsePairsReserves {
  pairAddresses: (string | undefined)[]
  ledgerVersion?: number
}

interface GetPairReserves extends UsePairsReserves {
  network: NetworkConfig
}

export type PairReserve = Awaited<ReturnType<typeof getPairReserves>>[number]

export async function getPairReserves({
  pairAddresses,
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

  const pairReservesQueries = await Promise.allSettled(pairAddresses.map(get))

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

export function usePairsReserves({
  pairAddresses,
  ledgerVersion,
}: UsePairsReserves) {
  const network = useNetwork()

  return useQuery({
    queryKey: ['pairsReserves', { pairAddresses, ledgerVersion, network }],
    queryFn: async () =>
      getPairReserves({ pairAddresses, ledgerVersion, network }),
    enabled: Boolean(pairAddresses),
    staleTime: Infinity,
  })
}
