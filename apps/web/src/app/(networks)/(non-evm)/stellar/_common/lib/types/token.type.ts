import type {
  StellarAccountAddress,
  StellarContractAddress,
} from 'sushi/stellar'

// See https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0042.md
export interface Token {
  code: string
  issuer: StellarAccountAddress | ''
  contract: StellarContractAddress
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
