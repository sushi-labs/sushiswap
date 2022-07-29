import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Pair } from '../../../.graphclient'
import { PairAPRCell } from './PairAPRCell'
import { PairChainCell } from './PairChainCell'
import { PairNameCell } from './PairNameCell'
import { PairRewardsCell } from './PairRewardsCell'
import { PairTVLCell } from './PairTVLCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<Pair> = {
  header: 'Network',
  cell: (props) => <PairChainCell pair={props.row.original} />,
  size: 60,
}

export const NAME_COLUMN: ColumnDef<Pair> = {
  header: 'Name',
  cell: (props) => <PairNameCell pair={props.row.original} />,
  size: 220,
}

export const TVL_COLUMN: ColumnDef<Pair> = {
  header: 'TVL',
  id: 'reserveETH',
  accessorFn: (row) => row.reserveETH,
  cell: (props) => <PairTVLCell pair={props.row.original} />,
  size: 100,
}

export const APR_COLUMN: ColumnDef<Pair> = {
  header: 'APR',
  cell: (props) => <PairAPRCell pair={props.row.original} />,
  size: 100,
}

export const REWARDS_COLUMN: ColumnDef<Pair> = {
  header: 'Rewards',
  cell: (props) => <PairRewardsCell pair={props.row.original} />,
}
