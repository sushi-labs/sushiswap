import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_REQUEST_HEADERS } from '../../../data-api/request-headers.js'
import { graphql } from '../../graphql.js'

export const PortfolioV2LiquidityPositionsQuery = graphql(`
	query PortfolioV2LiquidityPositions(
		$user: Bytes!
		$chainIds: [PoolChainId!]!
		$protocols: [PortfolioV2Protocol!]!
		$orderBy: PortfolioV2LiquidityPositionOrderBy
		$orderDirection: OrderDirection
	) {
		portfolioV2LiquidityPositions(
			user: $user
			chainIds: $chainIds
			protocols: $protocols
			orderBy: $orderBy
			orderDirection: $orderDirection
		) {
			totalLPPositionsUSD
			totalClaimableRewards {
				token {
					id
					chainId
					address
					name
					symbol
					decimals
				}
				amount
				amountUSD
			}
			v2 {
				pool {
					address
					chainId
					name
					protocol
					percentageOfLiquidityInPoolToken0
					percentageOfLiquidityInPoolToken1
					incentiveApr
					totalApr1d
					feeApr1d
					incentives {
						rewardToken {
							symbol
							name
							id
							decimals
							chainId
							address
						}
						apr
						rewardPerDay
					}
					token0Address
					token1Address
					swapFee
				}
				position {
					amountUSD
					amount0
					amount1
					source
					token1 {
						symbol
						name
						id
						decimals
						chainId
						address
					}
					token0 {
						symbol
						name
						id
						decimals
						chainId
						address
					}
				}
			}
			v3 {
				pool {
					address
					chainId
					name
					protocol
					percentageOfLiquidityInPoolToken0
					percentageOfLiquidityInPoolToken1
					incentiveApr
					totalApr1d
					feeApr1d
					incentives {
						rewardToken {
							symbol
							name
							id
							decimals
							chainId
							address
						}
						apr
						rewardPerDay
					}
					token0Address
					token1Address
					swapFee
				}
				position {
					amountUSD
					amount0
					amount1
					unclaimedFees0
					unclaimedFees1
					unclaimedFeesUSD
					source
					tokenId
					token1 {
						symbol
						name
						id
						decimals
						chainId
						address
					}
					token0 {
						symbol
						name
						id
						decimals
						chainId
						address
					}
				}
			}
			chains {
				chainId
				amountUSD
			}
			totalClaimableRewardsUSD
		}
	}
`)

export type GetPortfolioV2LiquidityPositions = VariablesOf<
  typeof PortfolioV2LiquidityPositionsQuery
>

export async function getPortfolioV2LiquidityPositions(
  variables: GetPortfolioV2LiquidityPositions,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-portfolio2.data-gcp.sushi.com/graphql'

  try {
    const result = await request(
      {
        url,
        document: PortfolioV2LiquidityPositionsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.portfolioV2LiquidityPositions
    }
  } catch (error) {
    console.error('getPortfolioV2LiquidityPositions error', error)
    throw new Error('getPortfolioV2LiquidityPositions error')
  }
  return {
    totalLPPositionsUSD: 0,
    totalClaimableRewards: [],
    v2: [],
    v3: [],
    chains: [],
    totalClaimableRewardsUSD: 0,
  }
}

export type PortfolioV2LiquidityPositionsResponse = Awaited<
  ReturnType<typeof getPortfolioV2LiquidityPositions>
>

export type PortfolioV2Protocol =
  GetPortfolioV2LiquidityPositions['protocols'][number]
export type PortfolioV2LiquidityPositionOrderBy =
  GetPortfolioV2LiquidityPositions['orderBy']
export type PortfolioV2LiquidityPositionOrderDirection =
  GetPortfolioV2LiquidityPositions['orderDirection']
//@dev currently only data for v2 and v3
export type PortfolioV2PositionPoolType =
  | PortfolioV2LiquidityPositionsResponse['v2'][number]
  | PortfolioV2LiquidityPositionsResponse['v3'][number]
