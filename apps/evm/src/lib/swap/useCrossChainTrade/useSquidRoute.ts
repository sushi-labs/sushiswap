import type { RouteRequest } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { useSquid } from './useSquid'

export const useSquidRoute = (
  params: RouteRequest | undefined,
  enabled: boolean,
) => {
  const { data: squid } = useSquid()

  return useQuery({
    queryKey: ['squidRoute', params],
    queryFn: async () => {
      const routeResponse = await squid?.getRoute(params as RouteRequest)
      return routeResponse?.route
    },
    enabled: enabled && Boolean(squid && params),
    refetchInterval: 10000,
    retry: false,
  })
}
