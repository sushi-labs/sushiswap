'use client'

import {
  TwapLimitPriceConfigSection,
  TwapPriceConfigPanel,
  TwapTriggerPriceConfigSection,
} from '../../_ui/twap-options-input'
import { Module } from '@orbs-network/spot-react'
import { TwapForm } from '../../_ui/twap-form'
import { StopLossExpiryInput } from './stop-loss-options-input'

const module = Module.STOP_LOSS
export const StopLossWidget = () => {
  return (
    <TwapForm module={module}>
      <TwapPriceConfigPanel isTriggerPrice={true}>
        <TwapTriggerPriceConfigSection />
        <TwapLimitPriceConfigSection />
      </TwapPriceConfigPanel>
      <StopLossExpiryInput />
    </TwapForm>
  )
}
