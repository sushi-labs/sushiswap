import { SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { formatPercent, formatUSD } from 'sushi'
import {
  type MaybeNestedPool,
  type PoolBase,
  type PoolIfIncentivized,
  type PoolWithAprs,
  type PoolWithIncentives,
  type SushiPositionStaked,
  type SushiPositionWithPool,
  unnestPool,
} from 'sushi/evm'
import { APRHoverCard } from '~evm/[chainId]/_ui/APRHoverCard'
import { PoolNameCell } from './PoolNameCell'

export const VALUE_COLUMN = {
  id: 'value',
  header: 'Value',
  accessorFn: (row) =>
    (Number(row.unstakedBalance + row.stakedBalance) /
      Number(row.pool.liquidity)) *
    Number(row.pool.liquidityUSD),
  cell: ({ row: { original } }) => (
    <span>
      {formatUSD(
        (Number(original.unstakedBalance + original.stakedBalance) /
          Number(original.pool.liquidity)) *
          Number(original.pool.liquidityUSD),
      )}
    </span>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
} as const satisfies ColumnDef<
  SushiPositionWithPool<PoolBase, SushiPositionStaked>,
  unknown
>

export const APR_COLUMN = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => unnestPool(row).totalApr1d,
  cell: (props) => (
    <APRHoverCard pool={unnestPool(props.row.original)}>
      <span
        className={classNames('underline decoration-dotted underline-offset-2')}
      >
        {formatPercent(unnestPool(props.row.original).totalApr1d)}
      </span>
    </APRHoverCard>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
} as const satisfies ColumnDef<
  MaybeNestedPool<PoolWithIncentives<PoolWithAprs>>,
  unknown
>

export const NAME_COLUMN_POOL: ColumnDef<
  MaybeNestedPool<PoolIfIncentivized<PoolBase, true>>,
  unknown
> = {
  id: 'name',
  header: 'Name',

  cell: (props) => <PoolNameCell pool={unnestPool(props.row.original)} />,
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
  size: 300,
}
