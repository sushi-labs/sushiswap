import { SUSHI_BAR_SUBGRAPH_URL } from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import { graphql } from '../graphql'

export const SushiBarHistoryQuery = graphql(
  `
  query Bar($hourCnt: Int = 24, $dayCnt: Int = 7, $weekCnt: Int = 1000) {
    hourSnapshots(first: $hourCnt, orderBy: date, orderDirection: desc) {
      id
      date
      xSushiSupply
      apr1m
      apr3m
      apr6m
      apr12m
    }
    daySnapshots(first: $dayCnt, orderBy: date, orderDirection: desc) {
      id
      date
      xSushiSupply
      apr1m
      apr3m
      apr6m
      apr12m
    }
    weekSnapshots(first: $weekCnt, orderBy: date, orderDirection: desc) {
      id
      date
      xSushiSupply
      apr1m
      apr3m
      apr6m
      apr12m
    }
  }
`,
)

export type GetSushiBarHistory = VariablesOf<typeof SushiBarHistoryQuery>

export async function getSushiBarHistory(variables: GetSushiBarHistory) {
  const url = `https://${SUSHI_BAR_SUBGRAPH_URL}`

  const result = await request(url, SushiBarHistoryQuery, variables)

  return result
}

export type SushiBarHistory = Awaited<ReturnType<typeof getSushiBarHistory>>
