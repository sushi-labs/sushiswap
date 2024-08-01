import { PoolApiSchema, getPoolFromDB } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { ChefType } from 'sushi'
import { CORS } from '../../../cors'

export const revalidate = 15

export async function GET(
  _request: Request,
  { params }: { params: { chainId: string; address: string } },
) {
  const result = PoolApiSchema.safeParse({
    chainId: params.chainId,
    address: params.address,
  })

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  let pool

  try {
    pool = await getPoolFromDB(result.data).then((pool) => ({
      ...pool,
      incentives: pool.incentives.sort((a) =>
        a.chefType === ChefType.MasterChefV2 ? -1 : 0,
      ),
    }))
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch pool' }, { status: 500 })
  }

  return NextResponse.json(pool, {
    headers: CORS,
  })
}
