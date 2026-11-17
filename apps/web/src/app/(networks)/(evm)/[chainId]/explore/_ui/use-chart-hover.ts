'use client'

import format from 'date-fns/format'
import { useCallback, useEffect, useState } from 'react'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import type { TimeframeOption } from './global-stats-charts'

interface HoveredPoint {
  value: number
  date: number
}

export function useChartHover({
  value,
  label,
  chainId,
  timeframe,
}: {
  value: number
  label: string
  chainId: EvmChainId
  timeframe: TimeframeOption
}): {
  value: number
  label: string
  onMouseOver: (params: { data?: number[] }[]) => string
  onMouseLeave: () => void
} {
  const [hovered, setHovered] = useState<HoveredPoint | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: Clear hover when the chart's data or selected period changes.
  useEffect(() => {
    setHovered(null)
  }, [value, label, chainId, timeframe])

  const onMouseOver = useCallback((params: { data?: number[] }[]) => {
    if (!params[0]?.data || !params[1]?.data) return ''

    const date = params[0].data[0]
    const value =
      params[0].data[1] + params[1].data[1] + (params[2]?.data?.[1] ?? 0)

    setHovered((previous) =>
      previous?.date === date && previous.value === value
        ? previous
        : { value, date },
    )

    return ''
  }, [])

  const onMouseLeave = useCallback(() => setHovered(null), [])

  return {
    value: hovered?.value ?? value,
    label: hovered
      ? `${getEvmChainById(chainId).name} · ${format(new Date(hovered.date), 'MMM dd, yyyy')}`
      : label,
    onMouseOver,
    onMouseLeave,
  }
}
