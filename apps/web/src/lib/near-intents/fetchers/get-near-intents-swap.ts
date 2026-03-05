import { ChainId, type Percent } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress } from 'sushi/stellar'
import { NEAR_INTENTS_API_URL, type NearIntentsChainId } from '../config'
import { nearIntentsSwapSchema } from './schema'

export interface GetNearIntentsSwapParams {
  chainId0: NearIntentsChainId
  amount: string
  inputCurrencyNearId: string
  outputCurrencyNearId: string
  slippageTolerance: Percent
  sender: EvmAddress | StellarAddress
  recipient: EvmAddress | StellarAddress
}

export const getNearIntentsSwap = async ({
  chainId0,
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
      slippageTolerance: slippageTolerance.toNumber() * 10_000,
      originAsset: inputCurrencyNearId,
      depositType: 'ORIGIN_CHAIN',
      destinationAsset: outputCurrencyNearId,
      amount: amount,
      refundTo: sender,
      refundType: 'ORIGIN_CHAIN',
      recipient: recipient,
      recipientType: 'DESTINATION_CHAIN',
      deadline: new Date(Date.now() + 600000).toISOString(), // 10mins
      referral: 'sushi',
      depositMode: chainId0 === ChainId.STELLAR ? 'MEMO' : 'SIMPLE',
      //   appFees: [{ recipient: 'recipient.near', fee: 100 }], //
    }),
  })

  return nearIntentsSwapSchema.parse(await response.json())
}
