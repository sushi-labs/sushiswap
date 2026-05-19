'use client'

import type { EvmChainId } from 'sushi/evm'
import {
  type StellarChainId,
  type StellarToken,
  isStellarChainId,
} from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import { useStablePrice } from '~stellar/_common/lib/hooks/price/use-stable-price'
import { usePrice } from './use-price'

export function useCurrencyPrice<TChainId extends BalanceChainId>({
  currency,
  enabled = true,
}: {
  currency: CurrencyFor<TChainId> | undefined
  enabled?: boolean
}) {
  const stellarCurrency =
    currency && isStellarChainId(currency.chainId)
      ? (currency as CurrencyFor<StellarChainId>)
      : undefined

  const evmsvmCurrency =
    currency && !isStellarChainId(currency.chainId)
      ? (currency as CurrencyFor<EvmChainId | SvmChainId>).wrap()
      : undefined

  const price = usePrice({
    chainId: evmsvmCurrency?.chainId,
    address: evmsvmCurrency?.address,
    enabled: Boolean(enabled && evmsvmCurrency),
  })

  const stellarPrice = useStablePrice({
    token: stellarCurrency as StellarToken | undefined,
    enabled: Boolean(enabled && stellarCurrency),
  })

  if (!currency || !enabled) {
    return {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
    }
  }

  if (stellarCurrency) {
    return {
      data: stellarPrice.data,
      isLoading: stellarPrice.isLoading,
      isFetching: stellarPrice.isFetching,
      isError: stellarPrice.isError,
    }
  }

  return {
    data: price.data,
    isLoading: price.isLoading,
    isFetching: price.isUpdating,
    isError: price.isError,
  }
}
