import { DCAOptionsInput } from './dca-options-input'
import { Module } from '@orbs-network/spot-react'
import { TwapForm } from '../../_ui/twap-form'

const module = Module.TWAP

export const DCAWidget = () => {
  return (
    <TwapForm module={module}>
      <DCAOptionsInput />
    </TwapForm>
  )
}
