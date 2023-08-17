import { Container } from '@sushiswap/ui'
import { CrossChainSwapWidget } from 'ui/swap/cross-chain/cross-chain-swap-widget'

import { Providers } from './providers'

export const metadata = {
  title: 'Sushi - Cross-chain Swap',
}

export default function SwapCrossChainPage({ searchParams }: { searchParams: URLSearchParams }) {
  return (
    <Providers searchParams={searchParams}>
      <Container maxWidth="lg" className="px-4">
        <CrossChainSwapWidget />
      </Container>
    </Providers>
  )
}
