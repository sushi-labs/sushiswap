import { notFound } from 'next/navigation'
import { isHex, size } from 'viem'
import { V4PoolHeader } from './_ui/v4-pool-header'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; poolId: string }>
}) {
  const { chainId, poolId } = await props.params
  if (!isHex(poolId) || size(poolId) !== 32) {
    return notFound()
  }

  return (
    <>
      <V4PoolHeader chainId={+chainId} poolId={poolId} />
      {props.children}
    </>
  )
}
