import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Pair } from '../../../.graphclient'
import { PairWithBalance } from '../../../types'
import { PairAPRCell } from './PairAPRCell'
import { PairChainCell } from './PairChainCell'
import { PairNameCell } from './PairNameCell'
import { PairPositionCell } from './PairPositionCell'
import { PairRewardsCell } from './PairRewardsCell'
import { PairTVLCell } from './PairTVLCell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<Pair> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PairChainCell row={props.row.original} />,
  size: 60,
}

export const NAME_COLUMN: ColumnDef<Pair> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PairNameCell row={props.row.original} />,
  size: 160,
}

export const TVL_COLUMN: ColumnDef<Pair> = {
  header: 'TVL',
  id: 'liquidityUSD',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => <PairTVLCell row={props.row.original} />,
  size: 100,
}

export const APR_COLUMN: ColumnDef<Pair> = {
  id: 'apr',
  header: 'APR',
  cell: (props) => <PairAPRCell row={props.row.original} />,
  size: 100,
}

export const REWARDS_COLUMN: ColumnDef<Pair> = {
  id: 'rewards',
  header: 'Rewards',
  cell: (props) => <PairRewardsCell row={props.row.original} />,
}

export const POSITION_COLUMN: ColumnDef<PairWithBalance> = {
  id: 'position',
  header: 'Value',
  cell: (props) => <PairPositionCell row={props.row.original} />,
  size: 100,
}
