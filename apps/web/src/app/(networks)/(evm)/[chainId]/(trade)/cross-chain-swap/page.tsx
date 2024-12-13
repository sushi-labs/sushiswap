import { Container } from '@sushiswap/ui'
import { CrossChainSwapWidget } from 'src/ui/swap/cross-chain/cross-chain-swap-widget'

export default function CrossChainSwapPage() {
  return (
    <Container maxWidth="lg" className={'px-4 !mx-[unset]'}>
      <CrossChainSwapWidget />
    </Container>
  )
}
