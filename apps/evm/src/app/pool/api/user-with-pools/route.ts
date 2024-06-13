import 'sushi/bigint-serializer'

import { getPools } from '@sushiswap/client'
import type { PoolHasSteerVaults } from '@sushiswap/steer-sdk'
import { NextResponse } from 'next/server'
import { getUser, getV2GraphPools } from 'src/lib/graph'
import { ChainId } from 'sushi/chain'

import { isSushiSwapV2ChainId } from 'sushi/config'
import type {
  PoolBase,
  PoolIfIncentivized,
  PoolWithAprs,
  SushiPositionStaked,
  SushiPositionWithPool,
} from 'sushi/types'
import { Address } from 'viem'
import { z } from 'zod'
import { CORS } from '../cors'

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

  if (!id) return new Response('No user(id) provided', { status: 422 })
  const result = schema.safeParse({ id, chainIds })
  if (!result.success) {
    return new Response(result.error.message, { status: 400 })
  }
  const args = result.data
  const data = await getUser(args)
  const poolIds = data.map((position) => position.pool.id)

  if (poolIds.length === 0) {
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=15, stale-while-revalidate=600',
        ...CORS,
      },
    })
  }

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

      const pool: PoolWithAprs<PoolIfIncentivized<PoolBase>> | undefined =
        dbPool || graphPool
          ? {
              ...graphPool!,
              isIncentivized: dbPool?.isIncentivized ?? false,
              wasIncentivized: dbPool?.wasIncentivized ?? false,
              incentiveApr: dbPool?.incentiveApr ?? 0,
              feeApr1h: dbPool?.feeApr1h ?? 0,
              feeApr1d: dbPool?.feeApr1d ?? 0,
              feeApr1w: dbPool?.feeApr1w ?? 0,
              feeApr1m: dbPool?.feeApr1m ?? 0,
              totalApr1h: dbPool?.totalApr1h ?? 0,
              totalApr1d: dbPool?.totalApr1d ?? 0,
              totalApr1w: dbPool?.totalApr1w ?? 0,
              totalApr1m: dbPool?.totalApr1m ?? 0,
            }
          : undefined

      if (!pool) return undefined

      return {
        ...position,
        pool,
      }
    })
    .filter((pool): pool is NonNullable<typeof pool> => pool !== undefined)

  return NextResponse.json(userPositions, {
    headers: {
      'Cache-Control': 'public, max-age=15, stale-while-revalidate=600',
      ...CORS,
    },
  })
}
