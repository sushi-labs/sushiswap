export interface CreateLaunchForm {
  name: string
  symbol: string
  description: string
  homepage: string
  x: string
  telegram: string
  initialBuyUsd: number
}

export type CreateStep = 'details' | 'buy' | 'review'
export type WethPaymentMode = 'native' | 'wrapped'
