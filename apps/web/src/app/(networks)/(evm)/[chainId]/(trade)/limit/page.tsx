'use client'

import { Container } from '@sushiswap/ui'
import { CowLimitWidget } from './_ui/cow-limit-widget'

export default function LimitPage(): React.JSX.Element {
  return (
    <Container maxWidth="6xl" className="relative">
      <CowLimitWidget />
    </Container>
  )
}
