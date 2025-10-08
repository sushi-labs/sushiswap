import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { ICON_SIZE } from '~tron/_common/constants/icon-size'
import { PositionAprCell } from './position-apr-cell'
import { PositionNameCell } from './position-name-cell'
import { PositionSizeCell } from './position-size-cell'
import { PositionValueCell } from './position-value-cell'
import type { IPositionRowData } from './positions-table'

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
