import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { PoolExtended } from 'lib/pool/use-pools-extended'
import { PoolAprCell } from '../shared-cells/pool-apr-cell'
import { PoolNameCell } from '../shared-cells/pool-name-cell'
import { PoolReserveCell } from '../shared-cells/pool-reserve-cell'
import { PoolTVLCell } from '../shared-cells/pool-tvl-cell'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NAME_COLUMN: ColumnDef<PoolExtended, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <SkeletonCircle radius={ICON_SIZE} />
          <SkeletonCircle radius={ICON_SIZE} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
}

export const RESERVE_COLUMN: ColumnDef<PoolExtended, unknown> = {
  id: 'reserves',
  header: 'Reserves',
  cell: (props) => <PoolReserveCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
}

export const APR_COLUMN: ColumnDef<PoolExtended, unknown> = {
  id: 'apr',
  header: 'APR',
  cell: (props) => <PoolAprCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
}

export const TVL_COLUMN: ColumnDef<PoolExtended, unknown> = {
  id: 'reserveUSD',
  header: 'TVL',
  accessorFn: (row) => row.reserveUSD,
  cell: (props) => <PoolTVLCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
}
