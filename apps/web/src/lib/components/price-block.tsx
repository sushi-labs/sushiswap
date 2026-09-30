'use client'

import { MinusIcon, PlusIcon } from '@heroicons/react-v1/solid'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TextField,
} from '@sushiswap/ui'
import { type ReactElement, useState } from 'react'
import type { Currency } from 'sushi'

interface PriceBlockProps {
  id?: string
  token0: Currency | undefined
  token1: Currency | undefined
  label: string
  value: string
  decrement(): string | undefined
  increment(): string | undefined
  onUserInput(value: string): void
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  locked?: boolean
  focus?: boolean
}

export function PriceBlock({
  id,
  token0,
  token1,
  label,
  value,
  decrement,
  increment,
  onUserInput,
  decrementDisabled,
  incrementDisabled,
  locked,
  focus = false,
}: PriceBlockProps): ReactElement {
  const [draft, setDraft] = useState<string>()
  function step(callback: PriceBlockProps['increment']): void {
    setDraft(undefined)
    const next = callback()
    if (typeof next === 'string') onUserInput(next)
  }
  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>
          {token1?.symbol} per {token0?.symbol}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <TextField
            id={id}
            aria-label={label}
            autoFocus={focus}
            variant="naked"
            testdata-id={`${id}-input`}
            type="text"
            inputMode="decimal"
            value={draft ?? value}
            onValueChange={setDraft}
            onBlur={() => {
              if (draft !== undefined && draft !== value) onUserInput(draft)
              setDraft(undefined)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
            disabled={locked}
            className="text-3xl font-medium pt-1 pb-2"
          />
          <div className="flex gap-1">
            <button
              type="button"
              aria-label={`Decrease ${label.toLowerCase()}`}
              disabled={locked || decrementDisabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => step(decrement)}
              className="flex items-center justify-center w-6 h-6 bg-secondary hover:bg-muted rounded-full disabled:opacity-40"
            >
              <MinusIcon width={12} height={12} />
            </button>
            <button
              type="button"
              aria-label={`Increase ${label.toLowerCase()}`}
              disabled={locked || incrementDisabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => step(increment)}
              className="flex items-center justify-center w-6 h-6 bg-secondary hover:bg-muted rounded-full disabled:opacity-40"
            >
              <PlusIcon width={12} height={12} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
