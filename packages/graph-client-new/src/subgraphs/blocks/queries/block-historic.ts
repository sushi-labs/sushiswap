import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { ChainId } from 'sushi/chain'
import { getBlocks } from './blocks'

type GetBlockHistoric = {
  secsAgo?: number
  minsAgo?: number
  hoursAgo?: number
  daysAgo?: number
  weeksAgo?: number
  monthsAgo?: number
  yearsAgo?: number
} & ChainIdVariable<ChainId>

export async function getBlockHistoric({
  chainId,
  secsAgo = 0,
  minsAgo = 0,
  hoursAgo = 0,
  daysAgo = 0,
  weeksAgo = 0,
  monthsAgo = 0,
  yearsAgo = 0,
}: GetBlockHistoric) {
  const current = Math.floor(Date.now() / 1000)
  const ago =
    secsAgo +
    minsAgo * 60 +
    hoursAgo * 60 * 60 +
    daysAgo * 60 * 60 * 24 +
    weeksAgo * 60 * 60 * 24 * 7 +
    monthsAgo * 60 * 60 * 24 * 30 +
    yearsAgo * 60 * 60 * 24 * 365

  const target = current - ago

  const blocks = await getBlocks({
    chainId,
    first: 1,
    orderBy: 'timestamp',
    orderDirection: 'asc',
    where: {
      timestamp_gte: String(target),
    },
  })

  const block = blocks[0]

  if (!block) {
    throw new Error('Block not found')
  }

  return {
    chainId,
    ...block,
  }
}
