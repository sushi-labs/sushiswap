'use client'

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { COW_EXPIRATIONS } from 'src/lib/swap/cow/chains'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import { formatCowTimestamp } from './cow-format'

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
    <div className="flex items-center justify-between">
      <Label htmlFor="cow-order-expiry">Expires</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="cow-order-expiry"
          aria-label="Order expiry"
          className="w-auto"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {editing && (
            <SelectItem value="keep">
              Keep {formatCowTimestamp(editing.validTo)}
            </SelectItem>
          )}
          {COW_EXPIRATIONS.map((option) => (
            <SelectItem key={option.seconds} value={String(option.seconds)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
