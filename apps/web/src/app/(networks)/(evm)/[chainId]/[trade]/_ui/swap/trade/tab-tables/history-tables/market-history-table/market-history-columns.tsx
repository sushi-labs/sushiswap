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
import type { LocalRecentSwap } from 'src/lib/hooks/react-query/recent-swaps/useLocalRecentSwaps'
import { getNetworkName } from 'src/lib/network'
import { Amount, formatNumber, getChainById } from 'sushi'
import { formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { EvmNative, EvmToken, shortenHash } from 'sushi/evm'
// import type { MarketTrade } from './market-history-table'

export const BUY_COLUMN: ColumnDef<LocalRecentSwap> = {
  id: 'buy',
  header: 'Buy',
  enableSorting: false,
  accessorFn: (row) => Number(row.amount1),
  cell: ({ row }) => {
    const token =
      row.original.token1.type === 'native'
        ? EvmNative.fromChainId(row.original.token1.chainId)
        : new EvmToken({
            chainId: row.original.token1.chainId,
            address: row.original.token1.address,
            decimals: row.original.token1.decimals,
            symbol: row.original.token1.symbol,
            name: row.original.token1.name,
          })

    return (
      <div className="w-full min-w-[150px] flex items-center gap-1 lg:gap-2 whitespace-nowrap">
        <Currency.Icon currency={token} width={24} height={24} />
        <span>
          {formatNumber(
            new Amount(token, row.original.amount1).toSignificant(6),
          )}{' '}
          {token.symbol}
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

export const SELL_COLUMN: ColumnDef<LocalRecentSwap> = {
  id: 'sell',
  header: 'Sell',
  enableSorting: false,
  accessorFn: (row) => Number(row.amount0),
  cell: ({ row }) => {
    const token =
      row.original.token0.type === 'native'
        ? EvmNative.fromChainId(row.original.token0.chainId)
        : new EvmToken({
            chainId: row.original.token0.chainId,
            address: row.original.token0.address,
            decimals: row.original.token0.decimals,
            symbol: row.original.token0.symbol,
            name: row.original.token0.name,
          })
    return (
      <div className="flex items-center gap-1 lg:gap-2 whitespace-nowrap">
        <Currency.Icon currency={token} width={24} height={24} />
        <span>
          {formatNumber(
            new Amount(token, row.original.amount0).toSignificant(6),
          )}{' '}
          {token.symbol}
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

export const CHAIN_COLUMN: ColumnDef<LocalRecentSwap> = {
  id: 'chain',
  header: 'Chain',
  enableSorting: false,
  accessorFn: (row) => `${row.token0.chainId}-${row.token1.chainId}`,
  cell: ({ row }) => {
    const isCrossChain =
      row.original.token0.chainId !== row.original.token1.chainId

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
            <NetworkIcon
              type="square"
              chainId={row.original.token0.chainId as EvmChainId}
              className="w-3 h-3 lg:w-5 lg:h-5"
            />
          </div>
          <span className="block text-xs lg:hidden">
            {getNetworkName(row.original.token0.chainId as EvmChainId)}
          </span>
          {isCrossChain ? (
            <>
              <ArrowSmallRightIcon className="w-3 h-3 dark:text-slate-500 text-slate-450" />
              <div className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] overflow-hidden">
                <NetworkIcon
                  type="square"
                  chainId={row.original.token1.chainId as EvmChainId}
                  className="w-3 h-3 lg:w-5 lg:h-5"
                />
              </div>
              <span className="block text-xs lg:hidden">
                {getNetworkName(row.original.token1.chainId as EvmChainId)}
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

export const VALUE_PNL_COLUMN: ColumnDef<LocalRecentSwap> = {
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
  accessorFn: (row) => Number(row.amount1USD ?? 0),
  sortingFn: ({ original: a }, { original: b }) =>
    Number(a.amount1USD ?? 0) - Number(b.amount1USD ?? 0),
  cell: ({ row }) => {
    //@dev currently using localswap data; data provider does not have accurate data yet
    const totalPnl = 0
    return (
      <div className="flex flex-col">
        <span>{formatUSD(row.original.amount1USD ?? 0)}</span>
        <span
          className={
            totalPnl > 0
              ? 'text-xs text-green-500'
              : totalPnl < 0
                ? 'text-xs text-red'
                : 'text-xs text-muted-foreground'
          }
        >
          {totalPnl > 0 ? '+' : ''}
          {/* {formatUSD(totalPnl)} */}
          {'-'}
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
  },
}

export const getPriceUsdColumn = (
  showInUsd: boolean,
  setShowInUsd: React.Dispatch<React.SetStateAction<boolean>>,
): ColumnDef<LocalRecentSwap> => ({
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
  accessorFn: (row) => Number(row.amount1USD ?? 0),
  cell: ({ row }) => {
    const token =
      row.original.token1.type === 'native'
        ? EvmNative.fromChainId(row.original.token1.chainId)
        : new EvmToken({
            chainId: row.original.token1.chainId,
            address: row.original.token1.address,
            decimals: row.original.token1.decimals,
            symbol: row.original.token1.symbol,
            name: row.original.token1.name,
          })
    return showInUsd ? (
      <span>{formatUSD(row.original.amount1USD ?? 0)}</span>
    ) : (
      <span className="whitespace-nowrap">{`${formatNumber(new Amount(token, row.original.amount1).toSignificant(6))} ${
        row.original.token1.symbol
      }`}</span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
})

export const TX_HASH_COLUMN: ColumnDef<LocalRecentSwap> = {
  id: 'txHash',
  header: 'Tx Hash',
  enableSorting: false,
  accessorFn: (row) => row.tx_hash,
  cell: ({ row }) => (
    <LinkExternal
      href={getChainById(
        row.original.token0.chainId as EvmChainId,
      )?.getTransactionUrl(row.original.tx_hash)}
    >
      {shortenHash(row.original.tx_hash)}
    </LinkExternal>
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm" />,
    },
  },
}

export const DATE_COLUMN: ColumnDef<LocalRecentSwap> = {
  id: 'timestamp',
  header: () => <span className="lg:text-right lg:block">Date</span>,
  enableSorting: false,
  accessorFn: (row) => row.timestamp,
  cell: ({ row }) => (
    <span className="whitespace-nowrap">
      {format(new Date(row.original.timestamp * 1000), 'MM/dd/yy h:mm a')}
    </span>
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-[60px] h-4 rounded-sm ml-auto" />,
    },
  },
}
