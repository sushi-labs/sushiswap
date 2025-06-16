import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
// import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

// TODO-BLADE: remove this once blade in prod
const SUSHI_DATA_API_HOST = 'https://data-api-180-merge.data-gcp.sushi.com'

export const BladePoolsQuery = graphql(
  `
  query BladePoolPairs($chainId: BladeChainId!) {
    bladePools(chainId: $chainId) {
        id
        address
        tokens {
            liquidityUSD
            weight
            targetWeight
            token {
                id
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
        totalApr1d
        feeUSD1d
        isDeprecated
        newPoolAddress
        abi
    }
  }
`,
)

export const BladePoolQuery = graphql(
  `
  query BladePool($address: Bytes!, $chainId: BladeChainId!) {
    bladePool(address: $address, chainId: $chainId) {
        id
        address
        tokens {
            liquidityUSD
            weight
            targetWeight
            token {
                id
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
        totalApr1d
        feeUSD1d
        isDeprecated
        newPoolAddress
        abi
    }
  }
`,
)

export const BladePoolPairsChartQuery = graphql(
  `
  query BladePoolPairsChart($address: Bytes!, $chainId: BladeChainId!, $duration: BladePoolPairsChartDuration!) {
    bladePoolPairsChart(address: $address, chainId: $chainId, duration: $duration) {
      volumeUSD
      txCount
      token0 {
        id
        address
        name
        symbol
        decimals
      }
      token1 {
        id
        address
        name
        symbol
        decimals
      }
    }
  }
`,
)

export const BladePoolTxSourcesChartQuery = graphql(
  `
  query BladePoolTxSourcesChart($address: Bytes!, $chainId: BladeChainId!, $duration: BladePoolPairsChartDuration!) {
    bladePoolTxSourcesChart(address: $address, chainId: $chainId, duration: $duration) {
        source
        volumeUSD
        txCount
    }
  }
`,
)

export type GetBladePools = VariablesOf<typeof BladePoolsQuery>
export type GetBladePool = VariablesOf<typeof BladePoolQuery>
export type GetBladePoolPairsChart = VariablesOf<
  typeof BladePoolPairsChartQuery
>
export type GetBladePoolTxSourcesChart = VariablesOf<
  typeof BladePoolTxSourcesChartQuery
>

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
      return result.bladePools.map((pool) => ({
        ...pool,
        chainId: variables.chainId,
        tokens: pool.tokens.map((token) => ({
          ...token,
          token: {
            ...token.token,
            chainId: variables.chainId,
          },
        })),
      }))
    }
  } catch (error) {
    console.error('getBladePools error', error)
  }
  return []
}

export async function getBladePool(
  variables: GetBladePool,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const result = await request(
    {
      url,
      document: BladePoolQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return {
      ...result.bladePool,
      chainId: variables.chainId,
      tokens: result.bladePool.tokens.map((token) => ({
        ...token,
        token: {
          ...token.token,
          chainId: variables.chainId,
        },
      })),
    }
  }
  throw new Error('Invalid response')
}

export async function getBladePoolPairsChart(
  variables: GetBladePoolPairsChart,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: BladePoolPairsChartQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.bladePoolPairsChart
    }
  } catch (error) {
    console.error('getBladePoolPairsChart error', error)
  }
  return []
}

export async function getBladePoolTxSourcesChart(
  variables: GetBladePoolTxSourcesChart,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: BladePoolTxSourcesChartQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.bladePoolTxSourcesChart
    }
  } catch (error) {
    console.error('getBladePoolTxSourcesChart error', error)
  }
  return []
}

export type BladePools = Awaited<ReturnType<typeof getBladePools>>
export type BladePool = NonNullable<Awaited<ReturnType<typeof getBladePool>>>
export type BladePoolPairsChart = Awaited<
  ReturnType<typeof getBladePoolPairsChart>
>
export type BladePoolTxSourcesChart = Awaited<
  ReturnType<typeof getBladePoolTxSourcesChart>
>
