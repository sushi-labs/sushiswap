import type { BladePool } from '@sushiswap/graph-client/data-api'
import type { Token } from 'sushi/currency'

export type BladePoolAsset =
  | (Omit<BladePool['tokens'][number], 'token'> & {
      stablecoin: 'USD'
    })
  | (Omit<BladePool['tokens'][number], 'token'> & {
      token: Token
    })

export const BLADE_PROTOCOL = 'BLADE' as const
