import type { FC } from 'react'

export const SparklineCell: FC<{ data: number[] }> = ({ data }) => {
  if (!data?.length) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const height = 40
  const width = 120

  const isPositive = data[data.length - 1] >= data[0]

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#39B37F' : '#f33536'}
        strokeWidth={1.5}
      />
    </svg>
  )
}
