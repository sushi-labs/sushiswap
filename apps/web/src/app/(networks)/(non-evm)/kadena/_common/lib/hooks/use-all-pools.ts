import { useQuery } from '@tanstack/react-query'
import type { KadenaPoolsApiResponse } from '~kadena/_common/types/get-all-pools-type'

export const useAllPools = ({
  first = 50,
  orderBy = 'TVL_USD_DESC',
  after = null,
}: {
  first?: number
  orderBy?: string
  after?: string | null
} = {}) => {
  return useQuery({
    queryKey: ['kadena-pools', first, orderBy, after],
    queryFn: async (): Promise<KadenaPoolsApiResponse['data']> => {
      const url = new URL('/kadena/api/pools', window.location.origin)
      url.searchParams.set('first', String(first))
      url.searchParams.set('orderBy', orderBy)
      if (after) url.searchParams.set('after', after)

      const res = await fetch(url.toString())
      const data = (await res.json()) as KadenaPoolsApiResponse

      console.log('data', data)

      if (!data.success) throw new Error('Failed to fetch pools')

      return data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
