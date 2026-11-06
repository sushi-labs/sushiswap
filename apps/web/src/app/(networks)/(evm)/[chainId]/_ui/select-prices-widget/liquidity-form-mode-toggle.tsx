'use client'

import type { ReactElement } from 'react'
import { SegmentedControl } from 'src/lib/components/segmented-control'

export type LiquidityFormMode = 'simple' | 'advanced'

export function LiquidityFormModeToggle({
  mode,
  onModeChange,
}: {
  mode: LiquidityFormMode
  onModeChange(mode: LiquidityFormMode): void
}): ReactElement {
  return (
    <SegmentedControl<LiquidityFormMode>
      label="Form mode"
      value={mode}
      onValueChange={onModeChange}
      options={[
        { value: 'simple', label: 'Simple' },
        { value: 'advanced', label: 'Advanced' },
      ]}
      variant="primary"
    />
  )
}
