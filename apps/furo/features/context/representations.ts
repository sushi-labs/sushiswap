import { FuroStatus, FuroType, TransactionType } from './enums'

export interface FuroRepresentation {
  id: string
  __typename: FuroType
  status: FuroStatus
  totalAmount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
  modifiedAtTimestamp: string
  recipient: UserRepresentation
  createdBy: UserRepresentation
  token: TokenRepresentation
  txHash: string
}

export type StreamRepresentation = FuroRepresentation

export interface VestingRepresentation extends FuroRepresentation {
  steps: string
  cliffAmount: string
  stepAmount: string
  cliffDuration: string
  stepDuration: string
}

export interface TokenRepresentation {
  id: string
  symbol: string
  name: string
  decimals: string
}

export interface UserRepresentation {
  id: string
}

export interface TransactionRepresentation {
  id: string
  type: TransactionType
  amount: string
  toBentoBox: boolean
  createdAtBlock: string
  createdAtTimestamp: string
  token: TokenRepresentation
  to: UserRepresentation
  txHash: string
}
