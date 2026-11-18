import type { V2Position } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { SkeletonBox, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import {
  Card,
  CardContent,
  LinkInternal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import type { FC, ReactElement } from 'react'
import { useTokensFromPool } from 'src/lib/hooks/use-tokens-from-pool'
import { formatPercent, formatUSD } from 'sushi'
import { getEvmChainById } from 'sushi/evm'

interface PositionCard {
  position: V2Position
}

export function PositionCardSkeleton(): ReactElement {
  return (
    <Card className="w-[320px]">
      <CardContent className="!pt-6 !gap-2">
        <div className="flex flex-col">
          <SkeletonText fontSize="2xl" style={{ height: 32 }} />
          <SkeletonText fontSize="xs" style={{ height: 16 }} />
        </div>
        <div className="flex flex-col gap-2 items-center py-7">
          <div className="inline-flex">
            <div className="rounded-full border-2 border-transparent">
              <SkeletonCircle radius={56} />
            </div>
            <div
              className="rounded-full border-2 border-transparent"
              style={{ marginLeft: -56 / 3 }}
            >
              <SkeletonCircle radius={56} />
            </div>
          </div>
        </div>
        <SkeletonText fontSize="sm" />
        <SkeletonBox className="h-9 w-full !rounded-full" />
      </CardContent>
    </Card>
  )
}

export const PositionCard: FC<PositionCard> = ({ position }) => {
  const { token0, token1 } = useTokensFromPool(position.pool)
  const valueUSD =
    (Number(position.unstakedBalance) / Number(position.pool.liquidity)) *
    Number(position.pool.liquidityUSD)

  return (
    <Card className="w-[320px]">
      <CardContent className="!pt-6 !gap-2">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium text-primary">
            {token0.symbol}/{token1.symbol}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              {formatPercent(position.pool.swapFee)}
            </span>
          </h1>
          <span className="text-xs text-muted-foreground">
            {getEvmChainById(position.pool.chainId).name}
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center py-7">
          <div className="flex min-w-[44px]">
            <Currency.IconList iconWidth={56} iconHeight={56}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="text-muted-foreground">Position value:</div>
          <div>{formatUSD(valueUSD)}</div>
        </div>
        <div className="flex gap-1 absolute top-3 right-3">
          {position.pool.isIncentivized && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="whitespace-nowrap py-1 bg-green/20 text-green text-xs px-2 rounded-full">
                    🧑‍🌾{' '}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Farm rewards available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="w-full">
          <LinkInternal
            href={`/${getEvmChainById(position.pool.chainId).key}/pool/v2/${
              position.pool.address
            }/migrate`}
          >
            <Button size="sm" className="w-full">
              Migrate
            </Button>
          </LinkInternal>
        </div>
      </CardContent>
    </Card>
  )
}
