import type { EvmAddress } from 'sushi/evm'
import { type Hex, decodeEventLog, isAddress, zeroAddress } from 'viem'

const v2FactoryEvents = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'token0', type: 'address' },
      { indexed: true, name: 'token1', type: 'address' },
      { indexed: false, name: 'pair', type: 'address' },
      { indexed: false, name: 'allPairsLength', type: 'uint256' },
    ],
    name: 'PairCreated',
    type: 'event',
  },
] as const

const v3FactoryEvents = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'token0', type: 'address' },
      { indexed: true, name: 'token1', type: 'address' },
      { indexed: true, name: 'fee', type: 'uint24' },
      { indexed: false, name: 'tickSpacing', type: 'int24' },
      { indexed: false, name: 'pool', type: 'address' },
    ],
    name: 'PoolCreated',
    type: 'event',
  },
] as const

const erc721TransferEvents = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

export interface ReceiptLog {
  readonly address: EvmAddress
  readonly data: Hex
  readonly topics: readonly [Hex, ...Hex[]]
}

export interface CreatedPoolIdentifier {
  readonly poolAddress: EvmAddress
  readonly protocol: 'v2' | 'v3'
  readonly token0: EvmAddress
  readonly token1: EvmAddress
}

export function deriveCreatedPool(
  logs: readonly ReceiptLog[],
): CreatedPoolIdentifier {
  for (const log of logs) {
    try {
      const event = decodeEventLog({
        abi: v2FactoryEvents,
        data: log.data,
        topics: [...log.topics],
      })
      if (event.eventName === 'PairCreated') {
        return {
          poolAddress: event.args.pair,
          protocol: 'v2',
          token0: event.args.token0,
          token1: event.args.token1,
        }
      }
    } catch {
      // The receipt contains many unrelated logs; try the next known event.
    }

    try {
      const event = decodeEventLog({
        abi: v3FactoryEvents,
        data: log.data,
        topics: [...log.topics],
      })
      if (event.eventName === 'PoolCreated') {
        return {
          poolAddress: event.args.pool,
          protocol: 'v3',
          token0: event.args.token0,
          token1: event.args.token1,
        }
      }
    } catch {
      // Continue scanning the receipt.
    }
  }
  throw new Error('No V2 PairCreated or V3 PoolCreated event found in receipt')
}

export function deriveMintedPositionId(
  logs: readonly ReceiptLog[],
  positionManager?: EvmAddress,
): bigint {
  for (const log of logs) {
    if (
      positionManager &&
      log.address.toLowerCase() !== positionManager.toLowerCase()
    ) {
      continue
    }
    try {
      const event = decodeEventLog({
        abi: erc721TransferEvents,
        data: log.data,
        topics: [...log.topics],
      })
      if (
        event.eventName === 'Transfer' &&
        event.args.from.toLowerCase() === zeroAddress
      ) {
        return event.args.tokenId
      }
    } catch {
      // Continue scanning the receipt.
    }
  }
  throw new Error('No position NFT mint event found in receipt')
}

export function directPoolUrl(
  appUrl: string,
  chainId: number,
  protocol: 'v2' | 'v3',
  poolAddress: string,
): string {
  if (!isAddress(poolAddress)) throw new Error('Invalid pool address')
  return new URL(
    `/${chainId}/pool/${protocol}/${poolAddress}`,
    appUrl,
  ).toString()
}

export function directPositionUrl(
  appUrl: string,
  chainId: number,
  poolAddress: string,
  positionId: bigint,
): string {
  if (!isAddress(poolAddress)) throw new Error('Invalid pool address')
  return new URL(
    `/${chainId}/pool/v3/${poolAddress}/${positionId}`,
    appUrl,
  ).toString()
}
