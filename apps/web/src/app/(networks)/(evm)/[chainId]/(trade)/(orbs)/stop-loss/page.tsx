'use client'

import { Container } from '@sushiswap/ui'
import { StopLossWidget } from './_ui/stop-loss-widget'

export default function SwapStopLossPage() {
  return (
    <Container maxWidth="lg" className="relative">
      <StopLossWidget />
    </Container>
  )
}
