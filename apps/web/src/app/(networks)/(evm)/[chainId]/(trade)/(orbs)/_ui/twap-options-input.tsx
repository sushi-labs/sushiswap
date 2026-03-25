import * as React from 'react'
import { Radio, RadioGroup } from '@headlessui/react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import {
  formatDecimals,
  TimeUnit,
  useDurationPanel,
  useInvertTradePanel,
  useLimitPricePanel,
  useTriggerPricePanel,
} from '@orbs-network/spot-react'
import {
  classNames,
  Explainer,
  IconButton,
  Switch,
  TextField,
  textFieldVariants,
  Toggle,
} from '@sushiswap/ui'
import { formatUSD } from 'sushi'
import { useMemo } from 'react'

// ============ Small UI / helpers ============
function LabelWithTooltip({
  label,
  tooltip,
}: {
  label: string
  tooltip?: string
}) {
  return (
    <div className="flex items-center gap-1 justify-start">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {tooltip && <Explainer>{tooltip}</Explainer>}
    </div>
  )
}

// Allows optional leading minus, digits, optional decimal part (e.g. -5, -2.5, 10.25)
const signedDecimalRegex = /^-?\d*(?:\.\d*)?$/

export interface TwapPercentageInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'size'
> {
  value: string
  onValueChange?: (value: string) => void
  maxDecimals?: number
  unit?: string
  variant?: 'default' | 'naked' | 'outline'
  size?: 'sm' | 'default'
  isError?: boolean
  className?: string
}

export const TwapPercentageInput = React.forwardRef<
  HTMLInputElement,
  TwapPercentageInputProps
>(
  (
    {
      value,
      onValueChange,
      maxDecimals,
      unit = '%',
      variant = 'default',
      size = 'default',
      isError = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const _onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const next = e.target.value.replace(/,/g, '.').replace(/%/g, '')
      if (onValueChange && (next === '' || next === '-')) {
        onValueChange(next)
        return
      }
      if (signedDecimalRegex.test(next)) {
        if (maxDecimals != null && next.includes('.')) {
          const [, decimals] = next.split('.')
          if (decimals.length <= maxDecimals) {
            onValueChange?.(next)
          }
        } else {
          onValueChange?.(next)
        }
      }
    }

    return (
      <div className="group relative flex items-center justify-between w-full">
        <input
          ref={ref}
          value={value}
          onChange={_onChange}
          disabled={disabled}
          placeholder="0"
          inputMode="decimal"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          autoComplete="off"
          className={textFieldVariants({
            isError: isError ? 'yes' : 'no',
            variant,
            hasIcon: 'no',
            hasUnit: unit ? 'yes' : 'no',
            size,
            className: classNames(
              'flex-grow flex-1 !outline-none !ring-0',
              className,
            ),
          })}
          {...props}
        />
        {unit ? (
          <div
            className={textFieldVariants({
              isError: isError ? 'yes' : 'no',
              variant,
              size,
              className:
                'text-muted-foreground rounded-l-none !w-[unset] flex items-center',
            })}
          >
            {unit}
          </div>
        ) : null}
      </div>
    )
  },
)

const TwapPriceConfigHeader = ({
  isTriggerPrice,
}: {
  isTriggerPrice: boolean
}) => {
  const { fromToken, isInverted, isMarketPrice, onInvert } =
    useInvertTradePanel()

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground font-medium">
        {!isInverted
          ? `Sell ${fromToken?.symbol} `
          : `Buy ${fromToken?.symbol} `}
        {!isTriggerPrice && isMarketPrice ? 'at best rate' : 'at rate'}
      </p>

      {!isMarketPrice && (
        <IconButton
          icon={ArrowsUpDownIcon}
          onClick={onInvert}
          name={'Invert'}
          className="!min-h-[30px] !h-[30px] !min-w-[30px] !w-[30px] px-2 transition-transform rotate-0 hover:rotate-180"
        />
      )}
    </div>
  )
}

