'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Button, TextField, classNames } from '@sushiswap/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import {
  CROSSMINT_SUPPORTED_FIAT_CURRENCIES,
  type CrossmintSupportedFiatCurrency,
} from 'src/config'
import { FIAT_CURRENCY_DETAILS } from '../fiat-currencies'
import { useFiatLocale } from '../hooks/use-fiat-locale'
import { FiatCurrencyIcon } from './fiat-currency-icon'
import { FiatCurrencySelector } from './fiat-currency-selector'

export interface FiatInputProps {
  className?: string
  currencies?: readonly CrossmintSupportedFiatCurrency[]
  currency: CrossmintSupportedFiatCurrency
  disabled?: boolean
  id?: string
  label?: ReactNode
  onChange?(value: string): void
  onCurrencyChange?(currency: CrossmintSupportedFiatCurrency): void
  value: string
}

function truncateAmount(value: string, minorUnits: number): string {
  if (!value.includes('.')) return value

  const [whole, fraction = ''] = value.split('.')

  if (minorUnits === 0) return whole

  return `${whole}.${fraction.slice(0, minorUnits)}`
}

export function FiatInput({
  className,
  currencies = CROSSMINT_SUPPORTED_FIAT_CURRENCIES,
  currency,
  disabled = false,
  id,
  label,

  onChange,
  onCurrencyChange,
  value,
}: FiatInputProps) {
  const [localValue, setLocalValue] = useState<string>('')
  const [pending, startTransition] = useTransition()
  const currencyDetails = FIAT_CURRENCY_DETAILS[currency]
  const resolvedLocale = useFiatLocale()

  const _onChange = useCallback(
    (value: string) => {
      setLocalValue(value)
      startTransition(() => {
        onChange?.(value)
      })
    },
    [onChange],
  )

  const formattedAmountParts = useMemo(
    () =>
      new Intl.NumberFormat(resolvedLocale, {
        currency: currency.toUpperCase(),
        currencyDisplay: 'symbol',
        style: 'currency',
      }).formatToParts(Number(value) || 0),
    [currency, resolvedLocale, value],
  )

  useEffect(() => {
    if (!onChange) return

    const truncatedValue = truncateAmount(value, currencyDetails.minorUnits)

    if (truncatedValue !== value) {
      onChange(truncatedValue)
    }
  }, [currencyDetails.minorUnits, onChange, value])

  const currencySelector = useMemo(
    () =>
      onCurrencyChange ? (
        <FiatCurrencySelector
          currencies={currencies}
          selected={currency}
          onSelect={onCurrencyChange}
        >
          <Button
            type="button"
            size="lg"
            variant="secondary"
            disabled={disabled}
            aria-label={`Select payment currency. Current currency: ${currency.toUpperCase()}`}
            className="!rounded-full !py-1 !pl-2 !pr-3"
          >
            <FiatCurrencyIcon currency={currency} />
            <span className="text-xl">{currency.toUpperCase()}</span>
            <ChevronDownIcon aria-hidden="true" className="h-4 w-4" />
          </Button>
        </FiatCurrencySelector>
      ) : (
        <div
          id={id ? `${id}-currency` : undefined}
          className="flex items-center gap-2 whitespace-nowrap rounded-full bg-secondary py-2 pl-2 pr-3 text-xl font-medium"
        >
          <FiatCurrencyIcon currency={currency} />
          {currency.toUpperCase()}
        </div>
      ),
    [onCurrencyChange, currencies, currency, disabled, id],
  )
  return (
    <div
      className={classNames(
        'relative space-y-2 overflow-hidden pb-2 border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl',
        className,
      )}
    >
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <div className="relative flex items-center gap-4">
        <div className="flex flex-1 items-center">
          <TextField
            id={id}
            type="number"
            variant="naked"
            disabled={disabled}
            onValueChange={_onChange}
            value={pending ? localValue : value}
            readOnly={disabled}
            maxDecimals={currencyDetails.minorUnits}
            className={classNames('p-0 py-1 !text-3xl font-medium')}
          />
        </div>

        {currencySelector}
      </div>
      <div className="flex flex-row items-center justify-start h-[36px]">
        <p
          className={classNames(
            'font-medium text-lg flex items-baseline select-none text-gray-500 dark:text-slate-400',
          )}
        >
          {formattedAmountParts.map((part, index) => (
            <span
              key={`${part.type}-${index}`}
              className={classNames(
                part.type === 'fraction' && 'text-sm font-semibold',
              )}
            >
              {part.value}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
