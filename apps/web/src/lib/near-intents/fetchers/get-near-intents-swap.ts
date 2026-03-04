import type { Percent } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress } from 'sushi/stellar'
import { NEAR_INTENTS_API_URL } from '../config'
import { nearIntentsSwapSchema } from './schema'

export interface GetNearIntentsSwapParams {
  amount: string
  inputCurrencyNearId: string
  outputCurrencyNearId: string
  slippageTolerance: Percent
  sender: EvmAddress | StellarAddress
  recipient: EvmAddress | StellarAddress
}

export const getNearIntentsSwap = async ({
  amount,
  inputCurrencyNearId,
  outputCurrencyNearId,
  slippageTolerance,
  sender,
  recipient,
}: GetNearIntentsSwapParams) => {
  const response = await fetch(`${NEAR_INTENTS_API_URL}/v0/quote`, {
    method: 'POST',
    headers: {
      //   Authorization: 'Bearer <token>',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dry: false,
      swapType: 'EXACT_INPUT',
      slippageTolerance: slippageTolerance.toString(), // TODO: PRECISION
      originAsset: inputCurrencyNearId,
      depositType: 'ORIGIN_CHAIN',
      destinationAsset: outputCurrencyNearId,
      amount: amount,
      refundTo: sender,
      refundType: 'ORIGIN_CHAIN',
      recipient: recipient,
      recipientType: 'DESTINATION_CHAIN',
      deadline: '2019-08-24T14:15:22Z', // TODO: 10mins?
      referral: 'sushi',
      //   appFees: [{ recipient: 'recipient.near', fee: 100 }], //
    }),
  })

  return nearIntentsSwapSchema.parse(await response.json())
}
