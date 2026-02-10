'use client'
import { Container, typographyVariants } from '@sushiswap/ui'
import { SimpleSwapWidget } from '~stellar/_common/ui/Swap/simple/simple-swap-widget'

export default function SwapSimplePage() {
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-2 mb-4 sm:mt-10 mt-2">
        <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
      </div>
      <SimpleSwapWidget />
    </Container>
  )
}
