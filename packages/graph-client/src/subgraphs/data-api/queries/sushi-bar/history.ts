import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../../graphql'

export const SushiBarHistory = graphql(
  `
  query SushiBarHistory {
  sushiBarHistory {
    hourSnapshots {
      id
      date
      xSushiSupply
      apr1m
      apr3m
      apr6m
      apr12m
    }
    daySnapshots {
      id
      date
      xSushiSupply
      apr1m
      apr3m
      apr6m
      apr12m
    }
    weekSnapshots {
      id
      date
      xSushiSupply
      apr1m
      apr3m
      apr6m
      apr12m
    }
  }
} 
`,
)

export type GetSushiBarHistory = VariablesOf<
  typeof SushiBarHistory
>

export async function getSushiBarHistory(
  variables: GetSushiBarHistory,
  options?: RequestOptions,
) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: SushiBarHistory, variables },
    options,
  )
  if (result) {
    return result.sushiBarHistory
  }

  throw new Error('No sushi bar history found')
}

export type SushiBarHistory = Awaited<
  ReturnType<typeof getSushiBarHistory>
>
