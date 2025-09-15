import type { ScaleLinear } from 'd3'

import type { ChartEntry } from './types'

export const HorizontalArea = ({
  series,
  xScale,
  yScale,
  xValue,
  yValue,
  fill,
  brushDomain,
  selectedFill,
  containerHeight,
  containerWidth,
}: {
  series: ChartEntry[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  xValue: (d: ChartEntry) => number
  yValue: (d: ChartEntry) => number
  brushDomain: [number, number] | undefined
  containerHeight: number
  containerWidth: number
  fill: string | undefined
  selectedFill: string | undefined
}) => {
  return (
    <>
      {series
        .filter((d) => {
          const value = yScale(yValue(d))
          return value > 0 && value <= containerHeight
        })
        .map((d, i) => {
          const price = yValue(d)
          const isInDomain =
            brushDomain && price >= brushDomain[0] && price <= brushDomain[1]
          const fillWithDefault = (isInDomain ? selectedFill : fill) ?? 'blue'

          return (
            <rect
              key={i}
              x={xScale(xValue(d))}
              y={yScale(price)}
              width={xScale(containerWidth) - xScale(xValue(d))}
              height={0.2}
              fill={fillWithDefault}
              stroke={fillWithDefault}
              rx={1}
              ry={1}
            />
          )
        })}
    </>
  )
}
