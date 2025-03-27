export type IToken = {
  address: string
  decimals: number
  logoURI?: string
  name: string
  symbol: string
}

export type TokenWithBalance = IToken & { balance: string }
