import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const AllSeasonsQuery = graphql(
  `
  query Seasons {
    seasons {
      endTime
      isActive
      name
      number
      startTime
    }
  }
`,
)

export type GetAllSeasons = VariablesOf<typeof AllSeasonsQuery>

export async function getAllSeasons(
  variables: GetAllSeasons,
  options?: RequestOptions,
) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: AllSeasonsQuery,
      variables,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.seasons
  }

  throw new Error('No data returned from Leaderboard API for current season')
}

export type AllSeasons = Awaited<ReturnType<typeof getAllSeasons>>
