'use client'
import {
  SlippageToleranceStorageKey,
  useDebounce,
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
import { SwitchSwapType } from '~kadena/_common/ui/Swap/SwitchSwapType'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useSwapState } from './swap-provider'

export default function SwapSimplePage() {
  const { token0, token1, amountIn } = useSwapState()
  const { activeAccount } = useKadena()
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100
  const debouncedAmountIn = useDebounce(amountIn, 250)

  const parsedAmountIn = useMemo(() => {
    const parsed = Number.parseFloat(debouncedAmountIn)
    return Number.isNaN(parsed) ? null : parsed
  }, [debouncedAmountIn])

  const { isLoading } = useSimulateSwap({
    token0Address: token0?.tokenAddress,
    token1Address: token1?.tokenAddress,
    amountIn: parsedAmountIn,
    signerAddress: activeAccount?.accountName,
    slippage,
  })

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
          <AmountOut isLoading={isLoading} />
          <ReviewSwapDialog />
        </div>
        <SwapStats />
        <SimpleSwapBanner />
      </div>
    </Container>
  )
}
