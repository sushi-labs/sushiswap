import {
  type NumberValue,
  type ScaleLinear,
  axisBottom,
  type Axis as d3Axis,
  select,
} from 'd3'
import React, { type FC, useMemo } from 'react'

interface AxisProps {
  axisGenerator: d3Axis<NumberValue>
}

const Axis: FC<AxisProps> = ({ axisGenerator }) => {
  const axisRef = (axis: SVGGElement) => {
    axis &&
      select(axis)
        .call(axisGenerator)
        .call((g) => g.select('.domain').remove())
  }

  return <g ref={axisRef} className="text-slate-600 dark:text-slate-400" />
}

interface AxisBottomProps {
  xScale: ScaleLinear<number, number>
  innerHeight: number
  offset?: number
}

export const AxisBottom: FC<AxisBottomProps> = ({
  xScale,
  innerHeight,
  offset = 0,
}) =>
  useMemo(
    () => (
      <g
        className="[>_line]:hidden [>_text]:text-slate-400 [>_text]:translate-y-[5px]"
        transform={`translate(0, ${innerHeight + offset})`}
      >
        <Axis axisGenerator={axisBottom(xScale).ticks(6)} />
      </g>
    ),
    [innerHeight, offset, xScale],
  )
