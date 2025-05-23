import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { PoolExtendedWithAprVolume } from '~aptos/pool/lib/use-user-position-pools'
import { PoolMyPositionAprCell } from './cells/position-apr-cell'
import { PositionNameCell } from './cells/position-name-cell'
import { PoolMyPositionTVLCell } from './cells/position-tvl-cell'

export const NAME_COLUMN: ColumnDef<PoolExtendedWithAprVolume, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PositionNameCell row={props.row.original} />,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
            <SkeletonCircle radius={26} className="-ml-[12px]" />
          </div>
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const TVL_COLUMN: ColumnDef<PoolExtendedWithAprVolume, unknown> = {
  id: 'reserveUSD',
  header: 'Value',
  accessorFn: (row) => row.reserveUSD,
  cell: (props) => (
    <PoolMyPositionTVLCell isSize={false} row={props.row.original} />
  ),
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const MYPOSITION_TVL_COLUMN: ColumnDef<
  PoolExtendedWithAprVolume,
  unknown
> = {
  id: 'Size',
  header: 'Size',
  cell: (props) => (
    <PoolMyPositionTVLCell isSize={true} row={props.row.original} />
  ),
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const MYPOSITION_APR_COLUMN: ColumnDef<
  PoolExtendedWithAprVolume,
  unknown
> = {
  id: 'APR',
  header: 'APR',
  cell: (props) => <PoolMyPositionAprCell row={props.row.original} />,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}
