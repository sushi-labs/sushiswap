import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import type { LaunchpadTokenRef } from './token-fragment.js'

export const LaunchpadQuoteTokenListQuery = graphql(`
  query LaunchpadQuoteTokenList($chainId: LaunchpadChainId!) {
    launchpad {
      quoteTokenList(chainId: $chainId) {
        address
        symbol
        name
        decimals
      }
    }
  }
`)

export type GetLaunchpadQuoteTokenList = VariablesOf<
  typeof LaunchpadQuoteTokenListQuery
>
export async function getLaunchpadQuoteTokenList(
  variables: GetLaunchpadQuoteTokenList,
  options?: RequestOptions,
): Promise<LaunchpadTokenRef[]> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadQuoteTokenListQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.quoteTokenList
}
