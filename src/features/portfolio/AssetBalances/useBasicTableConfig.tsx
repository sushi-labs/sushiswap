import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { AssetCell } from 'app/features/portfolio/AssetBalances/AssetCell'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { ValueCell } from 'app/features/portfolio/AssetBalances/ValueCell'
import React, { useMemo } from 'react'

export type CellProps = { cell: { value: CurrencyAmount<Currency> } }

export const useBasicTableConfig = (assets?: Assets[], balancesLoading?: boolean) => {
  const AssetColumns = useMemo(
    () => [
      {
        id: 'asset',
        Header: 'Asset',
        accessor: 'asset',
        minWidth: 100,
        className: 'text-left',
        Cell: (props: CellProps) => AssetCell(props.cell.value, balancesLoading),
      },
      {
        id: 'value',
        Header: 'Value',
        accessor: 'asset',
        maxWidth: 100,
        className: 'text-right flex justify-end',
        Cell: (props: CellProps) => ValueCell(props.cell.value, balancesLoading),
      },
    ],
    [balancesLoading]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: AssetColumns,
        data: balancesLoading ? new Array(5).fill({ asset: undefined }) : assets,
        defaultColumn,
        initialState: {
          sortBy: [{ id: 'value', desc: true }],
        },
        manualPagination: true,
      },
    }),
    [AssetColumns, assets, balancesLoading, defaultColumn]
  )
}
