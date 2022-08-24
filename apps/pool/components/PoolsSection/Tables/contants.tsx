import React from 'react'

import { PairWithBalance, PairWithFarmRewards } from '../../../types'
import { PairVolume7dCell } from '.'
import { PairAPRCell } from './PairAPRCell'
import { PairChainCell } from './PairChainCell'
import { PairNameCell } from './PairNameCell'
import { PairPositionCell } from './PairPositionCell'
import { PairRewardsCell } from './PairRewardsCell'
import { PairTVLCell } from './PairTVLCell'
import { ExtendedColumnDef } from './types'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ExtendedColumnDef<PairWithFarmRewards, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PairChainCell row={props.row.original} />,
  size: 30,
  skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
}

export const NAME_COLUMN: ExtendedColumnDef<PairWithFarmRewards, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PairNameCell row={props.row.original} />,
  size: 160,
  skeleton: (
    <div className="flex items-center w-full gap-2">
      <div className="flex items-center">
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
      </div>
      <div className="flex flex-col w-full">
        <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />
      </div>
    </div>
  ),
}

export const TVL_COLUMN: ExtendedColumnDef<PairWithFarmRewards, unknown> = {
  header: 'TVL',
  id: 'liquidityUSD',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) => <PairTVLCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const APR_COLUMN: ExtendedColumnDef<PairWithFarmRewards, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: (row) => row.apr,
  cell: (props) => <PairAPRCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const REWARDS_COLUMN: ExtendedColumnDef<PairWithFarmRewards, unknown> = {
  id: 'rewards',
  header: 'Rewards',
  cell: (props) => <PairRewardsCell row={props.row.original} />,
  skeleton: (
    <div className="flex items-center">
      <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
      <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
    </div>
  ),
}

export const POSITION_COLUMN: ExtendedColumnDef<PairWithBalance, unknown> = {
  id: 'position',
  header: 'Value',
  cell: (props) => <PairPositionCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const VOLUME_COLUMN: ExtendedColumnDef<PairWithFarmRewards, unknown> = {
  id: 'volume',
  header: 'Volume (7d)',
  cell: (props) => <PairVolume7dCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}
