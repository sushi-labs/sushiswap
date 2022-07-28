import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Pair } from '../../../.graphclient'
import { PoolsTableAPRCell } from './PoolsTableAPRCell'
import { PoolsTableChainCell } from './PoolsTableChainCell'
import { PoolsTableNameCell } from './PoolsTableNameCell'
import { PoolsTableRewardsCell } from './PoolsTableRewardsCell'
import { PoolsTableTVLCell } from './PoolsTableTVLCell'

export const ICON_SIZE = 26

export const PAGE_SIZE = 20

export const POOL_TABLE_COLUMNS: ColumnDef<Pair>[] = [
  {
    header: 'Network',
    cell: (props) => <PoolsTableChainCell pair={props.row.original} />,
    size: 60,
  },
  {
    header: 'Name',
    cell: (props) => <PoolsTableNameCell pair={props.row.original} />,
    size: 220,
  },
  {
    header: 'TVL',
    id: 'reserveETH',
    accessorFn: (row) => row.reserveETH,
    cell: (props) => <PoolsTableTVLCell pair={props.row.original} />,
    size: 100,
  },
  {
    header: 'APR',
    cell: (props) => <PoolsTableAPRCell pair={props.row.original} />,
    size: 100,
  },
  {
    header: 'Rewards',
    cell: (props) => <PoolsTableRewardsCell pair={props.row.original} />,
  },
]
