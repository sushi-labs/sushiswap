import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { Feature } from 'app/enums'
import { featureEnabled, formatNumber, formatPercent } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useBentoStrategies, useBentoTokens, useNativePrice, useTokens } from 'app/services/graph'
import React, { useMemo } from 'react'

import { filterForSearchQuery } from './tokenTableFilters'

export const useTableConfig = (chainId: number) => {
  const allTokens = useAllTokens()
  const { data: nativePrice } = useNativePrice({ chainId })

  const bentoBoxTokens = useBentoTokens({ chainId, shouldFetch: featureEnabled(Feature.BENTOBOX, chainId) })

  const bentoBoxTokenAddresses = useMemo(() => {
    if (!bentoBoxTokens || !bentoBoxTokens.length) {
      return []
    }
    // @ts-ignore
    return bentoBoxTokens.map((token) => token.id)
  }, [bentoBoxTokens])

  // Get exchange data
  const tokens = useTokens({
    chainId,
    shouldFetch: bentoBoxTokenAddresses && bentoBoxTokenAddresses.length,
    variables: {
      where: {
        id_in: bentoBoxTokenAddresses,
      },
    },
  })

  // Creating map to easily reference TokenId -> Token
  const tokenIdToPrice = useMemo<
    Map<string, { derivedETH: number; volumeUSD: number; dayData: Array<{ priceUSD: number }> }>
  >(() => {
    // @ts-ignore TYPE NEEDS FIXING
    return new Map(tokens?.map((token) => [token.id, token]))
  }, [tokens])

  const strategies = useBentoStrategies({ chainId })

  const data = useMemo<Array<any>>(() => {
    if (!bentoBoxTokens || !bentoBoxTokens.length || !tokens || !tokens.length) {
      return []
    }
    return (
      bentoBoxTokens
        // @ts-ignore
        .map(({ id, rebase, decimals, symbol, name }) => {
          const token = tokenIdToPrice.get(id)
          const supply = rebase.elastic
          const tokenDerivedETH = token?.derivedETH
          const price = (tokenDerivedETH ?? 0) * nativePrice
          const tvl = price * supply

          const strategy = strategies?.find((strategy) => strategy.token === id)

          return {
            token: {
              id,
              symbol,
              name,
              decimals,
            },
            strategy,
            price,
            liquidity: tvl,
          }
        })
        .filter(Boolean)
    )
  }, [bentoBoxTokens, tokens, tokenIdToPrice, nativePrice, strategies])

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'token',
        maxWidth: 100,
        // @ts-ignore
        Cell: (props) => {
          const address = getAddress(props.value.id)
          const currency = useMemo(
            () =>
              address in allTokens
                ? allTokens[address]
                : new Token(chainId, address, Number(props.value.decimals), props.value.symbol, props.value.name),
            [props, address]
          )
          return (
            <div className="flex items-center gap-2">
              <CurrencyLogo currency={currency ?? undefined} className="!rounded-full" size={36} />
              {props.value.symbol}
            </div>
          )
        },
        filter: filterForSearchQuery,
      },
      {
        Header: 'Price',
        accessor: 'price',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, undefined, 2),
        align: 'right',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false),
        align: 'right',
      },
      {
        id: 'target',
        Header: 'Strategy Target',
        accessor: 'strategy.targetPercentage',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value),
      },
      {
        id: 'utilisation',
        Header: 'Strategy Utilization',
        accessor: 'strategy.utilization',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value),
      },
      {
        Header: 'APY',
        accessor: 'strategy.apy',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value),
      },
    ],
    [chainId]
  )

  return useMemo(
    () => ({
      config: {
        columns,
        data: data ?? [],
        initialState: {
          sortBy: [
            { id: 'liquidity', desc: true },
            { id: 'price', desc: true },
            { id: 'targetPercentage', desc: true },
            { id: 'utilization', desc: true },
            { id: 'apy', desc: true },
          ],
        },
        autoResetFilters: false,
      },
      // loading: isValidating,
      // error,
    }),
    [columns, data]
  )
}
