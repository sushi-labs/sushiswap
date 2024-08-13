import { Container } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { Providers } from './providers'
const LimitPanel = dynamic(
  () => import('src/ui/swap/twap/twap').then((it) => it.LimitPanel),
  { ssr: false },
)

export const metadata = {
  title: 'Limit Order',
  description: 'SushiSwap Limit Order',
}

export default function SwapLimitPage() {
  return (
    <Providers>
      <Container maxWidth="lg" className="px-4">
        <LimitPanel />
      </Container>
    </Providers>
  )
}
