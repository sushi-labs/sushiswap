import { ArrowUpIcon, PlusIcon } from '@heroicons/react-v1/solid'
import type { MultiChainPool } from '@sushiswap/graph-client/data-api-181'
import {
  Button,
  Currency,
  SkeletonBox,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { getTextColor } from 'src/lib/helpers'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import type { EvmChainId, SushiSwapProtocol } from 'sushi'
import { Token, unwrapToken } from 'sushi/currency'
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'
import type { Address } from 'viem'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { TooltipDrawer } from '../common/tooltip-drawer'
import { SparklineCell } from '../token/SparklineCell'
import { ProtocolBadge } from './PoolNameCell'
import { AddLiquidityDialog } from './add-liquidity/add-liquidity-dialog'

export const CHAIN_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'chain',
  header: () => (
    <span className="font-[600] text-slate-450 dark:text-slate-500">Chain</span>
  ),
  cell: (props) => (
    <div className="px-2 md:min-w-[70px]">
      <NetworkIcon
        type="square"
        chainId={props.row.original.chainId as EvmChainId}
        className="md:w-5 h-5 min-w-5 min-h-5 rounded-[4px] border border-slate-200 dark:border-slate-750"
      />
    </div>
  ),
  meta: {
    body: {
      skeleton: (
        <div className="w-[68px] h-[84px] flex items-center">
          <SkeletonBox className="w-3 h-3 md:w-5 md:h-5 mx-2 !rounded-[4px]" />
        </div>
      ),
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const POOL_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'pool',
  header: () => (
    <span className="font-[600] text-slate-450 dark:text-slate-500">Pool</span>
  ),
  cell: (props) => {
    const [token0, token1] = useMemo(
      () => [
        new Token({
          chainId: props.row.original.chainId as EvmChainId,
          address: props.row.original.token0Address,
          symbol: props.row.original.name?.split(' /')[0] ?? '',
          decimals: 0,
        }),
        new Token({
          chainId: props.row.original.chainId as EvmChainId,
          address: props.row.original.token1Address,
          symbol: props.row.original.name?.split('/ ')[1] ?? '',
          decimals: 0,
        }),
      ],
      [props.row.original],
    )
    const { data: priceMap } = usePrices({
      chainId: props.row.original.chainId as EvmChainId,
      enabled: Boolean(token0 && token1),
    })

    const [formattedToken0Percent, formattedToken1Percent] = useMemo(() => {
      const raw0 = formatPercent(
        props.row.original.percentageOfLiquidityInPoolToken0,
      )
      const raw1 = formatPercent(
        props.row.original.percentageOfLiquidityInPoolToken1,
      )

      const clean = (str: string) => {
        return str.replace(/\.00%$/, '%')
      }

      return [clean(raw0), clean(raw1)]
    }, [
      props.row.original.percentageOfLiquidityInPoolToken0,
      props.row.original.percentageOfLiquidityInPoolToken1,
    ])

    return (
      <>
        {token0 && token1 ? (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-start gap-1 flex-col py-2 md:py-4 max-w-[160px]">
                  <div className="flex items-center">
                    <Currency.Icon
                      width={24}
                      height={24}
                      disableLink
                      currency={token0}
                    />
                    <div className="ml-1.5 mr-1">{token0.symbol}</div>
                    <div className="bg-slate-200 text-slate-450 dark:bg-slate-750 dark:text-slate-500 text-[12px] font-medium px-1.5 rounded-lg">
                      {formattedToken0Percent}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Currency.Icon
                      width={24}
                      height={24}
                      disableLink
                      currency={token1}
                    />
                    <div className="ml-1.5 mr-1">{token1.symbol}</div>
                    <div className="bg-slate-200 text-slate-450 dark:bg-slate-750 dark:text-slate-500 text-[12px] font-medium px-1.5 rounded-lg">
                      {formattedToken1Percent}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={20}
                className="md:block hidden px-5 py-5 mb-10 !bg-[#FFFFFF24] !backdrop-blur-md dark:!bg-[#00000024] border border-[#EBEBEB] dark:border-[#FFFFFF14]"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-450 dark:text-slate-500">
                    Token Price
                  </p>
                  <div className="flex items-start gap-2 min-w-[250px] text-sm flex-col">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <Currency.Icon
                          width={20}
                          height={20}
                          disableLink
                          currency={token0}
                        />
                        <div className="ml-1.5 mr-1 font-medium">
                          {token0.symbol}
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        {formatUSD(priceMap?.get(token0.address) ?? 0)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <Currency.Icon
                          width={20}
                          height={20}
                          disableLink
                          currency={token1}
                        />
                        <div className="ml-1.5 mr-1 font-medium">
                          {token1.symbol}
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        {formatUSD(priceMap?.get(token1.address) ?? 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </>
    )
  },
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="flex flex-col gap-1 py-2 w-[135px]">
          <div className="flex gap-1 items-center">
            <SkeletonCircle radius={24} />
            <SkeletonText fontSize="default" className="max-w-[80px]" />
          </div>
          <div className="flex gap-1 items-center">
            <SkeletonCircle radius={24} />
            <SkeletonText fontSize="default" className="max-w-[80px]" />
          </div>
        </div>
      ),
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const POOL_TYPE_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'type',
  header: () => (
    <span className="font-[600] text-slate-450 dark:text-slate-500">Type</span>
  ),
  cell: (props) => {
    const protocolContent = useMemo(() => {
      switch (props.row.original.protocol) {
        case 'SUSHISWAP_V2':
          return (
            <div className="flex flex-col gap-2 md:max-w-[275px]">
              <ProtocolBadge
                protocol={props.row.original.protocol as SushiSwapProtocol}
                showFullName={true}
              />
              <p className="text-sm font-normal text-slate-900 dark:text-pink-100">
                Classic liquidity pools have a fixed fee of 0.30% that utilize a
                constant product formula to ensure a 50/50 composition of each
                asset in the pool.
              </p>
              <Link href={'#'} rel="noreferrer noopener" target="_blank">
                <Button
                  className="w-fit !gap-1"
                  iconPosition="end"
                  icon={ArrowUpIcon}
                  iconProps={{
                    className: ' rotate-[45deg] w-[14px] h-[14px]',
                  }}
                  variant="tertiary"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          )
        case 'SUSHISWAP_V3':
          return (
            <div className="flex flex-col gap-2 max-w-[275px]">
              <ProtocolBadge
                protocol={props.row.original.protocol as SushiSwapProtocol}
                showFullName={true}
              />
              <p className="text-sm font-normal text-slate-900 dark:text-pink-100">
                Concentrated liquidity pools maximize capital efficiency by
                focusing liquidity within a set price range around the current
                pair price. If a user's position moves out of this range, it
                stops earning fees, requiring them to adjust the range or wait
                for the price to return.
              </p>
              <Link href={'#'} rel="noreferrer noopener" target="_blank">
                <Button
                  className="w-fit !gap-1"
                  iconPosition="end"
                  icon={ArrowUpIcon}
                  iconProps={{
                    className: ' rotate-[45deg] w-[14px] h-[14px]',
                  }}
                  variant="tertiary"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          )

        default:
          return null
      }
    }, [props.row.original.protocol])

    return (
      <div className="flex items-center gap-1 md:w-[180px]">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <ProtocolBadge
                protocol={props.row.original.protocol as SushiSwapProtocol}
              />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={100}
              className="md:block hidden px-5 py-5 mb-10 !bg-[#FFFFFF24] !backdrop-blur-md dark:!bg-[#00000024] border border-[#EBEBEB] dark:border-[#FFFFFF14]"
            >
              {protocolContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="bg-[#F4F5F6] text-muted-foreground dark:bg-[#1E293B] dark:text-pink-200 text-xs px-2.5 py-1 rounded-full">
                {formatNumber(props.row.original.swapFee * 100)}%
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={70}
              className="md:block hidden px-5 py-5 mb-10 !bg-[#FFFFFF24] !backdrop-blur-md dark:!bg-[#00000024] border border-[#EBEBEB] dark:border-[#FFFFFF14]"
            >
              <div className="flex flex-col gap-2 max-w-[275px]">
                <div className="bg-[#F4F5F6] w-fit text-muted-foreground dark:bg-[#1E293B] dark:text-pink-200 text-xs px-2.5 py-1 rounded-full">
                  {formatNumber(props.row.original.swapFee * 100)}% Fee Tier
                </div>
                <p className="text-sm font-normal text-slate-900 dark:text-pink-100">
                  A fee tier is the percentage of the liquidity provider fee
                  that is applied to swaps in a liquidity pool.
                </p>
                <Link href={'#'} rel="noreferrer noopener" target="_blank">
                  <Button
                    className="w-fit !gap-1"
                    iconPosition="end"
                    icon={ArrowUpIcon}
                    iconProps={{
                      className: ' rotate-[45deg] w-[14px] h-[14px]',
                    }}
                    variant="tertiary"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  },
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-1">
          <SkeletonText
            fontSize="default"
            className="!w-[35px] !rounded-full !h-[24px]"
          />
          <SkeletonText
            fontSize="default"
            className="!w-[48px] !rounded-full !h-[24px]"
          />
        </div>
      ),
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'volumeUSD1d',
  header: () => (
    <span className="font-[600]">
      1d Volume <span className="font-normal">(1d%)</span>
    </span>
  ),
  accessorFn: (row) => row.volumeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volumeUSD1d - rowB.volumeUSD1d,
  cell: (props) => (
    <div className="flex flex-col w-[130px]">
      <span>
        {formatUSD(props.row.original.volumeUSD1d).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.volumeUSD1d)}
      </span>
      <span
        className={classNames(
          'text-xs',
          getTextColor(
            props.row.original.volumeUSDChange1d,
            'text-muted-foreground',
          ),
        )}
      >
        {props.row.original.volumeUSDChange1d > 0 ? '+' : ''}
        {formatPercent(props.row.original.volumeUSDChange1d)}
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const VOLUME_1W_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'volumeUSD1w',
  header: () => (
    <span className="font-[600]">
      7d Volume <span className="font-normal">(7d%)</span>
    </span>
  ),
  accessorFn: (row) => row.volumeUSD1w,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.volumeUSD1w) - Number(rowB.volumeUSD1w),
  cell: (props) => (
    <div className="flex flex-col w-[130px]">
      <span>
        {formatUSD(props.row.original.volumeUSD1w).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.volumeUSD1w)}
      </span>
      <span
        className={classNames(
          'text-xs',
          getTextColor(
            props.row.original.volumeUSDChange1w,
            'text-muted-foreground',
          ),
        )}
      >
        {props.row.original.volumeUSDChange1w > 0 ? '+' : ''}
        {formatPercent(props.row.original.volumeUSDChange1w)}
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const TVL_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'liquidityUSD',
  header: () => (
    <span className="font-[600]">
      TVL <span className="font-normal">(1d%)</span>
    </span>
  ),
  accessorFn: (row) => row.liquidityUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.liquidityUSD - rowB.liquidityUSD,
  cell: (props) => (
    <div className="flex flex-col w-[130px]">
      <span>
        {formatUSD(props.row.original.liquidityUSD).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.liquidityUSD)}
      </span>
      <span
        className={classNames(
          'text-xs',
          getTextColor(
            props.row.original.liquidityUSDChange1d,
            'text-muted-foreground',
          ),
        )}
      >
        {props.row.original.liquidityUSDChange1d > 0 ? '+' : ''}
        {formatPercent(props.row.original.liquidityUSDChange1d)}
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const VOL_TVL_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'volumeTvlRatio',
  header: () => (
    <span className="font-[600] px-2">
      Vol / TVL <span className="font-normal">(1d)</span>
    </span>
  ),
  accessorFn: (row) => row.tvlVolumeRatio,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.tvlVolumeRatio - rowB.tvlVolumeRatio,
  cell: (props) => {
    return (
      <span className="flex items-center justify-center w-[130px]">
        {Number.isNaN(props.row.original.tvlVolumeRatio)
          ? '0'
          : formatNumber(props.row.original.tvlVolumeRatio)}
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
      className: 'bg-skyblue/[3%] h-full dark:bg-blue/[3%]',
    },
    header: {
      className: 'h-[60px] mt-4 flex items-center justify-center',
    },
    tableHead: {
      className: 'bg-skyblue/[3%] dark:bg-blue/[3%]',
    },
  },
}

export const APR_WITH_REWARDS_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'totalApr1w',
  header: () => (
    <span className="font-[600] px-2">
      APR <span className="font-normal">(7d%)</span>
    </span>
  ),
  accessorFn: (row) => row.totalApr1w,
  cell: (props) => {
    const hasIncentives = props.row.original.incentives.length > 0
    if (!hasIncentives) {
      return (
        <div className="flex flex-col pl-7 w-[130px]">
          <span>
            {Number.isNaN(props.row.original.totalApr1w)
              ? '0%'
              : formatPercent(props.row.original.totalApr1w)}
          </span>
        </div>
      )
    }

    return (
      <TooltipDrawer
        tooltipContentClassName="max-w-none"
        dialogContentClassName="max-w-none"
        side="right"
        trigger={
          <div className="flex flex-col cursor-pointer pl-7 w-[130px]">
            <div className="flex gap-1 items-center">
              <span className="underline decoration-dotted underline-offset-2">
                {Number.isNaN(props.row.original.totalApr1w)
                  ? '0%'
                  : formatPercent(props.row.original.totalApr1w)}
              </span>
              {props.row.original.incentives.map((incentive) => (
                <Currency.Icon
                  key={incentive.id}
                  width={14}
                  height={14}
                  currency={incentive.rewardToken}
                />
              ))}
            </div>
          </div>
        }
        content={
          <div className="flex flex-col font-normal gap-2 text-black w-full md:w-[254px] text-sm dark:text-white">
            <div className="flex flex-col gap-1 mb-2">
              <p>Total APR</p>
              <p className="text-xl font-medium">
                {Number.isNaN(props.row.original.totalApr1w)
                  ? '0%'
                  : formatPercent(props.row.original.totalApr1w)}
              </p>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <p>Fee APR</p>
              <p className="font-medium">
                {formatPercent(props.row.original.feeApr1w)}
              </p>
            </div>
            <p>Liquidity Pool fees from swap transactions</p>
            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2 items-center">
                <p>Rewards APR</p>
                {props.row.original.incentives.map((incentive) => (
                  <Currency.Icon
                    key={incentive.id}
                    width={14}
                    height={14}
                    currency={incentive.rewardToken}
                  />
                ))}
              </div>
              <p className="font-medium">
                {formatPercent(props.row.original.incentiveApr)}
              </p>
            </div>
            <p>Boosted rewards</p>
          </div>
        }
        dialogTitle="APR"
      />
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
      className: 'bg-skyblue/[3%] h-full dark:bg-blue/[3%]',
    },
    header: {
      className: 'h-[60px] mt-4 flex items-center justify-center',
    },
    tableHead: {
      className: 'bg-skyblue/[3%] dark:bg-blue/[3%]',
    },
    disableLink: true,
  },
}

export const APR_SPARKLINE_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'aprSparkline',
  accessorFn: (row) => row.feeApr1wSparkLine,
  header: () => (
    <span className="font-[600] text-slate-450 dark:text-slate-500">
      APR Last 7d
    </span>
  ),

  cell: (props) => {
    return (
      <div className="px-10">
        <SparklineCell
          data={props.row.original.feeApr1wSparkLine}
          width={90}
          height={20}
        />
      </div>
    )
  },
  meta: {
    header: {
      className: 'text-right pr-6 mt-4',
    },
    body: {
      skeleton: <SkeletonBox className="w-full h-10" />,
    },
  },
}
export const ACTION_COLUMN: ColumnDef<MultiChainPool, unknown> = {
  id: 'action',
  cell: (props) => {
    const poolType = props.row.original.protocol as SushiSwapProtocol

    const { data: _token0 } = useTokenWithCache({
      chainId: props.row.original.chainId as EvmChainId,
      address: props.row.original.token0Address as Address,
      enabled: !!props.row.original.token0Address,
    })
    const { data: _token1 } = useTokenWithCache({
      chainId: props.row.original.chainId as EvmChainId,
      address: props.row.original.token1Address as Address,
      enabled: !!props.row.original.token1Address,
    })

    const [token0, token1] = useMemo(
      () => [
        _token0 ? unwrapToken(_token0) : undefined,
        _token1 ? unwrapToken(_token1) : undefined,
      ],
      [_token0, _token1],
    )

    return (
      <AddLiquidityDialog
        poolType={poolType}
        token0={token0}
        token1={token1}
        hidePoolTypeToggle={true}
        hideTokenSelectors={true}
        initFeeAmount={props.row.original.swapFee * 1_000_000}
        trigger={
          <Button
            className="!gap-1 !w-[100px] !h-[36px] !rounded-lg"
            variant="tertiary"
          >
            <div className="flex gap-1 items-center">
              <PlusIcon className="w-[14px] max-w-[14px] h-[14px] max-h-[14px]" />
              <span>Add</span>
            </div>
          </Button>
        }
        chainId={props.row.original.chainId as EvmChainId}
      />
    )
  },
  meta: {
    disableLink: true,
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
