import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const PerpsPointsOverviewQuery = graphql(
  `
    query PerpsPointsOverview($address: EvmAddress!) {
      perps {
        pointsOverview(address: $address) {
          pointMultipliers {
              multiplier
              thresholdUsd
            }
            baseMultiplier
            totalVolumeUsd
            totalPoints
            points7d
            points30d
            address
        }
      }
    }
  `,
)

export type GetPerpsPointsOverview = VariablesOf<
  typeof PerpsPointsOverviewQuery
>

export async function getPerpsPointsOverview(
  variables: GetPerpsPointsOverview,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PerpsPointsOverviewQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.pointsOverview
  }

  throw new Error('No perps points overview')
}

export type PerpsPointsOverview = Awaited<
  ReturnType<typeof getPerpsPointsOverview>
>
