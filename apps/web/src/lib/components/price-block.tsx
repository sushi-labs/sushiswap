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
import { type ReactElement, useCallback, useEffect, useState } from 'react'
import type { Currency } from 'sushi'

interface PriceBlockProps {
  id?: string
  token0?: Currency
  token1?: Currency
  unit?: string
  label: string
  value: string
  decrement(): unknown
  increment(): unknown
  onUserInput(value: string): void
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  locked?: boolean
  focus?: boolean
}

export function PriceBlock({
  id,
  locked,
  onUserInput,
  decrement,
  increment,
  decrementDisabled,
  incrementDisabled,
  token0,
  token1,
  unit,
  label,
  value,
  focus = false,
}: PriceBlockProps): ReactElement {
  const [localValue, setLocalValue] = useState(value)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) {
      setLocalValue(value)
    }
  }, [focused, value])

  const commitInput = useCallback(() => {
    setFocused(false)
    onUserInput(localValue)
  }, [localValue, onUserInput])

  function handleStep(step: () => unknown): void {
    setFocused(false)
    const nextValue = step()
    if (typeof nextValue === 'string') {
      onUserInput(nextValue)
    }
  }

  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>
          {unit ?? `${token1?.symbol ?? ''} per ${token0?.symbol ?? ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <TextField
            id={id}
            autoFocus={focus}
            variant="naked"
            testdata-id={`${id}-input`}
            type="number"
            value={localValue}
            onValueChange={setLocalValue}
            onFocus={() => setFocused(true)}
            onBlur={commitInput}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur()
              }
            }}
            disabled={locked}
            className="pt-1 pb-2 text-3xl font-medium"
          />
          <div className="flex gap-1">
            <button
              type="button"
              disabled={decrementDisabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleStep(decrement)}
              className={classNames(
                decrementDisabled
                  ? 'opacity-40'
                  : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                'flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-700',
              )}
              tabIndex={-1}
            >
              <MinusIcon width={12} height={12} />
            </button>
            <button
              type="button"
              disabled={incrementDisabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleStep(increment)}
              className={classNames(
                incrementDisabled
                  ? 'opacity-40'
                  : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                'flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-700',
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
