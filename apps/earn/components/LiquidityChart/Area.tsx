import * as d3 from 'd3'
import { FC, useLayoutEffect, useMemo, useRef } from 'react'

import { Datum } from './utils/types'

interface AreaProps {
  x: d3.ScaleLinear<number, number>
  y: d3.ScaleLinear<number, number>
  data: Datum[]
  color: string
  animate: boolean
}

export const Area: FC<AreaProps> = ({ x, y, data, color, animate }) => {
  const area = useMemo(() => {
    return d3
      .area<Datum>()
      .curve(d3.curveStepAfter)
      .x((d) => x(d.vx))
      .y0(y(0))
      .y1((d) => y(d.vy * 0.9))
  }, [x, y])

  const d = useMemo(() => area(data), [area, data])

  useLayoutEffect(() => {
    if (!ref.current) return
    const path = d3.select(ref.current)
    ;(animate ? path.transition() : path).attr('d', () => d)
  }, [d]) // eslint-disable-line react-hooks/exhaustive-deps

  const ref = useRef<SVGPathElement | null>(null)
  return <path fill={color} ref={ref} />
}
