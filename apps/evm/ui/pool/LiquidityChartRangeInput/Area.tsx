import { area, curveStepAfter, ScaleLinear } from 'd3'
import React, { FC, useMemo } from 'react'

import { ChartEntry } from './types'

interface AreaProps {
  series: ChartEntry[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  xValue: (d: ChartEntry) => number
  yValue: (d: ChartEntry) => number
  fill?: string | undefined
  opacity?: number | undefined
}

export const Area: FC<AreaProps> = ({ series, xScale, yScale, xValue, yValue, fill, opacity }) =>
  useMemo(
    () => (
      <path
        opacity={opacity ?? 0.5}
        stroke={fill}
        fill={fill}
        d={
          area()
            .curve(curveStepAfter)
            .x((d: unknown) => xScale(xValue(d as ChartEntry)))
            .y1((d: unknown) => yScale(yValue(d as ChartEntry)))
            .y0(yScale(0))(
            series.filter((d) => {
              const value = xScale(xValue(d))

              return value <= window.innerWidth
            }) as unknown as [number, number][]
          ) ?? undefined
        }
      />
    ),
    [fill, series, xScale, xValue, yScale, yValue]
  )
