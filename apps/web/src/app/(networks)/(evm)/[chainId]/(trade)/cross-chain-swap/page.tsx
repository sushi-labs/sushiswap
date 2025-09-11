'use client'

import { Container } from '@sushiswap/ui'
import { CrossChainSwapWidget } from './_ui/cross-chain-swap-widget'

export default function CrossChainSwapPage() {
  return (
    <div className="flex justify-center flex-wrap gap-y-4 h-full">
      <Container maxWidth="lg" className="!mx-[unset]">
        <CrossChainSwapWidget />
      </Container>
    </div>
  )
}
