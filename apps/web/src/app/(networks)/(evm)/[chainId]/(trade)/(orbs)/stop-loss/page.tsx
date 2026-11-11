'use client'

import { Container } from '@sushiswap/ui'
import { StopLossWidget } from './_ui/stop-loss-widget'

export default function SwapStopLossPage() {
  return (
    <Container maxWidth="xl" className="relative">
      <StopLossWidget />
    </Container>
  )
}
