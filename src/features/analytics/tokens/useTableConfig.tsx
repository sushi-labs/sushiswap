import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { formatNumber, formatPercent } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import React, { useMemo } from 'react'

import useTokensAnalytics from '../hooks/useTokensAnalytics'
import { filterForSearchQuery } from './tokenTableFilters'

export const useTableConfig = (chainId: number) => {
  // const { data, error, isValidating } = useTokensAnalytics({ chainId })
  const data = useTokensAnalytics({ chainId })
  const allTokens = useAllTokens()
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'token',
        maxWidth: 100,
        // @ts-ignore
        Cell: (props) => {
          const currency = useMemo(() => {
            const address = getAddress(props.value.id)
            return address in allTokens
              ? allTokens[address]
              : new Token(chainId, address, Number(props.value.decimals), props.value.symbol, props.value.name)
          }, [props])
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
        Header: 'Volume',
        accessor: 'volume1d',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false),
        align: 'right',
      },
      {
        Header: 'Strategy APY',
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
            { id: 'volume', desc: true },
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
