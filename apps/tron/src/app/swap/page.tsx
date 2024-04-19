import { Container } from '@sushiswap/ui'
import { Widget } from './_components/widget'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap on Tron',
}

export default function SwapSimplePage() {
  return (
    <Providers>
      <Container maxWidth="lg" className="px-4">
        <Widget />
      </Container>
    </Providers>
  )
}
