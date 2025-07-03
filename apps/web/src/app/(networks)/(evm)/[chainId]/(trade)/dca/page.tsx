'use client'

import { Container } from '@sushiswap/ui'
import { DCAWidget } from 'src/ui/swap/twap/dca-widget'

export default function SwapDCAPage() {
  return (
    <Container maxWidth="lg" className="relative">
      <DCAWidget />
    </Container>
  )
}
