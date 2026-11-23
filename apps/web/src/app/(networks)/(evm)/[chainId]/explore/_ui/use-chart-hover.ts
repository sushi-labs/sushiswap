'use client'

import format from 'date-fns/format'
import type { TooltipComponentFormatterCallbackParams } from 'echarts'
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
  onMouseOver: (params: TooltipComponentFormatterCallbackParams) => string
  onMouseLeave: () => void
} {
  const [hovered, setHovered] = useState<HoveredPoint | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: Clear hover when the chart's data or selected period changes.
  useEffect(() => {
    setHovered(null)
  }, [value, label, chainId, timeframe])

  const onMouseOver = useCallback(
    (params: TooltipComponentFormatterCallbackParams) => {
      if (!Array.isArray(params)) return ''

      const [v2, v3, blade] = params.map((point) => point.data)
      if (!Array.isArray(v2) || !Array.isArray(v3)) return ''

      const date = Number(v2[0])
      const value =
        Number(v2[1]) +
        Number(v3[1]) +
        (Array.isArray(blade) ? Number(blade[1]) : 0)

      setHovered((previous) =>
        previous?.date === date && previous.value === value
          ? previous
          : { value, date },
      )

      return ''
    },
    [],
  )

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
