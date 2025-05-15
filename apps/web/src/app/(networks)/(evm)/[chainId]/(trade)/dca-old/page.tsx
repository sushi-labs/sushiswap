'use client'

import { Container } from '@sushiswap/ui'
import dynamic from 'next/dynamic'

const TWAPPanel = dynamic(
  () => import('src/ui/swap/twap/twap').then((it) => it.TWAPPanel),
  { ssr: false },
)

export default function SwapDCAPage() {
  return (
    <Container maxWidth="lg" className="px-4 relative">
      <TWAPPanel />
    </Container>
  )
}
