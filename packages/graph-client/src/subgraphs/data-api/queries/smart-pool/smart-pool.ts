import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../../graphql'

export const SmartPoolQuery = graphql(
  `
  query SmartPool($chainId: Int!, $vaultAddress: String!) {
    smartPool(chainId: $chainId, vaultAddress: $vaultAddress) {
      id
      chainId
      address
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
      strategy
      liquidityUSD
      vaultLiquidityUSD
      feeUSD1d
      feeApr1d
      feeAndIncentiveApr1d
      stakedApr1d
      stakedAndIncentiveApr1d
      incentiveApr
      wasIncentivized
      isIncentivized
      description
      lowerTick
      upperTick
      adjustmentFrequency
      lastAdjustmentTimestamp
    }
  }
`,
)

export type GetSmartPool = VariablesOf<
  typeof SmartPoolQuery
>

export async function getSmartPool(
  variables: GetSmartPool,
  options?: RequestOptions,
) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: SmartPoolQuery, variables },
    options,
  )
  if (result) {
    return result.smartPool
  }

  throw new Error('No smart pool found')
}

export type SmartPoolV1 = Awaited<
  ReturnType<typeof getSmartPool>
>
