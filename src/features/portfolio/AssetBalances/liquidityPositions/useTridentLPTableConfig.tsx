import { PoolType } from '@sushiswap/trident-sdk'
import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import { PoolCell } from 'app/features/trident/pools/PoolCell'
import { feeTiersFilter, filterForSearchQueryAndTWAP } from 'app/features/trident/pools/poolTableFilters'
import { chipPoolColorMapper, poolTypeNameMapper } from 'app/features/trident/types'
import { formatPercent } from 'app/functions'
import { TridentPositionRow } from 'app/services/graph'
import { useRollingPoolStats } from 'app/services/graph/hooks/pools'
import Link from 'next/link'
import React, { useMemo } from 'react'

interface TridentLPTableConfig {
  positions?: TridentPositionRow[]
  chainId: number | undefined
}

export const useTridentLPTableConfig = ({ positions, chainId }: TridentLPTableConfig) => {
  const AssetColumns = useMemo(
    () => [
      {
        Header: 'Assets',
        accessor: 'assets',
        className: 'text-left',
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
        className: 'text-left hidden lg:flex',
        Cell: (props: { value: PoolType; row: any }) => {
          return (
            <Chip
              label={props.row.original.legacy ? 'Legacy' : poolTypeNameMapper[props.value]}
              color={chipPoolColorMapper[props.value]}
            />
          )
        },
        // @ts-ignore TYPE NEEDS FIXING
        filter: (rows, id, filterValue) =>
          // @ts-ignore TYPE NEEDS FIXING
          rows.filter((row) => !filterValue.length || filterValue.includes(row.values.type)),
      },
      {
        Header: 'Fee Tier',
        accessor: 'swapFeePercent',
        maxWidth: 100,
        className: 'text-left hidden lg:flex',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <span>{props.value}%</span>,
        filter: feeTiersFilter,
      },
      {
        id: 'value',
        Header: 'Value',
        accessor: 'value',
        maxWidth: 100,
        className: 'text-right flex justify-end',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => {
          return (
            <Typography weight={700} className="w-full text-right text-high-emphesis">
              ${props.value.toFixed(2)}
            </Typography>
          )
        },
      },
      {
        Header: 'APY',
        accessor: 'apy',
        maxWidth: 100,
        className: 'text-right flex justify-end',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: ({ row, value }) => {
          const { data: stats } = useRollingPoolStats({
            chainId,
            variables: { where: { id_in: positions?.map((el) => el.id.toLowerCase()) } },
            shouldFetch: !!chainId && !!positions,
          })

          return (
            <Typography weight={700} className="w-full text-right text-high-emphesis">
              {formatPercent(value ?? stats?.[row.id]?.apy)}
            </Typography>
          )
        },
      },
      {
        id: 'actions',
        Header: 'Actions',
        accessor: 'type',
        maxWidth: 100,
        className: 'text-right flex justify-end',
        cellClassName: 'justify-end',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: ({ row: { original } }) => {
          if (original.legacy) {
            return (
              <div className="space-x-4">
                <Link
                  href={{
                    pathname: `/add`,
                    query: {
                      // @ts-ignore TYPE NEEDS FIXING
                      tokens: original.assets.map((el) => el.address),
                    },
                  }}
                >
                  <a className="text-sm rounded-full text-blue">Add</a>
                </Link>
                <Link
                  href={{
                    pathname: `/remove`,
                    query: {
                      // @ts-ignore TYPE NEEDS FIXING
                      tokens: original.assets.map((el) => el.address),
                    },
                  }}
                >
                  <a className="text-sm rounded-full text-blue">Remove</a>
                </Link>
              </div>
            )
          }

          return (
            <Link
              href={{
                pathname: `/trident/pool`,
                query: {
                  // @ts-ignore TYPE NEEDS FIXING
                  tokens: original.assets.map((el) => el.address),
                  fee: original.swapFeePercent * 100,
                  twap: original.twapEnabled,
                },
              }}
            >
              <a className="text-sm rounded-full text-blue">Manage</a>
            </Link>
          )
        },
      },
    ],
    [chainId]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: AssetColumns,
        data: positions || [],
        defaultColumn,
        initialState: {
          pageSize: 15,
          sortBy: [{ id: 'value', desc: true }],
        },
        autoResetFilters: false,
      },
    }),
    [AssetColumns, defaultColumn, positions]
  )
}
