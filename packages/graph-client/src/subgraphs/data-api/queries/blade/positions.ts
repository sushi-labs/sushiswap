import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/evm'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import { BladePoolFragment, enhanceBladePool } from './pools.js'

export const BladePositionsQuery = graphql(
  `
  query BladePositions($user: Bytes!, $chainId: BladeChainId!) {
    bladePositions(user: $user, chainId: $chainId) {
      user
      stakedBalance
      unstakedBalance
      pool {
        ...BladePoolFragment
      }
    }
  }
`,
  [BladePoolFragment],
)

export type GetBladePositions = VariablesOf<typeof BladePositionsQuery>

export async function getBladePositions(
  variables: GetBladePositions,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: BladePositionsQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.bladePositions.map((position) => ({
        ...position,
        stakedBalance: BigInt(position.stakedBalance),
        unstakedBalance: BigInt(position.unstakedBalance),
        pool: enhanceBladePool(position.pool, variables.chainId),
      }))
    }
  } catch (error) {
    console.error('getBladePositions error', error)
  }
  return []
}

export type BladePositions = Awaited<ReturnType<typeof getBladePositions>>
export type BladePosition = BladePositions[number]
