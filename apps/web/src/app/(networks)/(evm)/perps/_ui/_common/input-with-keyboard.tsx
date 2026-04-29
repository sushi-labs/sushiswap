'use client'
import { useBreakpoint } from '@sushiswap/hooks'
import { Currency, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { currencyFormatter } from 'src/lib/perps'
import { Amount } from 'sushi'
import type { EvmAddress, EvmCurrency } from 'sushi/evm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { PerpsCard } from './perps-card'

export const InputWithKeyboard = ({
  amount,
  setAmount,
  balance,
  currency,
  isLoading,
  address,
}: {
  amount: string
  setAmount: (value: string) => void
  balance: Amount<EvmCurrency> | undefined
  currency: EvmCurrency
  error: string | undefined
  isLoading: boolean
  address: EvmAddress | undefined
}) => {
  const widthRef = useRef<HTMLInputElement | null>(null)
  const { isLg } = useBreakpoint('lg')

  const { data: price } = usePrice({
    chainId: currency?.chainId,
    address: currency?.wrap().address,
  })

  // If currency changes, trim input to decimals
  useEffect(() => {
    if (currency && setAmount && amount?.includes('.')) {
      const [, decimals] = amount.split('.')
      if (decimals.length > currency.decimals) {
        setAmount(Number(amount).toFixed(currency.decimals))
      }
    }
  }, [amount, setAmount, currency])

  const parsedValue = useMemo(
    () => (currency ? Amount.tryFromHuman(currency, amount) : undefined),
    [currency, amount],
  )
  const usdValue = useMemo(
    () =>
      parsedValue && price
        ? `${(
            (price * Number(parsedValue.amount)) /
              10 ** parsedValue.currency.decimals
          ).toFixed(2)}`
        : '0.00',
    [parsedValue, price],
  )

  const handleMaxAmount = useCallback(() => {
    setAmount(balance?.toString() || '0')
  }, [balance, setAmount])

  useEffect(() => {
    const getWidthOfText = () => {
      if (!widthRef.current) return 0
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return 0
      const style = getComputedStyle(widthRef.current)
      const font = `${style.fontSize} ${style.fontFamily}`
      context.font = font
      const metrics = context.measureText(amount || '0')
      return metrics.width
    }
    const width = getWidthOfText()
    if (widthRef.current) {
      const offet = amount ? 30 : 60
      widthRef.current.style.width = `${width + offet}px`
    }
  }, [amount])

  return (
    <div className="flex flex-col gap-1">
      <PerpsCard className="flex flex-col items-center justify-center gap-3 py-12 lg:py-6 p-6 overflow-hidden">
        <div className="w-[28px] h-[28px] block lg:hidden">
          <Currency.Icon
            disableLink
            currency={currency}
            width={28}
            height={28}
          />
        </div>
        <div className="lg:relative">
          <div className="w-[28px] h-[28px] hidden lg:block absolute -left-[28px] top-1/2 -translate-y-1/2">
            <Currency.Icon
              disableLink
              currency={currency}
              width={28}
              height={28}
            />
          </div>
          <TextField
            type="number"
            variant="naked"
            disabled={!address || isLoading || !isLg}
            onValueChange={setAmount}
            value={amount}
            readOnly={isLoading || !address}
            maxDecimals={2}
            data-state={isLoading ? 'inactive' : 'active'}
            className={classNames(
              'p-0 py-1 !text-5xl font-medium !text-center',
            )}
            ref={widthRef}
          />
        </div>
        <p className="text-perps-muted-50 text-xs">
          ~{currencyFormatter.format(Number(usdValue))}
        </p>
      </PerpsCard>
      <button
        type="button"
        onClick={handleMaxAmount}
        className="text-xs lg:text-sm text-perps-muted-50 underline hover:text-perps-muted-70 px-2 py-1 self-center lg:self-end"
      >
        Balance: {balance ? balance.toSignificant(6) : '0.00'} {
          currency.symbol
        }{' '}
      </button>
      {isLg ? null : <KeyboardInput amount={amount} setAmount={setAmount} />}
    </div>
  )
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
]

const KeyboardInput = ({
  amount,
  setAmount,
  maxDecimals = 2,
}: {
  amount: string
  setAmount: (value: string) => void
  maxDecimals?: number
}) => {
  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      setAmount(amount.slice(0, -1))
    } else if (key === '.' && amount.includes('.')) {
      return
    } else {
      // Prevent more than maxDecimals decimals
      if (key === '.' && maxDecimals === 0) return
      if (amount.includes('.')) {
        const decimals = amount.split('.')[1]
        if (decimals.length >= maxDecimals) return
      }
      //prevent leading zeros
      if (key === '0' && !amount) return
      setAmount(amount + key)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.flat().map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          className="p-2 hover:bg-perps-muted/5 rounded-lg text-3xl"
          type="button"
        >
          {key}
        </button>
      ))}
    </div>
  )
}
