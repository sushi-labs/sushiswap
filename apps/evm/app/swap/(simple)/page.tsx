import { Container } from '@sushiswap/ui'
import { SimpleSwapHeader } from 'ui/swap/simple/simple-swap-header'
import { SimpleSwapToken0Input } from 'ui/swap/simple/simple-swap-token0-input'
import { SimpleSwapToken1Input } from 'ui/swap/simple/simple-swap-token1-input'

import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap Simple',
}

export default function SwapSimplePage() {
  return (
    <Providers>
      <Container maxWidth="lg" className="px-4">
        <SimpleSwapHeader />
        <SimpleSwapToken0Input />
        <SimpleSwapToken1Input />
      </Container>
    </Providers>
  )
}
