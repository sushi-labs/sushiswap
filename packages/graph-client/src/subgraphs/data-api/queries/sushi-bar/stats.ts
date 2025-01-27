import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const SushiBarStats = graphql(
  `
query SushiBarStats {
  sushiBarStats {
    id
    sushiXsushiRatio
    xSushiSushiRatio
    sushiSupply
    xSushiSupply
    apr1m
    apr3m
    apr6m
    apr12m
  }
}

`,
)

export type GetSushiBarStats = VariablesOf<typeof SushiBarStats>

export async function getSushiBarStats(
  variables: GetSushiBarStats,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: SushiBarStats,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.sushiBarStats
  }

  throw new Error('No sushi bar stats found')
}

export type SushiBarStats = Awaited<ReturnType<typeof getSushiBarStats>>
