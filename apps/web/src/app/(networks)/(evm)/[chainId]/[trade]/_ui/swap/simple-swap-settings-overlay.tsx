'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { useDerivedStateSimpleTrade } from './trade/derivedstate-simple-trade-provider'

export const SimpleSwapSettingsOverlay = () => {
  const {
    mutate: { setTradeView },
    state: { tradeView },
  } = useDerivedStateSimpleTrade()
  return (
    <SettingsOverlay
      modules={[
        SettingsModule.SlippageTolerance,
        SettingsModule.AdvancedTradingExperience,
      ]}
      options={{
        tradeView: {
          tradeView: tradeView,
          toggleTradeView: (view) => {
            setTradeView(view)
          },
        },
      }}
    />
  )
}
