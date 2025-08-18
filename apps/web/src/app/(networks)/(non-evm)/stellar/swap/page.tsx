'use client'
import { Container } from '@sushiswap/ui'
import { SimpleSwapWidget } from '~stellar/_common/ui/Swap/simple/simple-swap-widget'

export default function SwapSimplePage() {
  return (
    <Container maxWidth="lg" className="px-4">
      <SimpleSwapWidget />
    </Container>
  )
}
