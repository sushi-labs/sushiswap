import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const CurrentSeasonQuery = graphql(
  `
  query CurrentSeason {
    currentSeason {
      endTime
      isActive
      name
      number
      startTime
    }
  }
`,
)

export type GetCurrentSeason = VariablesOf<typeof CurrentSeasonQuery>

export async function getCurrentSeason(options?: RequestOptions) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: CurrentSeasonQuery,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.currentSeason
  }

  throw new Error('No data returned from Leaderboard API for current season')
}

export type CurrentSeason = Awaited<ReturnType<typeof getCurrentSeason>>
