import { MinusIcon, PlusIcon } from '@heroicons/react-v1/solid'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import type { Price } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

interface PriceBlockProps {
  id: string | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  label: string
  value: string
  decrement(): string
  increment(): string
  onUserInput(val: string): void
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  locked?: boolean
  focus?: boolean
  price: Price<EvmCurrency, EvmCurrency> | undefined
}

export const PriceBlock: FC<PriceBlockProps> = ({
  id,
  locked,
  onUserInput,
  decrement,
  increment,
  decrementDisabled,
  incrementDisabled,
  token0,
  token1,
  label,
  value,
  focus = false,
  price,
}) => {
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(localValue)
  }, [localValue, onUserInput])

  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  const priceDifferencePercentage = useMemo(() => {
    if (!price) return undefined
    const currentQuotePrice = price.asFraction
      .mul(price.scalar)
      .toSignificant(6)
    const currentBasePrice = price
      .invert()
      .asFraction.mul(price.scalar)
      .toSignificant(6)
    const valueIsBase = token1?.wrap().isSame(price.base.wrap())

    const localPrice = Number.parseFloat(localValue || '0')
    if (Number.isNaN(localPrice) || localPrice <= 0) return undefined
    if (valueIsBase && localPrice === Number.parseFloat(currentBasePrice))
      return '100'
    if (!valueIsBase && localPrice === Number.parseFloat(currentQuotePrice))
      return '100'
    const priceDifference = valueIsBase
      ? (localPrice - Number.parseFloat(currentBasePrice)) /
        Number.parseFloat(currentBasePrice)
      : (localPrice - Number.parseFloat(currentQuotePrice)) /
        Number.parseFloat(currentQuotePrice)
    const percentageDifference = priceDifference * 100

    if (Math.abs(percentageDifference) < 0.01) return '0'
    return percentageDifference.toFixed(2)
  }, [price, localValue, token1])

  return (
    <Card
      className="!bg-gray-100 dark:!bg-slate-900 shadow-none border-0"
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
    >
      <CardHeader className="!p-4">
        <CardTitle className="font-semibold dark:text-pink-100 text-slate-900 !text-lg">
          {label}
        </CardTitle>
        <CardDescription className="text-sm text-slate-450">
          {token1?.symbol} per {token0?.symbol}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <TextField
              autoFocus={focus}
              variant="naked"
              testdata-id={`${id}-input`}
              type="number"
              value={localValue}
              onValueChange={setLocalValue}
              disabled={locked}
              tabIndex={0}
              className="text-3xl font-medium pt-1 pb-2"
            />
            <div className="text-sm text-accent-foreground dark:text-slate-500">
              ({value === '∞' ? '∞' : priceDifferencePercentage || 0}%)
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              type="button"
              disabled={decrementDisabled}
              onClick={handleDecrement}
              className={classNames(
                decrementDisabled
                  ? 'opacity-40'
                  : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                'flex items-center justify-center w-8 h-8 bg-[#0000001F] dark:bg-[#ffffff1F] rounded-full',
              )}
              tabIndex={-1}
            >
              <MinusIcon width={12} height={12} />
            </button>
            <button
              type="button"
              disabled={incrementDisabled}
              onClick={handleIncrement}
              onKeyDown={handleIncrement}
              className={classNames(
                incrementDisabled
                  ? 'opacity-40'
                  : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                'flex items-center justify-center w-8 h-8 bg-[#0000001F] dark:bg-[#ffffff1F] rounded-full',
              )}
              tabIndex={-1}
            >
              <PlusIcon width={12} height={12} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
