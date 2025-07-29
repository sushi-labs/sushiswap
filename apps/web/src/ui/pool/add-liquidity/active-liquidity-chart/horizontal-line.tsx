import type { ScaleLinear } from 'd3'
import { useTheme } from 'next-themes'

export const HorizontalLine = ({
  value,
  yScale,
  width,
  containerWidth,
  lineStyle = 'dashed',
}: {
  value: number
  yScale: ScaleLinear<number, number>
  width: number
  containerWidth: number
  lineStyle?: 'solid' | 'dashed'
}) => {
  const lineStart = containerWidth - width
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  if (Number.isNaN(lineStart)) {
    return null
  }

  const strokeDasharray = lineStyle === 'dashed' ? '1, 4' : 'none'

  return (
    <line
      strokeDasharray={strokeDasharray}
      stroke={isDarkMode ? '#3DB1FF' : '#4217FF'}
      opacity={0.5}
      strokeWidth={1}
      fill="none"
      y1={yScale(value)}
      x1={lineStart}
      y2={yScale(value)}
      x2={lineStart + width}
    />
  )
}
