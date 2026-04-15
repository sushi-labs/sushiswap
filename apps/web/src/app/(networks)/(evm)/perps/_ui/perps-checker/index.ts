import type { ButtonProps } from '@headlessui/react'
import type { ComponentType } from 'react'
import { BuilderFee } from './builder-fee'
import { Deposit } from './deposit'
import { EnableTrading } from './enable-trading'
import { HyperReferral } from './hyper-referral'
import { Legal } from './legal'
import { OrderAmount } from './order-amount'
import { SimpleDeposit } from './simple-deposit'
import { StableAmount } from './stable-amount'
import { TakeStopTrigger } from './take-stop-trigger'
import { TwapRunningTime } from './twap-running-time'
import { TwapSuborder } from './twap-suborder'

export type PerpsCheckerProps = {
  Legal: ComponentType<ButtonProps>
  EnableTrading: ComponentType<ButtonProps>
  Deposit: ComponentType<ButtonProps>
  BuilderFee: ComponentType<ButtonProps>
  OrderAmount: ComponentType<ButtonProps>
  TwapRunningTime: ComponentType<ButtonProps>
  TwapSuborder: ComponentType<ButtonProps>
  TakeStopTrigger: ComponentType<ButtonProps>
  HyperReferral: ComponentType<ButtonProps>
  StableAmount: ComponentType<ButtonProps>
  SimpleDeposit: ComponentType<ButtonProps>
}

export const PerpsChecker = {
  Legal,
  EnableTrading,
  Deposit,
  BuilderFee,
  OrderAmount,
  TwapRunningTime,
  TwapSuborder,
  TakeStopTrigger,
  HyperReferral,
  StableAmount,
  SimpleDeposit,
}
