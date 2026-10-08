'use client'

import { useCallback, useMemo } from 'react'
import type {
  NearIntentsCurrencyEntry,
  NearIntentsSupportedChainId,
  NearIntentsToken,
} from 'src/lib/swap/near-intents'
import { isNearIntentsChainId } from 'src/lib/swap/near-intents'
import {
  getCurrencyEntryKey,
  getCurrencyParam,
  getDefaultTokenForChain,
  mapNearIntentsTokensToCurrencyEntries,
} from 'src/lib/swap/near-intents/tokens'
import { useValueTransferCatalog } from '../../layerzero/hooks/use-value-transfer-catalog'

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
  _chainId: NearIntentsSupportedChainId,
  _otherChainId: NearIntentsSupportedChainId,
  currencies:
    | Record<string, CurrencyFor<NearIntentsSupportedChainId>>
    | undefined,
): Record<string, CurrencyFor<NearIntentsSupportedChainId>> | undefined {
  return currencies
}

export function useNearIntentsCurrencyCatalog(
  tokens: readonly NearIntentsToken[] | undefined,
) {
  const catalog = useValueTransferCatalog()
  const nearIntentsTokens = tokens ?? EMPTY_TOKENS
  const currencyEntries = useMemo(() => {
    const entries = mapNearIntentsTokensToCurrencyEntries(nearIntentsTokens)
    for (const { currency, token } of catalog.entries) {
      if (
        !isNearIntentsChainId(currency.chainId) ||
        entries.some((entry) => entry.currency.id === currency.id)
      )
        continue
      entries.push({
        assetId: '',
        currency: currency as CurrencyFor<NearIntentsSupportedChainId>,
        priceUSD: token.price?.usd === undefined ? '' : String(token.price.usd),
        priceUpdatedAt: '',
      })
    }
    return entries
  }, [nearIntentsTokens, catalog.entries])

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
