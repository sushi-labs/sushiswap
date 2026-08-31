'use client'

import { useCallback } from 'react'

import {
  CrossmintTokenSelector,
  isCrossmintTokenSelectorChainId,
  useFiatExchangeRates,
  useFiatLocale,
} from 'src/lib/crossmint'
import {
  CROSSMINT_CLIENT_SIDE_API_KEY,
  getCrossmintEnvironment,
} from 'src/lib/crossmint/crossmint-config'
import { FIAT_CURRENCY_DETAILS } from 'src/lib/crossmint/fiat-currencies'
import { convertFiatToUsdAmount } from 'src/lib/crossmint/fiat-exchange-rates'
import { EvmChainId, USDC } from 'sushi/evm'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import { useDerivedStateFiatBuy } from './derivedstate-fiat-buy-provider'
import {
  formatFiatBuyTokenInputAmount,
  getFiatBuyPaymentAmount,
  getFiatBuyTokenEstimate,
} from './fiat-buy-token-estimate'

export function FiatTokenSelector() {
  const {
    mutate: { setFiatAmount, setToken },
    state: { chainId, fiatAmountString, paymentCurrency, token },
  } = useDerivedStateFiatBuy()
  const locale = useFiatLocale()
  const exchangeRates = useFiatExchangeRates({
    enabled: paymentCurrency !== 'usd',
  })
  const tokenPrice = useCurrencyPrice({ currency: token?.token })
  const environment = CROSSMINT_CLIENT_SIDE_API_KEY
    ? getCrossmintEnvironment(CROSSMINT_CLIENT_SIDE_API_KEY)
    : undefined
  const exchangeRate =
    paymentCurrency === 'usd' ? 1 : exchangeRates.data?.rates[paymentCurrency]
  const fiatAmount = Number(fiatAmountString)
  const amountUsd = (() => {
    if (!Number.isFinite(fiatAmount) || fiatAmount < 0 || !exchangeRate) {
      return undefined
    }

    if (fiatAmount === 0) return 0

    try {
      return Number(convertFiatToUsdAmount(fiatAmount, exchangeRate))
    } catch {
      return undefined
    }
  })()
  const tokenEstimate = getFiatBuyTokenEstimate({
    allowStagingFallback: !tokenPrice.isLoading,
    amountUsd,
    environment,
    sushiTokenPrice: tokenPrice.data,
  })
  const noEstimate = (
    <span className="text-sm font-normal text-muted-foreground">
      No estimate
    </span>
  )
  const amount = (() => {
    if (!token) return ''
    if (tokenEstimate.amount === 0) return ''
    if (tokenEstimate.amount === undefined) return noEstimate

    return formatFiatBuyTokenInputAmount(tokenEstimate.amount)
  })()
  const fiatValue =
    amountUsd === undefined
      ? '—'
      : new Intl.NumberFormat(locale, {
          currency: 'USD',
          currencyDisplay: 'symbol',
          style: 'currency',
        }).format(amountUsd)
  const isAmountLoading =
    Boolean(token) &&
    (tokenPrice.isLoading ||
      (paymentCurrency !== 'usd' && exchangeRates.isLoading))
  const handleAmountChange = useCallback(
    (tokenAmount: string) => {
      if (!exchangeRate || !tokenEstimate.priceUsd) return

      const paymentAmount = getFiatBuyPaymentAmount({
        exchangeRate,
        minorUnits: FIAT_CURRENCY_DETAILS[paymentCurrency].minorUnits,
        tokenAmount,
        tokenPriceUsd: tokenEstimate.priceUsd,
      })

      if (paymentAmount !== undefined) setFiatAmount(paymentAmount)
    },
    [exchangeRate, paymentCurrency, setFiatAmount, tokenEstimate.priceUsd],
  )

  return (
    <CrossmintTokenSelector
      amount={amount}
      defaultChainId={
        isCrossmintTokenSelectorChainId(chainId) ? chainId : undefined
      }
      defaultToken={USDC[EvmChainId.BASE]}
      fiatValue={fiatValue}
      isAmountLoading={isAmountLoading}
      label="Estimated receive"
      onAmountChange={
        token && exchangeRate && tokenEstimate.priceUsd
          ? handleAmountChange
          : undefined
      }
      onSelect={setToken}
      selected={token}
    />
  )
}
