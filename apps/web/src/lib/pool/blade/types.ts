import type { BladePool } from '@sushiswap/graph-client/data-api'
import type { Type } from 'sushi/currency'

export type BladePoolAsset =
  | (Omit<BladePool['tokens'][number], 'token'> & {
      stablecoin: 'USD'
    })
  | (Omit<BladePool['tokens'][number], 'token'> & {
      token: Type
    })

export const BLADE_PROTOCOL = 'BLADE' as const
