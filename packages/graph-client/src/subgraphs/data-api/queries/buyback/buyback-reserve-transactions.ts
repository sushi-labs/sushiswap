import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'

export const BuybackReserveTransactionsQuery = graphql(
  `query BuybackReserveTransactions($chainId: ChainId!, $walletAddress: Address!, $tokenAddress: ContractAddress!, $first: Int, $after: Base64) {
  buybackReserveTransactions(chainId: $chainId, walletAddress: $walletAddress, tokenAddress: $tokenAddress, first: $first, after: $after) {
    endCursor
    hasNextPage
    token {
      symbol
      name
      id
      decimals
      chainId
      address
    }
    totalCount
    transactions {
      transactionHash
      timestamp
      round
      receivedRaw
      received
      priceUSD
      spent {
        token {
          symbol
          name
          id
          decimals
          chainId
          address
        }
        amountUSD
        amountRaw
        amount
      }
    }
  }
}`,
)

export type GetBuybackReserveTransactions = VariablesOf<
  typeof BuybackReserveTransactionsQuery
>

export async function getBuybackReserveTransactions(
  variables: GetBuybackReserveTransactions,
  options?: RequestOptions,
) {
  const url = SUSHI_DATA_API_GRAPHQL_URL

  const result = await request(
    { url, document: BuybackReserveTransactionsQuery, variables },
    options,
  )
  if (result) {
    return result.buybackReserveTransactions
  }

  throw new Error('No buyback reserve')
}

export type BuybackReserveTransactions = Awaited<
  ReturnType<typeof getBuybackReserveTransactions>
>
export type BuybackReserveTransaction =
  BuybackReserveTransactions['transactions'][number]
