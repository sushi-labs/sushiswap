'use client'
import { Switch } from '@sushiswap/ui'
import { usePositionFilters } from './position-filters-provider'

export const HideClosedPositions = () => {
  const {
    state: { tab, hideClosedPositions },
    mutate: { setHideClosedPositions },
  } = usePositionFilters()
  if (tab !== 'v3') return null
  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <span className="text-sm font-medium text-muted-foreground">
        Hide closed
      </span>
      <Switch
        checked={hideClosedPositions}
        onCheckedChange={(checked) => setHideClosedPositions(checked)}
      />
    </div>
  )
}
