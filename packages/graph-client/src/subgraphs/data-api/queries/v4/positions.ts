import type { ResultOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import type { EvmAddress } from 'sushi/evm'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import type { SushiSwapV4ChainId } from '../../types/SushiSwapV4ChainId.js'

const V4PositionFragment = graphql(`
  fragment V4PositionFields on TerminalPosition @_unmask {
    id
    owner
    tickLower
    tickUpper
    salt
    liquidity
    amount0
    amount1
    amountUsd
    inRange
    createdAt
    token {
      positionManager
      tokenId
      holder
    }
    pendingFees {
      amount0
      amount1
    }
    pool {
      key
      token0
      token1
      fee {
        __typename
        ... on TerminalStaticFee {
          rate
        }
      }
      ... on TerminalPancakeSwapInfinityPool {
        protocolPoolId
        manager
        hooks
        parameters
        tickSpacing
      }
    }
  }
`)

export const V4PositionsQuery = graphql(
  `
  query V4Positions($chainId: TerminalChainId!, $holder: EvmAddress!, $after: String) {
    terminal {
      positions(input: { chainId: $chainId, holder: $holder, first: 100, after: $after, pendingFees: true }) {
        nodes {
          ...V4PositionFields
        }
        endCursor
        hasMore
      }
    }
  }
`,
  [V4PositionFragment],
)

type RawV4Position = ResultOf<typeof V4PositionFragment>

function parseV4Position(chainId: SushiSwapV4ChainId, raw: RawV4Position) {
  const { pool } = raw
  if (!('protocolPoolId' in pool) || !raw.token) return null

  return {
    id: raw.id,
    chainId,
    tokenId: BigInt(raw.token.tokenId),
    positionManager: raw.token.positionManager,
    holder: raw.token.holder ?? null,
    tickLower: raw.tickLower,
    tickUpper: raw.tickUpper,
    liquidity: BigInt(raw.liquidity),
    amount0: BigInt(raw.amount0),
    amount1: BigInt(raw.amount1),
    amountUSD: raw.amountUsd ?? null,
    inRange: raw.inRange,
    createdAt: raw.createdAt,
    pendingFees: raw.pendingFees
      ? {
          amount0: BigInt(raw.pendingFees.amount0),
          amount1: BigInt(raw.pendingFees.amount1),
        }
      : null,
    pool: {
      poolId: pool.protocolPoolId,
      poolManager: pool.manager,
      currency0: pool.token0,
      currency1: pool.token1,
      hooks: pool.hooks,
      parameters: pool.parameters,
      tickSpacing: pool.tickSpacing,
      fee: pool.fee,
    },
  }
}

export type V4Position = NonNullable<ReturnType<typeof parseV4Position>>

/**
 * The position manager tokens `holder` holds on a chain, every page of them.
 * Includes other deployments' tokens; callers filter by position manager.
 */
export async function getV4Positions(
  { chainId, holder }: { chainId: SushiSwapV4ChainId; holder: EvmAddress },
  options?: RequestOptions,
): Promise<V4Position[]> {
  const positions: V4Position[] = []
  let after: string | null = null

  do {
    const result: ResultOf<typeof V4PositionsQuery> = await request(
      {
        url: SUSHI_DATA_API_GRAPHQL_URL,
        document: V4PositionsQuery,
        variables: { chainId, holder, after },
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )

    const page: ResultOf<typeof V4PositionsQuery>['terminal']['positions'] =
      result.terminal.positions
    for (const node of page.nodes) {
      const position = parseV4Position(chainId, node)
      if (position) positions.push(position)
    }
    after = page.hasMore ? page.endCursor : null
  } while (after)

  return positions
}
