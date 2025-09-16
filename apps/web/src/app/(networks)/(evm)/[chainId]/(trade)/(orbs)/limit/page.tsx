'use client'

import { Container } from '@sushiswap/ui'
import { LimitWidget } from './_ui/limit-widget'

export default function SwapLimitPage() {
  return (
    <Container maxWidth="lg" className="relative">
      <LimitWidget />
    </Container>
  )
}
