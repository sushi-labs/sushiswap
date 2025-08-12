'use client'
import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  Container,
  SettingsModule,
  SettingsOverlay,
  typographyVariants,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { useSimulateSwap } from '~kadena/_common/lib/hooks/use-simulate-swap'
import { AmountIn } from '~kadena/_common/ui/Swap/AmountIn'
import { AmountOut } from '~kadena/_common/ui/Swap/AmountOut'
import { SimpleSwapBanner } from '~kadena/_common/ui/Swap/Banner/SwapBanner'
import { Rate } from '~kadena/_common/ui/Swap/Rate'
import { ReviewSwapDialog } from '~kadena/_common/ui/Swap/ReviewSwapDialog'
import { SwapStats } from '~kadena/_common/ui/Swap/SwapStats'
import { SwitchSwapDirection } from '~kadena/_common/ui/Swap/SwitchSwapDirection'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { SwapModeButtons } from './swap-mode-buttons'
import { useSwapState } from './swap-provider'

export default function SwapSimplePage() {
  const { token0, token1, amountIn } = useSwapState()
  const { activeAccount } = useKadena()
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100

  const parsedAmountIn = useMemo(() => {
    const parsed = Number.parseFloat(amountIn)
    return Number.isNaN(parsed) ? null : parsed
  }, [amountIn])

  const { isLoading } = useSimulateSwap({
    token0: token0,
    token1: token1,
    amountIn: parsedAmountIn,
    signerAddress: activeAccount?.accountName,
    slippage,
  })

  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 items-start mt-2 mb-4 sm:mt-10">
          <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
          <Rate />
        </div>

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
            <AmountOut isLoading={isLoading} />
            <ReviewSwapDialog />
          </div>
          <SwapStats />
          <SimpleSwapBanner />
        </div>
      </div>
    </Container>
  )
}
