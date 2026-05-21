import { TokenResponse } from '@defuse-protocol/one-click-sdk-typescript'
import { StellarChainId } from 'sushi/stellar'
import {
  NEAR_INTENTS_SUPPORTED_CHAIN_IDS,
  NEAR_INTENTS_SUPPORTED_EVM_CHAIN_IDS,
  type NearIntentsSupportedChainId,
  type NearIntentsSupportedEvmChainId,
} from './types'

const BLOCKCHAIN_BY_CHAIN_ID = {
  1: TokenResponse.blockchain.ETH,
  10: TokenResponse.blockchain.OP,
  56: TokenResponse.blockchain.BSC,
  100: TokenResponse.blockchain.GNOSIS,
  137: TokenResponse.blockchain.POL,
  143: TokenResponse.blockchain.MONAD,
  8453: TokenResponse.blockchain.BASE,
  80094: TokenResponse.blockchain.BERA,
  9745: TokenResponse.blockchain.PLASMA,
  42161: TokenResponse.blockchain.ARB,
  43114: TokenResponse.blockchain.AVAX,
  534352: TokenResponse.blockchain.SCROLL,
  [StellarChainId.STELLAR]: 'stellar',
} as const satisfies Record<NearIntentsSupportedChainId, string>

const CHAIN_ID_BY_BLOCKCHAIN = new Map<string, NearIntentsSupportedChainId>(
  Object.entries(BLOCKCHAIN_BY_CHAIN_ID).map(([chainId, blockchain]) => [
    blockchain,
    Number(chainId) as NearIntentsSupportedChainId,
  ]),
)

export const SUPPORTED_NEAR_INTENTS_CHAIN_IDS = [
  ...NEAR_INTENTS_SUPPORTED_CHAIN_IDS,
]

export function isNearIntentsChainId(
  chainId: number,
): chainId is NearIntentsSupportedChainId {
  return NEAR_INTENTS_SUPPORTED_CHAIN_IDS.includes(
    chainId as NearIntentsSupportedChainId,
  )
}

export function isNearIntentsEvmChainId(
  chainId: number,
): chainId is NearIntentsSupportedEvmChainId {
  return NEAR_INTENTS_SUPPORTED_EVM_CHAIN_IDS.includes(
    chainId as NearIntentsSupportedEvmChainId,
  )
}

export function getNearIntentsChainId(
  blockchain: string,
): NearIntentsSupportedChainId | undefined {
  return CHAIN_ID_BY_BLOCKCHAIN.get(blockchain)
}