function PriceConfigSection({
  header,
  onInputChange,
  price,
  isLoading,
  symbol,
  percentage,
  onPercentageChange,
  usd,
  error,
}: {
  header: React.ReactNode
  onInputChange: (value: string) => void
  price: string
  isLoading: boolean
  symbol: string
  percentage: string
  onPercentageChange: (value: string) => void
  usd: string
  error?: boolean
}) {
  return (
    <div className="rounded-xl border border-accent p-3 pb-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2">
          {header}
          <div className="flex gap-2 items-stretch">
            <div
              className={classNames(
                'flex gap-2 rounded-lg p-2 py-1 items-center bg-secondary flex-1',
                error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
              )}
            >
              <p className="text-[18px] font-medium whitespace-nowrap text-muted-foreground">
                {symbol}
              </p>
              <TextField
                type="number"
                variant="naked"
                disabled={false}
                onValueChange={onInputChange}
                value={price}
                readOnly={false}
                maxDecimals={18}
                data-state={isLoading ? 'inactive' : 'active'}
                className={classNames(
                  'p-0 py-1 !text-[22px] font-medium text-right',
                )}
              />
            </div>
            <div
              className={classNames(
                'rounded-lg p-2 py-1 bg-secondary w-[100px] flex items-center justify-center',
                error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
              )}
            >
              <TwapPercentageInput
                type="number"
                variant="naked"
                disabled={false}
                onValueChange={onPercentageChange}
                value={percentage}
                readOnly={false}
                maxDecimals={18}
                data-state={isLoading ? 'inactive' : 'active'}
                className={classNames(
                  'p-0 py-1 !text-[22px] font-medium text-center w-full',
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] text-right font-medium whitespace-nowrap text-muted-foreground flex-1">
            {' '}
            {formatUSD(usd)}
          </p>
          <div className="w-[100px]"></div>
        </div>
      </div>
    </div>
  )
}

const ResetButton = ({
  onReset,
  text,
}: {
  onReset: () => void
  text: string
}) => {
  return (
    <button
      onClick={onReset}
      name="Reset"
      className="text-[13px] font-medium text-muted-foreground hover:text-accent-foreground"
    >
      {text}
    </button>
  )
}

export const TwapLimitPriceConfigSection = ({
  isLimitModule = false,
}: {
  isLimitModule?: boolean
}) => {
  const {
    isLimitPrice,
    toggleLimitPrice,
    label,
    tooltip,
    price,
    percentage,
    toToken,
    onChange,
    onPercentageChange,
    onReset,
    isLoading,
    isTypedValue,
    usd,
    error,
  } = useLimitPricePanel()

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LabelWithTooltip label={label} tooltip={tooltip} />
        {!isLimitModule && (
          <Switch checked={isLimitPrice} onCheckedChange={toggleLimitPrice} />
        )}
      </div>
      {isLimitPrice && <ResetButton onReset={onReset} text="Set to default" />}
    </div>
  )

  if (!isLimitPrice) {
    return header
  }

  return (
    <PriceConfigSection
      header={header}
      onInputChange={onChange}
      price={isTypedValue ? price : formatDecimals(price, 6)}
      isLoading={isLoading ?? false}
      symbol={toToken?.symbol ?? ''}
      percentage={percentage}
      onPercentageChange={onPercentageChange}
      usd={usd}
      error={Boolean(error)}
    />
  )
}

export const TwapTriggerPriceConfigSection = () => {
  const {
    label,
    tooltip,
    price,
    percentage,
    toToken,
    onChange,
    onPercentageChange,
    onReset,
    isLoading,
    isTypedValue,
    usd,
    error,
  } = useTriggerPricePanel()

  const header = (
    <div className="flex items-center justify-between">
      <LabelWithTooltip label={label} tooltip={tooltip} />
      <ResetButton onReset={onReset} text="Set to default" />
    </div>
  )

  return (
    <PriceConfigSection
      header={header}
      onInputChange={onChange}
      price={isTypedValue ? price : formatDecimals(price, 6)}
      isLoading={isLoading ?? false}
      symbol={toToken?.symbol ?? ''}
      percentage={percentage}
      onPercentageChange={onPercentageChange}
      usd={usd}
      error={Boolean(error)}
    />
  )
}

export const TwapPriceConfigPanel = ({
  children,
  isTriggerPrice,
}: {
  children: React.ReactNode
  isTriggerPrice?: boolean
}) => {
  return (
    <div className="rounded-xl border border-accent bg-white dark:bg-slate-800 p-4 space-y-3">
      <TwapPriceConfigHeader isTriggerPrice={isTriggerPrice ?? false} />
      {children}
    </div>
  )
}

const LIMIT_EXPIRATION_OPTIONS = [
  {
    label: '1 day',
    value: TimeUnit.Days,
  },
  {
    label: '1 week',
    value: TimeUnit.Weeks,
  },
  {
    label: '1 month',
    value: TimeUnit.Months,
  },
  {
    label: '1 year',
    value: TimeUnit.Years,
  },
]

export const TwapExpiryInput = ({
  options,
}: {
  options?: { label: string; value: TimeUnit }[]
}) => {
  const { onChange, duration } = useDurationPanel()
  const selected = useMemo(
    () =>
      options?.find((option) => option.value === duration.unit * duration.value)
        ?.value,
    [duration, options],
  )

  return (
    <div className="flex flex-wrap justify-between items-center pb-2">
      <span className="text-muted-foreground font-medium whitespace-nowrap">
        Expires in
      </span>
      <RadioGroup value={selected} className="gap-2 flex py-1">
        {options?.map((option) => (
          <Radio value={option.value} key={option.value}>
            <Toggle
              variant="outline"
              className="whitespace-nowrap !rounded-[50px] !px-4 !h-7"
              onClick={() => onChange({ unit: option.value, value: 1 })}
              pressed={selected === option.value}
            >
              {option.label}
            </Toggle>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  )
}
