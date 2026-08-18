import type {
  SushiV2FeeDisposition,
  SushiV2LiquidityMode,
} from '../../_providers/sushi-v2/contract'

export interface CreateLaunchForm {
  name: string
  symbol: string
  description: string
  homepage: string
  x: string
  telegram: string
  initialBuyUsd: number
  liquidityMode: SushiV2LiquidityMode
  feeDisposition: SushiV2FeeDisposition
}

export type CreateStep = 'details' | 'buy' | 'review'
export type WethPaymentMode = 'native' | 'wrapped'
