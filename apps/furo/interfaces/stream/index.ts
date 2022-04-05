export interface Stream {
  id: string
  status: StreamStatus
  amount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
  modifiedAtTimestamp: string
  recipient: User
  createdBy: User
  token: Token
}

export interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
}

export interface User {
  id: string
}

export interface Transaction {
  id: string
  type: string
  amount: string
  toBentoBox: false
  withdrawnAmount: string
  createdAtBlock: string
  createdAtTimestamp: string
  token: Token
  to: User
}

export enum StreamStatus {
  ACTIVE = "ACTIVE",
  EXTENDED = "EXTENDED",
  CANCELLED = "CANCELLED"
}