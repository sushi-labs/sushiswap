import { SUSHI_BAR_SUBGRAPH_URL } from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'

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

export async function getSushiBar(variables: GetSushiBar) {
  const url = `https://${SUSHI_BAR_SUBGRAPH_URL}`

  const result = await request(url, SushiBarQuery, variables)

  if (result) {
    return result.xsushi
  }

  throw new Error('No bar')
}

export type SushiBar = Awaited<ReturnType<typeof getSushiBar>>
