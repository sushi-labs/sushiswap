import { ComponentType, FC } from 'react'

import { Amounts, AmountsProps } from './Amounts'
import { Custom, CustomProps } from './Custom'
import { Network, NetworkProps } from './Network'
import { Connect } from './Connect'
import { ButtonProps } from '@sushiswap/ui/components/button'
import { ApproveBentobox, ApproveBentoboxProps } from './ApproveBentobox'
import { Success, SuccessProps } from './Success'
import { CheckerProvider as Root, ProviderProps } from './Provider'
import { ApproveERC20, ApproveERC20Props } from './ApproveERC20'
import { ApproveERC20Multiple, ApproveERC20MultipleProps } from './ApproveERC20Multiple'

export type CheckerProps = {
  Amounts: ComponentType<AmountsProps>
  Network: ComponentType<NetworkProps>
  Custom: FC<CustomProps>
  ApproveERC20: ComponentType<ApproveERC20Props>
  ApproveERC20Multiple: ComponentType<ApproveERC20MultipleProps>
  Connect: ComponentType<ButtonProps>
  ApproveBentobox: ComponentType<ApproveBentoboxProps>
  Success: FC<SuccessProps>
  Root: FC<ProviderProps>
}

export const Checker: CheckerProps = {
  Amounts,
  Connect,
  Network,
  Custom,
  ApproveERC20,
  ApproveERC20Multiple,
  ApproveBentobox,
  Success,
  Root,
}
