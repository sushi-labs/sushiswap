import type { VariablesOf } from 'gql.tada'

import { FetchError } from 'src/lib/fetch-error'
import { type RequestOptions, request } from 'src/lib/request'
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

export async function getBlocks(
  { chainId, ...variables }: GetBlocks,
  options?: RequestOptions,
) {
  const baseUrl = BLOCKS_SUBGRAPH_URL[chainId]

  if (!baseUrl) {
    throw new FetchError(chainId, `No subgraph URL for chainId ${chainId}`)
  }

  const url = `https://${baseUrl}`

  const result = await request(
    { url, document: BlocksQuery, variables },
    options,
  )

  return result.blocks.map((block) => ({
    id: block.id,
    number: Number(block.number),
    timestamp: Number(block.timestamp),
  }))
}

export type Blocks = Awaited<ReturnType<typeof getBlocks>>
