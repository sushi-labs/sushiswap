import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { OrderStatus } from '@orbs-network/twap-sdk'
import {
  Chip,
  Currency,
  LinkExternal,
  SkeletonBox,
  SkeletonCircle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { DollarCircledIcon } from '@sushiswap/ui/icons/DollarCircled'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { TooltipDrawer } from 'src/app/(networks)/_ui/tooltip-drawer'
import { type TwapOrder, useParsedOrder } from 'src/lib/hooks/react-query/twap'
import type { ChainId } from 'sushi'
import { formatUSD, getChainById } from 'sushi'
import { formatPercent } from 'sushi'
import { formatNumber } from 'sushi'

export const DATE_COLUMN: ColumnDef<TwapOrder> = {
  id: 'date',
  header: 'Date',
  enableSorting: false,
  accessorFn: (row) => row.createdAt,
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {format(new Date(row.original.createdAt), 'dd/MM/yy h:mm aa')}
    </span>
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
}

export const BUY_COLUMN: ColumnDef<TwapOrder> = {
  id: 'buy',
  header: 'Buy',
  enableSorting: false,

  accessorFn: (row) => {
    const { buyTokenExpectedAmount } = useParsedOrder(row)
    return buyTokenExpectedAmount
  },
  cell: ({ row }) => {
    const { buyToken, buyTokenExpectedAmount } = useParsedOrder(row.original)
    if (!buyToken) return null
    return (
      <div className="flex items-center gap-2">
        <Currency.Icon currency={buyToken} width={18} height={18} />
        <span className="whitespace-nowrap">
          {formatNumber(buyTokenExpectedAmount)} {buyToken.symbol}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center gap-1">
          <SkeletonCircle radius={24} className="w-6 h-6" />
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
        </div>
      ),
    },
  },
}

export const SELL_COLUMN: ColumnDef<TwapOrder> = {
  id: 'sell',
  header: 'Sell',
  enableSorting: false,

  accessorFn: (row) => {
    const { sellTokenTotalAmount } = useParsedOrder(row)
    return sellTokenTotalAmount
  },
  cell: ({ row }) => {
    const { sellToken, sellTokenTotalAmount } = useParsedOrder(row.original)
    if (!sellToken) return null
    return (
      <div className="flex items-center gap-2">
        <Currency.Icon currency={sellToken} width={18} height={18} />
        <span className="whitespace-nowrap">
          {formatNumber(sellTokenTotalAmount)} {sellToken.symbol}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center gap-1">
          <SkeletonCircle radius={24} className="w-6 h-6" />
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
        </div>
      ),
    },
  },
}

export const CHAIN_COLUMN: ColumnDef<TwapOrder> = {
  id: 'chain',
  header: 'Chain',
  enableSorting: false,
  accessorFn: (row) => row.chainId,
  cell: ({ row }) => {
    const { chainInfo } = useParsedOrder(row.original)
    return (
      <div className="flex items-center gap-1 lg:gap-2">
        <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
          <NetworkIcon
            type="square"
            chainId={chainInfo.id}
            className="w-3 h-3 lg:w-5 lg:h-5"
          />
        </div>
        <span className="block text-xs lg:hidden">{chainInfo.name}</span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-5 h-5 rounded-sm" />,
    },
  },
}

