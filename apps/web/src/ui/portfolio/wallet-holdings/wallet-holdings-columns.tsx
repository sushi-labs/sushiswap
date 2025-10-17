import { useIsSmScreen } from '@sushiswap/hooks'
import {
  Currency,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import type { PortfolioV2Row } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio'
import {
  formatNumber,
  formatPercent,
  formatUSD,
  withoutScientificNotation,
} from 'sushi'
import { type EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { ethAddress, formatUnits } from 'viem'
import { SparklineCell } from '~evm/[chainId]/explore/tokens/_ui/sparkline-cell'
import { ActionButtons } from '../assets-chart/action-buttons'

export const CHAIN_COLUMN: ColumnDef<PortfolioV2Row> = {
  id: 'chain',
  header: () => (
    <span className="text-slate-450 dark:text-slate-500">Chain</span>
  ),
  enableSorting: false,
  accessorFn: (row) => row,
  cell: ({ row }) => (
    <div className="flex gap-1 md:gap-2">
      <div className="flex items-center -space-x-2  min-w-[50px] px-2">
        {row.original.chainIds.slice(0, 3).map((chainId, i) => (
          <div
            key={chainId}
            className={`relative ${i !== 0 ? '-ml-[6px]' : ''}`}
            style={{ zIndex: 3 + i }}
          >
            <NetworkIcon
              type="square"
              chainId={chainId}
              className="w-5 h-5 rounded-md border border-slate-900 dark:border-slate-800"
            />
          </div>
        ))}

        {row.original.chainIds.length > 3 && (
          <span className="ml-1 text-xs text-slate-500 pl-3">
            +{row.original.chainIds.length - 3}
          </span>
        )}
      </div>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-5 h-5 rounded-sm" />,
    },
    header: {
      className: 'mt-[21.625px] mb-2',
    },
  },
}

export const createAssetsColumn = (
  totalPercentage?: number,
  isLoading?: boolean,
): ColumnDef<PortfolioV2Row> => ({
  id: 'assets',
  header: () => {
    return (
      <div className="flex gap-1 items-center">
        <span className="text-slate-450 dark:text-slate-500">Assets</span>
        {isLoading ? (
          <SkeletonBox className="w-14 h-6 rounded-lg" />
        ) : totalPercentage ? (
          <div className="px-2 py-1 text-xs rounded-lg bg-slate-200 dark:bg-slate-750 text-slate-450 dark:text-slate-500">
            {formatPercent(totalPercentage)}
          </div>
        ) : null}
      </div>
    )
  },
  enableSorting: false,
  accessorFn: (row) => row,
  cell: ({ row }) => {
    const { token } = row.original
    const tokenAddress = token.address as `0x${string}`
    const isNative = tokenAddress === ethAddress
    const currency = isNative
      ? new EvmNative({ ...token, chainId: token.chainId as EvmChainId })
      : new EvmToken({
          ...token,
          address: token.address as `0x${string}`,
          chainId: token.chainId as EvmChainId,
        })

    return (
      <div className="flex items-center gap-1 md:gap-2 min-w-[130px]">
        <Currency.Icon disableLink currency={currency} width={24} height={24} />
        <span className="flex gap-1 items-center whitespace-nowrap text-slate-900 dark:text-slate-200">
          {row.original.token.symbol}
          <div className="px-2 py-1 text-xs rounded-lg bg-slate-200 dark:bg-slate-750 text-slate-450 dark:text-slate-500">
            {formatPercent(row.original.percentageOfPortfolio)}
          </div>
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-1 items-center">
          <SkeletonCircle radius={24} className="w-6 h-6" />
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
        </div>
      ),
    },
    header: { className: 'mt-[21.625px] mb-2' },
  },
})

export const PRICE_COLUMN: ColumnDef<PortfolioV2Row> = {
  id: 'price',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      Price
    </span>
  ),
  accessorFn: (row) => row,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.priceUSD - rowB.priceUSD,
  cell: (props) => {
    return formatUSD(props.row.original.priceUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.priceUSD)
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-[21.625px] mb-2',
    },
  },
}

