import { Container } from '@sushiswap/ui'
import { LimitWidget } from 'src/ui/swap/twap/limit-widget'

export default function SwapLimitPage() {
  return (
    <Container maxWidth="lg" className="px-4 relative">
      <LimitWidget />
    </Container>
  )
}
