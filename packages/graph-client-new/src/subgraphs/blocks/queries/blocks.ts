import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import { FetchError } from 'src/lib/fetch-error'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { ChainId } from 'sushi/chain'
import { BLOCKS_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { graphql } from '../graphql'

export const BlocksQuery = graphql(
  `
  query Blocks($first: Int = 1000, $skip: Int = 0, $orderBy: Block_orderBy = number, $orderDirection: OrderDirection = desc, $where: Block_filter) {
    blocks(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      number
      timestamp
    }
  }
`,
)

export type GetBlocks = VariablesOf<typeof BlocksQuery> &
  ChainIdVariable<ChainId>

export async function getBlocks({ chainId, ...variables }: GetBlocks) {
  const baseUrl = BLOCKS_SUBGRAPH_URL[chainId]

  if (!baseUrl) {
    throw new FetchError(chainId, `No subgraph URL for chainId ${chainId}`)
  }

  const url = `https://${baseUrl}`

  const result = await request(url, BlocksQuery, variables)

  return result
}

export type Blocks = Awaited<ReturnType<typeof getBlocks>>
