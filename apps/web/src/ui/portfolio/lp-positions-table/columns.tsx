import { Currency, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { formatUSD } from 'sushi'
import { formatNumber, formatPercent } from 'sushi/format'
import { PriceRangeCell } from './price-range-cell'

export const POSITION_SIZE_COLUMN: ColumnDef<
  any, //@todo - get from api when it's made
  unknown
> = {
  id: 'positionSize',
  accessorFn: (row) => +row?.position?.positionUSD,
  header: 'Position Size',
  cell: (props) => {
    return (
      <div className="flex flex-col">
        <div className="font-medium">
          {formatUSD(props?.row?.original?.position?.positionUSD)}
        </div>
        <div className="text-xs font-normal uppercase whitespace-nowrap text-muted-foreground dark:text-pink-200">
          {formatNumber(props?.row?.original?.position?.token0Size)}{' '}
          {props?.row?.original?.name?.split(' / ')[0]} +{' '}
          {formatNumber(props?.row?.original?.position?.token1Size)}{' '}
          {props?.row?.original?.name?.split(' / ')[1]}
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const POSITION_UNCOLLECTED_COLUMN: ColumnDef<
  any, //@todo - get from api when it's made
  unknown
> = {
  id: 'uncollected',
  accessorFn: (row) => +row.position.unclaimedUSD,
  header: 'Uncollected fees',
  cell: (props) => {
    // formatUSD(props.row.original.position.unclaimedUSD)
    if (props.row.original.protocol === 'SUSHISWAP_V2') {
      return (
        <div className="text-sm font-normal text-muted-foreground dark:text-pink-200">
          Auto Collected
        </div>
      )
    }
    return (
      <div className="flex flex-col">
        <div className="font-medium">
          {formatUSD(props?.row?.original?.position?.unclaimedUSD)}
        </div>
        <div className="text-xs font-normal uppercase whitespace-nowrap text-muted-foreground dark:text-pink-200">
          {formatNumber(props?.row?.original?.position?.unclaimedToken0)}{' '}
          {props?.row?.original?.name?.split(' / ')[0]} +{' '}
          {formatNumber(props?.row?.original?.position?.unclaimedToken1)}{' '}
          {props?.row?.original?.name?.split(' / ')[1]}
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const REWARDS_COLUMN: ColumnDef<
  any, //@todo - get from api when it's made
  unknown
> = {
  id: 'totalRewardsUSD',
  header: 'Rewards',
  accessorFn: (row) => row.totalRewardsUSD,
  cell: (props) => {
    if (props.row.original.totalRewardsUSD === 0) {
      return (
        <div className="text-sm font-normal text-muted-foreground dark:text-pink-200">
          -
        </div>
      )
    }

    return (
      <div className="flex flex-col">
        <div className="font-medium">
          {formatUSD(props?.row?.original?.totalRewardsUSD)}
        </div>
        <div className="flex gap-1 items-center text-xs font-normal uppercase whitespace-nowrap text-muted-foreground dark:text-pink-200">
          {formatNumber(props?.row?.original?.rewards[0]?.amount)}{' '}
          {props?.row?.original?.rewards[0]?.token?.symbol}
          <Currency.Icon
            currency={props?.row?.original?.rewards[0]?.token}
            width={16}
            height={16}
            className="rounded-full"
          />
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const APR_COLUMN: ColumnDef<
  any, //@todo - get from api when it's made,
  unknown
> = {
  id: 'apr',
  header: () => <span className="font-[600] px-2">APR</span>,
  accessorFn: (row) => row.apr,
  cell: (props) => {
    return (
      <span className="flex items-center justify-start w-[130px]">
        {formatPercent(props.row.original.apr / 100)}
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
      className: 'bg-skyblue/[8%] h-full dark:bg-blue/[8%]',
    },
    header: {
      className: 'h-[40px] mt-4 flex items-center justify-start',
    },
    tableHead: {
      className: 'bg-skyblue/[8%] dark:bg-blue/[8%]',
    },
  },
}

export const PRICE_RANGE_COLUMN: ColumnDef<
  any, //@todo - get from api when it's made
  unknown
> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => {
    const isHovered =
      props.table.options.meta?.getIsRowHovered(props.row.id) ?? false
    return (
      <span className="flex w-[230px]">
        <PriceRangeCell data={props.row.original} isHovered={isHovered} />
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}
