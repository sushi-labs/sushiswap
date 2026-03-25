import { ChevronDownIcon } from '@heroicons/react/24/solid'
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
import { TWAP_MAX_FILL_DELAY, TWAP_MIN_FILL_DELAY } from 'src/lib/swap/twap'
import { formatUSD } from 'sushi'
import {
  InputErrors,
  TimeUnit,
  useFillDelayPanel,
  useTradesPanel,
} from '@orbs-network/spot-react'
import { useTwapMinTradeSize } from '../../_ui/hooks'

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
    onChange: onTradesChange,
    error,
    totalTrades,
    fromToken,
    amountPerTradeUsd,
    amountPerTrade,
  } = useTradesPanel()
  const minTradeSize = useTwapMinTradeSize()

  const onChange = useCallback(
    (value: string) => {
      if (Number.isNaN(+value)) return
      onTradesChange(+value)
    },
    [onTradesChange],
  )

  return (
    <div className="flex-1 flex flex-col gap-1 whitespace-nowrap">
      <div className="flex justify-start items-center gap-1">
        <span className="text-sm text-muted-foreground">Over</span>
        <Explainer>
          The total number of individual trades that will be scheduled as part
          of your order.
        </Explainer>
      </div>

      <div
        className={classNames(
          error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
          'px-3 py-4 overflow-hidden border border-accent bg-white dark:bg-slate-800 rounded-xl',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          placeholder="0"
          maxDecimals={0}
          onValueChange={onChange}
          value={totalTrades}
          className={'!h-[20px] !min-h-[5px] !px-0 !py-1 !text-lg font-medium'}
        />
      </div>
      <span
        className={classNames(
          error ? 'text-red' : '',
          'text-xs text-muted-foreground',
        )}
      >
        {amountPerTrade ? <FormattedNumber number={amountPerTrade} /> : '0'}{' '}
        {fromToken?.symbol} per trade (
        {amountPerTradeUsd ? formatUSD(amountPerTradeUsd) : '$0'}
        {error ? ` - min $${minTradeSize}` : ''})
      </span>
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
    onInputChange,
    onUnitSelect,
    error: fillDelayError,
    fillDelay,
  } = useFillDelayPanel()
  const onValueChange = useCallback(
    (value: string) => {
      if (Number.isNaN(+value)) return
      onInputChange(value)
    },
    [onInputChange],
  )
  const onUnitChange = useCallback(
    (unit: TimeUnit) => {
      onUnitSelect(unit)
    },
    [onUnitSelect],
  )

  return (
    <div className="flex-1 flex flex-col gap-1 whitespace-nowrap">
      <div className="flex justify-start items-center gap-1">
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
          fillDelayError ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
          'px-3 py-2 overflow-hidden border border-accent bg-white dark:bg-slate-800 rounded-xl flex justify-between items-center',
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
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary rounded-xl capitalize">
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

      {fillDelayError?.type === InputErrors.MIN_FILL_DELAY ? (
        <span className="text-xs text-red">
          Must be ≥ {TWAP_MIN_FILL_DELAY.value}{' '}
          {TimeUnitLabel[TWAP_MIN_FILL_DELAY.unit].toLowerCase()}
        </span>
      ) : fillDelayError?.type === InputErrors.MAX_FILL_DELAY ? (
        <span className="text-xs text-red">
          {' '}
          Must be ≤ {TWAP_MAX_FILL_DELAY.value}{' '}
          {TimeUnitLabel[TWAP_MAX_FILL_DELAY.unit].toLowerCase()}
        </span>
      ) : null}
    </div>
  )
}
