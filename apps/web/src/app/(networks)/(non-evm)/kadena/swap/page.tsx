'use client'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import {
  Container,
  SettingsModule,
  SettingsOverlay,
  typographyVariants,
} from '@sushiswap/ui'
import { AmountIn } from '~kadena/_common/ui/Swap/AmountIn'
import { AmountOut } from '~kadena/_common/ui/Swap/AmountOut'
import { SimpleSwapBanner } from '~kadena/_common/ui/Swap/Banner/SwapBanner'
import { Rate } from '~kadena/_common/ui/Swap/Rate'
import { ReviewSwapDialog } from '~kadena/_common/ui/Swap/ReviewSwapDialog'
import { SwapStats } from '~kadena/_common/ui/Swap/SwapStats'
import { SwitchSwapDirection } from '~kadena/_common/ui/Swap/SwitchSwapDirection'
import { SwitchSwapType } from '~kadena/_common/ui/Swap/SwitchSwapType'

export default function SwapSimplePage() {
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-2 mt-2 mb-4 sm:mt-10">
          <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
          <Rate />
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
        <SimpleSwapBanner />
      </div>
    </Container>
  )
}
