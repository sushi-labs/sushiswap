import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import {
  type LaunchpadToken,
  LaunchpadTokenFragment,
} from './token-fragment.js'

export const LaunchpadTokensQuery = graphql(
  `
    query LaunchpadTokens($input: LaunchpadTokensInput!) {
      launchpad {
        tokens(input: $input) {
          edges {
            cursor
            node {
              ...LaunchpadTokenFragment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
          totalCount
        }
      }
    }
  `,
  [LaunchpadTokenFragment],
)

export const LaunchpadTokenQuery = graphql(
  `
    query LaunchpadToken($chainId: LaunchpadChainId!, $address: EvmAddress!) {
      launchpad {
        token(chainId: $chainId, address: $address) {
          ...LaunchpadTokenFragment
        }
      }
    }
  `,
  [LaunchpadTokenFragment],
)

export type GetLaunchpadTokens = VariablesOf<typeof LaunchpadTokensQuery>
export type GetLaunchpadToken = VariablesOf<typeof LaunchpadTokenQuery>
export type LaunchpadTokenConnection = ResultOf<
  typeof LaunchpadTokensQuery
>['launchpad']['tokens']
export type LaunchpadPageInfo = LaunchpadTokenConnection['pageInfo']

export type LaunchpadTokensInput = GetLaunchpadTokens['input']
export type LaunchpadTokenSortField = NonNullable<
  LaunchpadTokensInput['sortBy']
>
export type LaunchpadSortDirection = NonNullable<
  LaunchpadTokensInput['sortDirection']
>

export async function getLaunchpadTokens(
  variables: GetLaunchpadTokens,
  options?: RequestOptions,
): Promise<LaunchpadTokenConnection> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadTokensQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.tokens
}

export async function getLaunchpadToken(
  variables: GetLaunchpadToken,
  options?: RequestOptions,
): Promise<LaunchpadToken | null> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadTokenQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.token
}
