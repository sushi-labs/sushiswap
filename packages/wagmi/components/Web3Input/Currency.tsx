import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Amount, Currency, tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { classNames, Currency as UICurrency, DEFAULT_INPUT_UNSTYLED, Input, Typography } from '@sushiswap/ui'
import { FC, useCallback, useRef, useState } from 'react'

import { usePrices } from '../../hooks'
import { TokenSelector, TokenSelectorProps } from '../TokenSelector'

export interface CurrencyInputProps
  extends Pick<
    TokenSelectorProps,
    'onAddToken' | 'onRemoveToken' | 'onSelect' | 'tokenMap' | 'chainId' | 'customTokenMap'
  > {
  value: string
  disabled?: boolean
  onChange(value: string): void
  currency: Type
  usdPctChange?: number
  balance?: Amount<Currency>
  disableMaxButton?: boolean
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
  disabled,
  value,
  onChange,
  currency,
  onSelect,
  onAddToken,
  onRemoveToken,
  chainId,
  tokenMap,
  customTokenMap,
  disableMaxButton = false,
  balance,
  usdPctChange,
}) => {
  const isMounted = useIsMounted()
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: tokenPrices } = usePrices({ chainId: currency.chainId })
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)
  const price = tokenPrices?.[currency.wrapped.address]
  const parsedValue = tryParseAmount(value, currency)

  const focusInput = useCallback(() => {
    if (disabled) return
    inputRef.current?.focus()
  }, [disabled])

  const handleClose = useCallback(() => {
    setTokenSelectorOpen(false)
  }, [])

  return (
    <div onClick={focusInput}>
      <div className="relative flex items-center gap-1">
        <Input.Numeric
          ref={inputRef}
          variant="unstyled"
          disabled={disabled}
          onUserInput={onChange}
          className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-3xl py-1 text-slate-200 hover:text-slate-100')}
          value={value}
          readOnly={disabled}
        />
        <button
          onClick={(e) => {
            setTokenSelectorOpen(true)
            e.stopPropagation()
          }}
          className="text-slate-200 hover:text-slate-100 transition-all hover:ring-2 ring-slate-500 shadow-md flex flex-row items-center gap-1 text-xl font-medium bg-white bg-opacity-[0.12] rounded-full px-2 py-1"
        >
          <div className="w-5 h-5">
            <UICurrency.Icon disableLink layout="responsive" currency={currency} width={20} height={20} />
          </div>
          <div className="ml-0.5 -mr-0.5">{currency.symbol}</div>
          <div className="w-5 h-5">
            <ChevronDownIcon width={20} height={20} />
          </div>
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <Typography variant="xs" weight={400} className="py-1 select-none text-slate-400">
          {parsedValue && price && isMounted ? `$${parsedValue.multiply(price.asFraction).toFixed(2)}` : ''}
          {usdPctChange && (
            <span
              className={classNames(
                usdPctChange === 0
                  ? ''
                  : usdPctChange > 0
                  ? 'text-green'
                  : usdPctChange < -5
                  ? 'text-red'
                  : usdPctChange < -3
                  ? 'text-yellow'
                  : 'text-slate-500'
              )}
            >
              {' '}
              {`${usdPctChange === 0 ? '' : usdPctChange > 0 ? '(+' : '('}${
                usdPctChange === 0 ? '0.00' : usdPctChange?.toFixed(2)
              }%)`}
            </span>
          )}
        </Typography>

        <div className="h-6">
          <Transition
            appear
            show={Boolean(isMounted && balance)}
            enter="transition duration-300 origin-center ease-out"
            enterFrom="transform scale-90 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <button
              type="button"
              onClick={() => onChange(balance?.greaterThan(0) ? balance.toFixed() : '')}
              className="text-slate-400 hover:text-slate-300 py-1 text-xs"
              disabled={disableMaxButton}
            >
              {isMounted && balance ? `Balance: ${balance.toSignificant(6)}` : ''}
            </button>
          </Transition>
        </div>
      </div>
      <TokenSelector
        variant="dialog"
        onClose={handleClose}
        open={tokenSelectorOpen}
        fundSource={FundSource.WALLET}
        {...{ chainId, currency, onSelect, onAddToken, onRemoveToken, tokenMap, customTokenMap }}
      />
    </div>
  )
}
