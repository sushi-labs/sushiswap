import { type ScaleLinear, area, curveStepAfter } from 'd3'
import React, { type FC, useMemo } from 'react'

import type { ChartEntry } from './types'

interface AreaProps {
  series: ChartEntry[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  xValue: (d: ChartEntry) => number
  yValue: (d: ChartEntry) => number
  fill?: string | undefined
  opacity?: number | undefined
}

/**
 * Prepare series data for rendering with curveStepAfter.
 *
 * With curveStepAfter, a point at x_0 determines the y-value for the range [x_0, x_1).
 * This means:
 * 1. If x_0 is off-screen but x_1 is visible, we need to keep x_0 so the visible portion
 *    of [x_0, x_1) renders correctly.
 * 2. The LAST point in the series needs a synthetic "end" point so its value extends
 *    to the right edge of the chart.
 *
 * We:
 * - Keep one point to the left of the visible area (for proper left edge rendering)
 * - Keep all points within the visible area
 * - Keep one point to the right of the visible area (for proper right edge rendering)
 * - Clamp x-coordinates to [minX, maxX] so steps fill the visible area properly
 *   (also avoids issues with very large numbers that may not render correctly)
 */
function prepareSeriesForRendering(
  series: ChartEntry[],
  xScale: ScaleLinear<number, number>,
  xValue: (d: ChartEntry) => number,
): ChartEntry[] {
  if (series.length === 0) return []

  const domain = xScale.domain()
  const [minX, maxX] = domain

  // Find the indices of points just outside the visible range
  let leftBoundaryIdx = -1
  let rightBoundaryIdx = series.length

  for (let i = 0; i < series.length; i++) {
    const x = xValue(series[i])
    if (x < minX) {
      leftBoundaryIdx = i // Keep updating until we find the last point before minX
    } else if (x > maxX && rightBoundaryIdx === series.length) {
      rightBoundaryIdx = i // First point after maxX
      break
    }
  }

  // Include one point before minX (if exists) and one point after maxX (if exists)
  const startIdx = Math.max(0, leftBoundaryIdx)
  const endIdx = Math.min(series.length, rightBoundaryIdx + 1)

  // Slice and clamp x-coordinates to [minX, maxX]
  // This avoids rendering issues with very large numbers (scientific notation, etc.)
  return series.slice(startIdx, endIdx).map((d) => {
    return {
      ...d,
      price0: Math.min(maxX, Math.max(d.price0, minX)),
    }
  })
}

export const Area: FC<AreaProps> = ({
  series,
  xScale,
  yScale,
  xValue,
  yValue,
  fill,
  opacity,
}) =>
  useMemo(() => {
    const preparedSeries = prepareSeriesForRendering(series, xScale, xValue)

    return (
      <path
        opacity={opacity ?? 0.5}
        stroke={fill}
        fill={fill}
        d={
          area()
            .curve(curveStepAfter)
            .x((d: unknown) => xScale((d as ChartEntry).price0))
            .y1((d: unknown) => yScale(yValue(d as ChartEntry)))
            .y0(yScale(0))(preparedSeries as Iterable<[number, number]>) ??
          undefined
        }
      />
    )
  }, [fill, opacity, series, xScale, xValue, yScale, yValue])
