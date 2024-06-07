import type { VariablesOf } from 'gql.tada'

import { FetchError } from 'src/lib/fetch-error'
import { type RequestOptions, request } from 'src/lib/request'
import { SUSHI_BAR_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { graphql } from '../graphql'

export const SushiBarQuery = graphql(
  `
  query Bar($block: Block_height) {
    xsushi(id: "xSushi", block: $block) {
      id
      sushiXsushiRatio
      xSushiSushiRatio
      sushiSupply
      xSushiSupply
      apr1m
      apr3m
      apr6m
      apr12m
    }
  }
`,
)

export type GetSushiBar = VariablesOf<typeof SushiBarQuery>

export async function getSushiBar(
  variables: GetSushiBar,
  options?: RequestOptions,
) {
  const url = `https://${SUSHI_BAR_SUBGRAPH_URL}`

  const result = await request(
    { url, document: SushiBarQuery, variables },
    options,
  )

  if (result) {
    return result.xsushi
  }

  throw new FetchError(1, 'No bar')
}

export type SushiBar = Awaited<ReturnType<typeof getSushiBar>>
