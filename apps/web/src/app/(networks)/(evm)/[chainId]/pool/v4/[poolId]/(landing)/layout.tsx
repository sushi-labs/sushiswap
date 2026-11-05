import type { ReactElement, ReactNode } from 'react'
import { PoolHeaderLayout } from '~evm/[chainId]/pool/_ui/pool-header-layout'
import { getV4PoolOrNotFound } from '../_lib/get-cached-v4-pool'

export default async function Layout(props: {
  children: ReactNode
  params: Promise<{ chainId: string; poolId: string }>
}): Promise<ReactElement> {
  const { poolId, pool } = await getV4PoolOrNotFound(props.params)

  return (
    <PoolHeaderLayout address={poolId} pool={pool} showAddLiquidityButton>
      {props.children}
    </PoolHeaderLayout>
  )
}
