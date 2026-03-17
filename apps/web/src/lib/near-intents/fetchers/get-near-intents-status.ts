import { NEAR_INTENTS_API_URL } from '../config'
import { nearIntentsStatusSchema } from './schema'

export interface GetNearIntentsStatusParams {
  depositAddress: string
  depositMemo?: string
}

export const getNearIntentsStatus = async ({
  depositAddress,
  depositMemo,
}: GetNearIntentsStatusParams) => {
  const url = new URL(`${NEAR_INTENTS_API_URL}/v0/status`)
  url.searchParams.set('depositAddress', depositAddress)
  if (depositMemo) {
    url.searchParams.set('depositMemo', depositMemo)
  }

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Deposit address not found')
    }
    throw new Error(`Failed to fetch status: ${response.statusText}`)
  }

  const json = await response.json()
  return nearIntentsStatusSchema.parse(json)
}
