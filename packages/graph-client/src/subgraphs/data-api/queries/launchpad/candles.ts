import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const LaunchpadCandlesQuery = graphql(`
  query LaunchpadCandles($input: LaunchpadCandlesInput!) {
    launchpad {
      candles(input: $input) {
        streamCursor
        nodes {
          timestamp
          open
          high
          low
          close
          volumeUsd
          tradeCount
        }
      }
    }
  }
`)

export type GetLaunchpadCandles = VariablesOf<typeof LaunchpadCandlesQuery>
export type LaunchpadCandlesInput = GetLaunchpadCandles['input']
export type LaunchpadCandleInterval = LaunchpadCandlesInput['interval']
export type LaunchpadCandleSnapshot = ResultOf<
  typeof LaunchpadCandlesQuery
>['launchpad']['candles']
export type LaunchpadCandle = LaunchpadCandleSnapshot['nodes'][number]

export async function getLaunchpadCandles(
  variables: GetLaunchpadCandles,
  options?: RequestOptions,
): Promise<LaunchpadCandleSnapshot> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadCandlesQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.candles
}
