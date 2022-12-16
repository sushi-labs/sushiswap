import { Signature } from '@ethersproject/bytes'
import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { ButtonProps, NotificationData } from '@sushiswap/ui'
import { ReactNode } from 'react'
import { Address } from 'wagmi'

import { ApprovalState } from '../../hooks'

export type ApproveDefinition = Array<ToDef<ApprovalTypeBentobox> | ToDef<ApprovalTypeToken>>

export interface ApproveButtonReturnType {
  approvalState: ApprovalState
  iconButton: ReactNode
  button: ReactNode
}

export enum ApprovalType {
  Bentobox,
  Token,
}

interface ApprovalTypeBase {
  index: number
  enabled?: boolean
  buttonProps: Omit<ButtonProps<'button'>, 'onClick'>
  chainId: ChainId | undefined
  onSuccess(data: NotificationData): void
}

export interface ApprovalTypeBentobox extends ApprovalTypeBase {
  type: ApprovalType.Bentobox
  masterContract: Address | undefined
  enabled?: boolean
  buttonProps: Omit<ButtonProps<'button'>, 'onClick'>
  onSignature(signature: Signature): void
}

export interface ApprovalTypeToken extends ApprovalTypeBase {
  type: ApprovalType.Token
  address: Address | undefined
  amount: Amount<Type> | undefined
}

export type ToDef<C> = Omit<C, 'chainId' | 'onSuccess' | 'index'>
