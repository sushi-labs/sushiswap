import type { RouteRequest, RouteResponse } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { SquidApiURL, SquidIntegratorId } from 'sushi/config'

export const getSquidRoute = async (
  params: RouteRequest,
): Promise<RouteResponse> => {
  const url = new URL(`${SquidApiURL}/route`)

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'x-integrator-id': SquidIntegratorId,
      'Content-Type': 'application/json',
    },
  })

  const json = await response.json()

  if (response.status !== 200) {
    json.data.error
    throw new Error(json.data.error)
  }

  return json
}

export const useSquidRoute = (
  params: RouteRequest | undefined,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ['squidRoute', params],
    queryFn: async () => {
      const response = await getSquidRoute(params!)
      return response.route
    },
    enabled: enabled && Boolean(params),
    refetchInterval: 10000,
    retry: false,
  })
}
