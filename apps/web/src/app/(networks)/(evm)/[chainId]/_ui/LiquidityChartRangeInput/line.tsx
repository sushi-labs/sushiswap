import type { ScaleLinear } from 'd3'
import React, { type FC, useMemo } from 'react'

interface LineProps {
  value: number
  xScale: ScaleLinear<number, number>
  innerHeight: number
}

export const Line: FC<LineProps> = ({ value, xScale, innerHeight }) =>
  useMemo(
    () => (
      <line
        opacity={1}
        strokeWidth={1}
        stroke="currentColor"
        fill="none"
        className="text-gray-900 dark:text-slate-300"
        x1={xScale(value)}
        y1="0"
        x2={xScale(value)}
        y2={innerHeight}
      />
    ),
    [value, xScale, innerHeight],
  )
