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
import {
  TWAP_MAX_FILL_DELAY,
  TWAP_MIN_FILL_DELAY,
  TwapSDK,
} from 'src/lib/swap/twap'
import { formatUSD } from 'sushi/format'
import {
  useDerivedStateTwap,
  useTwapTradeErrors,
} from './derivedstate-twap-provider'

export const DCAOptionsInput = () => {
  return (
    <div className="flex flex-wrap gap-3 pb-2">
      <DCATradesInput />
      <DCAIntervalInput />
    </div>
  )
}

const DCATradesInput = () => {
  const {
    state: { chainId, token0, chunks, token0PriceUSD, amountInPerChunk },
    mutate: { setChunks },
    isLoading,
  } = useDerivedStateTwap()

  const { minTradeSizeError } = useTwapTradeErrors()

  const onChange = useCallback(
    (value: string) => {
      if (Number.isNaN(+value)) return
      setChunks(+value)
    },
    [setChunks],
  )

  const token0ChunkAmountUSD = useMemo(() => {
    if (!amountInPerChunk || !token0PriceUSD) return undefined
    return amountInPerChunk.multiply(token0PriceUSD).toSignificant(6)
  }, [amountInPerChunk, token0PriceUSD])

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
          'px-3 py-4 overflow-hidden border border-accent bg-gray-100 dark:bg-slate-900 rounded-xl',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          placeholder="0"
          maxDecimals={0}
          onValueChange={onChange}
          value={chunks}
          className={'!h-[20px] !min-h-[5px] !px-0 !py-1 !text-lg font-medium'}
        />
      </div>
      {!isLoading ? (
        <span
          className={classNames(
            minTradeSizeError ? 'text-red' : '',
            'text-xs text-muted-foreground',
          )}
        >
          {amountInPerChunk ? (
            <FormattedNumber number={amountInPerChunk.toExact()} />
          ) : (
            '0'
          )}{' '}
          {token0?.symbol} per trade (
          {token0ChunkAmountUSD ? formatUSD(token0ChunkAmountUSD) : '$0'}
          {minTradeSizeError
            ? ` - min $${TwapSDK.onNetwork(chainId).config.minChunkSizeUsd}`
            : ''}
          )
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
  [TimeUnit.Minutes]: 'Minutes',
  [TimeUnit.Hours]: 'Hours',
  [TimeUnit.Days]: 'Days',
} as const

const DCAIntervalInput = () => {
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

  const { minFillDelayError, maxFillDelayError } = useTwapTradeErrors()

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
          minFillDelayError || maxFillDelayError
            ? '!bg-red-500/20 !dark:bg-red-900/30'
            : '',
          'px-3 py-2 overflow-hidden border border-accent bg-gray-100 dark:bg-slate-900 rounded-xl flex justify-between items-center',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          placeholder="1"
          maxDecimals={0}
          onValueChange={onValueChange}
          value={fillDelay.value}
          className={'!h-[22px] !min-h-[22px] !px-0 !py-1 !text-lg font-medium'}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm !bg-[#0000001F] dark:!bg-[#FFFFFF1F] rounded-xl capitalize">
            {TimeUnitLabel[fillDelay.unit as keyof typeof TimeUnitLabel]}
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

      {minFillDelayError ? (
        <span className="text-xs text-red">
          Must be ≥ {TWAP_MIN_FILL_DELAY.value}{' '}
          {TimeUnitLabel[TWAP_MIN_FILL_DELAY.unit].toLowerCase()}
        </span>
      ) : maxFillDelayError ? (
        <span className="text-xs text-red">
          {' '}
          Must be ≤ {TWAP_MAX_FILL_DELAY.value}{' '}
          {TimeUnitLabel[TWAP_MAX_FILL_DELAY.unit].toLowerCase()}
        </span>
      ) : null}
    </div>
  )
}
