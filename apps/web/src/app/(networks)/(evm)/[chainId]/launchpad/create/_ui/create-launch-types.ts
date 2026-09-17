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
  initialBuyAmount: string
  liquidityMode: SushiV2LiquidityMode
  // TODO(distribution)
  feeDisposition: Exclude<SushiV2FeeDisposition, 'DISTRIBUTE_TO_HOLDERS'>
}

export type CreateStep = 'details' | 'buy' | 'review'
export type WethPaymentMode = 'native' | 'wrapped'
