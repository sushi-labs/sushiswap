import { Signature } from '@ethersproject/bytes'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Type } from '@sushiswap/currency'
import { ButtonProps } from '@sushiswap/ui'
import { ReactNode } from 'react'
import { Address } from 'wagmi'

import { ApprovalState } from '../../hooks'
import { PromiseNotification } from '@sushiswap/dexie'

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
  chainId: BentoBoxV1ChainId | undefined
  onSuccess(data: PromiseNotification): void
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
