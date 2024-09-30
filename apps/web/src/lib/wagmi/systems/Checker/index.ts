import { ButtonProps } from '@sushiswap/ui'
import { ComponentType, FC } from 'react'

import { Amounts, AmountsProps } from './Amounts'
import { ApproveERC20, ApproveERC20Props } from './ApproveERC20'
import {
  ApproveERC20Multiple,
  ApproveERC20MultipleProps,
} from './ApproveERC20Multiple'
import {
  ApproveERC20WithPermit,
  ApproveERC20WithPermitProps,
} from './ApproveERC20WithPermit'
import { Connect } from './Connect'
import { Custom, CustomProps } from './Custom'
import { Guard, GuardProps } from './Guard'
import { Network, NetworkProps } from './Network'
import { CheckerProvider as Root, ProviderProps } from './Provider'
import { Success, SuccessProps } from './Success'

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
