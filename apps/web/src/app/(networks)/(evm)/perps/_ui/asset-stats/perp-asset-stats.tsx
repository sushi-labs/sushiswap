'use client'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import {
  currencyFormatter,
  formatPrice,
  getSignForValue,
  getTextColorClass,
  perpsNumberFormatter,
  useActiveAsset,
} from 'src/lib/perps'
import { formatPercent } from 'sushi'
import { ValueSensitiveText } from '../_common'
import { useAssetListState } from '../asset-selector'
import { useAssetState } from '../trade-widget'
import { AssetStatsSkeleton } from './asset-stats-skeleton'

export const PerpAssetStats = () => {
  const {
    state: { activeAsset },
  } = useAssetState()
  const {
    state: {
      assetListQuery: { data, isLoading },
    },
  } = useAssetListState()
  const { data: assetData, isLoading: isAssetLoading } = useActiveAsset({
    assetString: activeAsset,
  })
  const asset = useMemo(() => data?.get?.(activeAsset), [data, activeAsset])

  if (isAssetLoading || !assetData || isLoading) {
    return Array(8)
      .fill(0)
      .map((_, i) => <AssetStatsSkeleton key={i} />)
  }

  return (
    <>
      <div className="flex flex-col">
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <div className="text-sm text-muted-foreground underline cursor-pointer">
              Mark
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              Used for margining, computing unrealized PNL, liquidations, and
              triggering TP/SL orders.
            </p>
          </HoverCardContent>
        </HoverCard>

        <ValueSensitiveText
          value={formatPrice(
            assetData?.markPrice?.toString() ?? '',
            asset?.decimals ?? 0,
            'perp',
          )}
          className="text-sm font-medium tabular-nums"
        />
      </div>
      <div className="flex flex-col">
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <div className="text-sm text-muted-foreground underline cursor-pointer">
              Oracle
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              The median of external prices reported by validators, used for
              computing funding rates.
            </p>
          </HoverCardContent>
        </HoverCard>

        <ValueSensitiveText
          value={formatPrice(
            assetData?.oraclePrice?.toString() ?? '',
            asset?.decimals ?? 0,
            'perp',
          )}
          formatOptions={{
            minimumFractionDigits: 0,
            maximumFractionDigits: asset?.decimals,
          }}
          className="text-sm font-medium tabular-nums"
          allowColorChange={false}
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Change</div>

        <p
          className={classNames(
            'text-sm whitespace-nowrap tabular-nums font-medium',
            assetData?.change24hAbs &&
              getTextColorClass(Number(assetData.change24hAbs)),
          )}
        >
          {getSignForValue(Number(assetData?.change24hAbs ?? 0))}
          {perpsNumberFormatter({
            value: assetData?.change24hAbs ?? '0',
            maxFraxDigits: 4,
          })}{' '}
          / {getSignForValue(Number(assetData?.change24hPct ?? 0))}
          {formatPercent(assetData?.change24hPct)}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Volume</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {currencyFormatter.format(Number(assetData?.volume24hUsd ?? 0))}
        </p>
      </div>
      <div className="flex flex-col">
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <div className="text-sm text-muted-foreground underline cursor-pointer">
              Open Interest
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              Two sided-open interest: the sum of long and short positions on
              this contract.
            </p>
          </HoverCardContent>
        </HoverCard>
        <p className={classNames('text-sm tabular-nums font-medium ')}>
          {currencyFormatter.format(Number(assetData?.openInterestUsd ?? 0))}
        </p>
      </div>
      <div className="flex flex-col">
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <div className="text-sm text-muted-foreground underline cursor-pointer whitespace-nowrap">
              Funding / Countdown
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              The hourly rate at which longs pay shorts (if negative, shorts pay
              longs). There are no fees associated with funding, which is a
              peer-to-peer transfer between users to push prices towards the
              spot price. See Docs for details.
            </p>
          </HoverCardContent>
        </HoverCard>
        <div className="flex items-center gap-2">
          <p
            className={classNames(
              'text-sm tabular-nums font-medium whitespace-nowrap',
            )}
          >
            {(Number(assetData?.fundingPct ?? 0) * 100).toFixed(4)}%
          </p>
          <Countdown />
        </div>
      </div>
    </>
  )
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const minutes = now.getUTCMinutes()
      const seconds = now.getUTCSeconds()
      const totalSeconds = minutes * 60 + seconds
      const secondsInHour = 60 * 60
      return secondsInHour - totalSeconds
    }

    setTimeLeft(calculateTimeLeft())

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <span className="text-sm font-medium tabular-nums whitespace-nowrap">
      {`00:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`}
    </span>
  )
}
