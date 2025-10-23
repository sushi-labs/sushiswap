import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import type { EvmChainId } from 'sushi/evm'
import { EvmToken } from 'sushi/evm'
import { SUSHI_REQUEST_HEADERS } from '../../../data-api/request-headers.js'
import { graphql } from '../../graphql.js'

export const MultiChainPoolsQuery = graphql(`
  query MultiChainPools(
    $chainIds: [PoolChainId!]!,
    $page: Int,
    $search: [String],
    $protocols: [Protocol],
    $onlyIncentivized: Boolean,
    $orderBy: PoolsOrderBy,
    $orderDirection: OrderDirection,
    $minTvl: Float,
    $maxTvl: Float
  ) {
    multiChainPools(
      chainIds: $chainIds,
      page: $page,
      search: $search,
      protocols: $protocols,
      onlyIncentivized: $onlyIncentivized,
      orderBy: $orderBy,
      orderDirection: $orderDirection,
      minTvl: $minTvl,
      maxTvl: $maxTvl
    ) {
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
        feeApr1d,
        feeApr1w
        feeApr1wSparkLine
        totalApr1d
        totalApr1w
        tvlVolumeRatio
        percentageOfLiquidityInPoolToken0
        percentageOfLiquidityInPoolToken1
        incentiveApr
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
`)

export type GetMultiChainPools = VariablesOf<typeof MultiChainPoolsQuery>

export async function getMultiChainPools(
  variables: GetMultiChainPools,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-sushi2.data-gcp.sushi.com/graphql'
  // const chainIds = variables.chainIds as EvmChainId[]

  try {
    const result = await request(
      {
        url,
        document: MultiChainPoolsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return {
        count: result.multiChainPools.count,
        data: result.multiChainPools.data.map((pool) => ({
          ...pool,
          incentives: pool.incentives.map((incentive) => {
            return {
              ...incentive,
              rewardToken: new EvmToken({
                ...incentive.rewardToken,
                chainId: incentive.rewardToken.chainId as EvmChainId,
                address: incentive.rewardToken.address as `0x${string}`,
              }),
            }
          }),
        })),
      }
    }
  } catch (error) {
    console.error('getMultiChainPools error', error)
    throw new Error('getMultiChainPools error')
  }
  return {
    count: 0,
    data: [],
  }
}

export type MultiChainPoolsResponse = Awaited<
  ReturnType<typeof getMultiChainPools>
>
export type MultiChainPools = MultiChainPoolsResponse['data']
export type MultiChainPool = MultiChainPools[number]
