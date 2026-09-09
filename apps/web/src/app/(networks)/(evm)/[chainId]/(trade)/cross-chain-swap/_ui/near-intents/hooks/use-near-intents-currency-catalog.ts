'use client'

import { useCallback, useMemo } from 'react'
import {
  isLayerZeroChainId,
  isLayerZeroTokenParam,
} from 'src/lib/swap/layerzero/config'
import type {
  NearIntentsCurrencyEntry,
  NearIntentsSupportedChainId,
  NearIntentsToken,
} from 'src/lib/swap/near-intents'
import {
  getCurrencyEntryKey,
  getCurrencyParam,
  getDefaultTokenForChain,
  mapNearIntentsTokensToCurrencyEntries,
} from 'src/lib/swap/near-intents/tokens'
import { STELLAR_USDT0, StellarChainId } from 'sushi/stellar'

interface NearIntentsDefaultTokenParams {
  token0Param: string | undefined
  token1Param: string | undefined
}

const EMPTY_TOKENS: readonly NearIntentsToken[] = []

function getCurrencyEntryByTokenAssetId(
  entries: readonly NearIntentsCurrencyEntry[],
  token: NearIntentsToken | undefined,
): NearIntentsCurrencyEntry | undefined {
  if (!token) return undefined

  return entries.find((entry) => entry.assetId === token.assetId)
}

export function getNearIntentsSelectableCurrencies(
  chainId: NearIntentsSupportedChainId,
  otherChainId: NearIntentsSupportedChainId,
  currencies:
    | Record<string, CurrencyFor<NearIntentsSupportedChainId>>
    | undefined,
): Record<string, CurrencyFor<NearIntentsSupportedChainId>> | undefined {
  if (chainId !== StellarChainId.STELLAR || isLayerZeroChainId(otherChainId)) {
    return currencies
  }

  return Object.fromEntries(
    Object.entries(currencies ?? {}).filter(
      ([address]) => !isLayerZeroTokenParam(StellarChainId.STELLAR, address),
    ),
  )
}

export function useNearIntentsCurrencyCatalog(
  tokens: readonly NearIntentsToken[] | undefined,
) {
  const nearIntentsTokens = tokens ?? EMPTY_TOKENS
  const currencyEntries = useMemo(() => {
    const entries = mapNearIntentsTokensToCurrencyEntries(nearIntentsTokens)
    // Make the USDT0 route discoverable without assigning it a NEAR asset ID.
    const currency = STELLAR_USDT0[StellarChainId.STELLAR]
    if (!entries.some((entry) => entry.currency.id === currency.id)) {
      entries.push({ assetId: '', currency, priceUSD: '1', priceUpdatedAt: '' })
    }
    return entries
  }, [nearIntentsTokens])

  const currencyEntryByKey = useMemo(() => {
    const entries = new Map<string, NearIntentsCurrencyEntry>()
    for (const entry of currencyEntries) {
      entries.set(
        getCurrencyEntryKey(
          entry.currency.chainId as NearIntentsSupportedChainId,
          getCurrencyParam(entry.currency),
        ),
        entry,
      )
    }
    return entries
  }, [currencyEntries])

  const currenciesByChain = useMemo(() => {
    const currencies: Partial<
      Record<
        NearIntentsSupportedChainId,
        Record<string, CurrencyFor<NearIntentsSupportedChainId>>
      >
    > = {}

    for (const entry of currencyEntries) {
      const chainId = entry.currency.chainId as NearIntentsSupportedChainId
      currencies[chainId] ??= {}
      currencies[chainId][getCurrencyParam(entry.currency)] = entry.currency
    }

    return currencies
  }, [currencyEntries])

  const getCurrencyEntry = useCallback(
    (chainId: NearIntentsSupportedChainId, tokenParam: string | undefined) =>
      tokenParam
        ? currencyEntryByKey.get(getCurrencyEntryKey(chainId, tokenParam))
        : undefined,
    [currencyEntryByKey],
  )

  const getDefaultTokenParams = useCallback(
    (
      sourceChainId: NearIntentsSupportedChainId,
      destChainId: NearIntentsSupportedChainId,
    ): NearIntentsDefaultTokenParams => {
      const sourceToken = getCurrencyEntryByTokenAssetId(
        currencyEntries,
        getDefaultTokenForChain(nearIntentsTokens, sourceChainId),
      )
      const destToken = getCurrencyEntryByTokenAssetId(
        currencyEntries,
        getDefaultTokenForChain(nearIntentsTokens, destChainId),
      )

      return {
        token0Param: sourceToken
          ? getCurrencyParam(sourceToken.currency)
          : undefined,
        token1Param: destToken
          ? getCurrencyParam(destToken.currency)
          : undefined,
      }
    },
    [currencyEntries, nearIntentsTokens],
  )

  return {
    currencyEntries,
    currenciesByChain,
    getCurrencyEntry,
    getDefaultTokenParams,
  }
}
