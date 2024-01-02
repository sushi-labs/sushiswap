import { Pool } from '@sushiswap/client'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { BarPosition } from 'src/lib/bar/useBarPositionsInfinite'
import { formatUSD } from 'sushi/format'
import { PoolNameCellPool } from '../pool/PoolNameCell'

export const NAME_COLUMN_POOL: ColumnDef<BarPosition, unknown> = {
  id: 'name',
  header: 'Pool Name',
  cell: (props) => (
    <PoolNameCellPool pool={props.row.original as any as Pool} />
  ),
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

export const FEES_COLUMN: ColumnDef<BarPosition, unknown> = {
  id: 'fees',
  header: 'Fees Accrued',
  accessorFn: (row) => row.balanceUSD,
  cell: (props) =>
    formatUSD(props.row.original.balanceUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.balanceUSD),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
