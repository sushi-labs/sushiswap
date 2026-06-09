import type { AppFee } from '@defuse-protocol/one-click-sdk-typescript'
import {
  EVM_UI_FEE_BIPS,
  EVM_UI_FEE_DECIMAL,
  EVM_UI_FEE_PERCENT,
} from 'src/config'
import { StellarChainId } from 'sushi/stellar'
import { getNearIntentsFeeRecipient } from './placeholders'
import type { NearIntentsSupportedChainId } from './types'

export const NEAR_INTENTS_UI_FEE_BIPS = EVM_UI_FEE_BIPS
export const NEAR_INTENTS_UI_FEE_PERCENT = EVM_UI_FEE_PERCENT
export const NEAR_INTENTS_UI_FEE_DECIMAL = EVM_UI_FEE_DECIMAL

export function buildNearIntentsAppFees({
  fromChainId,
  toChainId,
}: {
  fromChainId: NearIntentsSupportedChainId
  toChainId: NearIntentsSupportedChainId
}): AppFee[] {
  // TODO!: Fix for stellar
  if (fromChainId === StellarChainId.STELLAR) {
    return []
  }

  return [
    {
      recipient: getNearIntentsFeeRecipient({ fromChainId, toChainId }),
      fee: NEAR_INTENTS_UI_FEE_BIPS,
    },
  ] satisfies AppFee[]
}
