import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request'
import { SUSHI_BAR_SUBGRAPH_URL } from 'sushi/config/subgraph'
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

export async function getSushiBarHistory(
  variables: GetSushiBarHistory,
  options?: RequestOptions,
) {
  const url = `https://${SUSHI_BAR_SUBGRAPH_URL}`

  const result = await request(
    { url, document: SushiBarHistoryQuery, variables },
    options,
  )

  return result
}

export type SushiBarHistory = Awaited<ReturnType<typeof getSushiBarHistory>>
