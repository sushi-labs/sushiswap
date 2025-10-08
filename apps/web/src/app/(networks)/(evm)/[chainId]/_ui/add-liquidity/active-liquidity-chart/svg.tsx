// Handle - straight horizontal line only
export const brushHandlePath = (width: number) =>
  [
    `M 0 0`, // move to origin
    `h ${width}`, // horizontal line with specified width
  ].join(' ')

export const brushHandleAccentPath = (width: number) => {
  const lineStart = width / 2 - 15
  return [
    'M 0 0', // move to origin
    `m ${lineStart} 8`, // move to start of accent line
    `h 30`, // horizontal line
  ].join(' ')
}
/** 
  Points down by default
*/
export const OffScreenHandle = ({
  color,
  size = 6,
}: { color: string; size?: number }) => {
  const center = size / 3
  return (
    <polygon
      points={`0 0, ${size} ${size}, 0 ${size}`}
      transform={`translate(${center}, ${center}) rotate(-45) translate(-${center}, -${center})`}
      fill={color}
      stroke={color}
      strokeWidth="4"
      strokeLinejoin="round"
    />
  )
}

import type { ScaleTime } from 'd3'
import { type FC, useMemo } from 'react'

type SparklineCellProps = {
  data: { price: number; timestamp: number }[]
  height: number
  xScale: ScaleTime<number, number>
}

export const Sparkline: FC<SparklineCellProps> = ({ data, height, xScale }) => {
  if (!data?.length) return null

  const { points } = useMemo(() => {
    const min = Math.min(...data.map((d) => d.price))
    const max = Math.max(...data.map((d) => d.price))
    const range = max - min
    const isPositive = data[data.length - 1] >= data[0]

    const points = data
      .map(({ price, timestamp }) => {
        const x = xScale(new Date(timestamp))
        const y = height - ((price - min) / range) * height
        return `${x},${y}`
      })
      .join(' ')

    return { points, isPositive }
  }, [data, height, xScale])

  return (
    <polyline
      fill="none"
      points={points}
      className="stroke-[#1DA67D]"
      strokeWidth={1}
    />
  )
}
