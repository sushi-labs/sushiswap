import { Container } from '@sushiswap/ui'
import { Suspense } from 'react'
import { SvmChainId } from 'sushi/svm'
import { SimpleSwapWidgetFrame } from '~evm/[chainId]/(trade)/swap/_ui/simple-swap-widget-frame'
import { SimpleSwapWidgetSkeleton } from '~evm/[chainId]/(trade)/swap/_ui/simple-swap-widget-skeleton'
import { SvmSimpleSwapRuntime } from '~evm/[chainId]/(trade)/swap/_ui/svm-simple-swap-runtime'
import { Providers } from '~evm/[chainId]/(trade)/swap/providers'

export default function SwapSimplePage() {
  return (
    <Container maxWidth="lg">
      <SimpleSwapWidgetFrame>
        <Suspense fallback={<SimpleSwapWidgetSkeleton />}>
          <Providers>
            <SvmSimpleSwapRuntime chainId={SvmChainId.SOLANA} />
          </Providers>
        </Suspense>
      </SimpleSwapWidgetFrame>
    </Container>
  )
}
