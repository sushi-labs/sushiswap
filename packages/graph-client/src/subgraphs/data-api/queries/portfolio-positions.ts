import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../graphql'

export const PortfolioPositionsQuery = graphql(
  `
query PortfolioPositions($id: ID!) {
  portfolioLiquidityPositions(id: $id) {
    totalUSD
    v2Positions {
      id
      chainId
      chain
      protocol
      protocolId
      protocolLogoUrl
      address
      swapFee
      token0 {
        id
        chain
        chainId
        name
        symbol
        decimals
        logoUrl
        protocolId
        price
        isVerified
        isCore
        isWallet
        timeAt
        amount
        amountUSD
      }
      token1 {
        id
        chain
        chainId
        name
        symbol
        decimals
        logoUrl
        protocolId
        price
        isVerified
        isCore
        isWallet
        timeAt
        amount
        amountUSD
      }
      
      amountUSD
      updatedAt
    }
    v3Positions {
      id
      chainId
      chain
      protocol
      protocolId
      protocolLogoUrl
      address
      positionId
      range
      swapFee
      token0 {
        id
        chain
        chainId
        name
        symbol
        decimals
        logoUrl
        protocolId
        price
        isVerified
        isCore
        isWallet
        timeAt
        amount
        amountUSD
      }
      token1 {
        id
        chain
        chainId
        name
        symbol
        decimals
        logoUrl
        protocolId
        price
        isVerified
        isCore
        isWallet
        timeAt
        amount
        amountUSD
      }
      rewards {
        id
        chain
        chainId
        name
        symbol
        decimals
        logoUrl
        protocolId
        price
        isVerified
        isCore
        isWallet
        timeAt
        amount
        amountUSD
      }
      amountUSD
      updatedAt
    }
  }
}
`,
)

export type GetPortfolioPositions = VariablesOf<typeof PortfolioPositionsQuery>

export async function getPortfolioPositions(variables: GetPortfolioPositions, options?: RequestOptions) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: PortfolioPositionsQuery, variables },
    options,
  )
  if (result) {
    return result.portfolioLiquidityPositions
  }

  throw new Error('No portfolio positions')
}

export type PortfolioPositions = Awaited<ReturnType<typeof getPortfolioPositions>>
