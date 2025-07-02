import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { OrderStatus } from '@orbs-network/twap-sdk'
import {
  Chip,
  Currency,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { DollarCircledIcon } from '@sushiswap/ui/icons/DollarCircled'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type TwapOrder, useParsedOrder } from 'src/lib/hooks/react-query/twap'
import { TooltipDrawer } from 'src/ui/common/tooltip-drawer'
import { formatUSD } from 'sushi/format'
import { formatPercent } from 'sushi/format'
import { formatNumber } from 'sushi/format'

export const DATE_COLUMN: ColumnDef<TwapOrder> = {
  id: 'date',
  header: 'Date',
  enableSorting: false,
  accessorFn: (row) => row.createdAt,
  cell: ({ row }) => (
    <span className="">
      {format(new Date(row.original.createdAt), 'dd/MM/yy HH:mm')}
    </span>
  ),
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
        <span>
          {formatNumber(buyTokenExpectedAmount)} {buyToken.symbol}
        </span>
      </div>
    )
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
        <span>
          {formatNumber(sellTokenTotalAmount)} {sellToken.symbol}
        </span>
      </div>
    )
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
      <div className="flex items-center gap-1 md:gap-2">
        <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
          <NetworkIcon
            type="square"
            chainId={chainInfo.id}
            className="w-3 h-3 md:w-5 md:h-5"
          />
        </div>
        <span className="block text-xs md:hidden">{chainInfo.name}</span>
      </div>
    )
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
      <div className="flex items-start gap-1 md:flex-col ">
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
      <span className="">{`${sellTokenAmountPerChunk.toFixed(4)} ${
        sellToken?.symbol
      }`}</span>
    )
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
  header: () => <span className="md:text-right md:block">Status</span>,
  enableSorting: false,
  accessorFn: (row) => row.status,
  cell: ({ row }) => {
    const color =
      row.original.status === OrderStatus.Completed
        ? 'text-green-500'
        : row.original.status === OrderStatus.Canceled
          ? 'text-orange-400'
          : 'text-muted-foreground'
    return (
      <span
        className={`${color} flex items-center gap-1 w-full justify-end text-[14px]`}
      >
        {row.original.status}
        {/* <ArrowUpRightIcon className="w-[12px] h-[12px]" /> */}
      </span>
    )
  },
}
