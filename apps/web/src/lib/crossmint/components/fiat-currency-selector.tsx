'use client'

import { CheckIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TextField,
  classNames,
} from '@sushiswap/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  CROSSMINT_SUPPORTED_FIAT_CURRENCIES,
  type CrossmintSupportedFiatCurrency,
} from 'src/config'
import { FIAT_CURRENCY_DETAILS } from '../fiat-currencies'
import { FiatCurrencyIcon } from './fiat-currency-icon'

export interface FiatCurrencySelectorProps {
  children: ReactNode
  currencies?: readonly CrossmintSupportedFiatCurrency[]
  onSelect(currency: CrossmintSupportedFiatCurrency): void
  selected: CrossmintSupportedFiatCurrency
}

export function FiatCurrencySelector({
  children,
  currencies = CROSSMINT_SUPPORTED_FIAT_CURRENCIES,
  onSelect,
  selected,
}: FiatCurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const filteredCurrencies = useMemo(
    () =>
      currencies.filter((currency) => {
        const details = FIAT_CURRENCY_DETAILS[currency]

        return [currency, details.name, details.symbol].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )
      }),
    [currencies, normalizedQuery],
  )

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const handleSelect = useCallback(
    (currency: CrossmintSupportedFiatCurrency) => {
      onSelect(currency)
      setOpen(false)
    },
    [onSelect],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[80vh] !flex !w-full !flex-col !p-0 md:min-w-[600px]">
        <div className="relative flex min-h-0 flex-1 flex-col gap-4 p-6">
          <DialogHeader className="!text-left">
            <DialogTitle>Select a payment currency</DialogTitle>
            <DialogDescription>
              Search by currency code, name, or symbol.
            </DialogDescription>
          </DialogHeader>
          <TextField
            type="text"
            value={query}
            onValueChange={setQuery}
            icon={MagnifyingGlassIcon}
            placeholder="Search currencies"
            testdata-id="fiat-currency-selector-search-input"
          />
          <div
            role="listbox"
            aria-label="Payment currencies"
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-2"
          >
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => {
                const details = FIAT_CURRENCY_DETAILS[currency]
                const isSelected = currency === selected

                return (
                  <button
                    key={currency}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(currency)}
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none',
                      isSelected && 'bg-secondary',
                    )}
                  >
                    <FiatCurrencyIcon currency={currency} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-medium">
                        {currency.toUpperCase()}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {details.name}
                      </span>
                    </span>
                    {isSelected ? (
                      <CheckIcon
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-blue"
                        strokeWidth={2.5}
                      />
                    ) : null}
                  </button>
                )
              })
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                No payment currencies found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
