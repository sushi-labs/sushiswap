import * as d3 from 'd3'
import { FC, memo, useLayoutEffect, useRef } from 'react'

interface XAxisProps {
  x: d3.ScaleLinear<number, number>
}

export const XAxis: FC<XAxisProps> = memo(function XAxis({ x }) {
  const ref = useRef<SVGGElement | null>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    d3.select(ref.current).call(d3.axisBottom(x).ticks(7).tickSizeOuter(0))
  }, [x])

  return <g className="text-[11px] text-slate-300" ref={ref} color="currentColor" />
})
