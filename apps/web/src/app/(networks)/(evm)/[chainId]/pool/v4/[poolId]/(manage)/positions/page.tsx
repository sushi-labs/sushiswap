import type { ReactElement } from 'react'
import { getV4PoolOrNotFound } from '../../_lib/get-cached-v4-pool'
import { V4PoolPositions } from './v4-pool-positions'

export default async function V4PoolPositionsPage(props: {
  params: Promise<{ chainId: string; poolId: string }>
}): Promise<ReactElement> {
  const { poolId, pool } = await getV4PoolOrNotFound(props.params)
  return <V4PoolPositions chainId={pool.chainId} poolId={poolId} />
}
