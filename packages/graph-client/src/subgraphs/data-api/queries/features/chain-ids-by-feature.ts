import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../../graphql'
import { SUSHI_DATA_API_HOST } from '../../data-api-host'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers'

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
