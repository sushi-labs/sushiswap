'use client'

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
import { type FC, useCallback, useEffect, useState } from 'react'
import type { EvmCurrency } from 'sushi/evm'

interface PriceBlockProps {
  id?: string
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  label: string
  value: string
  decrement(): string
  increment(): string
  onUserInput(value: string): void
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  locked?: boolean
  focus?: boolean
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
}) => {
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

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
      setTimeout(() => setLocalValue(value), 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <Card
      className="bg-transparent shadow-none"
      onBlur={handleOnBlur}
      onFocus={() => setUseLocalValue(true)}
    >
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>
          {token1?.symbol} per {token0?.symbol}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
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
          <div className="flex gap-1">
            <button
              type="button"
              disabled={decrementDisabled}
              onClick={handleDecrement}
              className={classNames(
                decrementDisabled
                  ? 'opacity-40'
                  : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
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
                'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
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
