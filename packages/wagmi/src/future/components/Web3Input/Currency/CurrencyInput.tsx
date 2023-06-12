import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { Token, tryParseAmount, Type } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { DEFAULT_INPUT_UNSTYLED, Input } from '@sushiswap/ui/future/components/input'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { useAccount } from 'wagmi'

import { TokenSelector } from '../../TokenSelector/TokenSelector'
import { BalancePanel } from './BalancePanel'
import { PricePanel } from './PricePanel'
import { usePrice } from '@sushiswap/react-query'
import { useBalanceWeb3 } from '../../../hooks'
import dynamic from 'next/dynamic'

export interface CurrencyInputProps {
  id?: string
  disabled?: boolean
  value: string
  onChange?(value: string): void
  currency: Type | undefined
  onSelect?(currency: Type): void
  chainId: ChainId
  className?: string
  loading?: boolean
  usdPctChange?: number
  disableMaxButton?: boolean
  type: 'INPUT' | 'OUTPUT'
  fetching?: boolean
  currencyLoading?: boolean
  currencies?: Record<string, Token>
}

export const Component: FC<CurrencyInputProps> = ({
  id,
  disabled,
  value,
  onChange,
  currency,
  onSelect,
  chainId,
  className,
  loading,
  usdPctChange,
  disableMaxButton = false,
  type,
  fetching,
  currencyLoading,
  currencies,
}) => {
  const { address } = useAccount()
  const inputRef = useRef<HTMLInputElement>(null)
  const focusInput = useCallback(() => {
    if (disabled) return
    inputRef.current?.focus()
  }, [disabled])

  const { data: balance, isInitialLoading: isBalanceLoading } = useBalanceWeb3({
    chainId,
    account: address,
    currency,
  })

  const { data: price, isInitialLoading: isPriceLoading } = usePrice({
    chainId: currency?.chainId,
    address: currency?.wrapped?.address,
  })

  const _value = useMemo(() => tryParseAmount(value, currency), [value, currency])
  const insufficientBalance = address && type === 'INPUT' && balance && _value && balance.lessThan(_value)

  // If currency changes, trim input to decimals
  useEffect(() => {
    if (currency && onChange && value && value.includes('.')) {
      const [, decimals] = value.split('.')
      if (decimals.length > currency.decimals) {
        onChange((+value).toFixed(currency.decimals))
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency])

  const isLoading = loading || currencyLoading || isBalanceLoading

  return (
    <div
      className={classNames(
        fetching && type === 'OUTPUT' ? 'shimmer-fast' : '',
        insufficientBalance ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'space-y-2 overflow-hidden pb-2',
        className
      )}
      onClick={focusInput}
    >
      <div className="relative flex items-center gap-4">
        {isLoading ? (
          <div className="flex gap-1 items-center justify-between flex-grow h-[44px]">
            <Skeleton.Box className="w-1/2 h-[32px] rounded-lg" />
          </div>
        ) : (
          <Input.Numeric
            id={id}
            ref={inputRef}
            variant="unstyled"
            disabled={disabled}
            onUserInput={onChange}
            className={classNames(DEFAULT_INPUT_UNSTYLED, 'without-ring !text-3xl py-1')}
            value={value}
            readOnly={disabled}
            maxDecimals={currency?.decimals}
          />
        )}
        {onSelect && (
          <TokenSelector
            id={`${id}-token-selector`}
            currencies={currencies}
            selected={currency}
            chainId={chainId}
            onSelect={onSelect}
          >
            {({ setOpen }) => (
              <button
                id={`${id}-button`}
                type="button"
                testdata-id={`${id}-button`}
                onClick={(e) => {
                  setOpen(true)
                  e.stopPropagation()
                }}
                className={classNames(
                  'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap'
                )}
              >
                {currency ? (
                  <>
                    <div className="w-[28px] h-[28px] mr-0.5">
                      <Currency.Icon disableLink currency={currency} width={28} height={28} />
                    </div>
                    {currency.symbol}
                    <ChevronDownIcon className="ml-1" strokeWidth={3} width={16} height={16} />
                  </>
                ) : (
                  'Select'
                )}
              </button>
            )}
          </TokenSelector>
        )}
        {!onSelect && (
          <div
            id={`${id}-button`}
            className={classNames(
              'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium whitespace-nowrap'
            )}
          >
            {currency ? (
              <>
                <div className="w-[28px] h-[28px] mr-0.5">
                  <Currency.Icon disableLink currency={currency} width={28} height={28} />
                </div>
                {currency.symbol}
              </>
            ) : (
              <span className="text-gray-400 dark:text-slate-500">No token selected</span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-between h-[36px]">
        <PricePanel
          value={value}
          currency={currency}
          usdPctChange={usdPctChange}
          error={insufficientBalance ? 'Exceeds Balance' : undefined}
          loading={isLoading || isPriceLoading}
          price={price}
        />
        <BalancePanel
          id={id}
          loading={isLoading}
          chainId={chainId}
          account={address}
          onChange={onChange}
          currency={currency}
          disableMaxButton={disableMaxButton}
          balance={balance}
          type={type}
        />
      </div>
    </div>
  )
}

export const CurrencyInput = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
