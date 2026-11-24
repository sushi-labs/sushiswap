import { type ReactElement, useMemo } from 'react'

type SparklineCellProps = {
  data: number[]
  width: number
  height: number
}

export function SparklineCell({
  data,
  width,
  height,
}: SparklineCellProps): ReactElement | null {
  const line = useMemo(() => {
    if (!data.length) return null

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min
    const isPositive = data[data.length - 1] >= data[0]

    const points = data
      .map((value, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * width
        const y = range ? height - ((value - min) / range) * height : height / 2
        return `${x},${y}`
      })
      .join(' ')

    return { points, isPositive }
  }, [data, width, height])

  if (!line) return null

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto max-w-full overflow-visible"
      role="img"
      aria-label="Recent price trend"
    >
      <polyline
        fill="none"
        points={line.points}
        className={line.isPositive ? 'stroke-green' : 'stroke-red'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
