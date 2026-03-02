import type { Amount, Currency, Percent } from 'sushi'
import { zeroAddress } from 'viem'
import { NEAR_INTENTS_API_URL } from '../config'
import { nearIntentsQuoteSchema } from './schema'

export interface GetNearIntentsQuoteParams {
  inputAmount: Amount<Currency & { nearAssetId: string }>
  outputCurrency: Currency & { nearAssetId: string }
  slippageTolerance: Percent
}

export const getNearIntentsQuote = async ({
  inputAmount,
  outputCurrency,
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
      originAsset: inputAmount.currency.nearAssetId,
      depositType: 'ORIGIN_CHAIN',
      destinationAsset: outputCurrency.nearAssetId,
      amount: inputAmount.amount.toString(),
      refundTo: zeroAddress,
      refundType: 'ORIGIN_CHAIN',
      recipient: zeroAddress,
      recipientType: 'DESTINATION_CHAIN',
      deadline: '2019-08-24T14:15:22Z', // TODO: 10mins?
      referral: 'sushi',
      //   appFees: [{ recipient: 'recipient.near', fee: 100 }], //
    }),
  })

  return nearIntentsQuoteSchema.parse(await response.json())
}
