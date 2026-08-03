import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import { LaunchpadTokenFragment } from './token-fragment.js'

export const LaunchpadCreatorQuery = graphql(
  `
    query LaunchpadCreator(
      $chainId: LaunchpadChainId!
      $address: EvmAddress!
      $input: LaunchpadTokensInput!
    ) {
      launchpad {
        creator(chainId: $chainId, address: $address) {
          chainId
          address
          launchCount
        }
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

export type GetLaunchpadCreator = VariablesOf<typeof LaunchpadCreatorQuery>
type LaunchpadCreatorResult = ResultOf<
  typeof LaunchpadCreatorQuery
>['launchpad']
export type LaunchpadCreator = LaunchpadCreatorResult['creator'] & {
  launches: LaunchpadCreatorResult['tokens']
}

export async function getLaunchpadCreator(
  variables: GetLaunchpadCreator,
  options?: RequestOptions,
): Promise<LaunchpadCreator> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadCreatorQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return {
    ...result.launchpad.creator,
    launches: result.launchpad.tokens,
  }
}
