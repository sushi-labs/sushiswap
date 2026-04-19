import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const PerpsPointsHistoryQuery = graphql(
  `
    query PerpsPointsHistory($address: EvmAddress!, $from: String, $to: String) {
      perps {
        pointsHistory(address: $address, from: $from, to: $to) {
          date
          points
        }
      }
    }
  `,
)

export type GetPerpsPointsHistory = VariablesOf<typeof PerpsPointsHistoryQuery>

export async function getPerpsPointsHistory(
  variables: GetPerpsPointsHistory,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PerpsPointsHistoryQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.pointsHistory
  }

  throw new Error('No perps points history')
}

export type PerpsPointsHistory = Awaited<
  ReturnType<typeof getPerpsPointsHistory>
>
export type PerpsPointsPoint = PerpsPointsHistory[number]
