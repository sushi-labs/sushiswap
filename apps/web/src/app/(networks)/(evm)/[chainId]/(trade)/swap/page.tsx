import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { isSupportedChainId } from 'src/config'
import { isEvmChainId } from 'sushi/evm'
import { EvmSimpleSwapRuntime } from './_ui/evm-simple-swap-runtime'
import { SimpleSwapWidgetFrame } from './_ui/simple-swap-widget-frame'
import { SimpleSwapWidgetSkeleton } from './_ui/simple-swap-widget-skeleton'
import { Providers } from './providers'

export default async function SwapSimplePage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isSupportedChainId(chainId) || !isEvmChainId(chainId)) return notFound()

  return (
    <Container maxWidth="lg">
      <SimpleSwapWidgetFrame>
        <Suspense fallback={<SimpleSwapWidgetSkeleton />}>
          <Providers>
            <EvmSimpleSwapRuntime chainId={chainId} />
          </Providers>
        </Suspense>
      </SimpleSwapWidgetFrame>
    </Container>
  )
}
