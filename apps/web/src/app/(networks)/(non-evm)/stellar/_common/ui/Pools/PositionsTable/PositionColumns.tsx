import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { ICON_SIZE } from '~stellar/_common/constants/icon-size'
import { PositionAprCell } from './PositionAprCell'
import { PositionCollectFeesCell } from './PositionCollectFeesCell'
import { PositionCollectableFeesCell } from './PositionCollectableFeesCell'
import { PositionNameCell } from './PositionNameCell'
import { PositionPriceRangeCell } from './PositionPriceRangeCell'
import { PositionSizeCell } from './PositionSizeCell'
import { PositionValueCell } from './PositionValueCell'
import type { IPositionRowData } from './PositionsTable'

export const POSITION_NAME_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PositionNameCell data={props.row.original} />,
  meta: {
    body: {
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
  },
}

export const PRICE_RANGE_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'price-range',
  header: 'Price Range',
  cell: (props) => <PositionPriceRangeCell data={props.row.original} />,
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

export const VALUE_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'value',
  header: 'Value',
  cell: (props) => <PositionValueCell data={props.row.original} />,
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

export const SIZE_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'size',
  header: 'Size',
  cell: (props) => <PositionSizeCell data={props.row.original} />,
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
export const APR_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'apr',
  header: 'APR',
  cell: (props) => <PositionAprCell data={props.row.original} />,
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

export const COLLECTABLE_FEES_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'collectable-fees',
  header: 'Collectable Fees',
  cell: (props) => <PositionCollectableFeesCell data={props.row.original} />,
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

export const COLLECT_FEES_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'collect-fees',
  header: 'Collect Fees',
  cell: (props) => <PositionCollectFeesCell data={props.row.original} />,
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
    disableLink: true,
  },
}
