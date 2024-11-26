import { Container } from '@sushiswap/ui'
import { CrossChainSwapWidget } from 'src/ui/swap/cross-chain/cross-chain-swap-widget'

export default async function CrossChainSwapPage() {
  return (
    <Container maxWidth="lg" className="px-4">
      <CrossChainSwapWidget />
    </Container>
  )
}
