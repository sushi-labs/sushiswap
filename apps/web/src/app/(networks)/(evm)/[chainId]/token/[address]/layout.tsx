import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import { Header } from '../../header'
import { Providers } from './providers'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as EvmChainId
  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <Header
        chainId={chainId}
        networks={POOL_SUPPORTED_NETWORKS.filter(isEvmChainId)}
      />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </Providers>
  )
}
