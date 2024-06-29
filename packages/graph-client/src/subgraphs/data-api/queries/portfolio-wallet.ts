import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../graphql'

export const PortfolioWalletQuery = graphql(
  `
  query PortfolioWallet($id: ID!) {
    portfolioWallet(id: $id) {
      totalUSD
      amountUSD24Change
      percentageChange24h
      tokens {
        id
        chain
        chainId
        name
        symbol
        decimals
        logoUrl
        protocolId
        price
        price24hChange
        isVerified
        isCore
        isWallet
        timeAt
        amount
        rawAmount
        amountUSD
      }
    }
  }
`,
)

export type getPortfolioWallet = VariablesOf<typeof PortfolioWalletQuery>

export async function getPortfolioWallet(variables: getPortfolioWallet, options?: RequestOptions) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: PortfolioWalletQuery, variables },
    options,
  )
  if (result) {
    return result.portfolioWallet
  }

  throw new Error('No portfolio wallet')
}

export type PortfolioWallet = Awaited<ReturnType<typeof getPortfolioWallet>>
