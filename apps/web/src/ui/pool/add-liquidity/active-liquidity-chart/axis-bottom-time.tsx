import {
  type NumberValue,
  type ScaleTime,
  axisBottom,
  type Axis as d3Axis,
  select,
  timeFormat,
} from 'd3'
import React, { type FC, useMemo } from 'react'

interface AxisProps {
  axisGenerator: d3Axis<NumberValue | Date>
}

const Axis: FC<AxisProps> = ({ axisGenerator }) => {
  const axisRef = (axis: SVGGElement) => {
    if (!axis) return

    select(axis)
      .call(axisGenerator)
      .call((g) => {
        g.select('.domain').remove()
        g.selectAll('line').attr('stroke', 'none')
        g.selectAll('text').attr('font-size', '8px')
      })
  }

  return (
    <g ref={axisRef} className="!text-[#0000008C] dark:!text-[#ffffff8C]" />
  )
}

interface AxisBottomTimeProps {
  xScale: ScaleTime<number, number>
  innerHeight: number
  offset: number | undefined
  tickFormat: (date: Date) => string | undefined
}

export const AxisBottomTime: FC<AxisBottomTimeProps> = ({
  xScale,
  innerHeight,
  offset = 0,
  tickFormat = timeFormat('%b %d'),
}) =>
  useMemo(
    () => (
      <g transform={`translate(0, ${innerHeight + offset})`}>
        <Axis
          axisGenerator={axisBottom(xScale)
            .ticks(5)
            .tickFormat(tickFormat as any)}
        />
      </g>
    ),
    [innerHeight, offset, xScale, tickFormat],
  )
