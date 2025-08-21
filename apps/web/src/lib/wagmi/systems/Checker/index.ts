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
import { PartialRoute, type PartialRouteProps } from './PartialRoute'
import { type ProviderProps, CheckerProvider as Root } from './Provider'
import {
  RevokeApproveERC20,
  type RevokeApproveERC20Props,
} from './RevokeApproveERC20'
import {
  SLIPPAGE_WARNING_THRESHOLD,
  Slippage,
  type SlippageProps,
} from './Slippage'
import { Success, type SuccessProps } from './Success'
import { TransferERC20, type TransferERC20Props } from './TransferERC20'
import {
  TransferERC20Multiple,
  type TransferERC20MultipleProps,
} from './TransferERC20Multiple'

export type CheckerProps = {
  Amounts: ComponentType<AmountsProps>
  Network: ComponentType<NetworkProps>
  Guard: FC<GuardProps>
  Custom: FC<CustomProps>
  ApproveERC20: ComponentType<ApproveERC20Props>
  ApproveERC20Multiple: ComponentType<ApproveERC20MultipleProps>
  ApproveERC20WithPermit: ComponentType<ApproveERC20WithPermitProps>
  RevokeApproveERC20: ComponentType<RevokeApproveERC20Props>
  Connect: ComponentType<ButtonProps>
  Success: FC<SuccessProps>
  Root: FC<ProviderProps>
  PartialRoute: FC<PartialRouteProps>
  Slippage: FC<SlippageProps>
  TransferERC20: ComponentType<TransferERC20Props>
  TransferERC20Multiple: ComponentType<TransferERC20MultipleProps>
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
  RevokeApproveERC20,
  Success,
  Root,
  PartialRoute,
  Slippage,
  TransferERC20,
  TransferERC20Multiple,
}

export { SLIPPAGE_WARNING_THRESHOLD }
