import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const ChainStatsQuery = graphql(
  `
  query ChainStats($season: Int) {
    chainStats(season: $season) {
      chainId
      chainName
      fees
      swapCount
      userCount
      volume
    }
  }
`,
)

export type GetChainStats = VariablesOf<typeof ChainStatsQuery>

export async function getChainStats(
  variables: GetChainStats,
  options?: RequestOptions,
) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: ChainStatsQuery,
      variables,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.chainStats
  }

  throw new Error('No data returned from Leaderboard API for chain stats')
}

export type ChainStats = Awaited<ReturnType<typeof getChainStats>>
