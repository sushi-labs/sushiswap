import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { useAssetList } from 'src/lib/perps/use-asset-list'
import {
  currencyFormatter,
  getSignForValue,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { formatNumber, formatPercent } from 'sushi'
import { ValueSensitiveText } from '../value-sensitive-text'

export const PerpTokenStats = () => {
  const { data } = useAssetList()
  //todo: provider for selected token
  const token = data?.perp?.get?.('BTC-USDC')
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
            maximumFractionDigits: 0,
          }}
          value={token?.markPrice?.toString() ?? ''}
          className="text-sm font-medium  tabular-nums"
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

        <p className="text-sm font-medium  tabular-nums">
          {token?.oraclePrice?.toString() ?? '0'}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Change</div>

        <p
          className={classNames(
            'text-sm whitespace-nowrap tabular-nums',
            token?.change24hAbs &&
              getTextColorClass(Number(token.change24hAbs)),
          )}
        >
          {getSignForValue(Number(token?.change24hAbs ?? 0))}
          {formatNumber(token?.change24hAbs ?? 0)} /{' '}
          {getSignForValue(Number(token?.change24hPct ?? 0))}
          {formatPercent(token?.change24hPct)}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Volume</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {currencyFormatter.format(Number(token?.volume24hUsd ?? 0))}
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
          {currencyFormatter.format(Number(token?.openInterestUsd ?? 0))}
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
        <p
          className={classNames(
            'text-sm tabular-nums font-medium whitespace-nowrap',
          )}
        >
          {(Number(token?.fundingPct ?? 0) * 100).toFixed(4)}%
        </p>
      </div>
    </>
  )
}
