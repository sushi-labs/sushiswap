import { ChainId, type Percent } from 'sushi'
import { zeroAddress } from 'viem'
import { ZERO_ADDRESS } from '~stellar/_common/lib/soroban'
import { NEAR_INTENTS_API_URL, type NearIntentsChainId } from '../config'
import { nearIntentsQuoteSchema } from './schema'

export interface GetNearIntentsQuoteParams {
  chainId0: NearIntentsChainId
  amount: number
  inputCurrencyNearId: string
  outputCurrencyNearId: string
  slippageTolerance: Percent
}

export const getNearIntentsQuote = async ({
  chainId0,
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
      dry: true,
      swapType: 'EXACT_INPUT',
      slippageTolerance: slippageTolerance.toNumber() * 10_000,
      originAsset: inputCurrencyNearId,
      depositType: 'ORIGIN_CHAIN',
      destinationAsset: outputCurrencyNearId,
      amount: amount,
      refundTo: chainId0 === ChainId.STELLAR ? ZERO_ADDRESS : zeroAddress,
      refundType: 'ORIGIN_CHAIN',
      recipient: chainId0 === ChainId.STELLAR ? zeroAddress : ZERO_ADDRESS,
      recipientType: 'DESTINATION_CHAIN',
      deadline: new Date(Date.now() + 600000).toISOString(), // 10mins
      depositMode: chainId0 === ChainId.STELLAR ? 'MEMO' : 'SIMPLE',
      referral: 'sushi',
      //   appFees: [{ recipient: 'recipient.near', fee: 100 }], // TODO
    }),
  })

  return nearIntentsQuoteSchema.parse(await response.json())
}
