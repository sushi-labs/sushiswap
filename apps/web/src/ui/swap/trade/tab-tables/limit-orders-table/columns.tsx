import { XMarkIcon } from '@heroicons/react/24/solid'
import {
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
import {
  type TwapOrder,
  useCancelOrder,
  useParsedOrder,
} from 'src/lib/hooks/react-query/twap'
import { TooltipDrawer } from 'src/ui/common/tooltip-drawer'
import { formatNumber, formatUSD } from 'sushi'

export const BUY_COLUMN: ColumnDef<TwapOrder> = {
  id: 'buy',
  header: 'Buy',
  accessorFn: (row) => row,
  enableSorting: false,
  cell: ({ row }) => {
    const { buyToken, buyTokenExpectedAmount } = useParsedOrder(row.original)
    if (!buyToken) return null
    return (
      <div className="flex items-center gap-1 md:gap-2 min-w-[130px]">
        <Currency.Icon disableLink currency={buyToken} width={24} height={24} />{' '}
        <span className="whitespace-nowrap">
          {formatNumber(buyTokenExpectedAmount)} ${buyToken.symbol}
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
  accessorFn: (row) => row,
  enableSorting: false,
  cell: ({ row }) => {
    const { sellToken, sellTokenTotalAmount } = useParsedOrder(row.original)
    if (!sellToken) return null
    return (
      <div className="flex items-center gap-1 md:gap-2">
        <Currency.Icon
          disableLink
          currency={sellToken}
          width={24}
          height={24}
        />
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

export const VALUE_PNL_COLUMN: ColumnDef<TwapOrder> = {
  id: 'valueUsd',
  header: () => {
    return (
      <TooltipDrawer
        trigger={
          <span className="border-b border-dotted border-muted-foreground">
            Value / Est. PnL
          </span>
        }
        content={
          <p>
            Profit or loss calculated as the difference in USD value of the
            asset on the day it was bought and the day it was sold.
          </p>
        }
        dialogTitle="Estimated PnL"
      />
    )
  },
  enableSorting: false,
  accessorFn: (row) => row.tradeDollarValueIn,
  sortingFn: ({ original: a }, { original: b }) =>
    Number(a.tradeDollarValueIn) - Number(b.tradeDollarValueIn),
  cell: ({ row }) => {
    const { profitAndLoss, sellTokenTotalUsdValue } = useParsedOrder(
      row.original,
    )

    return (
      <div className="flex items-center md:items-start font-medium gap-1 md:flex-col">
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

export const getPriceColumn = (
  showInUsd: boolean,
  setShowInUsd: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<TwapOrder> => ({
  id: 'priceUsd',
  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={(e) => {
              e.stopPropagation()
              setShowInUsd((prev) => !prev)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
            className="flex items-center gap-1 cursor-pointer select-none min-w-[93px]"
          >
            <span>Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current pb-[1px]">
              <DollarCircledIcon />
              <span>{showInUsd ? 'USD' : 'Token'}</span>
            </span>
          </span>
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
    const { usdPerChunk } = useParsedOrder(row)

    return usdPerChunk
  },
  cell: ({ row }) => {
    const { sellToken, usdPerChunk, sellTokenAmountPerChunk } = useParsedOrder(
      row.original,
    )

    if (!sellToken) return null

    return (
      <span>
        {showInUsd
          ? formatUSD(usdPerChunk)
          : `${formatNumber(sellTokenAmountPerChunk)} ${sellToken.symbol}`}
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
})

// export const FILLED_COLUMN: ColumnDef<TwapOrder> = {
// 	id: "filled",
// 	header: "Filled",
// 	enableSorting: false,
// 	accessorFn: (row) => {
// 		const { filledPercentage } = useParsedOrder(row);
// 		return filledPercentage;
// 	},
// 	cell: ({ row }) => {
// 		const { filledPercentage, buyToken, buyTokenFilledAmount, buyTokenExpectedAmount } = useParsedOrder(
// 			row.original
// 		);
// 		if (!buyToken) return null;
// 		return (
// 			<div className="flex items-center gap-2">
// 				<span>
// 					{formatNumber(buyTokenFilledAmount)}/{formatNumber(buyTokenExpectedAmount)} {buyToken.symbol}
// 				</span>
// 				<Chip className="dark:!bg-slate-750 !bg-slate-200 !p-2 dark:text-slate-500 text-slate-450 !h-[28px]">
// 					{formatPercent(filledPercentage / 100)}
// 				</Chip>
// 			</div>
// 		);
// 	},

// };

export const TIME_COLUMN: ColumnDef<TwapOrder> = {
  id: 'time',
  header: 'Time',
  enableSorting: false,
  accessorFn: (row) => row.createdAt,
  cell: ({ row }) => format(new Date(row.original.createdAt), 'yyyy/MM/dd'),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
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
            onClick={() => {
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

export const EXPIRES_COLUMN: ColumnDef<TwapOrder> = {
  id: 'expires',
  header: 'Expires',
  enableSorting: false,
  accessorFn: (row) => row.deadline,
  cell: ({ row }) => format(new Date(row.original.deadline), 'dd/MM/yy HH:mm'),
}
