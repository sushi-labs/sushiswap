import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../../graphql'

export const PoolQuery = graphql(
  `
    query Pool($address: String!, $chainId: Int!, $protocol: String!) {
    pool(address: $address, chainId: $chainId, protocol: $protocol) {
        id
        chainId
        name
        address
        createdAt
        swapFee
        protocol
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
        source
        reserve0
        reserve1
        liquidity
        volumeUSD
        liquidityUSD
        token0Price
        token1Price
        volumeUSD1d
        feeUSD1d
        txCount1d
        feeApr1d
        totalApr1d
        volumeUSD1dChange
        feeUSD1dChange
        txCount1dChange
        liquidityUSD1dChange
        incentiveApr
        hadSmartPool
        hasSmartPool
        isIncentivized
        wasIncentivized
        incentives {
        id
        chainId
        chefType
        apr
        rewardToken {
            id
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
        vaults
        hour {
        id
        date
        volumeUSD
        liquidityUSD
        txCount
        feesUSD
        }
        day {
        id
        date
        volumeUSD
        liquidityUSD
        txCount
        feesUSD
        }
    }
    }
`,
)

export type GetPool = VariablesOf<
  typeof PoolQuery
>

export async function getPool(
  variables: GetPool,
  options?: RequestOptions,
) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: PoolQuery, variables },
    options,
  )
  if (result) {
    return result.pool
  }

  throw new Error('No pool found')
}

export type PoolV1 = Awaited<
  ReturnType<typeof getPool>
>
