import { Price, tryParseAmount } from '@sushiswap/currency'
import { useMemo } from 'react'

import { BridgeState } from '../../components'
import { useBridgeFees } from './useBridgeFees'

export const useBridgeOutput = (state: BridgeState) => {
  const { amount, dstToken } = state
  const { bridgeFee, isLoading } = useBridgeFees(state)

  const srcAmountOut = useMemo(() => (bridgeFee ? amount?.subtract(bridgeFee) : undefined), [bridgeFee, amount])

  const dstAmountOut = useMemo(() => {
    if (!srcAmountOut || !dstToken) return
    return tryParseAmount(
      srcAmountOut.toFixed(srcAmountOut.currency.decimals > dstToken.decimals ? dstToken.decimals : undefined),
      dstToken
    )
  }, [dstToken, srcAmountOut])

  const price = useMemo(
    () => (amount && dstAmountOut ? new Price({ baseAmount: amount, quoteAmount: dstAmountOut }) : undefined),
    [amount, dstAmountOut]
  )

  return useMemo(
    () => ({
      srcAmountOut,
      dstAmountOut,
      price,
      bridgeFee,
      isLoading,
    }),
    [bridgeFee, dstAmountOut, isLoading, price, srcAmountOut]
  )
}
