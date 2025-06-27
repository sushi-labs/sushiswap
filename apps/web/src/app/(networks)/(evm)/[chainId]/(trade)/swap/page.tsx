import { Container } from '@sushiswap/ui'
import { use } from 'react'
import { SimpleSwapWidget } from 'src/ui/swap/simple/simple-swap-widget'
import type { ChainId } from 'sushi/chain'

export default function SwapSimplePage(props: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = +use(props.params).chainId as ChainId
  return (
    <Container maxWidth="lg" className="px-4">
      <SimpleSwapWidget chainId={chainId} />
    </Container>
  )
}
