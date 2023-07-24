import { ChainId } from '@sushiswap/chain'
import { Token, tryParseAmount, Type } from '@sushiswap/currency'
import { usePrice } from '@sushiswap/react-query'
import { classNames } from '@sushiswap/ui'
import { Button, SelectIcon } from '@sushiswap/ui'
import { TextField } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/components/currency'
import { SkeletonBox } from '@sushiswap/ui/components/skeleton'
import dynamic from 'next/dynamic'
import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { useAccount } from 'wagmi'

import { useBalanceWeb3 } from '../../../hooks'
import { TokenSelector } from '../../TokenSelector/TokenSelector'
import { BalancePanel } from './BalancePanel'
import { PricePanel } from './PricePanel'

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
  allowNative?: boolean
  error?: string
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
  allowNative = true,
  error,
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
  const _error = error ? error : insufficientBalance ? 'Exceeds Balance' : undefined

  return (
    <div
      className={classNames(
        fetching && type === 'OUTPUT' ? 'shimmer-fast' : '',
        _error ? '!bg-red-500/20 !dark:bg-red-900/30' : '',
        'space-y-2 overflow-hidden pb-2',
        className
      )}
      onClick={focusInput}
    >
      <div className="relative flex items-center gap-4">
        {isLoading ? (
          <div className="flex gap-1 items-center justify-between flex-grow h-[44px]">
            <SkeletonBox className="w-1/2 h-[32px] rounded-lg" />
          </div>
        ) : (
          <TextField
            testdata-id={`${id}-input`}
            type="number"
            ref={inputRef}
            variant="naked"
            disabled={disabled}
            onValueChange={onChange}
            value={value}
            readOnly={disabled}
            maxDecimals={currency?.decimals}
            className="p-0 py-1 !text-3xl font-medium"
          />
        )}
        {onSelect && (
          <TokenSelector
            id={`${id}-token-selector`}
            currencies={currencies}
            selected={currency}
            chainId={chainId}
            onSelect={onSelect}
            includeNative={allowNative}
          >
            <Button
              size="lg"
              variant={currency ? 'secondary' : 'default'}
              id={id}
              type="button"
              className={classNames(currency ? 'pl-2 pr-3 text-xl' : '', '!rounded-full')}
            >
              {currency ? (
                <>
                  <div className="w-[28px] h-[28px] mr-0.5">
                    <Currency.Icon disableLink currency={currency} width={28} height={28} />
                  </div>
                  {currency.symbol}
                  <SelectIcon />
                </>
              ) : (
                'Select token'
              )}
            </Button>
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
          error={_error}
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
