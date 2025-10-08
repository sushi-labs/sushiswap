import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Chip,
  Currency,
  Loader,
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
import type { TwapSupportedChainId } from 'src/config'
import { type TwapOrder, useParsedOrder } from 'src/lib/hooks/react-query/twap'
import { useCancelOrder } from 'src/lib/hooks/react-query/twap/useCancelOrder'
import { fillDelayText } from 'src/lib/swap/twap'
import { formatUSD } from 'sushi'
import { formatPercent } from 'sushi'
import { formatNumber } from 'sushi'

export const FILLED_COLUMN: ColumnDef<TwapOrder> = {
  id: 'filled',
  header: 'Filled',
  enableSorting: false,
  accessorFn: (row) => {
    const { filledPercentage } = useParsedOrder(row)
    return filledPercentage
  },
  cell: ({ row }) => {
    const { buyToken, buyTokenFilledAmount } = useParsedOrder(row.original)
    if (!buyToken) return null
    return (
      <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap min-w-[130px]">
        <Currency.Icon disableLink currency={buyToken} width={24} height={24} />{' '}
        <span className="whitespace-nowrap">
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
    const { sellToken, sellTokenTotalAmount, sellTokenTotalUsdValue } =
      useParsedOrder(row.original)
    if (!sellToken) return null
    return (
      <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
        <Currency.Icon
          disableLink
          currency={sellToken}
          width={24}
          height={24}
        />{' '}
        <div className="flex flex-col">
          <span>
            {formatNumber(sellTokenTotalAmount)} {sellToken.symbol}
          </span>
          <span className="hidden text-xs font-normal dark:text-slate-500 text-slate-450 md:block">
            {formatUSD(sellTokenTotalUsdValue)}
          </span>
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center gap-1">
          <SkeletonCircle radius={24} className="w-6 h-6" />
          <div className="flex flex-col gap-1">
            <SkeletonBox className="w-[60px] h-4 rounded-sm" />
            <SkeletonBox className="w-[40px] h-3 rounded-sm" />
          </div>
        </div>
      ),
    },
  },
}

export const SPENT_COLUMN: ColumnDef<TwapOrder> = {
  id: 'spent',
  header: 'Spent',
  enableSorting: false,
  accessorFn: (row) => {
    const { sellTokenFilledUsdValue } = useParsedOrder(row)
    return sellTokenFilledUsdValue
  },
  cell: ({ row }) => {
    const {
      sellTokenFilledAmount,
      sellToken,
      chunksCountTotal,
      filledPercentage,
      remainingChunkCount,
    } = useParsedOrder(row.original)

    if (!sellToken) return null
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="whitespace-nowrap">
            {formatNumber(sellTokenFilledAmount)} {sellToken.symbol}
          </span>
          <Chip className="dark:!bg-slate-750 !bg-slate-200 !p-2 dark:text-slate-500 text-slate-450 !h-[20px]">
            {formatPercent(filledPercentage / 100)}
          </Chip>
        </div>
        <span className="text-xs font-normal dark:text-slate-500 text-slate-450">
          {remainingChunkCount}/{chunksCountTotal} Order Remaining
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

export const getAvgPriceColumn = (
  showInUsd: boolean,
  setShowInUsd: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<TwapOrder> => ({
  id: 'avgPriceUsd',
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-1 cursor-pointer select-none w-[100px]"
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
  enableSorting: false,
  accessorFn: (row) => {
    const { avgBuyTokenUsdPerChunk, avgBuyTokenAmountPerChunk } =
      useParsedOrder(row)
    return showInUsd ? avgBuyTokenUsdPerChunk : avgBuyTokenAmountPerChunk
  },
  cell: ({ row }) => {
    const {
      buyToken,
      createdAtTimestamp,
      sellTokenAmountPerChunk,
      fillIntervalMs,
      orderDurationFormatted,
      avgBuyTokenAmountPerChunk,
      avgBuyTokenUsdPerChunk,
      sellToken,
    } = useParsedOrder(row.original)

    if (!buyToken || !sellToken) return null
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {showInUsd ? (
              <span>
                {!avgBuyTokenUsdPerChunk
                  ? 'N/A'
                  : formatUSD(avgBuyTokenUsdPerChunk)}
              </span>
            ) : (
              <span className="whitespace-nowrap">{`${formatNumber(avgBuyTokenAmountPerChunk)} ${
                buyToken.symbol
              }`}</span>
            )}
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="dark:bg-black/10 bg-white/10 py-4 px-5 grid grid-cols-2 w-[270px] text-xs gap-2"
          >
            <div className="grid w-full grid-cols-2 col-span-2 gap-2">
              <div className="font-medium text-black dark:text-pink-100">
                Created
              </div>
              <div className="text-slate-700 dark:text-pink-200">
                {format(new Date(createdAtTimestamp), 'dd/MM/yy h:mm a')}
              </div>
            </div>
            <div className="grid w-full grid-cols-2 col-span-2 gap-2">
              <div className="font-medium text-black dark:text-pink-100">
                Frequency
              </div>
              <div className="text-slate-700 dark:text-pink-200">
                Every {fillDelayText(fillIntervalMs)}
              </div>
            </div>
            <div className="grid w-full grid-cols-2 col-span-2 gap-2">
              <div className="font-medium text-black dark:text-pink-100">
                Duration
              </div>
              <div className="text-slate-700 dark:text-pink-200">
                {orderDurationFormatted}
              </div>
            </div>
            <div className="grid w-full grid-cols-2 col-span-2 gap-2">
              <div className="font-medium text-black dark:text-pink-100">
                Each Order Size
              </div>
              <div className="text-slate-700 dark:text-pink-200">
                {formatNumber(sellTokenAmountPerChunk)} {sellToken.symbol}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-5 h-5 rounded-sm" />,
    },
  },
})

export const EXPIRES_COLUMN: ColumnDef<TwapOrder> = {
  id: 'expires',
  header: 'Expires',
  enableSorting: false,
  accessorFn: (row) => {
    const { deadlineTimestamp } = useParsedOrder(row)
    return deadlineTimestamp
  },
  cell: ({ row }) => {
    const { deadlineTimestamp } = useParsedOrder(row.original)

    const formattedDate = format(new Date(deadlineTimestamp), 'dd/MM/yy h:mm a')
    return <span className="whitespace-nowrap">{formattedDate}</span>
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[70px] h-4 rounded-sm" />,
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

export const ACTION_COLUMN: ColumnDef<TwapOrder> = {
  id: 'action',
  header: () => <span className="hidden md:text-right md:block">Action</span>,
  enableSorting: false,
  accessorFn: (row) => row.id,
  cell: (row) => {
    const { write, isWritePending } = useCancelOrder(
      row.row.original.chainId as TwapSupportedChainId,
      row.row.original,
    )

    return (
      <div className="flex items-center justify-end">
        {isWritePending ? (
          <Loader size={18} />
        ) : (
          <XMarkIcon
            className="hidden w-4 h-4 ml-auto cursor-pointer text-red md:block"
            aria-label="Cancel order"
            onClick={(e) => {
              e.stopPropagation()
              write?.()
            }}
          />
        )}
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-5 h-5 rounded-sm ml-auto" />,
    },
  },
}
