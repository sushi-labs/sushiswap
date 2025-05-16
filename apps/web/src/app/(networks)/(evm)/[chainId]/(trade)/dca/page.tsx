'use client'

import { Container } from '@sushiswap/ui'
import { DcaWidget } from 'src/ui/swap/twap/dca-widget'

export default function SwapDCAPage() {
  return (
    <Container maxWidth="lg" className="px-4 relative">
      <DcaWidget />
    </Container>
  )
}
