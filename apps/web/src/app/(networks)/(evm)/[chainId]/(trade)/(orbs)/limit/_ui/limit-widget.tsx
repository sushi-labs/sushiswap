'use client'

import {
  TwapLimitPriceConfigSection,
  TwapPriceConfigPanel,
} from '../../_ui/twap-options-input'
import { Module } from '@orbs-network/spot-react'
import { TwapForm } from '../../_ui/twap-form'
import { LimitExpiryInput } from './limit-options-input'

const module = Module.LIMIT
export const LimitWidget = () => {
  return (
    <TwapForm module={module}>
      <TwapPriceConfigPanel>
        <TwapLimitPriceConfigSection isLimitModule={true} />
      </TwapPriceConfigPanel>
      <LimitExpiryInput />
    </TwapForm>
  )
}
