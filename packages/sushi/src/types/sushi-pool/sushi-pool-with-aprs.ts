import type { SushiPoolBase } from 'sushi/types'

export type SushiPoolWithAprs<T extends SushiPoolBase = SushiPoolBase> = T &
  SushiPoolWithIncentiveApr<T> &
  SushiPoolWithFeeAprs<T> &
  SushiPoolWithFeeAprs<T>

export type SushiPoolWithIncentiveApr<T extends SushiPoolBase = SushiPoolBase> =
  T & {
    incentiveApr: number
  }

export type SushiPoolWithFeeAprs<T extends SushiPoolBase = SushiPoolBase> =
  T & {
    feeApr1h: number
    feeApr1d: number
    feeApr1w: number
    feeApr1m: number
  }

export type SushiPoolWithTotalAprs<T extends SushiPoolBase = SushiPoolBase> =
  T & {
    totalApr1h: number
    totalApr1d: number
    totalApr1w: number
    totalApr1m: number
  }
