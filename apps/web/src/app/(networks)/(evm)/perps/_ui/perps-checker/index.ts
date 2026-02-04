import type { ButtonProps } from '@headlessui/react'
import type { ComponentType } from 'react'
import { BuilderFee } from './builder-fee'
import { Deposit } from './deposit'
import { EnableTrading } from './enable-trading'
import { Legal } from './legal'

export type PerpsCheckerProps = {
  Legal: ComponentType<ButtonProps>
  EnableTrading: ComponentType<ButtonProps>
  Deposit: ComponentType<ButtonProps>
  BuilderFee: ComponentType<ButtonProps>
}

export const PerpsChecker = {
  Legal,
  EnableTrading,
  Deposit,
  BuilderFee,
}
