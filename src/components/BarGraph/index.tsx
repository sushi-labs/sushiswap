import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { Bar } from '@visx/shape'
import React, { FC, useMemo } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import AutoSizer from 'react-virtualized-auto-sizer'

const verticalMargin = 40

// accessors
const getX = (d: DataTuple) => d.x
const getY = (d: DataTuple) => d.y

interface DataTuple {
  x: string
  y: number
}

type BarGraphProps = {
  data: DataTuple[]
  width: number
  height: number
  events?: boolean
  setSelectedDatum?: (x: DataTuple) => void
}

const Graph: FC<BarGraphProps> = ({ data, width, height, setSelectedDatum, events = false }) => {
  // bounds
  const xMax = useMemo(() => width, [width])
  const yMax = useMemo(() => height - verticalMargin, [height])

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getX),
        padding: 0.1,
        paddingOuter: 0,
      }),
    [xMax, data]
  )

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        // Make the chart domain as small as possible while showing all bars
        // This allows us to use less height for the graph
        domain: [Math.min(...data.map(getY)) * 0.9, Math.max(...data.map(getY))],
      }),
    [yMax, data]
  )

  return (
    <svg width={width} height={height}>
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const x = getX(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getY(d)) ?? 0)
          const barX = xScale(x)
          const barY = yMax - barHeight
          return (
            <Bar
              key={`bar-${x}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(0, 160, 233, 1)"
              // @ts-ignore TYPE NEEDS FIXING
              onClick={() => setSelectedDatum(d)}
              // @ts-ignore TYPE NEEDS FIXING
              onMouseMove={() => setSelectedDatum(d)}
              // @ts-ignore TYPE NEEDS FIXING
              onMouseEnter={() => setSelectedDatum(d)}
            />
          )
        })}
      </Group>
    </svg>
  )
}

// @ts-ignore TYPE NEEDS FIXING
export const BarGraph = ({ data, ...rest }) => (
  // @ts-ignore TYPE NEEDS FIXING
  <AutoSizer>{({ width, height }) => <Graph data={data} width={width} height={height} {...rest} />}</AutoSizer>
)
