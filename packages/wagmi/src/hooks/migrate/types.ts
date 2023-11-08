import { V3MigrateAddress } from './constants'

export type V3MigrateChainId = keyof typeof V3MigrateAddress
export const isV3MigrateChainId = (
  chainId: number,
): chainId is V3MigrateChainId => chainId in V3MigrateAddress
