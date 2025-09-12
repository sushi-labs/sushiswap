import { type FC, useMemo } from 'react'

type SparklineCellProps = {
  data: number[]
  width: number
  height: number
}

export const SparklineCell: FC<SparklineCellProps> = ({
  data,
  width,
  height,
}) => {
  if (!data?.length) return null

  const { points, isPositive } = useMemo(() => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min
    const isPositive = data[data.length - 1] >= data[0]

    const points = data
      .map((value, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((value - min) / range) * height
        return `${x},${y}`
      })
      .join(' ')

    return { points, isPositive }
  }, [data, width, height])

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        points={points}
        className={isPositive ? 'stroke-green' : 'stroke-red'}
        strokeWidth={1}
      />
    </svg>
  )
}
