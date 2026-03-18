import type { ComponentType, FC } from 'react'

import { Amounts, type AmountsProps } from './amounts'
import { Guard, type GuardProps } from './guard'

type CheckerProps = {
  Amounts: ComponentType<AmountsProps>
  Guard: FC<GuardProps>
}

export const Checker: CheckerProps = {
  Amounts,
  Guard,
}
