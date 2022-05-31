import { PoolType } from '@sushiswap/trident-sdk'
import Chip from 'app/components/Chip'
import { formatNumber, formatPercent } from 'app/functions/format'
import { useOneDayBlock } from 'app/services/graph'
import { TridentPool } from 'app/services/graph/fetchers/pools'
import { useGetAllTridentPools, usePoolKpi } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import React, { ReactNode, useMemo } from 'react'

import { chipPoolColorMapper, poolTypeNameMapper } from '../types'
import { PoolCell } from './PoolCell'
import { feeTiersFilter, filterForSearchQueryAndTWAP } from './poolTableFilters'

export interface DiscoverPoolsTableColumn {
  Header: string
  accessor: keyof TridentPool | 'actions'
  Cell: ReactNode
  filter?: any
  maxWidth?: number
}

export const usePoolsTableData = () => {
  const { chainId } = useActiveWeb3React()
  const { data, error, isValidating } = useGetAllTridentPools({ chainId })

  const columns: DiscoverPoolsTableColumn[] = useMemo(() => {
    return [
      {
        Header: 'Assets',
        accessor: 'assets',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: ({ value, row: { original } }) => {
          return <PoolCell assets={value} twapEnabled={original.twapEnabled} />
        },
        filter: filterForSearchQueryAndTWAP,
      },
      {
        Header: 'Pool Type',
        accessor: 'type',
        maxWidth: 100,
        Cell: (props: { value: PoolType }) => (
          <Chip label={poolTypeNameMapper[props.value]} color={chipPoolColorMapper[props.value]} />
        ),
        // @ts-ignore TYPE NEEDS FIXING
        filter: (rows, id, filterValue) =>
          // @ts-ignore TYPE NEEDS FIXING
          rows.filter((row) => !filterValue.length || filterValue.includes(row.values.type)),
      },
      {
        Header: 'Fee Tier',
        accessor: 'swapFee',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <span>{props.value / 100}%</span>,
        filter: feeTiersFilter,
      },
      {
        Header: 'TVL',
        accessor: 'liquidityUSD',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <span>{formatNumber(props.value, true)}</span>,
      },

      {
        Header: 'Volume',
        accessor: 'volumeUSD',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <span>{formatNumber(props.value, true)}</span>,
      },
      {
        Header: 'APY',
        accessor: 'apy',
        maxWidth: 100,
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          const { data: oneDayBlock } = useOneDayBlock({ chainId, shouldFetch: !!chainId })
          const { data: oneDayPoolKpi } = usePoolKpi({
            chainId,
            variables: { block: oneDayBlock, id: data?.[props.row.id].address },
          })

          const percent = // @ts-ignore TYPE NEEDS FIXING
            (Math.max(
              0,
              // @ts-ignore TYPE NEEDS FIXING
              oneDayPoolKpi
                ? // @ts-ignore TYPE NEEDS FIXING
                  data?.[props.row.id]?.volumeUSD - oneDayPoolKpi?.volumeUSD
                : data?.[props.row.id]?.volumeUSD
            ) *
              // @ts-ignore TYPE NEEDS FIXING
              (data?.[props.row.id]?.swapFee / 10000) *
              365 *
              100) /
            // @ts-ignore TYPE NEEDS FIXING
            data?.[props.row.id]?.liquidityUSD

          return <span>{formatPercent(percent, 'NEW')}</span>
        },
      },
      // {
      //   Header: 'Actions',
      //   accessor: 'actions',
      //   maxWidth: 100,
      //   Cell: () => (
      //     /* Entire row is clickable, hence button does not need link */
      //     <Button color="blue" size="sm" variant="empty">
      //       Invest
      //     </Button>
      //   ),
      // },
    ]
  }, [chainId, data])

  return useMemo(
    () => ({
      config: {
        columns: columns,
        data: data ?? [],
        initialState: {
          pageSize: 15,
          sortBy: [
            { id: 'liquidityUSD' as DiscoverPoolsTableColumn['accessor'], desc: true },
            { id: 'volumeUSD' as DiscoverPoolsTableColumn['accessor'], desc: true },
          ],
        },
        autoResetFilters: false,
      },
      loading: isValidating,
      error,
    }),
    [columns, data, error, isValidating]
  )
}
