import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { useEffect, useState } from 'react'
import { useActiveAsset } from 'src/lib/perps/use-active-asset'
import { useInitialDecimals } from 'src/lib/perps/use-initial-decimals'
import {
  currencyFormatter,
  getSignForValue,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { formatNumber, formatPercent } from 'sushi'
import { usePerpState } from '../perp-state-provider'
import { ValueSensitiveText } from '../value-sensitive-text'

export const PerpTokenStats = () => {
  const {
    state: { activeAsset },
  } = usePerpState()
  const { data: tokenData } = useActiveAsset({
    assetString: activeAsset,
  })
  const initialDecimals = useInitialDecimals(tokenData?.markPrice)

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
          formatOptions={{
            minimumFractionDigits: initialDecimals,
            maximumFractionDigits: initialDecimals,
          }}
          value={tokenData?.markPrice?.toString() ?? ''}
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
          formatOptions={{
            minimumFractionDigits: initialDecimals,
            maximumFractionDigits: initialDecimals,
          }}
          value={tokenData?.oraclePrice?.toString() ?? ''}
          className="text-sm font-medium tabular-nums"
          allowColorChange={false}
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Change</div>

        <p
          className={classNames(
            'text-sm whitespace-nowrap tabular-nums font-medium',
            tokenData?.change24hAbs &&
              getTextColorClass(Number(tokenData.change24hAbs)),
          )}
        >
          {getSignForValue(Number(tokenData?.change24hAbs ?? 0))}
          {formatNumber(Number(tokenData?.change24hAbs ?? 0).toFixed(2))} /{' '}
          {getSignForValue(Number(tokenData?.change24hPct ?? 0))}
          {formatPercent(tokenData?.change24hPct)}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Volume</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {currencyFormatter.format(Number(tokenData?.volume24hUsd ?? 0))}
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
          {currencyFormatter.format(Number(tokenData?.openInterestUsd ?? 0))}
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
            {(Number(tokenData?.fundingPct ?? 0) * 100).toFixed(4)}%
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