export const VALUE_PNL_COLUMN: ColumnDef<TwapOrder> = {
  id: 'valueUsd',
  header: () => (
    <TooltipDrawer
      trigger={
        <span className="border-b border-dotted border-muted-foreground">
          Value / Est. PnL
        </span>
      }
      content={
        <p>
          Profit or loss calculated as the difference in USD value of the asset
          on the day it was bought and the day it was sold.
        </p>
      }
      dialogTitle="Value / Est. PnL"
    />
  ),
  enableSorting: false,

  accessorFn: (row) => {
    const { sellTokenTotalUsdValue } = useParsedOrder(row)
    return sellTokenTotalUsdValue
  },
  cell: ({ row }) => {
    const { sellTokenTotalUsdValue, profitAndLoss } = useParsedOrder(
      row.original,
    )
    return (
      <div className="flex items-center lg:items-start gap-1 lg:flex-col">
        {sellTokenTotalUsdValue ? (
          <>
            <span>{formatUSD(sellTokenTotalUsdValue)}</span>
            {profitAndLoss === null ? (
              <span className="text-xs text-muted-foreground">N/A</span>
            ) : (
              <span
                className={
                  profitAndLoss > 0
                    ? 'text-xs text-green-500'
                    : profitAndLoss < 0
                      ? 'text-xs text-red'
                      : 'text-xs text-muted-foreground'
                }
              >
                {profitAndLoss > 0 ? '+' : ''}
                {formatUSD(profitAndLoss)}
              </span>
            )}
          </>
        ) : (
          <span>N/A</span>
        )}
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
  },
}

export const getPriceUsdColumn = (
  showInUsd: boolean,
  setShowInUsd: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<TwapOrder> => ({
  id: 'priceUsd',
  enableSorting: false,
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation()
              setShowInUsd((prev) => !prev)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
            className="flex items-start gap-1 cursor-pointer select-none min-w-[100px]"
          >
            <span>Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current">
              <DollarCircledIcon className="w-3 h-3" />
              <span>{showInUsd ? 'USD' : 'Token'}</span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="dark:bg-black/10 bg-white/10 py-4 px-5 !text-slate-900 dark:!text-pink-100 text-xs"
        >
          <p>Toggle to view price in USD or token pair unit.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  accessorFn: (row) => {
    const { usdPerChunk } = useParsedOrder(row)
    return usdPerChunk
  },
  cell: ({ row }) => {
    const { sellToken, usdPerChunk, sellTokenAmountPerChunk } = useParsedOrder(
      row.original,
    )

    if (!usdPerChunk) {
      return <span>N/A</span>
    }

    return showInUsd ? (
      <span>{formatUSD(usdPerChunk)}</span>
    ) : (
      <span className="">{`${sellTokenAmountPerChunk.toFixed(4)} ${sellToken?.symbol}`}</span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
})

export const FILLED_COLUMN: ColumnDef<TwapOrder> = {
  id: 'filled',
  header: 'Filled',
  enableSorting: false,

  accessorFn: (row) => {
    const { filledPercentage } = useParsedOrder(row)
    return filledPercentage
  },
  cell: ({ row }) => {
    const {
      buyToken,
      buyTokenFilledAmount,
      filledPercentage,
      buyTokenExpectedAmount,
    } = useParsedOrder(row.original)

    if (!buyToken) return null

    return (
      <div className="flex items-center gap-2">
        <span>
          {formatNumber(buyTokenFilledAmount)} /{' '}
          {formatNumber(Number(buyTokenExpectedAmount))} {buyToken.symbol}
        </span>
        <Chip className="dark:!bg-slate-750 !bg-slate-200 !p-2 dark:text-slate-500 text-slate-450 !h-[20px]">
          {formatPercent(filledPercentage / 100)}
        </Chip>
      </div>
    )
  },
}

/** Status column */
export const STATUS_COLUMN: ColumnDef<TwapOrder> = {
  id: 'status',
  header: () => <span className="lg:text-right lg:block">Status</span>,
  enableSorting: false,
  accessorFn: (row) => row.status,
  cell: ({ row }) => {
    const color =
      row.original.status === OrderStatus.Completed
        ? 'text-green-500'
        : row.original.status === OrderStatus.Canceled
          ? 'text-orange-400'
          : 'text-muted-foreground'
    const chainId = row.original.chainId
    const txnHash = row.original.txHash as `0x${string}`
    return (
      <div className="w-full flex lg:justify-end">
        <LinkExternal
          href={getChainById(chainId as ChainId)?.getTransactionUrl(txnHash)}
          className={`${color} flex items-center gap-1 w-full justify-end text-[14px]`}
        >
          {`${row.original.status?.slice(0, 1).toUpperCase()}${row.original.status?.slice(1).toLowerCase()}`}
          <ArrowUpRightIcon className="w-[12px] h-[12px]" />
        </LinkExternal>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm ml-auto" />,
    },
  },
}
