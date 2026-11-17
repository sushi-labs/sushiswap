import {
  ArrowDownRightIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  LightBulbIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import type { Pool } from '@sushiswap/graph-client/data-api'
import {
  Badge,
  Button,
  Chip,
  Currency,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo } from 'react'
import { formatNumber, formatPercent, formatUSD } from 'sushi'
import {
  EvmNative,
  EvmToken,
  type SushiSwapProtocol,
  getEvmChainById,
  isMerklChainId,
} from 'sushi/evm'
import { APRWithRewardsHoverCard } from './apr-with-rewards-hover-card'
import { KatanaStakingAPRHoverCard } from './katana-staking-apr-hover-card'
import { ProtocolBadge } from './protocol-badge'

export const EXPLORE_NAME_COLUMN_POOL: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => {
    const [token0, token1] = useMemo(
      () => [
        new EvmToken({
          name: '',
          symbol: '',
          chainId: props.row.original.chainId,
          address: props.row.original.token0Address,
          decimals: 0,
        }),
        new EvmToken({
          name: '',
          symbol: '',
          chainId: props.row.original.chainId,
          address: props.row.original.token1Address,
          decimals: 0,
        }),
      ],
      [props.row.original],
    )

    return (
      <div className="flex items-center gap-5">
        <div className="flex min-w-[54px]">
          {token0 && token1 ? (
            <Badge
              className="border-2 border-background rounded-full z-[11]"
              position="bottom-right"
              badgeContent={
                <NetworkIcon
                  chainId={props.row.original.chainId}
                  width={14}
                  height={14}
                />
              }
            >
              <Currency.IconList iconWidth={26} iconHeight={26}>
                <Currency.Icon disableLink currency={token0} />
                <Currency.Icon disableLink currency={token1} />
              </Currency.IconList>
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 pr-2 text-sm font-medium text-primary whitespace-nowrap">
            {props.row.original.name}
          </span>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {
                    ProtocolBadge[
                      props.row.original.protocol as SushiSwapProtocol
                    ]
                  }
                </TooltipTrigger>
                <TooltipContent>
                  <p>Protocol version</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-muted-foreground bg-muted text-[10px] px-2 rounded-full">
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
            {props.row.original.isSmartPool && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-[#F2E9D6] dark:bg-yellow/60 text-[10px] px-2 rounded-full">
                      🏦
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Liquidity Vault available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    )
  },
  size: 300,
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

export const BLANK_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'blank',
  header: () => <span>&nbsp;</span>,
  cell: () => <div />,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
export const TVL_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.liquidityUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.liquidityUSD - rowB.liquidityUSD,
  cell: (props) => (
    <div className="flex flex-col">
      <span>
        {formatUSD(props.row.original.liquidityUSD).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.liquidityUSD)}
      </span>
      <span
        className={classNames(
          'text-xs',
          props.row.original.liquidityUSDChange1d > 0
            ? 'text-green'
            : props.row.original.liquidityUSDChange1d < 0
              ? 'text-red'
              : 'text-muted-foreground',
        )}
      >
        {props.row.original.liquidityUSDChange1d > 0 ? '+' : ''}
        {props.row.original.liquidityUSDChange1d.toFixed(2)}%
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volumeUSD1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volumeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volumeUSD1d - rowB.volumeUSD1d,
  cell: (props) => (
    <div className="flex flex-col">
      <span>
        {formatUSD(props.row.original.volumeUSD1d).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.volumeUSD1d)}
      </span>
      <span
        className={classNames(
          'text-xs',
          props.row.original.volumeUSDChange1d > 0
            ? 'text-green'
            : props.row.original.volumeUSDChange1d < 0
              ? 'text-red'
              : 'text-muted-foreground',
        )}
      >
        {props.row.original.volumeUSDChange1d > 0 ? '+' : ''}
        {props.row.original.volumeUSDChange1d.toFixed(2)}%
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const VOLUME_1W_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volumeUSD1w',
  header: 'Volume (1w)',
  accessorFn: (row) => row.volumeUSD1w,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.volumeUSD1w) - Number(rowB.volumeUSD1w),
  cell: (props) => (
    <div className="flex flex-col">
      <span>
        {formatUSD(props.row.original.volumeUSD1w).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.volumeUSD1w)}
      </span>
      <span
        className={classNames(
          'text-xs',
          props.row.original.volumeUSDChange1w > 0
            ? 'text-green'
            : props.row.original.volumeUSDChange1w < 0
              ? 'text-red'
              : 'text-muted-foreground',
        )}
      >
        {props.row.original.volumeUSDChange1w > 0 ? '+' : ''}
        {props.row.original.volumeUSDChange1w.toFixed(2)}%
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TRANSACTIONS_1D_COLUMN: ColumnDef<Pool, unknown> = {
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

export const APR_WITH_REWARDS_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => row.totalApr1d,
  cell: (props) => (
    <div className="flex items-center gap-1">
      <APRWithRewardsHoverCard pool={props.row.original}>
        <div className="flex items-center gap-1">
          <span
            className={classNames(
              'underline decoration-dotted underline-offset-2',
            )}
          >
            {formatPercent(props.row.original.totalApr1d)}
          </span>
          {props.row.original.incentives.map((incentive) => (
            <Currency.Icon
              key={incentive.id}
              width={16}
              height={16}
              currency={incentive.rewardToken}
            />
          ))}
        </div>
      </APRWithRewardsHoverCard>
      <KatanaStakingAPRHoverCard pool={props.row.original} />
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    disableLink: true,
  },
}

export const ACTION_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'actions',
  header: 'Action',
  cell: ({ row }) =>
    row.original.protocol === 'SUSHISWAP_V3' ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuLabel>
            {row.original.name}
            <Chip variant="blue" className="ml-2">
              SushiSwap V3
            </Chip>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                onClick={(e) => e.stopPropagation()}
                shallow={true}
                className="flex items-center"
                href={`/${getEvmChainById(row.original.chainId).key}/pool/v3/${
                  row.original.address
                }`}
              >
                <ArrowDownRightIcon width={16} height={16} className="mr-2" />
                Pool details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                onClick={(e) => e.stopPropagation()}
                shallow={true}
                className="flex items-center"
                href={`/${getEvmChainById(row.original.chainId).key}/pool/v3/${
                  row.original.address
                }/create`}
              >
                <PlusIcon width={16} height={16} className="mr-2" />
                Create position
              </Link>
            </DropdownMenuItem>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild={row.original.isSmartPool}>
                  <DropdownMenuItem
                    asChild
                    disabled={!row.original.isSmartPool}
                  >
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      shallow={true}
                      className="flex items-center"
                      href={`/${getEvmChainById(row.original.chainId).key}/pool/v3/${
                        row.original.address
                      }/smart`}
                    >
                      <span className="relative">
                        <LightBulbIcon
                          width={16}
                          height={16}
                          className="mr-2"
                        />
                        <sup className="rounded-full bg-background absolute right-[3px]">
                          <PlusIcon width={12} height={12} />
                        </sup>
                      </span>
                      Create smart position
                    </Link>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[240px]">
                  <p>
                    {!row.original.isSmartPool
                      ? 'No Liquidity Vaults available for this pool'
                      : `Liquidity Vaults optimize liquidity allocation within custom price ranges, enhancing trading efficiency by
          providing deeper liquidity around the current price, increasing Liquidity Providers (LP) fee earnings.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild={isMerklChainId(row.original.chainId)}>
                  <DropdownMenuItem
                    asChild
                    disabled={!isMerklChainId(row.original.chainId)}
                  >
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      shallow={true}
                      className="flex items-center"
                      href={`/${
                        getEvmChainById(row.original.chainId).key
                      }/pool/incentivize?fromCurrency=${
                        row.original.token0Address ===
                        EvmNative.fromChainId(row.original.chainId).wrap()
                          .address
                          ? 'NATIVE'
                          : row.original.token0Address
                      }&toCurrency=${
                        row.original.token1Address ===
                        EvmNative.fromChainId(row.original.chainId).wrap()
                          .address
                          ? 'NATIVE'
                          : row.original.token1Address
                      }&feeAmount=${row.original.swapFee * 10_000 * 100}`}
                    >
                      <GiftIcon width={16} height={16} className="mr-2" />
                      Add incentive
                    </Link>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[240px]">
                  <p>
                    {!isMerklChainId(row.original.chainId)
                      ? 'Not available on this network'
                      : 'Add rewards to a pool to incentivize liquidity providers joining in.'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuLabel>
            {row.original.name}
            {row.original.protocol === 'SUSHISWAP_V2' && (
              <Chip variant="pink" className="ml-2">
                SushiSwap V2
              </Chip>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                onClick={(e) => e.stopPropagation()}
                shallow={true}
                className="flex items-center"
                href={`/${getEvmChainById(row.original.chainId).key}/pool/v2/${
                  row.original.address
                }/add`}
              >
                <PlusIcon width={16} height={16} className="mr-2" />
                Add liquidity
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                onClick={(e) => e.stopPropagation()}
                shallow={true}
                className="flex items-center"
                href={`/${getEvmChainById(row.original.chainId).key}/pool/v2/${
                  row.original.address
                }/remove`}
              >
                <MinusIcon width={16} height={16} className="mr-2" />
                Remove liquidity
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  size: 80,
  meta: {
    disableLink: true,
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
