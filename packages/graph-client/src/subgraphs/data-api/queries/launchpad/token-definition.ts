import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const LaunchpadTokenDefinitionQuery = graphql(`
  query LaunchpadTokenDefinition(
    $chainId: LaunchpadChainId!
    $address: EvmAddress!
  ) {
    launchpad {
      token(chainId: $chainId, address: $address) {
        __typename
        id
        chainId
        provider
        address
        factoryAddress
        name
        symbol
        decimals
        initialSupply
        initialFdvUsd
        pool {
          address
          feeTier
          quoteToken {
            address
            symbol
            name
            decimals
          }
        }
        creationTransactionHash
        createdAt
        ... on SushiV1LaunchpadToken {
          originalCreator: creator
        }
        ... on PoolsFunV1LaunchpadToken {
          originalCreator: creator
        }
        ... on SushiV2LaunchpadToken {
          originalCreator: launchCreator
        }
      }
    }
  }
`)

export type LaunchpadTokenDefinition = NonNullable<
  ResultOf<typeof LaunchpadTokenDefinitionQuery>['launchpad']['token']
>

export type GetLaunchpadTokenDefinition = VariablesOf<
  typeof LaunchpadTokenDefinitionQuery
>

export async function getLaunchpadTokenDefinition(
  variables: GetLaunchpadTokenDefinition,
  options?: RequestOptions,
): Promise<LaunchpadTokenDefinition | null> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadTokenDefinitionQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.token
}
