'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  type ValueTransferChain,
  type ValueTransferToken,
  valueTransferChainsResponseSchema,
  valueTransferTokensResponseSchema,
} from 'src/lib/swap/value-transfer/schemas'
import {
  type ValueTransferCurrencyEntry,
  getValueTransferChainId,
  getValueTransferCurrencyKey,
  getValueTransferCurrencyParam,
  mapValueTransferToken,
} from 'src/lib/swap/value-transfer/tokens'
import {
  type ValueTransferChainId,
  isValueTransferChainId,
} from 'src/lib/swap/value-transfer/types'

interface CatalogResponse {
  chains: ValueTransferChain[]
  tokens: ValueTransferToken[]
}

interface ValueTransferCatalog extends CatalogResponse {
  entries: ValueTransferCurrencyEntry[]
  currenciesByChain: Partial<
    Record<
      ValueTransferChainId,
      Record<string, CurrencyFor<ValueTransferChainId>>
    >
  >
  networkIds: ValueTransferChainId[]
  getChain(chainId: ValueTransferChainId): ValueTransferChain | undefined
  getToken(
    chainId: ValueTransferChainId,
    param: string | undefined,
  ): ValueTransferToken | undefined
  getCurrency(
    chainId: ValueTransferChainId,
    param: string | undefined,
  ): CurrencyFor<ValueTransferChainId> | undefined
  isLoading: boolean
  error: Error | null
}

async function fetchCatalog(): Promise<CatalogResponse> {
  const [chains, tokens] = await Promise.all([
    fetch('/api/cross-chain/value-transfer/chains'),
    fetch('/api/cross-chain/value-transfer/tokens'),
  ])
  if (!chains.ok || !tokens.ok) throw new Error('Token catalog unavailable')
  return {
    chains: valueTransferChainsResponseSchema.parse(await chains.json()).chains,
    tokens: valueTransferTokensResponseSchema.parse(await tokens.json()).tokens,
  }
}

export function useValueTransferCatalog(): ValueTransferCatalog {
  const query = useQuery({
    queryKey: ['value-transfer-catalog'],
    queryFn: fetchCatalog,
    staleTime: 5 * 60_000,
    retry: 2,
  })
  const catalog = useMemo(() => {
    const chains = query.data?.chains ?? []
    const tokens = query.data?.tokens ?? []
    const chainByKey = new Map(chains.map((chain) => [chain.chainKey, chain]))
    const chainById = new Map(
      chains.flatMap((chain) => {
        const chainId = getValueTransferChainId(chain)
        return chainId ? [[chainId, chain] as const] : []
      }),
    )
    const entries = tokens.flatMap((token) => {
      const chain = chainByKey.get(token.chainKey)
      const entry = chain ? mapValueTransferToken(token, chain) : undefined
      return entry ? [entry] : []
    })
    const byKey = new Map(
      entries.map((entry) => [
        getValueTransferCurrencyKey(
          entry.currency.chainId,
          getValueTransferCurrencyParam(entry.currency),
        ),
        entry,
      ]),
    )
    const currenciesByChain: ValueTransferCatalog['currenciesByChain'] = {}
    for (const { currency } of entries) {
      if (!isValueTransferChainId(currency.chainId)) continue
      const currencies = currenciesByChain[currency.chainId] ?? {}
      currenciesByChain[currency.chainId] = currencies
      currencies[getValueTransferCurrencyParam(currency)] = currency
    }
    function getEntry(
      chainId: ValueTransferChainId,
      param: string | undefined,
    ): ValueTransferCurrencyEntry | undefined {
      return param
        ? byKey.get(getValueTransferCurrencyKey(chainId, param))
        : undefined
    }
    return {
      chains,
      tokens,
      entries,
      currenciesByChain,
      networkIds: [...chainById.keys()],
      getChain: (chainId: ValueTransferChainId) => chainById.get(chainId),
      getToken: (chainId: ValueTransferChainId, param: string | undefined) =>
        getEntry(chainId, param)?.token,
      getCurrency: (chainId: ValueTransferChainId, param: string | undefined) =>
        getEntry(chainId, param)?.currency,
    }
  }, [query.data])
  return { ...catalog, isLoading: query.isLoading, error: query.error }
}
