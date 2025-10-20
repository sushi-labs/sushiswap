import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_REQUEST_HEADERS } from '../../../data-api/request-headers.js'
import { graphql } from '../../graphql.js'

export const PortfolioV2ChartQuery = graphql(`
  query PortfolioV2Chart($address: Bytes!, $chainIds: [PoolChainId!]!, $tokenFilter: PortfolioChartTokenFilter, $range: PortfolioChartRange) {
    portfolioV2Chart(address: $address, chainIds: $chainIds, tokenFilter: $tokenFilter, range: $range) {
      dataPoints {
        timestamp
        valueUSD
      }
      usdChange
      percentChange
      totalValueUSD
    }
  }
`)

export type GetPortfolioV2Chart = VariablesOf<typeof PortfolioV2ChartQuery>

export async function getPortfolioV2Chart(
  variables: GetPortfolioV2Chart,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-portfolio2.data-gcp.sushi.com/graphql'

  try {
    const result = await request(
      {
        url,
        document: PortfolioV2ChartQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )

    return result.portfolioV2Chart
  } catch (error) {
    console.error('getPortfolioV2Chart error', error)
    throw new Error('getPortfolioV2Chart error')
  }
}

export type PortfolioV2ChartResponse = Awaited<
  ReturnType<typeof getPortfolioV2Chart>
>
export type PortfolioV2ChartDataPoint =
  PortfolioV2ChartResponse['dataPoints'][number]

export type PortfolioV2ChartRange =
  | 'ONE_DAY'
  | 'SEVEN_DAYS'
  | 'THIRTY_DAYS'
  | 'ALL'
