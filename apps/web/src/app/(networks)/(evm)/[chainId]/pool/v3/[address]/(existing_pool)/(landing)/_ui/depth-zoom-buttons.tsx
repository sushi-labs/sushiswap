import { MinusIcon, PlusIcon } from '@heroicons/react-v1/solid'
import { IconButton } from '@sushiswap/ui'
import type { Dispatch, SetStateAction } from 'react'
import type { DepthZoomType } from './statistics-chart-v3'

export const DepthZoomButtons = ({
  setZoomRange,
}: {
  setZoomRange: Dispatch<SetStateAction<DepthZoomType>>
}) => {
  const handleZoom = (direction: 'in' | 'out') => {
    setZoomRange((prev) => {
      const { start, end } = prev
      const center = (start + end) / 2
      const currentRange = end - start || 100

      const factor = direction === 'in' ? 0.8 : 1.25 // 20% step
      let newRange = currentRange * factor

      if (newRange < 5) newRange = 5 // don’t zoom in infinitely
      if (newRange > 100) newRange = 100

      let newStart = center - newRange / 2
      let newEnd = center + newRange / 2

      if (newStart < 0) {
        newStart = 0
        newEnd = newRange
      }
      if (newEnd > 100) {
        newEnd = 100
        newStart = 100 - newRange
      }

      return { start: newStart, end: newEnd }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <IconButton
        variant="tertiary"
        size="xs"
        onClick={() => handleZoom('out')}
        icon={MinusIcon}
        iconProps={{ className: '!w-3 !h-3' }}
        name="zoom out"
      />
      <IconButton
        variant="tertiary"
        size="xs"
        onClick={() => handleZoom('in')}
        icon={PlusIcon}
        iconProps={{ className: '!w-3 !h-3' }}
        name="zoom in"
      />
    </div>
  )
}
