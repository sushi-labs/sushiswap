import { Pool } from '@sushiswap/client'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistance, fromUnixTime } from 'date-fns'
import { BarPosition } from 'src/lib/bar'
import { Chain } from 'sushi/chain'
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

export const LAST_DISTRUBUTED_COLUMN: ColumnDef<BarPosition, unknown> = {
  id: 'lastDistributed',
  header: 'Last Distributed',
  accessorFn: (row) => row.lastDistributedTimestamp ?? '0',
  cell: (props) =>
    props.row.original.lastDistributedTimestamp ? (
      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div onClick={(e) => e.stopPropagation()}>
        <a
          href={Chain.from(props.row.original.chainId)?.getTxUrl(
            props.row.original.lastDistributedTx,
          )}
          rel="noreferrer noopener"
          target="_blank"
          className="underline decoration-dotted underline-offset-2"
        >
          {formatDistance(
            fromUnixTime(props.row.original.lastDistributedTimestamp),
            new Date(),
            { addSuffix: true },
          )}
        </a>
      </div>
    ) : (
      'n/a'
    ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
