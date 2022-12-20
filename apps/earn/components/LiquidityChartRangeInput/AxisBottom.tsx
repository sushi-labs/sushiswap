import { Axis as d3Axis, axisBottom, NumberValue, ScaleLinear, select } from 'd3'
import React, { FC, useMemo } from 'react'

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

  return <g ref={axisRef} />
}

interface AxisBottomProps {
  xScale: ScaleLinear<number, number>
  innerHeight: number
  offset?: number
}

export const AxisBottom: FC<AxisBottomProps> = ({ xScale, innerHeight, offset = 0 }) =>
  useMemo(
    () => (
      <g transform={`translate(0, ${innerHeight + offset})`}>
        <Axis axisGenerator={axisBottom(xScale).ticks(6)} />
      </g>
    ),
    [innerHeight, offset, xScale]
  )
