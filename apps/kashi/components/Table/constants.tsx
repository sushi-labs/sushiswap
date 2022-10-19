import { JSBI } from '@sushiswap/math'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import React from 'react'

import { AssetCell } from './AssetCell'
import { AvailableForBorrowCell } from './AvailableForBorrowCell'
import { BorrowAPRCell } from './BorrowAPRCell'
import { BorrowAssetCell, BorrowAssetCellPopover } from './BorrowAssetCell'
import { CollateralCell } from './CollateralCell'
import { LendAssetCell, LendAssetCellPopover } from './LendAssetCell'
import { NetworkCell } from './NetworkCell'
import { SupplyAPRCell } from './SupplyAPRCell'
import { TotalAPRCell } from './TotalAPRCell'
import { TotalAssetCell } from './TotalAssetCell'
import { TotalBorrowCell } from './TotalBorrowCell'
import { TotalBorrowUSDCell } from './TotalBorrowUSDCell'
import { TotalSupplyUSDCell } from './TotalSupplyUSDCell'
import { ExtendedColumnDef } from './types'

export const ICON_SIZE = 20
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <NetworkCell row={props.row.original} />,
  size: 20,
  skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
}

export const ASSET_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'asset',
  header: 'Lend Asset',
  cell: (props) => <AssetCell row={props.row.original} />,
  size: 50,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const LEND_ASSET_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'asset',
  header: 'Lend Asset',
  cell: (props) => <LendAssetCell row={props.row.original} />,
  size: 70,
  skeleton: (
    <div className="flex items-center flex-grow">
      <div className="flex items-baseline min-w-[54px] min-h-[40px]">
        <div className="z-[1] w-[32px] h-[32px] rounded-full animate-pulse bg-slate-700" />
        <div className="-ml-2.5 w-[20px] h-[20px] rounded-full animate-pulse bg-slate-700" />
      </div>
      <div className="flex rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />
    </div>
  ),
}

export const LEND_ASSET_COLUMN_POPOVER: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'asset',
  header: 'Market',
  cell: (props) => <LendAssetCellPopover row={props.row.original} />,
  size: 70,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const BORROW_ASSET_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'collateral',
  header: 'Borrow Asset',
  cell: (props) => <BorrowAssetCell row={props.row.original} />,
  size: 70,
  skeleton: (
    <div className="flex items-center flex-grow">
      <div className="flex items-baseline min-w-[54px] min-h-[40px]">
        <div className="z-[1] w-[32px] h-[32px] rounded-full animate-pulse bg-slate-700" />
        <div className="-ml-2.5 w-[20px] h-[20px] rounded-full animate-pulse bg-slate-700" />
      </div>
      <div className="flex rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />
    </div>
  ),
}

export const BORROW_ASSET_COLUMN_POPOVER: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'collateral',
  header: 'Market',
  cell: (props) => <BorrowAssetCellPopover row={props.row.original} />,
  size: 70,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const COLLATERAL_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'collateral',
  header: 'Borrow Asset',
  cell: (props) => <CollateralCell row={props.row.original} />,
  size: 50,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const TOTAL_APR_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'totalAPR',
  header: 'Total APR',
  // accessorFn: (row) => JSBI.toNumber(row.currentSupplyAPR.quotient),
  cell: (props) => <TotalAPRCell row={props.row.original} />,
  size: 50,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const TOTAL_ASSET_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'totalAsset',
  header: 'Total Supply',
  accessorFn: (row) => row.totalAsset,
  cell: (props) => <TotalAssetCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const SUPPLY_APR_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'currentSupplyAPR',
  header: 'Lend APY',
  accessorFn: (row) => JSBI.toNumber(row.currentSupplyAPR.quotient),
  cell: (props) => <SupplyAPRCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const TOTAL_BORROW_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'totalBorrow',
  header: 'Borrowed',
  cell: (props) => <TotalBorrowCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const TOTAL_BORROW_USD: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'totalBorrowUSD',
  header: 'Borrowed',
  cell: (props) => <TotalBorrowUSDCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}
export const TOTAL_SUPPY_USD: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'totalSupplyUSD',
  header: 'Supplied',
  cell: (props) => <TotalSupplyUSDCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const AVAILABLE_FOR_BORROW_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'availableBorrow',
  header: 'Available For Borrow',
  cell: (props) => <AvailableForBorrowCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const BORROW_APR_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'borrow',
  header: 'Borrow APR',
  // accessorFn: (row) => row.currentInterestPerYear,
  cell: (props) => <BorrowAPRCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const REWARD_APR_COLUMN: ExtendedColumnDef<KashiMediumRiskLendingPairV1, any> = {
  id: 'reward',
  header: 'Reward APY',
  // accessorFn: (row) => row.currentInterestPerYear,
  cell: (props) => <BorrowAPRCell row={props.row.original} />,
  size: 40,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}
