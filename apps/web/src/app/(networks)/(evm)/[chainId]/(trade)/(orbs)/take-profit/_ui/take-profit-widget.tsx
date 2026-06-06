'use client'
import { Module } from '@orbs-network/spot-react'
import { TwapForm } from '../../_ui/twap-form'
import {
  TwapLimitPriceConfigSection,
  TwapPriceConfigPanel,
  TwapTriggerPriceConfigSection,
} from '../../_ui/twap-options-input'
import { TakeProfitExpiryInput } from './take-profit-options-input'

export const TakeProfitWidget = () => {
  return (
    <TwapForm module={Module.TAKE_PROFIT}>
      <TwapPriceConfigPanel>
        <TwapTriggerPriceConfigSection />
        <TwapLimitPriceConfigSection />
      </TwapPriceConfigPanel>
      <TakeProfitExpiryInput />
    </TwapForm>
  )
}
