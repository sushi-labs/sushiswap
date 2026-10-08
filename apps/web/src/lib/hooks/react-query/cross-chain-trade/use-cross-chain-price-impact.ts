'use client'

import { useMemo } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { getCrossChainPriceImpact } from 'src/lib/swap/cross-chain/price-impact'
import type { Amount, Percent } from 'sushi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

export function useCrossChainPriceImpact({
  amountIn,
  amountOut,
}: {
  amountIn: Amount<CurrencyFor<LifiXSwapSupportedChainId>> | undefined
  amountOut: Amount<CurrencyFor<LifiXSwapSupportedChainId>> | undefined
}): Percent | undefined {
  const { data: pricesIn } = usePrices({ chainId: amountIn?.currency.chainId })
  const { data: pricesOut } = usePrices({
    chainId: amountOut?.currency.chainId,
  })

  return useMemo(
    () =>
      getCrossChainPriceImpact({
        amountIn,
        amountOut,
        // Use the same prices as the currency inputs. Aggregator token prices
        // can be placeholders, even when their executable amounts are valid.
        tokenInPrice: amountIn
          ? pricesIn?.getFraction(amountIn.currency.wrap().address)
          : undefined,
        tokenOutPrice: amountOut
          ? pricesOut?.getFraction(amountOut.currency.wrap().address)
          : undefined,
      }),
    [amountIn, amountOut, pricesIn, pricesOut],
  )
}
