export type WalletPosition = {
  id: string
  pairId: string
  pair: {
    address: string
    id: string
    reserve0: {
      name: string
      symbol: string
      amount: string
    }
    reserve1: {
      name: string
      symbol: string
      amount: string
    }
  }
  liquidity: string
  valueUsd: string
  apr24h: string
}

export type WalletPositionsResponse = {
  success: boolean
  data: WalletPosition[]
}
