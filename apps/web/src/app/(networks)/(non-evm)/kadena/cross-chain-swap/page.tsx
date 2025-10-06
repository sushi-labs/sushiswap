'use client'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Container, SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { SimpleSwapBanner } from '~kadena/_common/ui/Swap/Banner/SwapBanner'
import { AmountIn } from '~kadena/_common/ui/kinesis/amount-in'
import { AmountOut } from '~kadena/_common/ui/kinesis/amount-out'
import { ReviewSwapDialog } from '~kadena/_common/ui/kinesis/review-swap-dialog'
import { SwitchSwapDirection } from '~kadena/_common/ui/kinesis/switch-swap-direction'
import { SwapModeButtons } from '../swap/swap-mode-buttons'

export default function CrossChainSwapPage() {
  return (
    <Container maxWidth="lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
          <div className="flex justify-between items-center">
            <SwapModeButtons />
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
          {/* <SwapStats /> */}
        </div>
        <SimpleSwapBanner />
      </div>
    </Container>
  )
}
