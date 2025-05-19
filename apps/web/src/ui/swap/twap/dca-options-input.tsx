import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { TimeUnit } from '@orbs-network/twap-sdk'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Explainer,
  FormattedNumber,
  SkeletonBox,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import { Amount } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { useDerivedStateTwap, useTwapTrade } from './derivedstate-twap-provider'

export const DcaOptionsInput = () => {
  return (
    <div className="flex flex-wrap gap-3 pb-2">
      <DcaTradesInput />
      <DcaIntervalInput />
    </div>
  )
}

const DcaTradesInput = () => {
  const {
    state: { token0, chunks, token0PriceUSD },
    mutate: { setChunks },
  } = useDerivedStateTwap()

  const trade = useTwapTrade()

  const onChange = useCallback(
    (value: string) => {
      if (Number.isNaN(+value)) return
      setChunks(+value)
    },
    [setChunks],
  )

  // const error = useMemo(() => {
  //   // trade size must be at least $50
  // }, [])

  const token0ChunkAmount = useMemo(() => {
    if (!token0 || !trade) return undefined
    return Amount.fromRawAmount(token0, trade.srcChunkAmount)
  }, [token0, trade])

  const token0ChunkAmountUSD = useMemo(() => {
    if (!token0ChunkAmount || !token0PriceUSD) return undefined
    return token0ChunkAmount.multiply(token0PriceUSD).toSignificant(6)
  }, [token0ChunkAmount, token0PriceUSD])

  return (
    <div className="flex-1 flex flex-col gap-1 whitespace-nowrap">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Over</span>
        <Explainer>
          The total number of individual trades that will be scheduled as part
          of your order.
        </Explainer>
      </div>

      <div
        className={classNames(
          // error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
          'px-3 py-4 overflow-hidden border border-accent bg-white dark:bg-slate-800 rounded-xl',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          placeholder="0"
          maxDecimals={0}
          onValueChange={onChange}
          value={chunks}
          className={'!h-5 !min-h-[5] !px-0 !py-0 !text-lg font-medium'}
        />
      </div>
      {trade ? (
        <span className="text-xs text-muted-foreground">
          {token0ChunkAmount ? (
            <FormattedNumber number={token0ChunkAmount.toExact()} />
          ) : (
            '0'
          )}{' '}
          {token0?.symbol} per trade (
          {token0ChunkAmountUSD ? formatUSD(token0ChunkAmountUSD) : '$0'})
        </span>
      ) : (
        <div className="w-40 h-4 py-0.5">
          <SkeletonBox className="h-full" />
        </div>
      )}
    </div>
  )
}

const TimeUnitLabel = {
  [TimeUnit.Days]: 'Days',
  [TimeUnit.Hours]: 'Hours',
  [TimeUnit.Minutes]: 'Minutes',
  [TimeUnit.Months]: 'Months',
  [TimeUnit.Weeks]: 'Weeks',
  [TimeUnit.Years]: 'Years',
} as const

const DcaIntervalInput = () => {
  const {
    state: { fillDelay },
    mutate: { setFillDelay },
  } = useDerivedStateTwap()

  const onValueChange = useCallback(
    (value: string) => {
      if (Number.isNaN(+value)) return
      setFillDelay((prev) => ({ ...prev, value: +value }))
    },
    [setFillDelay],
  )
  const onUnitChange = useCallback(
    (unit: TimeUnit) => {
      setFillDelay((prev) => ({ ...prev, unit }))
    },
    [setFillDelay],
  )

  return (
    <div className="flex-1 flex flex-col gap-1 whitespace-nowrap">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Every</span>
        <Explainer>
          The estimated time that will elapse between each trade in your order.
          Note that as this time includes an allowance of two minutes for bidder
          auction and block settlement, which cannot be predicted exactly,
          actual time may vary.
        </Explainer>
      </div>

      <div
        className={classNames(
          // error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
          'px-3 py-2 overflow-hidden border border-accent bg-white dark:bg-slate-800 rounded-xl flex justify-between items-center',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          placeholder="0"
          maxDecimals={0}
          onValueChange={onValueChange}
          value={fillDelay.value}
          className={
            '!h-[22px] !min-h-[22px] !px-0 !py-1 !text-lg font-medium '
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary rounded-xl capitalize">
            {TimeUnitLabel[fillDelay.unit]}
            <ChevronDownIcon width={14} height={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {Object.values(TimeUnitLabel).map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onUnitChange(TimeUnit[value])}
                  className="cursor-pointer"
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
