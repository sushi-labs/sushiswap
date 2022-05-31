import { Currency, CurrencyAmount, Price, Token, USD } from '@sushiswap/core-sdk'
import { useNativePrice, useTokens, useTridentTokens } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

/**
 * Returns the prices in USDC of the input currency
 * @param currencies currencies to compute the USDC price of
 * @param useTrident for possible compatibility reasons
 */
export function useUSDCPricesSubgraph(
  currencies?: Currency[],
  useTrident = false
): { [address: string]: Price<Currency, Token> } | undefined {
  const { chainId } = useActiveWeb3React()

  const stablecoin = chainId ? CurrencyAmount.fromRawAmount(USD[chainId], 0).currency : undefined

  const { data: ethPrice } = useNativePrice({ chainId })
  const tokensLegacy = useTokens({
    chainId,
    variables: { where: { id_in: currencies?.map((currency) => currency.wrapped.address.toLowerCase()) } },
    shouldFetch: currencies && currencies?.length > 0,
  }) as any[] | undefined
  const { data: tokensTrident } = useTridentTokens({
    chainId,
    variables: {
      where: { id_in: currencies?.map((currency) => currency.wrapped.address.toLowerCase()) },
    },
    shouldFetch: currencies && currencies?.length > 0,
  })

  return useMemo(() => {
    if (!currencies || currencies.length === 0 || !stablecoin || !(tokensLegacy || tokensTrident)) {
      return undefined
    }

    const prices: { [address: string]: Price<Currency, Token> } = {}

    currencies.map((currency) => {
      let price: number | undefined = undefined

      const tokenLegacy = tokensLegacy?.find((token) => token.id === currency.wrapped.address.toLowerCase())
      const tokenTrident = tokensTrident?.find((token) => token.id === currency.wrapped.address.toLowerCase())

      // handle usdc
      if (currency?.wrapped.equals(stablecoin)) {
        prices[currency.wrapped.address] = new Price(stablecoin, stablecoin, '1', '1')
        return
      }

      if (tokenLegacy && tokenTrident) {
        if (tokenLegacy.liquidity > tokenTrident.kpi.liquidity) {
          price = ethPrice * tokenLegacy.derivedETH
        } else {
          price = tokenTrident.price.derivedUSD
        }
      } else if (ethPrice && tokenLegacy) {
        price = ethPrice * tokenLegacy.derivedETH
      } else if (tokenTrident) {
        price = tokenTrident.price.derivedUSD
      }

      if (price !== undefined && price !== 0) {
        const base = 10 ** (String(price).split('.')?.[1]?.length ?? 0)
        const quote = Math.floor(price * base)
        try {
          prices[currency.wrapped.address] = new Price(
            currency,
            stablecoin,
            (base * 10 ** currency.decimals) / 10 ** stablecoin.decimals,
            quote
          )
        } catch {}
      }
    })

    return prices
  }, [currencies, stablecoin, tokensLegacy, tokensTrident, ethPrice])
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 * @param useTrident for possible compatibility reasons
 */
export default function useUSDCPriceSubgraph(
  currency?: Currency,
  useTrident = false
): Price<Currency, Token> | undefined {
  const priceObject = useUSDCPricesSubgraph(currency ? [currency] : undefined, useTrident)

  return priceObject ? Object.values(priceObject)[0] : undefined
}

export function useUSDCValueSubgraph(
  currencyAmount: CurrencyAmount<Currency> | undefined | null,
  includeTrident = false
) {
  const price = useUSDCPriceSubgraph(currencyAmount?.currency, includeTrident)

  return useMemo(() => {
    if (!price || !currencyAmount) return null
    try {
      return price.quote(currencyAmount)
    } catch (error) {
      return null
    }
  }, [currencyAmount, price])
}

export function useUSDCSubgraphPriceWithLoadingIndicator(currency?: Currency) {
  // Bandaid solution for now, might become permanent
  const price = useUSDCPriceSubgraph(currency)
  return useMemo(() => {
    if (!price || !currency) return { price: undefined, loading: false }
    try {
      return { price, loading: false }
    } catch (error) {
      return { price: undefined, loading: false }
    }
  }, [currency, price])
}

export function useUSDCSubgraphValueWithLoadingIndicator(currencyAmount: CurrencyAmount<Currency> | undefined) {
  // Bandaid solution for now, might become permanent
  const price = useUSDCPriceSubgraph(currencyAmount?.currency)
  return useMemo(() => {
    if (!price || !currencyAmount) return { value: undefined, loading: false }
    try {
      return { value: price.quote(currencyAmount), loading: false }
    } catch (error) {
      return { value: undefined, loading: false }
    }
  }, [currencyAmount, price])
}
