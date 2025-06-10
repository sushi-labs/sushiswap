import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
// import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

// TODO-BLADE: remove this once blade in prod
const SUSHI_DATA_API_HOST = 'http://data-api-180-merge.data-gcp.sushi.com'

export const BladePoolsQuery = graphql(
  `
  query BladePoolPairs($chainId: BladeChainId!) {
    bladePools(chainId: $chainId) {
        id
        address
        chainId
        tokens {
            liquidityUSD
            weight
            targetWeight
            token {
                id
                chainId
                address
                name
                symbol
                decimals
            }
        }
        liquidityUSD
        liquidityUSDChange1d
        volumeUSD
        volumeUSD1d
        volumeUSDChange1d
        volumeUSD1w
        volumeUSDChange1w
        feeApr1d
        feeUSD1d
        isDeprecated
        newPoolAddress
        abi
    }
  }
`,
)

export type GetBladePools = VariablesOf<typeof BladePoolsQuery>

export async function getBladePools(
  variables: GetBladePools,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: BladePoolsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.bladePools
    }
  } catch (error) {
    console.error('getBladePools error', error)
  }
  return []
}

export type BladePools = Awaited<ReturnType<typeof getBladePools>>
export type BladePool = BladePools[number]
