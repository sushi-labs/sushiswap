import { Container } from '@sushiswap/ui'
import { use } from 'react'
import { SimpleSwapWidget } from 'src/ui/swap/simple/simple-swap-widget'
import { ChainId } from 'sushi/chain'

export default function SwapSimplePage(props: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = +use(props.params).chainId as ChainId
  return (
    <Container
      maxWidth="lg"
      className={
        chainId === ChainId.KATANA
          ? '!max-w-[33rem] p-6 pt-0 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(15,23,42,0.8)] rounded-3xl backdrop-blur-2xl'
          : 'px-4'
      }
    >
      <SimpleSwapWidget />
    </Container>
  )
}
