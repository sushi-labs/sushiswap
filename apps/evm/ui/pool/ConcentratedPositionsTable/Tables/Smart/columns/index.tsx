import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'

import { SteerPosition } from '../useSteerPositions'
import { SteerNameCell } from './SteerNameCell'

export const STEER_NAME_COLUMN: ColumnDef<SteerPosition, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <SteerNameCell {...props.row} />,
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
