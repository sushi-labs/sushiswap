import * as d3 from 'd3'
import { FC, memo, useLayoutEffect, useRef } from 'react'

interface YAxisProps {
  y: d3.ScaleLinear<number, number>
}

export const YAxis: FC<YAxisProps> = memo(function YAxis({ y }) {
  const ref = useRef<SVGGElement | null>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    const axis = d3
      .axisLeft(y) //
      .ticks(6)
      .tickFormat(d3.format('.1e'))
    d3.select(ref.current).call(axis)
  }, [y])

  return <g ref={ref} />
})
