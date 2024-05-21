import { ButtonProps } from '@sushiswap/ui/components/button'
import { ComponentType, FC } from 'react'

import { Amounts, AmountsProps } from './amounts'
import { Connect } from './connect'
import { Guard, GuardProps } from './guard'

export type CheckerProps = {
  Amounts: ComponentType<AmountsProps>
  Guard: FC<GuardProps>
  Connect: ComponentType<ButtonProps>
}

export const Checker: CheckerProps = {
  Amounts,
  Guard,
  Connect,
}
