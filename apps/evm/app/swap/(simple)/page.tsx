import { Container } from '@sushiswap/ui'
import { SimpleSwapWidget } from 'ui/swap/simple/simple-swap-widget'

import { Providers } from './providers'

export const metadata = {
  title: 'Sushi - Swap',
}

export default function SwapSimplePage({ searchParams }: { searchParams: URLSearchParams }) {
  return (
    <Providers searchParams={searchParams}>
      <Container maxWidth="lg" className="px-4">
        <SimpleSwapWidget />
      </Container>
    </Providers>
  )
}
