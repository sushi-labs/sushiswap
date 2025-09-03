import {
  SushiSwapChainIds,
  isSushiSwapChainId,
} from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import type { EvmChainId } from 'sushi/evm'
import { Header } from '../../header'
import { Providers } from './providers'

export default async function PoolLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as EvmChainId
  if (!isSushiSwapChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <Header chainId={chainId} supportedNetworks={SushiSwapChainIds} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </Providers>
  )
}
