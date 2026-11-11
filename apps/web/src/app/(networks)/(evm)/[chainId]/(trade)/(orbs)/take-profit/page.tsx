'use client'

import { Container } from '@sushiswap/ui'
import { TakeProfitWidget } from './_ui/take-profit-widget'

export default function SwapTakeProfitPage() {
  return (
    <Container maxWidth="xl" className="relative">
      <TakeProfitWidget />
    </Container>
  )
}
