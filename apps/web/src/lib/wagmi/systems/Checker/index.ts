import type { ButtonProps } from '@sushiswap/ui'
import type { ComponentType, FC } from 'react'

import { Amounts, type AmountsProps } from './Amounts'
import { ApproveERC20, type ApproveERC20Props } from './ApproveERC20'
import {
  ApproveERC20Multiple,
  type ApproveERC20MultipleProps,
} from './ApproveERC20Multiple'
import {
  ApproveERC20WithPermit,
  type ApproveERC20WithPermitProps,
} from './ApproveERC20WithPermit'
import { Connect } from './Connect'
import { Custom, type CustomProps } from './Custom'
import { Guard, type GuardProps } from './Guard'
import { Network, type NetworkProps } from './Network'
import { type ProviderProps, CheckerProvider as Root } from './Provider'
import { Success, type SuccessProps } from './Success'

export type CheckerProps = {
  Amounts: ComponentType<AmountsProps>
  Network: ComponentType<NetworkProps>
  Guard: FC<GuardProps>
  Custom: FC<CustomProps>
  ApproveERC20: ComponentType<ApproveERC20Props>
  ApproveERC20Multiple: ComponentType<ApproveERC20MultipleProps>
  ApproveERC20WithPermit: ComponentType<ApproveERC20WithPermitProps>
  Connect: ComponentType<ButtonProps>
  Success: FC<SuccessProps>
  Root: FC<ProviderProps>
}

export const Checker: CheckerProps = {
  Amounts,
  Connect,
  Network,
  Guard,
  Custom,
  ApproveERC20,
  ApproveERC20Multiple,
  ApproveERC20WithPermit,
  Success,
  Root,
}
