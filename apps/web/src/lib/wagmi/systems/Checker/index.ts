import type { ButtonProps } from '@sushiswap/ui'
import type { ComponentType, FC } from 'react'

import { Amounts, type AmountsProps } from './amounts'
import { ApproveERC20, type ApproveERC20Props } from './approve-erc20'
import {
  ApproveERC20Multiple,
  type ApproveERC20MultipleProps,
} from './approve-erc20-multiple'
import {
  ApproveERC20WithPermit,
  type ApproveERC20WithPermitProps,
} from './approve-erc20-with-permit'
import { Connect } from './connect'
import { Custom, type CustomProps } from './custom'
import { Guard, type GuardProps } from './guard'
import { Network, type NetworkProps } from './network'
import { PartialRoute, type PartialRouteProps } from './partial-route'
import { type ProviderProps, CheckerProvider as Root } from './provider'
import {
  RevokeApproveERC20,
  type RevokeApproveERC20Props,
} from './revoke-approve-erc20'
import {
  SLIPPAGE_WARNING_THRESHOLD,
  Slippage,
  type SlippageProps,
} from './slippage'
import { Success, type SuccessProps } from './success'

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
}

export { SLIPPAGE_WARNING_THRESHOLD }
