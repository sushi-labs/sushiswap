'use client'
import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  Button,
  Container,
  FormattedNumber,
  SettingsModule,
  SettingsOverlay,
  SkeletonText,
  typographyVariants,
} from '@sushiswap/ui'
import { useState } from 'react'
import { formatUSD } from 'sushi/format'
import { useSimulateSwap } from '~kadena/_common/lib/hooks/use-simulate-swap'
import { AmountIn } from '~kadena/_common/ui/Swap/AmountIn'
import { AmountOut } from '~kadena/_common/ui/Swap/AmountOut'
import { SimpleSwapBanner } from '~kadena/_common/ui/Swap/Banner/SwapBanner'
import { ReviewSwapDialog } from '~kadena/_common/ui/Swap/ReviewSwapDialog'
import { SwapStats } from '~kadena/_common/ui/Swap/SwapStats'
import { SwitchSwapDirection } from '~kadena/_common/ui/Swap/SwitchSwapDirection'
import { SwitchSwapType } from '~kadena/_common/ui/Swap/SwitchSwapType'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useSwapState } from './swap-provider'

export default function SwapSimplePage() {
  const [invert, setInvert] = useState(false)
  const { token0, token1, amountIn, amountOut, isSwapIn } = useSwapState()
  const { activeAccount } = useKadena()
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100

  const { data, isLoading: isSimulating } = useSimulateSwap({
    token0Address: token0?.tokenAddress,
    token1Address: token1?.tokenAddress,
    amountIn: Number(amountIn),
    amountOut: Number(amountOut),
    isSwapIn,
    signerAddress: activeAccount?.accountName,
    slippage,
  })

  console.log('useSimulateSwap data', data)

  const token0FiatPrice = '2.34'
  const token1FiatPrice = '.72'
  const price = '1.8'
  return (
    <Container maxWidth="lg" className="px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-2 mt-2 mb-4 sm:mt-10">
          <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
          {!token0 || !token1 ? (
            <SkeletonText fontSize="sm" className="w-2/4" />
          ) : (
            <Button
              variant="link"
              size="sm"
              onClick={() => setInvert((invert) => !invert)}
            >
              <ArrowTrendingUpIcon width={16} height={16} />
              <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
                1 {invert ? token0.tokenSymbol : token1.tokenSymbol}{' '}
                <span className="font-normal">
                  ({formatUSD(invert ? token0FiatPrice : token1FiatPrice)})
                </span>{' '}
                =
                <FormattedNumber number={price} />{' '}
                {invert ? token1.tokenSymbol : token0.tokenSymbol}{' '}
                <span className="font-normal">
                  ({formatUSD(invert ? token1FiatPrice : token0FiatPrice)})
                </span>
              </span>
            </Button>
          )}{' '}
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
        <AmountIn isLoading={isSimulating && !isSwapIn} />
        <SwitchSwapDirection />
        <div className="flex flex-col">
          <AmountOut isLoading={isSimulating && isSwapIn} />
          <ReviewSwapDialog simulatedSwap={data} />
        </div>
        <SwapStats />
        <SimpleSwapBanner />
      </div>
    </Container>
  )
}
