import { OrderStatus } from '@orbs-network/twap-sdk'
import {
  Button,
  SkeletonBox,
  SkeletonCircle,
  TooltipContent,
} from '@sushiswap/ui'
import { TooltipTrigger } from '@sushiswap/ui'
import { Tooltip } from '@sushiswap/ui'
import { TooltipProvider } from '@sushiswap/ui'
import { DollarCircledIcon } from '@sushiswap/ui/icons/DollarCircled'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Currency } from 'node_modules/@sushiswap/ui/dist/components/currency'
import { type TwapOrder, useParsedOrder } from 'src/lib/hooks/react-query/twap'
import { fillDelayText } from 'src/lib/swap/twap'
import { formatNumber, formatUSD } from 'sushi/format'

export const ORDER_ID_COLUMN: ColumnDef<TwapOrder> = {
  id: 'orderId',
  header: 'Order ID',
  enableSorting: false,
  accessorFn: (row) => row.id,
  cell: ({ row }) => <div>{row.original.id}</div>,
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
}

export const FILLED_COLUMN: ColumnDef<TwapOrder> = {
  id: 'filled',
  header: 'Filled',
  enableSorting: false,
  accessorFn: (row) => {
    const { buyTokenFilledAmount } = useParsedOrder(row)

    return buyTokenFilledAmount
  },
  cell: ({ row }) => {
    const { buyToken, buyTokenFilledAmount } = useParsedOrder(row.original)
    if (!buyToken) return null
    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Currency.Icon currency={buyToken} width={24} height={24} />
        <span>
          {formatNumber(buyTokenFilledAmount)} {buyToken.symbol}
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

export const SIZE_COLUMN: ColumnDef<TwapOrder> = {
  id: 'size',
  header: 'Size',
  enableSorting: false,
  accessorFn: (row) => {
    const { sellTokenTotalAmount } = useParsedOrder(row)
    return sellTokenTotalAmount
  },
  cell: ({ row }) => {
    const { sellToken, sellTokenTotalAmount } = useParsedOrder(row.original)
    if (!sellToken) return null
    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Currency.Icon currency={sellToken} width={24} height={24} />
        <span>
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
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-5 h-5 rounded-sm" />,
    },
  },
}

export const VALUE_COLUMN: ColumnDef<TwapOrder> = {
  id: 'valueUsd',
  header: 'Value',
  enableSorting: false,
  accessorFn: (row) => {
    const { sellTokenTotalUsdValue } = useParsedOrder(row)

    return sellTokenTotalUsdValue
  },
  cell: ({ row }) => {
    const { sellTokenTotalUsdValue } = useParsedOrder(row.original)
    return <span>{formatUSD(sellTokenTotalUsdValue)}</span>
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
}

export const getAvgPriceColumn = (
  showInUsd: boolean,
  setShowInUsd: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<TwapOrder> => ({
  id: 'avgPriceUsd',
  enableSorting: false,
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-1 cursor-pointer select-none min-w-[110px]"
            onClick={(e) => {
              e.stopPropagation()
              setShowInUsd((prev) => !prev)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
          >
            <span>Avg. Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current pb-[1px]">
              <DollarCircledIcon />
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
    const { avgBuyTokenAmountPerChunk, avgBuyTokenUsdPerChunk, buyToken } =
      useParsedOrder(row.original)

    return showInUsd ? (
      <span>
        {!avgBuyTokenUsdPerChunk ? 'N/A' : formatUSD(avgBuyTokenUsdPerChunk)}
      </span>
    ) : (
      <span className="whitespace-nowrap">
        {!avgBuyTokenAmountPerChunk
          ? 'N/A'
          : `${formatNumber(avgBuyTokenAmountPerChunk)} ${buyToken?.symbol}`}
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
})

export const ORDERS_COLUMN: ColumnDef<TwapOrder> = {
  id: 'orders',
  header: 'Orders',
  enableSorting: false,
  accessorFn: (row) => {
    const { chunksCountTotal } = useParsedOrder(row)

    return chunksCountTotal
  },
  cell: ({ row }) => {
    const { chunksCountTotal, fillIntervalMs } = useParsedOrder(row.original)

    return (
      <div className="flex flex-col">
        <span className="whitespace-nowrap">{chunksCountTotal} Orders</span>
        <span className="text-xs dark:text-slate-500 text-slate-450 whitespace-nowrap">
          Every {fillDelayText(fillIntervalMs)}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex flex-col gap-1">
          <SkeletonBox className="w-[50px] h-4 rounded-sm" />
          <SkeletonBox className="w-[65px] h-3 rounded-sm" />
        </div>
      ),
    },
  },
}

export const STATUS_COLUMN: ColumnDef<TwapOrder> = {
  id: 'status',
  header: () => <div className="text-right">Status</div>,
  enableSorting: false,
  accessorFn: (row) => row?.status,
  cell: ({ row }) => {
    const { fullyFilledAtTimestamp, status, deadlineTimestamp } =
      useParsedOrder(row.original)
    const date =
      status === OrderStatus.Completed
        ? fullyFilledAtTimestamp
        : deadlineTimestamp
    return (
      <div className="flex flex-col">
        <span className="whitespace-nowrap">
          <span className="capitalize">{status?.toLocaleLowerCase()} On</span>
        </span>
        {date && (
          <span className="text-xs dark:text-slate-500 text-slate-450 whitespace-nowrap">
            {format(new Date(date), 'dd/MM/yy h:mm a')}
          </span>
        )}
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex flex-col gap-1 items-end">
          <SkeletonBox className="w-[50px] h-4 rounded-sm" />
          <SkeletonBox className="w-[65px] h-3 rounded-sm" />
        </div>
      ),
    },
  },
}

export const ACTION_COLUMN: ColumnDef<TwapOrder> = {
  id: 'action',
  header: 'Action',
  enableSorting: false,
  accessorFn: (row) => row.id,
  cell: () => (
    <Button className="w-full md:hidden" variant="tradePrimary">
      View Orders
    </Button>
  ),
}

export function makeActionColumn(
  onView: (id: number) => void,
): ColumnDef<TwapOrder> {
  return {
    id: 'action',
    header: 'Action',
    enableSorting: false,
    cell: ({ row }) => (
      <Button
        className="w-full"
        variant="tradePrimary"
        onClick={(e) => {
          e.stopPropagation()
          onView(row.original.id)
        }}
      >
        View Orders
      </Button>
    ),
  }
}
