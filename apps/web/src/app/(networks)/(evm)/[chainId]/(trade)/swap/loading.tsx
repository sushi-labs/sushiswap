'use client'

import { Container } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { useSwapPageChainId } from 'src/app/(networks)/_ui/use-swap-page-chain-id'
import { SimpleSwapWidgetFrame } from './_ui/simple-swap-widget-frame'
import { SimpleSwapWidgetSkeleton } from './_ui/simple-swap-widget-skeleton'

export default function SimpleSwapLoading(): ReactElement {
  const chainId = useSwapPageChainId()

  return (
    <Container maxWidth="xl">
      <SimpleSwapWidgetFrame chainId={chainId}>
        <SimpleSwapWidgetSkeleton chainId={chainId} />
      </SimpleSwapWidgetFrame>
    </Container>
  )
}
