import * as d3 from 'd3'
import { FC, memo } from 'react'

import { SizeInfo } from './utils/types'

interface MidLineProps {
  size: SizeInfo
  midPoint: number
  x: d3.ScaleLinear<number, number>
}

export const MidLine: FC<MidLineProps> = memo(function MidLine({ size, midPoint, x }) {
  const _x = x(midPoint)
  const inView = _x >= -100 && _x <= size.width + 100

  return (
    <line
      y1={size.margin.top}
      y2={size.height - size.margin.bottom}
      stroke="currentColor"
      strokeDasharray="4"
      display={inView ? undefined : 'none'}
      transform={inView ? `translate(${x(midPoint)},0)` : undefined}
    />
  )
})
