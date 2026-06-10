import { Module } from '@orbs-network/spot-react'
import { TwapForm } from '../../_ui/twap-form'
import { DCAOptionsInput } from './dca-options-input'

const module = Module.TWAP

export const DCAWidget = () => {
  return (
    <TwapForm module={module}>
      <DCAOptionsInput />
    </TwapForm>
  )
}
