'use client'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import {
  Container,
  SettingsModule,
  SettingsOverlay,
  typographyVariants,
} from '@sushiswap/ui'
import { AmountIn } from '~tron/_common/ui/Swap/amount-in'
import { AmountOut } from '~tron/_common/ui/Swap/amount-out'
import { ReviewSwapDialog } from '~tron/_common/ui/Swap/review-swap-dialog'
import { SwapStats } from '~tron/_common/ui/Swap/swap-stats'
import { SwitchSwapDirection } from '~tron/_common/ui/Swap/switch-swap-direction'
import { SwitchSwapType } from '~tron/_common/ui/Swap/switch-swap-type'

export default function SwapSimplePage() {
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4">
        <div />
        <div className="flex flex-col items-start gap-2 mb-4 sm:mt-10 mt-2">
          <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
          <div className="h-5" />
        </div>
        <div className="flex items-center justify-between">
          <SwitchSwapType />
          <SettingsOverlay
            options={{
              slippageTolerance: {
                storageKey: SlippageToleranceStorageKey.Swap,
              },
            }} //use this key to get slippage from localStorage
            modules={[SettingsModule.SlippageTolerance]}
          />
        </div>
        <AmountIn />
        <SwitchSwapDirection />
        <div className="flex flex-col">
          <AmountOut />
          <ReviewSwapDialog />
        </div>
        <SwapStats />
      </div>
    </Container>
  )
}
