import type { Percent } from 'sushi'
import { zeroAddress } from 'viem'
import { NEAR_INTENTS_API_URL } from '../config'
import { nearIntentsQuoteSchema } from './schema'

export interface GetNearIntentsQuoteParams {
  amount: string
  inputCurrencyNearId: string
  outputCurrencyNearId: string
  slippageTolerance: Percent
}

export const getNearIntentsQuote = async ({
  inputCurrencyNearId,
  outputCurrencyNearId,
  amount,
  slippageTolerance,
}: GetNearIntentsQuoteParams) => {
  const response = await fetch(`${NEAR_INTENTS_API_URL}/v0/quote`, {
    method: 'POST',
    headers: {
      //   Authorization: 'Bearer <token>',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dry: 'true',
      swapType: 'EXACT_INPUT',
      slippageTolerance: slippageTolerance.toString(), // TODO: PRECISION
      originAsset: inputCurrencyNearId,
      depositType: 'ORIGIN_CHAIN',
      destinationAsset: outputCurrencyNearId,
      amount: amount,
      refundTo: zeroAddress,
      refundType: 'ORIGIN_CHAIN',
      recipient: zeroAddress,
      recipientType: 'DESTINATION_CHAIN',
      deadline: '2019-08-24T14:15:22Z', // TODO: 10mins?
      referral: 'sushi',
      //   appFees: [{ recipient: 'recipient.near', fee: 100 }], // TODO
    }),
  })

  return nearIntentsQuoteSchema.parse(await response.json())
}
