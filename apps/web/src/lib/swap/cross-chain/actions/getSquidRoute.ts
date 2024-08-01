import { RouteRequest, RouteResponse } from '@0xsquid/squid-types'
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
    throw new Error(json.message)
  }

  return json
}
