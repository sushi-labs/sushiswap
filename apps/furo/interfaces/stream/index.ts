export interface Stream {
  id: string
  status: string
  amount: string
  withdrawnAmount: string
  expiresAt: string
  startedAt: string
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
