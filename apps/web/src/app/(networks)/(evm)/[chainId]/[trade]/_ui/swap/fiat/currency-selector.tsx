'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { z } from 'zod'
import type { FiatCurrency } from './derivedstate-fiat-provider'
import { FiatSelectorRow } from './fiat-selector-row'
interface CurrencySelectorProps {
  selected: FiatCurrency | undefined
  onSelect(currency: FiatCurrency): void
  children: ReactNode
}

const CurrencySchema = z.object({
  code: z.string(),
  name: z.string(),
  flag: z.string(),
  country: z.string(),
  countryCode: z.string(),
})

const CurrenciesSchema = z.array(CurrencySchema)

export type Currency = z.infer<typeof CurrencySchema>

const useCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const res = await fetch(
        'https://gist.githubusercontent.com/ibrahimhajjaj/a0e39e7330aebf0feb49912f1bf9062f/raw/d160e7d3b0e11ea3912e97a1b3b25b359746c86a/currencies-with-flags.json',
      )

      if (!res.ok) {
        throw new Error('Failed to fetch currencies')
      }

      const json = await res.json()

      const _data = CurrenciesSchema.safeParse(json)
      if (!_data.success) {
        throw new Error('Invalid currency data')
      }
      return _data.data
    },
  })
}

export const CurrencySelector: FC<CurrencySelectorProps> = ({
  selected,
  onSelect,
  children,
}) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { data: currenciesData, isLoading } = useCurrencies()

  const filteredCurrencies = useMemo(() => {
    if (!query || isLoading) return currenciesData || []
    return currenciesData?.filter(
      (currency) =>
        currency.name.toLowerCase().includes(query.toLowerCase()) ||
        currency.code.toLowerCase().includes(query.toLowerCase()) ||
        currency.country.toLowerCase().includes(query.toLowerCase()),
    )
  }, [query, currenciesData, isLoading])

  const _onSelect = useCallback(
    (currency: FiatCurrency) => {
      if (onSelect) {
        onSelect(currency)
      }

      setOpen(false)
    },
    [onSelect],
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(state: boolean) => {
        setOpen(state)
        setQuery('')
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className={classNames(
          'h-[80vh] !flex !flex-col md:!flex-row w-fit !p-0 md:min-w-[565px]',
        )}
      >
        <div className="flex flex-col w-full gap-4 overflow-y-auto hide-scrollbar overflow-x-hidden relative p-6">
          <DialogHeader className="!text-left mb-4">
            <DialogTitle className="text-xl font-medium text-slate-900 dark:text-pink-100">
              Select Currency
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 relative">
            <TextField
              placeholder="Search by name"
              icon={MagnifyingGlassIcon}
              type="text"
              testdata-id={`currency-selector-input`}
              value={query}
              onValueChange={setQuery}
              className="py-5 placeholder:text-slate-450 !dark:text-slate-500 placeholder:dark:text-slate-450 dark:!bg-slate-900 !bg-gray-100"
            />
          </div>
          <div
            id="currency-list-container"
            className="flex flex-1 flex-col flex-grow px-1 py-0.5 hide-scrollbar overflow-y-scroll"
          >
            <p className="text-xs text-slate-450 dark:text-slate-500">
              Balance
            </p>
            <div className="flex-1 flex flex-col">
              {filteredCurrencies?.map((currency) => (
                <FiatSelectorRow
                  key={currency.code}
                  currencySymbol={currency.code}
                  flagImage={currency.flag}
                  countryName={currency.country}
                  selected={selected?.code === currency.code}
                  onSelect={_onSelect}
                  countryCode={currency.countryCode}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
