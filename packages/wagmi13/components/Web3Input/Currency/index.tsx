'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui13'
import { Currency } from '@sushiswap/ui13/components/currency'
import { DEFAULT_INPUT_UNSTYLED, Input } from '@sushiswap/ui13/components/input'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import React, { FC, useCallback, useMemo, useRef } from 'react'
import { useAccount } from 'wagmi'

import { TokenSelector } from '../../TokenSelector/TokenSelector'
import { BalancePanel } from './BalancePanel'
import { PricePanel } from './PricePanel'

export interface CurrencyInputProps {
  id?: string
  disabled?: boolean
  value: string
  onChange(value: string): void
  currency: Type | undefined
  onSelect?(currency: Type): void
  chainId: ChainId
  className?: string
  loading?: boolean
  usdPctChange?: number
  fundSource?: FundSource
  disableMaxButton?: boolean
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
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
  fundSource = FundSource.WALLET,
  disableMaxButton = false,
}) => {
  const { address } = useAccount()
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = useCallback(() => {
    if (disabled) return
    inputRef.current?.focus()
  }, [disabled])

  return useMemo(
    () => (
      <div className={classNames('transition-all duration-[400ms]', className)} onClick={focusInput}>
        <div className="relative flex items-center gap-1">
          {loading ? (
            <div className="flex flex-col gap-1 justify-center flex-grow h-[44px]">
              <Skeleton.Box className="w-[120px] h-[22px] bg-white/[0.06] rounded-full" />
            </div>
          ) : (
            <Input.Numeric
              testdata-id={`${id}-input`}
              ref={inputRef}
              variant="unstyled"
              disabled={disabled}
              onUserInput={onChange}
              className={classNames(
                DEFAULT_INPUT_UNSTYLED,
                'without-ring !text-3xl py-1 text-gray-900 dark:text-slate-200 hover:dark:text-slate-100'
              )}
              value={value}
              readOnly={disabled}
            />
          )}
          {onSelect ? (
            <TokenSelector
              id={`${id}-token-selector`}
              selected={currency}
              chainId={chainId}
              onSelect={onSelect}
              fundSource={fundSource}
            >
              {({ setOpen }) => (
                <button
                  id={`${id}-button`}
                  onClick={() => setOpen(true)}
                  className={classNames(
                    'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12]'
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
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-row justify-between h-[24px]">
          <PricePanel value={value} currency={currency} usdPctChange={usdPctChange} />
          <div className="h-6">
            <BalancePanel
              id={id}
              loading={loading}
              chainId={chainId}
              account={address}
              onChange={onChange}
              currency={currency}
              fundSource={fundSource}
              disableMaxButton={disableMaxButton}
            />
          </div>
        </div>
      </div>
    ),
    [
      address,
      chainId,
      className,
      currency,
      disableMaxButton,
      disabled,
      focusInput,
      fundSource,
      id,
      loading,
      onChange,
      onSelect,
      usdPctChange,
      value,
    ]
  )
}
