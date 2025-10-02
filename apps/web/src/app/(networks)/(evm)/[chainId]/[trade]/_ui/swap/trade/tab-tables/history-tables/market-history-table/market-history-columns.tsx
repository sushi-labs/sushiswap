import { ArrowSmallRightIcon } from '@heroicons/react/24/outline'
import {
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
import { NativeAddress } from 'src/lib/constants'
import { getNetworkName } from 'src/lib/network'
import { formatNumber, getChainById } from 'sushi'
import { formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { EvmNative, EvmToken } from 'sushi/evm'
import type { MarketTrade } from './market-history-table'

export const BUY_COLUMN: ColumnDef<MarketTrade> = {
  id: 'buy',
  header: 'Buy',
  enableSorting: false,
  accessorFn: (row) => row.amountOut,
  cell: ({ row }) => {
    const token =
      row.original.tokenOut.address === NativeAddress
        ? EvmNative.fromChainId(row.original.tokenOut.chainId as EvmChainId)
        : new EvmToken({
            chainId: row.original.tokenOut.chainId as EvmChainId,
            address: row.original.tokenOut.address,
            decimals: row.original.tokenOut.decimals,
            symbol: row.original.tokenOut.symbol,
            name: row.original.tokenOut.name,
          })

    return (
      <div className="w-full min-w-[150px] flex items-center gap-1 lg:gap-2 whitespace-nowrap">
        <Currency.Icon currency={token} width={24} height={24} />
        <span>
          {formatNumber(row.original.amountOut)} {token.symbol}
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

export const SELL_COLUMN: ColumnDef<MarketTrade> = {
  id: 'sell',
  header: 'Sell',
  enableSorting: false,
  accessorFn: (row) => row.amountIn,
  cell: ({ row }) => {
    const token =
      row.original.tokenIn.address === NativeAddress
        ? EvmNative.fromChainId(row.original.tokenIn.chainId as EvmChainId)
        : new EvmToken({
            chainId: row.original.tokenIn.chainId as EvmChainId,
            address: row.original.tokenIn.address,
            decimals: row.original.tokenIn.decimals,
            symbol: row.original.tokenIn.symbol,
            name: row.original.tokenIn.name,
          })
    return (
      <div className="flex items-center gap-1 lg:gap-2 whitespace-nowrap">
        <Currency.Icon currency={token} width={24} height={24} />
        <span>
          {formatNumber(row.original.amountIn)} {token.symbol}
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

export const CHAIN_COLUMN: ColumnDef<MarketTrade> = {
  id: 'chain',
  header: 'Chain',
  enableSorting: false,
  accessorFn: (row) => `${row.tokenIn.chainId}-${row.tokenOut.chainId}`,
  cell: ({ row }) => {
    const isCrossChain =
      row.original.tokenIn.chainId !== row.original.tokenOut.chainId

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
            <NetworkIcon
              type="square"
              chainId={row.original.tokenIn.chainId as EvmChainId}
              className="w-3 h-3 lg:w-5 lg:h-5"
            />
          </div>
          <span className="block text-xs lg:hidden">
            {getNetworkName(row.original.tokenIn.chainId as EvmChainId)}
          </span>
          {isCrossChain ? (
            <>
              <ArrowSmallRightIcon className="w-3 h-3 dark:text-slate-500 text-slate-450" />
              <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
                <NetworkIcon
                  type="square"
                  chainId={row.original.tokenOut.chainId as EvmChainId}
                  className="w-3 h-3 lg:w-5 lg:h-5"
                />
              </div>
              <span className="block text-xs lg:hidden">
                {getNetworkName(row.original.tokenOut.chainId as EvmChainId)}
              </span>
            </>
          ) : null}
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-5 h-5 rounded-sm" />,
    },
  },
}

export const VALUE_PNL_COLUMN: ColumnDef<MarketTrade> = {
  id: 'valueUsd',
  header: () => (
    <TooltipDrawer
      trigger={
        <span className="border-b border-dotted border-muted-foreground">
          Value / PnL
        </span>
      }
      content={
        <p>
          Profit or loss calculated as the difference in USD value of the asset
          on the day it was bought and the day it was sold.
        </p>
      }
      dialogTitle="Value / PnL"
    />
  ),
  enableSorting: false,
  accessorFn: (row) => row.amountOutUSD,
  sortingFn: ({ original: a }, { original: b }) =>
    a.amountOutUSD - b.amountOutUSD,
  cell: ({ row }) => (
    <div className="flex flex-col">
      <span>{formatUSD(row.original.amountOutUSD)}</span>
      <span
        className={
          row.original.totalPnl > 0
            ? 'text-xs text-green-500'
            : row.original.totalPnl < 0
              ? 'text-xs text-red'
              : 'text-xs text-muted-foreground'
        }
      >
        {row.original.totalPnl > 0 ? '+' : ''}
        {formatUSD(row.original.totalPnl)}
      </span>
    </div>
  ),
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
): ColumnDef<MarketTrade> => ({
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
  accessorFn: (row) => row.amountOutUSD,
  cell: ({ row }) => {
    return showInUsd ? (
      <span>{formatUSD(row.original.amountOutUSD)}</span>
    ) : (
      <span className="whitespace-nowrap">{`${formatNumber(row.original.amountOut)} ${
        row.original.tokenOut.symbol
      }`}</span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
})

export const TX_HASH_COLUMN: ColumnDef<MarketTrade> = {
  id: 'txHash',
  header: 'Tx Hash',
  enableSorting: false,
  // accessorFn: (row) => row.txHash,
  cell: ({ row }) => (
    <LinkExternal
      href={getChainById(
        row.original.tokenIn.chainId as EvmChainId,
      )?.getTransactionUrl('0x')}
    >
      -{/* {shortenHash(row.original.txHash)} */}
    </LinkExternal>
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
}

export const DATE_COLUMN: ColumnDef<MarketTrade> = {
  id: 'timestamp',
  header: () => <span className="lg:text-right lg:block">Date</span>,
  enableSorting: false,
  accessorFn: (row) => row.time,
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {format(new Date(row.original.time * 1000), 'MM/dd/yy h:mm a')}
    </span>
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm ml-auto" />,
    },
  },
}
