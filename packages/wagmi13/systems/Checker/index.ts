import { FC } from 'react'

import { Amounts, AmountsProps } from './Amounts'
import { Custom, CustomProps } from './Custom'
import { Network, NetworkProps } from './Network'
import { ApproveERC20, ApproveERC20Props } from './ApproveERC20'
import { CheckerButton } from './types'
import { Connect } from './Connect'
import { ButtonProps } from '@sushiswap/ui13/components/button'

export type CheckerProps = {
  Amounts: FC<AmountsProps>
  Network: FC<NetworkProps>
  Custom: FC<CustomProps>
  ApproveERC20: FC<ApproveERC20Props>
  Connect: FC<ButtonProps<'button'>>
}

export const Checker: CheckerProps = { Amounts, Connect, Network, Custom, ApproveERC20 }
