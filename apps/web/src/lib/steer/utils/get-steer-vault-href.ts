import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import {
  type EvmChainId,
  SushiSwapProtocol,
  type SushiSwapV3Protocol,
  type SushiSwapV4Protocol,
  getEvmChainById,
} from 'sushi/evm'
import { isAddress, isHash } from 'viem'

export type SteerVaultProtocol = SushiSwapV3Protocol | SushiSwapV4Protocol

/**
 * The data API doesn't expose a vault's protocol, but V3 vaults sit on a pool
 * address while V4 vaults sit on a 32-byte pool id.
 */
export function getSteerVaultProtocol(
  vault: Pick<VaultV1, 'poolAddress'>,
): SteerVaultProtocol {
  if (isAddress(vault.poolAddress, { strict: false }))
    return SushiSwapProtocol.SUSHISWAP_V3
  if (isHash(vault.poolAddress)) return SushiSwapProtocol.SUSHISWAP_V4

  throw new Error(`Unknown vault pool: ${vault.poolAddress}`)
}

const POOL_PATH_SEGMENTS: Record<SteerVaultProtocol, string> = {
  [SushiSwapProtocol.SUSHISWAP_V3]: 'v3',
  [SushiSwapProtocol.SUSHISWAP_V4]: 'v4',
}

export function getSteerPoolHref(
  vault: Pick<VaultV1, 'poolAddress'> & { chainId: EvmChainId },
): string {
  const segment = POOL_PATH_SEGMENTS[getSteerVaultProtocol(vault)]

  return `/${getEvmChainById(vault.chainId).key}/pool/${segment}/${vault.poolAddress}/smart`
}

export function getSteerVaultHref(
  vault: Pick<VaultV1, 'poolAddress' | 'address'> & { chainId: EvmChainId },
): string {
  return `${getSteerPoolHref(vault)}/${vault.address}`
}
