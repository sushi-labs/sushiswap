import type { BladePool } from '@sushiswap/graph-client/data-api'
import type { EvmCurrency } from 'sushi/evm'

export type BladePoolStablecoinAsset = Omit<
  BladePool['tokens'][number],
  'token' | 'priceUSD'
> & {
  stablecoin: 'USD'
}

export type BladePoolTokenAsset = Omit<BladePool['tokens'][number], 'token'> & {
  token: EvmCurrency
}

export type BladePoolAsset = BladePoolStablecoinAsset | BladePoolTokenAsset
