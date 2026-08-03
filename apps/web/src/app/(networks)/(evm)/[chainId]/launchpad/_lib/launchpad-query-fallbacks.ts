import type { LaunchpadTokenConnection } from '@sushiswap/graph-client/data-api'

export const EMPTY_LAUNCHPAD_TOKEN_CONNECTION: LaunchpadTokenConnection = {
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
  totalCount: 0,
}
