'use client'

import { Container } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
const LimitPanel = dynamic(
  () => import('src/ui/swap/twap/twap').then((it) => it.LimitPanel),
  { ssr: false },
)

export default function SwapLimitPage() {
  return (
    <Container maxWidth="lg" className="px-4 relative">
      <LimitPanel />
    </Container>
  )
}
