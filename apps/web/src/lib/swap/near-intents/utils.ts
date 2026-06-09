import { QuoteRequest } from '@defuse-protocol/one-click-sdk-typescript'
import { StellarChainId } from 'sushi/stellar'
import type { NearIntentsSupportedChainId } from './types'

export function getDepositMode(
  originChainId: NearIntentsSupportedChainId,
): QuoteRequest.depositMode {
  return originChainId === StellarChainId.STELLAR
    ? QuoteRequest.depositMode.MEMO
    : QuoteRequest.depositMode.SIMPLE
}

export function formatDeadline(minutesFromNow = 15): string {
  return new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString()
}
