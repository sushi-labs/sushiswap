import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'

export const BuybackReserveQuery = graphql(
  `query BuybackReserve($chainId: ChainId!, $walletAddress: Address!, $tokenAddress: ContractAddress!) {
  buybackReserve(chainId: $chainId, walletAddress: $walletAddress, tokenAddress: $tokenAddress) {
    amount
    amountRaw
    amountUSD
    averageBuyPriceUSD
    buybackCount
    holderCount
    chainId
    percentageDifference
    spotPriceUSD
    token {
      symbol
      name
      id
      decimals
      chainId
      address
    }
    walletAddress
  }
}`,
)

export type GetBuybackReserve = VariablesOf<typeof BuybackReserveQuery>

export async function getBuybackReserve(
  variables: GetBuybackReserve,
  options?: RequestOptions,
) {
  const url = SUSHI_DATA_API_GRAPHQL_URL

  const result = await request(
    { url, document: BuybackReserveQuery, variables },
    options,
  )
  if (result) {
    return result.buybackReserve
  }

  throw new Error('No buyback reserve')
}

export type BuybackReserve = Awaited<ReturnType<typeof getBuybackReserve>>
