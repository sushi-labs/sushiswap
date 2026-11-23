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
  const axisRef = (axis: SVGGElement | null) => {
    if (!axis) return
    const group = select(axis).call(axisGenerator)
    group.select('.domain').remove()
    group.selectAll('.tick text').attr('text-anchor', (_, i, labels) => {
      if (i === 0) return 'start'
      if (i === labels.length - 1) return 'end'
      return 'middle'
    })
  }

  return <g ref={axisRef} className="text-muted-foreground" />
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
  useMemo(() => {
    const [, width] = xScale.range()
    const tickCount = Math.max(2, Math.min(6, Math.floor(width / 72)))
    return (
      <g
        className="[>_line]:hidden [>_text]:text-muted-foreground [>_text]:translate-y-[5px]"
        transform={`translate(0, ${innerHeight + offset})`}
      >
        <Axis axisGenerator={axisBottom(xScale).ticks(tickCount)} />
      </g>
    )
  }, [innerHeight, offset, xScale])
