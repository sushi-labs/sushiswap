import { getPools } from '@sushiswap/client'
import type { PoolHasSteerVaults } from '@sushiswap/steer-sdk'
import { NextResponse } from 'next/server'
import { getUser, getV2GraphPools } from 'src/lib/graph'
import { ChainId } from 'sushi/chain'
import { isSushiSwapV2ChainId } from 'sushi/config'
import type {
  PoolBase,
  PoolIfIncentivized,
  SushiPositionStaked,
  SushiPositionWithPool,
} from 'sushi/types'
import { Address } from 'viem'
import { z } from 'zod'

export const revalidate = 15

const schema = z.object({
  id: z
    .string()
    .refine((id) => id.startsWith('0x'))
    .transform((id) => id.toLowerCase() as Address),
  chainIds: z.nullable(z.string()).transform((chainIds) =>
    chainIds
      ?.split(',')
      .map((chainId) => Number(chainId) as ChainId)
      .filter(isSushiSwapV2ChainId),
  ),
})

export type UserWithPool = SushiPositionWithPool<
  PoolHasSteerVaults<PoolIfIncentivized<PoolBase, true>, true>,
  SushiPositionStaked
>

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const chainIds = searchParams.get('chainIds')
  if (!id) return new Response(null, { status: 422 })
  const result = schema.safeParse({ id, chainIds })
  if (!result.success) {
    return new Response(result.error.message, { status: 400 })
  }
  const args = result.data
  const data = await getUser(args)
  const poolIds = data.map((position) => position.pool.id)

  const [graphPoolsPromise, dbPoolsPromise] = await Promise.allSettled([
    getV2GraphPools(poolIds),
    getPools({
      ids: poolIds,
    }),
  ])

  const graphPools =
    graphPoolsPromise.status === 'fulfilled' ? graphPoolsPromise.value : []
  const dbPools =
    dbPoolsPromise.status === 'fulfilled' ? dbPoolsPromise.value : []

  const userPositions = data
    .map((position) => {
      const dbPool = dbPools?.find((pool) => pool.id === position.pool.id)
      const graphPool = graphPools?.find(
        (graphPool) => graphPool.id === position.pool.id,
      )

      const pool: PoolIfIncentivized<PoolBase> | undefined =
        dbPool || graphPool
          ? {
              ...graphPool!,
              isIncentivized: true,
              wasIncentivized: true,
            }
          : undefined

      if (!pool) return undefined

      return {
        ...position,
        pool,
      }
    })
    .filter((pool): pool is NonNullable<typeof pool> => pool !== undefined)

  return NextResponse.json(userPositions satisfies UserWithPool[], {
    headers: {
      'Cache-Control': 'public, max-age=15, stale-while-revalidate=600',
    },
  })
}
