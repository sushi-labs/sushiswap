'use client'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Container, SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { Title } from '~tron/_common/ui/General/Title'
import { AmountIn } from '~tron/_common/ui/Swap/AmountIn'
import { AmountOut } from '~tron/_common/ui/Swap/AmountOut'
import { ReviewSwapDialog } from '~tron/_common/ui/Swap/ReviewSwapDialog'
import { SwapStats } from '~tron/_common/ui/Swap/SwapStats'
import { SwitchSwapDirection } from '~tron/_common/ui/Swap/SwitchSwapDirection'
import { SwitchSwapType } from '~tron/_common/ui/Swap/SwitchSwapType'

export default function SwapSimplePage() {
  return (
    <Container className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4 max-w-[520px]">
      <Title className="!font-bold">Trade</Title>
      <section className="flex items-center justify-between">
        <SwitchSwapType />
        <SettingsOverlay
          options={{
            slippageTolerance: { storageKey: SlippageToleranceStorageKey.Swap },
          }} //use this key to get slippage from localStorage
          modules={[SettingsModule.SlippageTolerance]}
        />
      </section>
      <section className="flex flex-col gap-2 relative">
        <AmountIn />
        <SwitchSwapDirection />
        <AmountOut />
      </section>
      <ReviewSwapDialog />
      <SwapStats />
    </Container>
  )
}
