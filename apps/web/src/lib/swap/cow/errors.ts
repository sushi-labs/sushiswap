import { OrderBookApiError } from '@cowprotocol/cow-sdk'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import * as z from 'zod'

// The wallet returned no signature, e.g. a Safe that needs more confirmations.
export class CowUnsupportedSignatureError extends Error {}

export function isCowNotFoundError(error: unknown): boolean {
  return error instanceof OrderBookApiError && error.response.status === 404
}

export function getCowErrorMessage(error: unknown): string {
  if (isUserRejectedError(error))
    return 'The request was rejected in your wallet.'
  if (error instanceof OrderBookApiError) {
    const body = z.object({ errorType: z.string() }).safeParse(error.body)
    switch (body.data?.errorType) {
      case 'UnsupportedToken':
      case 'SellTokenNotSupported':
      case 'BuyTokenNotSupported':
        return 'CoW does not support this token. Choose another token.'
      case 'NoLiquidity':
        return 'CoW cannot find liquidity for this pair and amount.'
      case 'OldOrderActivelyBidOn':
        return 'This order is being settled. Refresh its status before editing again.'
      case 'InsufficientBalance':
      case 'InsufficientAllowance':
        return 'Your balance or approval changed. Review the order and try again.'
      case 'DuplicatedOrder':
        return 'This order has already been submitted. Refresh your orders.'
      default:
        return 'CoW could not complete this request. Check the order status and try again.'
    }
  }
  return error instanceof Error ? error.message : 'Unable to complete the order'
}

export function logCowError(error: unknown, action: string): void {
  if (isUserRejectedError(error)) return
  logger.error(error, { location: 'cow-limit', action })
}
