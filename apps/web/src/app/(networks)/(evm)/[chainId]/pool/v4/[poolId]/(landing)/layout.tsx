import { isSushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { isHash } from 'viem'
import { PoolHeaderLayoutV4 } from '../_ui/pool-header-layout-v4'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; poolId: string }>
}) {
  const params = await props.params

  const { chainId: _chainId, poolId } = params
  const chainId = +_chainId

  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) {
    return notFound()
  }

  return (
    <PoolHeaderLayoutV4 chainId={chainId} poolId={poolId}>
      {props.children}
    </PoolHeaderLayoutV4>
  )
}
