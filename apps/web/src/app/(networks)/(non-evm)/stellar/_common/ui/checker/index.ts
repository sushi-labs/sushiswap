import type { ButtonProps } from '@sushiswap/ui'
import type { ComponentType, FC } from 'react'

import { Amounts, type AmountsProps } from './amounts'
import { Connect } from './connect'
import { Guard, type GuardProps } from './guard'

type CheckerProps = {
  Amounts: ComponentType<AmountsProps>
  Guard: FC<GuardProps>
  Connect: ComponentType<ButtonProps>
}

export const Checker: CheckerProps = {
  Amounts,
  Guard,
  Connect,
}
