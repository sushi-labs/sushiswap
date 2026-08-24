import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'

export const PortfolioWalletQuery = graphql(
  `
  query PortfolioWallet(
    $evmAddress: EvmAddress
    $svmAddress: SvmAddress
    $stellarAddress: StellarAccountAddress
  ) {
    portfolioWallet(
      evmAddress: $evmAddress
      svmAddress: $svmAddress
      stellarAddress: $stellarAddress
    ) {
      totalUSD
      amountUSD24Change
      percentageChange24h
      tokens {
        id
        chainId
        address
        name
        symbol
        decimals
        price24hChange
        balance
        amountUSD
      }
    }
  }
`,
)

export type GetPortfolioWallet = VariablesOf<typeof PortfolioWalletQuery>

export async function getPortfolioWallet(
  variables: GetPortfolioWallet,
  options?: RequestOptions,
) {
  const url = SUSHI_DATA_API_GRAPHQL_URL

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
export type PortfolioWalletToken = PortfolioWallet['tokens'][0]
