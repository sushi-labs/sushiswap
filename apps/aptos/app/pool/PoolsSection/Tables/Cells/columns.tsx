import { ColumnDef } from '@tanstack/react-table'
import { Pool } from 'utils/usePools'
import { PoolNameCell } from '../SharedCells/PoolNameCell'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original} />,
  size: 280,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <Skeleton.Circle radius={ICON_SIZE} />
          <Skeleton.Circle radius={ICON_SIZE} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <Skeleton.Text fontSize="text-lg" />
        </div>
      </div>
    ),
  },
}
