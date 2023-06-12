import { FC } from 'react'

import { Amounts, AmountsProps } from './Amounts'
import { Connected } from './Connected'
import { Custom, CustomProps } from './Custom'
import { Network, NetworkProps } from './Network'
import { CheckerButton } from './types'

export type CheckerProps = {
  Amounts: FC<AmountsProps>
  Connected: FC<CheckerButton>
  Network: FC<NetworkProps>
  Custom: FC<CustomProps>
}

/**
 * @deprecated use future/systems/Checker
 */
export const Checker: CheckerProps = { Amounts, Connected, Network, Custom }
