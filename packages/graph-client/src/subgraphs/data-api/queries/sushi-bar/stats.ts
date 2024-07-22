import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../../graphql'

export const SushiBarStats = graphql(
  `
query SushiBarStats {
  sushiBarStats {
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

export type GetSushiBarStats = VariablesOf<
  typeof SushiBarStats
>

export async function getSushiBarStats(
  variables: GetSushiBarStats,
  options?: RequestOptions,
) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: SushiBarStats, variables },
    options,
  )
  if (result) {
    return result.sushiBarStats
  }

  throw new Error('No sushi bar stats found')
}

export type SushiBarStats = Awaited<
  ReturnType<typeof getSushiBarStats>
>
