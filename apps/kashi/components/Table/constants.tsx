import { Skeleton } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import React from 'react'

import { AssetCell } from './AssetCell'
import { AvailableForBorrowCell } from './AvailableForBorrowCell'
import { BorrowAPRCell } from './BorrowAPRCell'
import { BorrowAssetCell, BorrowAssetCellPopover } from './BorrowAssetCell'
import { CollateralCell } from './CollateralCell'
import { HealthCell } from './HealthCell'
import { LendAssetCell, LendAssetCellPopover } from './LendAssetCell'
import { NetworkCell } from './NetworkCell'
import { SupplyAPRCell } from './SupplyAPRCell'
import { TotalAssetCell } from './TotalAssetCell'
import { TotalBorrowAPRCell } from './TotalBorrowAPRCell'
import { TotalBorrowCell } from './TotalBorrowCell'
import { TotalBorrowUSDCell } from './TotalBorrowUSDCell'
import { TotalSupplyAPRCell } from './TotalSupplyAPRCell'
import { TotalSupplyUSDCell } from './TotalSupplyUSDCell'

export const ICON_SIZE = 20
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <NetworkCell row={props.row.original} />,
  size: 20,
  meta: {
    skeleton: <Skeleton.Circle radius={26} className="bg-slate-700" />,
  },
}

export const ASSET_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'asset',
  header: 'Asset',
  cell: (props) => <AssetCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
  },
}

export const LEND_ASSET_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'asset',
  header: 'Lend Asset',
  cell: (props) => <LendAssetCell row={props.row.original} />,
  size: 70,
  meta: {
    skeleton: (
      <div className="flex items-center flex-grow">
        <div className="flex items-baseline min-w-[54px] min-h-[40px]">
          <Skeleton.Circle radius={32} className="z-[1] bg-slate-700" />
          <Skeleton.Circle radius={20} className="-ml-2.5 bg-slate-700" />
        </div>
        <Skeleton.Box className="flex bg-slate-700 w-full h-5 " />
      </div>
    ),
  },
}

export const LEND_ASSET_COLUMN_POPOVER: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'asset',
  header: 'Market',
  cell: (props) => <LendAssetCellPopover row={props.row.original} />,
  size: 70,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
  },
}

export const BORROW_ASSET_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'asset',
  header: 'Borrow Asset',
  cell: (props) => <BorrowAssetCell row={props.row.original} />,
  size: 70,
  meta: {
    skeleton: (
      <div className="flex items-center flex-grow">
        <div className="flex items-baseline min-w-[54px] min-h-[40px]">
          <Skeleton.Circle radius={32} className="z-[1] bg-slate-700" />
          <Skeleton.Circle radius={20} className="-ml-2.5 bg-slate-700" />
        </div>
        <Skeleton.Box className="flex bg-slate-700 w-full h-5 " />
      </div>
    ),
  },
}

export const BORROW_ASSET_COLUMN_POPOVER: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'asset',
  header: 'Market',
  cell: (props) => <BorrowAssetCellPopover row={props.row.original} />,
  size: 70,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
  },
}

export const COLLATERAL_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'collateral',
  header: 'Borrow Asset',
  cell: (props) => <CollateralCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
  },
}

export const TOTAL_SUPPLY_APR_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'totalSupplyAPR',
  header: 'Total APR',
  // accessorFn: (row) => JSBI.toNumber(row.currentSupplyAPR.quotient),
  cell: (props) => <TotalSupplyAPRCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
  },
}

export const TOTAL_BORROW_APR_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'totalBorrowAPR',
  header: 'Total APR',
  // accessorFn: (row) => JSBI.toNumber(row.currentSupplyAPR.quotient),
  cell: (props) => <TotalBorrowAPRCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
  },
}

export const TOTAL_ASSET_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'totalAsset',
  header: 'Total Supply',
  accessorFn: (row) => row.currentAllAssets,
  cell: (props) => <TotalAssetCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}

export const SUPPLY_APR_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'currentSupplyAPR',
  header: 'Lend APY',
  // accessorFn: (row) => JSBI.toNumber(row.currentSupplyAPR.quotient),
  cell: (props) => <SupplyAPRCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}

export const TOTAL_BORROW_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'totalBorrow',
  header: 'Borrowed',
  cell: (props) => <TotalBorrowCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}

export const TOTAL_BORROW_USD: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'totalBorrowUSD',
  header: 'Borrowed',
  cell: (props) => <TotalBorrowUSDCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}
export const TOTAL_SUPPY_USD: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'totalSupplyUSD',
  header: 'Supplied',
  cell: (props) => <TotalSupplyUSDCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}

export const AVAILABLE_FOR_BORROW_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'availableBorrow',
  header: 'Available For Borrow',
  cell: (props) => <AvailableForBorrowCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}

export const BORROW_APR_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'borrow',
  header: 'Borrow APR',
  // accessorFn: (row) => row.currentInterestPerYear,
  cell: (props) => <BorrowAPRCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}

export const REWARD_APR_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'reward',
  header: 'Reward APY',
  // accessorFn: (row) => row.currentInterestPerYear,
  cell: (props) => <BorrowAPRCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}

export const HEALTH_COLUMN: ColumnDef<KashiMediumRiskLendingPairV1, unknown> = {
  id: 'health',
  header: 'Health',
  cell: (props) => <HealthCell row={props.row.original} />,
  size: 40,
  meta: {
    skeleton: <Skeleton.Box className="bg-slate-700 w-full h-5" />,
    className: 'flex justify-end',
  },
}
