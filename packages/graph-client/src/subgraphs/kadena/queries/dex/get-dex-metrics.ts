import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { KADENA_INDEXER_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'
import { KADENA_INDEXER_REQUEST_HEADERS } from '../../request-headers.js'

export const GetDexMetricsQuery = graphql(
  `
		query GetDexMetrics($protocolAddress: String!) {
			dexMetrics(protocolAddress: $protocolAddress) {
				totalPools
				currentTvlUsd
				totalVolumeUsd
				tvlHistory {
					timestamp
					value
				}
				volumeHistory {
					timestamp
					value
				}
			}
		}
	`,
)

export type GetDexMetrics = VariablesOf<typeof GetDexMetricsQuery>

export type GetDexMetricsResponse = Awaited<ReturnType<typeof getDexMetrics>>

export async function getDexMetrics(
  variables: GetDexMetrics,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: KADENA_INDEXER_GRAPHQL_URL,
      document: GetDexMetricsQuery,
      variables,
      requestHeaders: KADENA_INDEXER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.dexMetrics) {
    throw new Error('Failed to getDexMetrics')
  }

  return result.dexMetrics
}
