import {
  Badge,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { StellarCircle } from '@sushiswap/ui/icons/network/circle/StellarCircle'
import type { ColumnDef } from '@tanstack/react-table'
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'
import type { TopPool } from '~stellar/_common/lib/hooks/pool/use-top-pools'
import { CurrencyIcon } from '../currency/currency-icon'
import { CurrencyIconList } from '../currency/currency-icon-list'

export const NAME_COLUMN: ColumnDef<TopPool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => {
    return (
      <div className="flex items-center gap-5">
        <div className="flex min-w-[54px]">
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={<StellarCircle width={14} height={14} />}
          >
            <CurrencyIconList iconWidth={26} iconHeight={26}>
              <CurrencyIcon currency={props.row.original.token0} />
              <CurrencyIcon currency={props.row.original.token1} />
            </CurrencyIconList>
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 pr-2 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
            {props.row.original.name}
          </span>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                    {formatNumber(props.row.original.swapFee * 100)}%
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Swap fee</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {props.row.original.isIncentivized && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
                      🧑‍🌾{' '}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Farm rewards available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={30} />
            <SkeletonCircle radius={30} className="-ml-[10px]" />
          </div>
          <div className="flex flex-col w-full min-w-[120px]">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const TVL_COLUMN: ColumnDef<TopPool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.liquidityUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.liquidityUSD - rowB.liquidityUSD,
  cell: (props) =>
    formatUSD(props.row.original.liquidityUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.liquidityUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<TopPool, unknown> = {
  id: 'volumeUSD1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volumeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volumeUSD1d - rowB.volumeUSD1d,
  cell: (props) =>
    formatUSD(props.row.original.volumeUSD1d).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.volumeUSD1d),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const FEES_1D_COLUMN: ColumnDef<TopPool, unknown> = {
  id: 'feeUSD1d',
  header: 'Fees (24h)',
  accessorFn: (row) => row.feeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.feeUSD1d - rowB.feeUSD1d,
  cell: (props) =>
    formatUSD(props.row.original.feeUSD1d).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.feeUSD1d),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TRANSACTIONS_1D_COLUMN: ColumnDef<TopPool, unknown> = {
  id: 'txCount1d',
  header: 'Transactions (24h)',
  accessorFn: (row) => row.txCount1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.txCount1d - rowB.txCount1d,
  cell: (props) => props.row.original.txCount1d,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const APR_COLUMN: ColumnDef<TopPool, unknown> = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => row.totalApr1d,
  cell: (props) => formatPercent(props.row.original.totalApr1d),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
