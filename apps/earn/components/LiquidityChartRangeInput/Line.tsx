import { ScaleLinear } from 'd3'
import React, { FC, useMemo } from 'react'

interface LineProps {
  value: number
  xScale: ScaleLinear<number, number>
  innerHeight: number
}

export const Line: FC<LineProps> = ({ value, xScale, innerHeight }) =>
  useMemo(
    () => (
      <line
        opacity={0.5}
        strokeWidth={2}
        stroke="currentColor"
        fill="none"
        className="text-slate-50"
        x1={xScale(value)}
        y1="0"
        x2={xScale(value)}
        y2={innerHeight}
      />
    ),
    [value, xScale, innerHeight]
  )
