import { useMemo } from 'react'
import { STABLECOINS, XLM } from '~stellar/_common/config/coins'
import { NETWORK_NAME } from '~stellar/_common/lib/constants'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { usePoolInfo } from '../pool/use-pool-info'
import { usePoolsBetween } from '../swap/use-pools-between'
import { getCurrencyPrice } from './get-currency-price'

interface UseStablePrice {
  currency: Token | undefined
}

export function useStablePrice({ currency }: UseStablePrice) {
  const native = useMemo(() => XLM[NETWORK_NAME], [])
  const stableTokens = useMemo(() => STABLECOINS[NETWORK_NAME], [])
  const defaultStable = stableTokens[0] // USDC (undefined on testnet)

  // Get pool addresses between tokens
  const {
    data: currencyNativePoolsBasic,
    isLoading: isCurrencyNativePoolsLoading,
  } = usePoolsBetween({
    tokenA: currency || native,
    tokenB: native,
    enabled:
      !!currency && currency.contract !== native.contract && !!defaultStable,
  })

  const {
    data: nativeStablePoolsBasic,
    isLoading: isNativeStablePoolsLoading,
  } = usePoolsBetween({
    tokenA: native,
    tokenB: defaultStable,
    enabled: !!defaultStable,
  })

  const stablePoolsBasicQueries = stableTokens.map((stableToken) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePoolsBetween({
      tokenA: currency || stableToken,
      tokenB: stableToken,
      enabled: !!currency && currency.contract !== stableToken.contract,
    }),
  )

  // Get full pool info with reserves
  const { data: currencyNativePool, isLoading: isCurrencyNativePoolLoading } =
    usePoolInfo(currencyNativePoolsBasic?.[0]?.address || null)
  const { data: nativeStablePool, isLoading: isNativeStablePoolLoading } =
    usePoolInfo(nativeStablePoolsBasic?.[0]?.address || null)

  const stablePoolsInfoQueries = stablePoolsBasicQueries.map((query) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePoolInfo(query.data?.[0]?.address || null),
  )

  const stablePools = stablePoolsInfoQueries.map((query) => query.data || null)

  const isLoading =
    isCurrencyNativePoolsLoading ||
    isNativeStablePoolsLoading ||
    isCurrencyNativePoolLoading ||
    isNativeStablePoolLoading ||
    stablePoolsBasicQueries.some((query) => query.isLoading) ||
    stablePoolsInfoQueries.some((query) => query.isLoading)

  const price = useMemo(() => {
    if (!currency || !defaultStable) return undefined

    return getCurrencyPrice(
      currency,
      defaultStable,
      native,
      currencyNativePool || null,
      nativeStablePool || null,
      stablePools,
    )
  }, [
    currency,
    defaultStable,
    native,
    currencyNativePool,
    nativeStablePool,
    stablePools,
  ])

  return { price, isLoading }
}
