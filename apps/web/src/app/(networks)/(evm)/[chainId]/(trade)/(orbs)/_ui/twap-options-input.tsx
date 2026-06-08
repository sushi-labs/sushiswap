import { Radio, RadioGroup } from '@headlessui/react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import {
  type TimeUnit,
  useDurationPanel,
  useInvertTradePanel,
  useLimitPricePanel,
  useTriggerPricePanel,
} from '@orbs-network/spot-react'
import {
  Explainer,
  IconButton,
  Switch,
  TextField,
  Toggle,
  classNames,
} from '@sushiswap/ui'
import type * as React from 'react'
import { useMemo } from 'react'
import { formatUSD } from 'sushi'
import { formatDecimals } from './helper'

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
              <TextField
                type="number"
                allowNegative
                unit="%"
                placeholder="0"
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
          <div className="w-[100px]" />
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
      type="button"
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
        <LabelWithTooltip label="Limit price" />
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
      <LabelWithTooltip label="Trigger price" />
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
