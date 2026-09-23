import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'

export const BuybackReserveHistoryQuery = graphql(
  `query BuybackReserveHistory($chainId: ChainId!, $walletAddress: Address!, $tokenAddress: ContractAddress!) {
  buybackReserveHistory(chainId: $chainId, walletAddress: $walletAddress, tokenAddress: $tokenAddress) {
    isReconciled
    points {
      timestamp
      amountRaw
      amount
    }
    token {
      symbol
      name
      id
      decimals
      chainId
      address
    }
  }
}`,
)

export type GetBuybackReserveHistory = VariablesOf<
  typeof BuybackReserveHistoryQuery
>

export async function getBuybackReserveHistory(
  variables: GetBuybackReserveHistory,
  options?: RequestOptions,
) {
  const url = SUSHI_DATA_API_GRAPHQL_URL

  const result = await request(
    { url, document: BuybackReserveHistoryQuery, variables },
    options,
  )
  if (result) {
    return result.buybackReserveHistory
  }

  throw new Error('No buyback reserve')
}

export type BuybackReserveHistory = Awaited<
  ReturnType<typeof getBuybackReserveHistory>
>
