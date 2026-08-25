import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../../data-api-host.js'
import { graphql } from '../../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../../request-headers.js'

export const LaunchpadUserHoldingsQuery = graphql(`
  query UserHoldings($input: LaunchpadUserHoldingsInput!) {
    launchpad {
      userHoldings(input: $input) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            amountUsd
            isCreator
            pnlPercent
            pnlUsd
            tokenAmount
            token {
              address
              chainId
              createdAt
              symbol
              name
              decimals
              creator
              initialSupply
              provider
              quoteToken {
                symbol
                name
                decimals
                address
              }
            }
          }
        }
      }
    }
  }
`)

export type GetLaunchpadUserHoldings = VariablesOf<
  typeof LaunchpadUserHoldingsQuery
>
export type LaunchpadUserHoldingsType = ResultOf<
  typeof LaunchpadUserHoldingsQuery
>['launchpad']['userHoldings']

export async function getLaunchpadUserHoldings(
  variables: GetLaunchpadUserHoldings,
  options?: RequestOptions,
): Promise<LaunchpadUserHoldingsType> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadUserHoldingsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.userHoldings
}
