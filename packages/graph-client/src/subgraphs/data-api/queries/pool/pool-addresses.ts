import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request'
import { SUSHI_DATA_API_HOST } from '../../data-api-host'
import { graphql } from '../../graphql'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers'

export const PoolAddressesQuery = graphql(
  `
  query PoolAddresses($chainId: PoolChainId!, $protocols: [Protocol]) {
    poolAddresses(chainId: $chainId, protocols: $protocols)
  }
`,
)

export type GetPoolAddresses = VariablesOf<typeof PoolAddressesQuery>

export async function getPoolAddresses(
  variables: GetPoolAddresses,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: PoolAddressesQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.poolAddresses
    }
  } catch (error) {
    console.error('getPoolAddresses error', error)
  }

  throw new Error('getPoolAddresses error')
}

export type PoolAddressesResponse = Awaited<ReturnType<typeof getPoolAddresses>>
