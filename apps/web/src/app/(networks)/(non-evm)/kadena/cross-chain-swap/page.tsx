'use client'

import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import { Container, SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { useMemo } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { formatUnits } from 'viem'
import { useSimulateSwap } from '~kadena/_common/lib/hooks/use-simulate-swap'
import { SimpleSwapBanner } from '~kadena/_common/ui/Swap/Banner/SwapBanner'
import { SwapStats } from '~kadena/_common/ui/Swap/SwapStats'
import { AmountIn } from '~kadena/_common/ui/cross-chain-swap/amount-in'
import { AmountOut } from '~kadena/_common/ui/cross-chain-swap/amount-out'
import { ReviewSwapDialog } from '~kadena/_common/ui/cross-chain-swap/review-swap-dialog'
import { SwitchSwapDirection } from '~kadena/_common/ui/cross-chain-swap/switch-swap-direction'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { SwapModeButtons } from '../swap/swap-mode-buttons'
import { useSwapState } from '../swap/swap-provider'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

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
            <AmountOut isLoading={false} />

            <ReviewSwapDialog />
          </div>
          {/* <SwapStats /> */}
        </div>
        <SimpleSwapBanner />
      </div>
    </Container>
  )
}
