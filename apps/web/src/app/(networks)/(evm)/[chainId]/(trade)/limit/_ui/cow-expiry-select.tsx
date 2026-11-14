'use client'

import { Tabs, TabsList, TabsTrigger } from '@sushiswap/ui'
import { COW_EXPIRATIONS } from 'src/lib/swap/cow/chains'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import { formatCowDate } from './cow-format'

// `value` is a duration in seconds, or `keep` for an edited order's expiry.
export function CowExpirySelect({
  value,
  onChange,
  editing,
}: {
  value: string
  onChange(value: string): void
  editing: CowOrder | undefined
}): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1">
      <span className="text-sm text-muted-foreground">Expires in</span>
      <Tabs value={value} onValueChange={onChange}>
        <TabsList aria-label="Order expiry">
          {editing && (
            <TabsTrigger value="keep">
              Keep {formatCowDate(editing.validTo)}
            </TabsTrigger>
          )}
          {COW_EXPIRATIONS.map((option) => (
            <TabsTrigger key={option.seconds} value={String(option.seconds)}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
