import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

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

export type GetSushiBarHistory = VariablesOf<typeof SushiBarHistory>

export async function getSushiBarHistory(
  variables: GetSushiBarHistory,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: SushiBarHistory,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.sushiBarHistory
  }

  throw new Error('No sushi bar history found')
}

export type SushiBarHistory = Awaited<ReturnType<typeof getSushiBarHistory>>
