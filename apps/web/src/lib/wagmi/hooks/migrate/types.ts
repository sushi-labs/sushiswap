import { V3MigrateAddress, V4MigrateAddress } from './constants'

export type V3MigrateChainId = keyof typeof V3MigrateAddress
export const isV3MigrateChainId = (
  chainId: number,
): chainId is V3MigrateChainId => chainId in V3MigrateAddress

export type V4MigrateChainId = keyof typeof V4MigrateAddress
export const isV4MigrateChainId = (
  chainId: number,
): chainId is V4MigrateChainId => chainId in V4MigrateAddress
