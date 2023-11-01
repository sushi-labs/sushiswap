import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { formatNumber } from 'sushi/format'

import { SteerPosition } from '../useSteerPositions'
import { SteerStrategyCell } from './SteerStrategyCell'
import { PoolNameCellPool } from '../../../../PoolNameCell'

export const STEER_NAME_COLUMN: ColumnDef<SteerPosition, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCellPool pool={props.row.original.vault.pool} />,
  meta: {
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
  size: 300,
}

export const STEER_STRATEGY_COLUMN: ColumnDef<SteerPosition, unknown> = {
  id: 'strategy',
  header: 'Strategy',
  cell: (props) => <SteerStrategyCell vault={props.row.original.vault} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <SkeletonText fontSize="lg" />
      </div>
    ),
  },
  size: 300,
}

export const STEER_POSITION_SIZE_COLUMN: ColumnDef<SteerPosition, unknown> = {
  id: 'positionSize',
  header: 'Position Size',
  accessorFn: (row) => row.totalAmountUSD ?? 0,
  cell: (props) => `$${formatNumber(props.row.original.totalAmountUSD)}`,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
