import type {
  PortfolioV2LiquidityPositionsResponse,
  PortfolioV2PositionPoolType,
} from '@sushiswap/graph-client/data-api-portfolio'
import {
  Currency,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useClaimableRewards } from 'src/lib/hooks/react-query'
import { formatNumber, formatPercent, formatUSD } from 'sushi'
import {
  type EvmChainId,
  EvmToken,
  type MerklChainId,
  type SushiSwapProtocol,
  isMerklChainId,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import { PoolColumn, PoolTypeColumn } from '~evm/[chainId]/_ui/columns-v2'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { PriceRangeCell } from './price-range-cell'

const isV3 = (
  row: PortfolioV2PositionPoolType,
): row is PortfolioV2LiquidityPositionsResponse['v3'][number] => {
  return row.pool.protocol === 'SUSHISWAP_V3'
}

export const CHAIN_COLUMN: ColumnDef<PortfolioV2PositionPoolType, unknown> = {
  id: 'chain',
  header: () => (
    <span className="font-[600] text-slate-450 dark:text-slate-500">Chain</span>
  ),
  cell: (props) => (
    <div className="px-2 md:min-w-[70px]">
      <NetworkIcon
        type="square"
        chainId={props.row.original.pool.chainId as EvmChainId}
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

export const POOL_COLUMN: ColumnDef<PortfolioV2PositionPoolType, unknown> = {
  id: 'pool',
  header: () => (
    <span className="font-[600] text-slate-450 dark:text-slate-500">Pool</span>
  ),
  cell: (props) => {
    const pool = props.row.original.pool
    const [token0, token1] = useMemo(() => {
      const [symbol0 = '', symbol1 = ''] = pool.name?.split(' / ') ?? []

      const chainId = pool.chainId as EvmChainId

      return [
        new EvmToken({
          name: symbol0,
          chainId,
          address: pool.token0Address as `0x${string}`,
          symbol: symbol0,
          decimals: 18,
        }),
        new EvmToken({
          name: symbol1,
          chainId,
          address: pool.token1Address as `0x${string}`,
          symbol: symbol1,
          decimals: 18,
        }),
      ]
    }, [pool])

    const { data: priceMap } = usePrices({
      chainId: pool.chainId as EvmChainId,
      enabled: Boolean(token0 && token1),
    })

    const [formattedToken0Percent, formattedToken1Percent] = useMemo(() => {
      const raw0 = formatPercent(pool.percentageOfLiquidityInPoolToken0)
      const raw1 = formatPercent(pool.percentageOfLiquidityInPoolToken1)

      const clean = (str: string) => {
        return str.replace(/\.00%$/, '%')
      }

      return [clean(raw0), clean(raw1)]
    }, [
      pool.percentageOfLiquidityInPoolToken0,
      pool.percentageOfLiquidityInPoolToken1,
    ])

    return (
      <>
        {token0 && token1 ? (
          <PoolColumn
            token0={token0}
            token1={token1}
            percentOfToken0={formattedToken0Percent}
            percentOfToken1={formattedToken1Percent}
            priceToken0={priceMap?.get(token0.address) ?? 0}
            priceToken1={priceMap?.get(token1.address) ?? 0}
          />
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

export const POOL_TYPE_COLUMN: ColumnDef<PortfolioV2PositionPoolType, unknown> =
  {
    id: 'type',
    header: () => (
      <span className="font-[600] text-slate-450 dark:text-slate-500">
        Type
      </span>
    ),
    cell: (props) => {
      return (
        <PoolTypeColumn
          protocol={props.row.original.pool.protocol as SushiSwapProtocol}
          swapFee={props.row.original.pool.swapFee}
        />
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

export const POSITION_SIZE_COLUMN: ColumnDef<
  PortfolioV2PositionPoolType,
  unknown
> = {
  id: 'positionSize',
  accessorFn: (row) => row?.position?.amountUSD || 0,
  header: 'Position Size',
  cell: (props) => {
    return (
      <div className="flex flex-col">
        <div className="font-medium">
          {formatUSD(props?.row?.original?.position?.amountUSD)}
        </div>
        <div className="text-xs font-normal uppercase whitespace-nowrap text-muted-foreground dark:text-pink-200">
          {formatNumber(props?.row?.original?.position?.amount0)}{' '}
          {props?.row?.original?.pool?.name?.split(' / ')[0]} +{' '}
          {formatNumber(props?.row?.original?.position?.amount1)}{' '}
          {props?.row?.original?.pool?.name?.split(' / ')[1]}
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const POSITION_UNCOLLECTED_COLUMN: ColumnDef<
  PortfolioV2PositionPoolType,
  unknown
> = {
  id: 'uncollected',
  accessorFn: (row) => (isV3(row) ? row?.position?.unclaimedFeesUSD || 0 : 0),
  header: 'Uncollected fees',
  cell: (props) => {
    if (props.row.original.pool.protocol === 'SUSHISWAP_V2') {
      return (
        <div className="text-sm font-normal text-muted-foreground dark:text-pink-200">
          Auto Collected
        </div>
      )
    }
    if (isV3(props.row.original)) {
      return (
        <div className="flex flex-col">
          <div className="font-medium">
            {formatUSD(props?.row?.original?.position?.unclaimedFeesUSD)}
          </div>
          <div className="text-xs font-normal uppercase whitespace-nowrap text-muted-foreground dark:text-pink-200">
            {formatNumber(props?.row?.original?.position?.unclaimedFees0)}{' '}
            {props?.row?.original?.pool.name?.split(' / ')[0]} +{' '}
            {formatNumber(props?.row?.original?.position?.unclaimedFees1)}{' '}
            {props?.row?.original?.pool.name?.split(' / ')[1]}
          </div>
        </div>
      )
    }
    return <div>-</div>
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

export const REWARDS_COLUMN: ColumnDef<PortfolioV2PositionPoolType, unknown> = {
  id: 'totalRewardsUSD',
  header: 'Rewards',
  cell: (props) => {
    return <RewardsCell data={props.row.original} />
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}

const RewardsCell = ({ data }: { data: PortfolioV2PositionPoolType }) => {
  const { address } = useAccount()
  const { data: rewardsData } = useClaimableRewards({
    chainIds: isMerklChainId(data?.pool?.chainId) ? [data?.pool?.chainId] : [],
    account: address,
    enabled: isMerklChainId(data?.pool?.chainId as EvmChainId),
  })

  const rewardsForChain = rewardsData?.[data?.pool.chainId as MerklChainId]

  if (!rewardsForChain) {
    return (
      <div className="text-sm font-normal text-muted-foreground dark:text-pink-200">
        -
      </div>
    )
  }
  const merkleChainId = data?.pool.chainId as MerklChainId
  return (
    <div className="flex flex-col">
      <div className="font-medium">
        {formatUSD(rewardsForChain?.rewardAmountsUSD[merkleChainId] || 0)}
      </div>
      <div className="flex gap-1 items-center text-xs font-normal uppercase whitespace-nowrap text-muted-foreground dark:text-pink-200">
        {formatNumber(
          rewardsForChain?.rewardAmounts[merkleChainId].toSignificant(6),
        )}{' '}
        {rewardsForChain?.rewardAmounts[merkleChainId].currency.symbol}
        <Currency.Icon
          currency={rewardsForChain?.rewardAmounts[merkleChainId].currency}
          width={16}
          height={16}
          className="rounded-full"
        />
      </div>
    </div>
  )
}

export const APR_COLUMN: ColumnDef<PortfolioV2PositionPoolType, unknown> = {
  id: 'apr',
  header: () => <span className="font-[600] px-2">APR</span>,
  accessorFn: (row) => row.pool.totalApr1d,
  cell: (props) => {
    return (
      <span className="flex items-center justify-start w-[130px]">
        {formatPercent(props.row.original.pool.totalApr1d)}
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
      className: 'bg-skyblue/[8%] h-full dark:bg-[#8A80FF08]',
    },
    header: {
      className: 'h-[40px] mt-4 flex items-center justify-start',
    },
    tableHead: {
      className: 'bg-skyblue/[8%] dark:bg-[#8A80FF08]',
    },
  },
}

export const PRICE_RANGE_COLUMN: ColumnDef<
  PortfolioV2PositionPoolType,
  unknown
> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => {
    const isHovered =
      props.table.options.meta?.getIsRowHovered(props.row.id) ?? false
    return (
      <span className="flex w-[230px]">
        <PriceRangeCell data={props.row.original} isHovered={isHovered} />
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    header: {
      className: 'mt-4',
    },
  },
}
