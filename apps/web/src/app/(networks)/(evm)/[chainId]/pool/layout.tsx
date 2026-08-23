import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { Header } from '../header'

interface PoolLayoutProps {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}

export default function PoolLayout(props: PoolLayoutProps) {
  return (
    <Suspense fallback={null}>
      <PoolLayoutContent {...props} />
    </Suspense>
  )
}

async function PoolLayoutContent(props: PoolLayoutProps) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} networks={POOL_SUPPORTED_NETWORKS} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </>
  )
}
