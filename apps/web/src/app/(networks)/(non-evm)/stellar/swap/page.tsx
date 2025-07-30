'use client'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import {
  Container,
  SettingsModule,
  SettingsOverlay,
  typographyVariants,
} from '@sushiswap/ui'
import { Swap } from '~stellar/_common/ui/Swap/Swap'

export default function SwapSimplePage() {
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4">
        <div />
        <div className="flex flex-col items-start gap-2 mb-4 sm:mt-10 mt-2">
          <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
          <div className="h-5" />
        </div>
        <Swap />
      </div>
    </Container>
  )
}
