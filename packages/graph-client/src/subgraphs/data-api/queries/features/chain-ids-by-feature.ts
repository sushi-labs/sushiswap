import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ChainIdsByFeatureQuery = graphql(
  `
  query ChainIdsByFeature($feature: ChainIdFeature!) {
    chainIdsByFeature(feature: $feature)
  }
`,
)

export type GetChainIdsByFeature = VariablesOf<typeof ChainIdsByFeatureQuery>

export async function getChainIdsByFeature(
  variables: GetChainIdsByFeature,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const result = await request(
    {
      url,
      document: ChainIdsByFeatureQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.chainIdsByFeature
  }

  throw new Error('Failed to fetch chain ids by feature')
}
