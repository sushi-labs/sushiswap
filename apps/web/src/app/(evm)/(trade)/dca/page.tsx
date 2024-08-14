import { Container } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { Providers } from './providers'

const TWAPPanel = dynamic(
  () => import('src/ui/swap/twap/twap').then((it) => it.TWAPPanel),
  { ssr: false },
)

export const metadata = {
  title: 'Dollar-Cost Averaging (DCA)',
  description: 'SushiSwap Dollar-Cost Averaging (DCA)',
}

export default function SwapDCAPage() {
  return (
    <Providers>
      <Container maxWidth="lg" className="px-4">
        <TWAPPanel />
      </Container>
    </Providers>
  )
}
