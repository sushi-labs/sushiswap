import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers'
import { Token } from 'sushi/currency'

export const PoolsQuery = graphql(
  `
  query Pools($chainId: PoolChainId!, $page: Int, $search: [String], $orderBy: PoolsOrderBy, $orderDirection: OrderDirection, $protocols: [Protocol], $onlyIncentivized: Boolean, $onlySmartPools: Boolean) {
    pools(chainId: $chainId, page: $page, search: $search, protocols: $protocols, onlyIncentivized: $onlyIncentivized, onlySmartPools: $onlySmartPools, orderBy: $orderBy, orderDirection: $orderDirection) {
      count
      data {
        id
        chainId
        name
        address
        swapFee
        protocol
        token0Address
        token1Address
        liquidityUSD
        liquidityUSDChange1d
        volumeUSD1d
        volumeUSD1w
        volumeUSDChange1d
        volumeUSDChange1w
        txCount1d
        txCountChange1d
        feeUSD1d
        feeApr1d
        totalApr1d
        incentiveApr
        isSmartPool
        isIncentivized
        wasIncentivized
        incentives {
          id
          chainId
          chefType
          apr
          rewardToken {
            id
            chainId
            address
            name
            symbol
            decimals
          }
          rewardPerDay
          poolAddress
          pid
          rewarderAddress
          rewarderType
        }
        source
      }
    }
  }
`,
)

export type GetPools = VariablesOf<typeof PoolsQuery>

export async function getPools(variables: GetPools, options?: RequestOptions) {
  const url = `https://${SUSHI_DATA_API_HOST}`
  try {
    const result = await request(
      {
        url,
        document: PoolsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return {
        count: result.pools.count,
        data: result.pools.data.map((pool) => ({
          ...pool,
          chainId: variables.chainId,
          incentives: pool.incentives.map((incentive) => ({
            ...incentive,
            rewardToken: new Token(incentive.rewardToken),
          })),
        })),
      }
    }
  } catch (error) {
    console.error('getPools error', error)
  }
  return {
    count: 0,
    data: [],
  }
}

export type PoolsResponse = Awaited<ReturnType<typeof getPools>>
export type Pools = PoolsResponse['data']
export type Pool = Pools[number]
