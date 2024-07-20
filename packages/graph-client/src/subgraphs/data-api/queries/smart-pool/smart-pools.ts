import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../../graphql'

export const SmartPoolsQuery = graphql(
  `
  query SmartPools($chainId: Int!) {
    smartPools(chainId: $chainId) {
      id
      chainId
      address
      swapFee
      strategy
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
    }
  }
`,
)

export type GetSmartPools = VariablesOf<
  typeof SmartPoolsQuery
>

export async function getSmartPools(
  variables: GetSmartPools,
  options?: RequestOptions,
) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: SmartPoolsQuery, variables },
    options,
  )
  if (result) {
    return result.smartPools
  }

  throw new Error('No smart pools found')
}

export type SmartPoolsV1 = Awaited<
  ReturnType<typeof getSmartPools>
>
