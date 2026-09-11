import { Amount } from 'sushi'
import { EvmChainId, EvmNative } from 'sushi/evm'

// Recordings and deployed contracts are pinned to this chain/block together.
export const chainId = EvmChainId.POLYGON
export const forkBlockNumber = 71015789
export const transactionTimeout = 60_000
export const nativeAmount = new Amount(
  EvmNative.fromChainId(chainId),
  10n ** 20n,
)

export function getAnvilPort(): number {
  const port = Number(process.env.ANVIL_PORT ?? 8545)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('ANVIL_PORT must be an integer between 1 and 65535')
  }
  return port
}

export function getForkOptions(): { forkUrl: string; forkBlockNumber: number } {
  const forkUrl = process.env.ANVIL_FORK_URL
  if (!forkUrl || !['http:', 'https:'].includes(new URL(forkUrl).protocol)) {
    throw new Error('ANVIL_FORK_URL must be an HTTP(S) archive RPC URL')
  }
  if (
    Number(process.env.ANVIL_BLOCK_NUMBER ?? forkBlockNumber) !==
    forkBlockNumber
  ) {
    throw new Error(
      `ANVIL_BLOCK_NUMBER must match the recordings: ${forkBlockNumber}`,
    )
  }
  if (Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? chainId) !== chainId) {
    throw new Error(
      'The fork suite currently has recordings for Polygon (137) only',
    )
  }
  return { forkUrl, forkBlockNumber }
}
