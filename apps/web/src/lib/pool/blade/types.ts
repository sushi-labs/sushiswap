import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
import type { EvmCurrency } from 'sushi/evm'

export type BladePoolAsset =
  | (Omit<BladePool['tokens'][number], 'token'> & {
      stablecoin: 'USD'
    })
  | (Omit<BladePool['tokens'][number], 'token'> & {
      token: EvmCurrency
    })
