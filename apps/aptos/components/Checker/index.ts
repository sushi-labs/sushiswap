import { ButtonProps } from '@sushiswap/ui/components/button'
import { ComponentType, FC } from 'react'

import { Amounts, AmountsProps } from './Amounts'
import { Connect } from './Connect'
import { Guard, GuardProps } from './Guard'

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
