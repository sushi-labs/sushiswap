'use client'

import { Container } from '@sushiswap/ui'
import { TakeProfitWidget } from './_ui/take-profit-widget'

export default function SwapStopLossPage() {
  return (
    <Container maxWidth="lg" className="relative">
      <TakeProfitWidget />
    </Container>
  )
}
