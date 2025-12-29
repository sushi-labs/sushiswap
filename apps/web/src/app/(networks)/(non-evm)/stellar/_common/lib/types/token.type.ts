// See https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0042.md
export interface Token {
  code: string
  issuer: string
  contract: string
  name: string
  org: string
  domain?: string
  icon?: string
  decimals: number
  isStable?: boolean
}

export interface TokenWithBalance extends Token {
  balance: bigint
}