export const AMOUNT_COLUMN: ColumnDef<PortfolioV2Row> = {
  id: 'amount',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      Amount
    </span>
  ),
  accessorFn: (row) => row,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    +rowA.amount - +rowB.amount,
  cell: ({ row }) => {
    const { token, amount } = row.original

    const _amount = formatUnits(
      BigInt(withoutScientificNotation(amount) || '0'),
      token.decimals,
    )
    return (
      <div className="flex items-center gap-1 md:gap-2 min-w-[130px]">
        <span className="whitespace-nowrap">
          {formatNumber(_amount.toString())} {row.original.token.symbol}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-1 items-center">
          <SkeletonCircle radius={24} className="w-6 h-6" />
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
        </div>
      ),
    },
    header: {
      className: 'mt-[21.625px] mb-2',
    },
  },
}

export const VALUE_COLUMN: ColumnDef<PortfolioV2Row> = {
  id: 'value',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      Value
    </span>
  ),
  accessorFn: (row) => row,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.amountUSD - rowB.amountUSD,
  cell: (props) =>
    formatUSD(props.row.original.amountUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.amountUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-[21.75px] mb-2',
    },
  },
}

export const UPNL_COLUMN: ColumnDef<PortfolioV2Row> = {
  id: 'uPnL',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      uPnL
    </span>
  ),
  accessorFn: (row) => row.uPnL,
  sortingFn: ({ original: a }, { original: b }) =>
    Number(a.uPnL) - Number(b.uPnL),
  cell: ({ row }) => {
    return (
      <div className="flex gap-1 items-center font-medium md:items-start md:flex-col">
        <span
          className={
            row.original.uPnL > 0
              ? 'text-green-500'
              : row.original.uPnL < 0
                ? 'text-red'
                : 'text-muted-foreground'
          }
        >
          {row.original.uPnL > 0 ? '+' : row.original.uPnL < 0 ? '-' : ''}
          {formatUSD(row.original.uPnL).replace(/[+-]/g, '')}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex flex-col gap-1">
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
          <SkeletonBox className="w-[50px] h-3 rounded-sm" />
        </div>
      ),
    },
    header: {
      className: 'mt-[21.625px] mb-2',
    },
  },
}

export const createLast30DaysColumn = (
  isLoading?: boolean,
): ColumnDef<PortfolioV2Row> => ({
  id: 'last30Days',
  header: () => (
    <span className="text-slate-450 dark:text-slate-500">Last 30 Days</span>
  ),
  enableSorting: false,
  accessorFn: (row) => row.last30Days,
  cell: ({ row, table }) => {
    if (isLoading) {
      return <SkeletonBox className="w-[212px] h-[40px]" />
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const isSmallScreen = useIsSmScreen()

    const isHovered = table.options.meta?.getIsRowHovered?.(row.id) ?? false
    const { last30Days } = row.original

    if (!last30Days) return null

    const yData = last30Days.map((p) => p.price)

    const token =
      row.original.token.address === ethAddress
        ? new EvmNative({
            ...row.original.token,
            chainId: row.original.token.chainId as EvmChainId,
          })
        : new EvmToken({
            ...row.original.token,
            address: row.original.token.address as `0x${string}`,
            chainId: row.original.token.chainId as EvmChainId,
          })

    return (isHovered || isModalOpen) && !isSmallScreen ? (
      <ActionButtons
        token={token}
        renderSendWidget={false}
        buttonClassName="!w-[92px]"
        className="!flex !flex-row"
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
      />
    ) : (
      <div className="!w-[292px] flex justify-center">
        <SparklineCell
          data={yData.length > 0 ? yData : [0.5, 0.5]}
          width={212}
          height={40}
        />
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <div className="w-[212px] h-[40px]" />,
    },
    header: {
      className: 'mt-[21.625px] mb-2',
    },
  },
})
