import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { KashiPair } from '../../.graphclient'
import { AssetCell } from './AssetCell'
import { BorrowAPRCell } from './BorrowAPRCell'
import { CollateralCell } from './CollateralCell'
import { LendAssetCell } from './LendAssetCell'
import { NetworkCell } from './NetworkCell'
import { SupplyAPRCell } from './SupplyAPRCell'
import { TotalAssetCell } from './TotalAssetCell'
import { TotalBorrowCell } from './TotalBorrowCell'

export const ICON_SIZE = 20
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<KashiPair> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <NetworkCell row={props.row.original} />,
  size: 40,
}

export const ASSET_COLUMN: ColumnDef<KashiPair> = {
  id: 'asset',
  header: 'Lend Asset',
  cell: (props) => <AssetCell row={props.row.original} />,
  size: 50,
}

export const LEND_ASSET_COLUMN: ColumnDef<KashiPair> = {
  id: 'asset',
  header: 'Lend Asset',
  cell: (props) => <LendAssetCell row={props.row.original} />,
  size: 50,
}

export const COLLATERAL_COLUMN: ColumnDef<KashiPair> = {
  id: 'collateral',
  header: 'Borrow Asset',
  cell: (props) => <CollateralCell row={props.row.original} />,
  size: 50,
}

export const TOTAL_ASSET_COLUMN: ColumnDef<KashiPair> = {
  id: 'totalAsset',
  header: 'Supplied',
  cell: (props) => <TotalAssetCell row={props.row.original} />,
  size: 90,
}

export const SUPPLY_APR_COLUMN: ColumnDef<KashiPair> = {
  id: 'supply',
  header: 'Deposit APR',
  accessorFn: (row) => row.supplyAPR,
  cell: (props) => <SupplyAPRCell row={props.row.original} />,
  size: 40,
}

export const TOTAL_BORROW_COLUMN: ColumnDef<KashiPair> = {
  id: 'totalBorrow',
  header: 'Borrowed',
  cell: (props) => <TotalBorrowCell row={props.row.original} />,
  size: 90,
}

export const BORROW_APR_COLUMN: ColumnDef<KashiPair> = {
  id: 'borrow',
  header: 'Borrow APR',
  accessorFn: (row) => row.borrowAPR,
  cell: (props) => <BorrowAPRCell row={props.row.original} />,
  size: 40,
}
