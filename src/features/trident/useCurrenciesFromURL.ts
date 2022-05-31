import { ChainId, Currency, NATIVE, SUSHI } from '@sushiswap/core-sdk'
import { Fee } from '@sushiswap/trident-sdk'
import { useCurrency } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

const getToken = (urlToken: string | undefined, chainId: ChainId | undefined) => {
  if (!urlToken || !chainId) return undefined
  return [NATIVE[chainId].symbol, 'ETH'].includes(urlToken) ? 'ETH' : urlToken
}

const useCurrenciesFromURL = (): {
  currencies: (Currency | undefined)[]
  switchCurrencies: () => Promise<void>
  setURLCurrency: (cur: Currency, index: number) => void
  fee: number
  twap: boolean
} => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()

  const currencyA =
    useCurrency(getToken(router.query.tokens?.[0], chainId)) || (chainId && NATIVE[chainId]) || undefined
  const currencyB =
    useCurrency(getToken(router.query.tokens?.[1], chainId)) || (chainId && SUSHI[chainId as ChainId]) || undefined

  const fee = Number(router.query.fee ?? Fee.DEFAULT)
  const twap = router.query.twap !== 'false'

  const switchCurrencies = useCallback(async () => {
    if (!chainId) return

    // @ts-ignore TYPE NEEDS FIXING
    const nativeSymbol = NATIVE[chainId].symbol
    let tokens: string[] = []
    if (router.query && router.query.tokens) {
      tokens = [router.query.tokens?.[1], router.query.tokens?.[0]]
    } else {
      tokens = [
        // @ts-ignore TYPE NEEDS FIXING
        currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address,
        // @ts-ignore TYPE NEEDS FIXING
        currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address,
      ]
    }

    await router.push({
      pathname: router.pathname,
      query: {
        tokens,
        ...(router.pathname !== '/swap' && {
          fee,
          twap,
        }),
      },
    })
  }, [
    chainId,
    currencyA?.isNative,
    currencyA?.wrapped.address,
    currencyB?.isNative,
    currencyB?.wrapped.address,
    fee,
    router,
    twap,
  ])

  const setURLCurrency = useCallback(
    async (cur: Currency, index: number) => {
      if (!chainId) return

      // @ts-ignore TYPE NEEDS FIXING
      const nativeSymbol = NATIVE[chainId].symbol
      let tokens: string[] = [
        // @ts-ignore TYPE NEEDS FIXING
        currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address,
        // @ts-ignore TYPE NEEDS FIXING
        currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address,
      ]

      if (chainId && router.query?.tokens && router.query?.tokens.length > 0) {
        tokens = [...router.query.tokens]

        // If selected currency is already in URL, switch currencies
        if (tokens[(index + 1) % 2] === (cur.isNative ? nativeSymbol : cur.wrapped.address)) {
          return switchCurrencies()
        }

        // @ts-ignore TYPE NEEDS FIXING
        const newToken = cur.isNative ? NATIVE[chainId].symbol : cur.wrapped.address
        // @ts-ignore TYPE NEEDS FIXING
        if (tokens.includes(newToken)) return // return if token already selected
        // @ts-ignore TYPE NEEDS FIXING
        tokens[index] = newToken
      }

      if (!router.query?.tokens) {
        // @ts-ignore TYPE NEEDS FIXING
        tokens[index] =
          index === 1
            ? cur.isNative
              ? nativeSymbol
              : cur?.wrapped.address
            : cur.isNative
            ? nativeSymbol
            : cur?.wrapped.address
      }

      await router.push({
        pathname: router.pathname,
        query: {
          tokens,
          ...(router.pathname !== '/swap' && {
            fee,
            twap,
          }),
        },
      })
    },
    [
      chainId,
      currencyA?.isNative,
      currencyA?.wrapped.address,
      currencyB?.isNative,
      currencyB?.wrapped.address,
      fee,
      router,
      switchCurrencies,
      twap,
    ]
  )

  return useMemo(
    () => ({
      currencies: [currencyA, currencyB],
      setURLCurrency,
      switchCurrencies,
      fee,
      twap,
    }),
    [currencyA, currencyB, setURLCurrency, switchCurrencies, fee, twap]
  )
}

export default useCurrenciesFromURL
