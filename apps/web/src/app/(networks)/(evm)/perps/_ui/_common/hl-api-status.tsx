'use client'

import { Button, classNames } from '@sushiswap/ui'
import { type StatusInidator, useHlStatus } from 'src/lib/perps'

const indicatorToTextColor = (indicator: StatusInidator | undefined) => {
  switch (indicator) {
    case 'none':
      return 'text-green-500'
    case 'minor':
      return 'text-yellow-500'
    case 'major':
      return 'text-red-500'
    case 'critical':
      return 'text-red-500'
    case 'maintenance':
      return 'text-blue-500'
    default:
      return 'text-gray-500'
  }
}

const indicatorToBgColor = (indicator: StatusInidator | undefined) => {
  switch (indicator) {
    case 'none':
      return 'bg-green-500'
    case 'minor':
      return 'bg-yellow-500'
    case 'major':
      return 'bg-red-500'
    case 'critical':
      return 'bg-red-500'
    case 'maintenance':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export const HlApiStatus = () => {
  const { data } = useHlStatus()

  return (
    <Button
      className={classNames(
        '!cursor-default !rounded-full !min-h-[18px] !h-[18px]',
        indicatorToTextColor(data?.indicator),
        data?.indicator === 'none'
          ? 'from-[#52FA8D]/[0.08] to-[#52FA8D]/[0.02]'
          : 'from-[#FB7185]/[0.08] to-[#FB7185]/[0.02]',
      )}
      size="xs"
      variant={data?.indicator === 'none' ? 'perps-long' : 'perps-short'}
    >
      <div className="relative h-3 w-3">
        <div
          className={classNames(
            'rounded-full w-3 h-3 absolute top-0 left-0 opacity-20',
            indicatorToBgColor(data?.indicator),
          )}
        />
        <div
          className={classNames(
            indicatorToBgColor(data?.indicator),
            'rounded-full w-1.5 h-1.5 animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          )}
        />
      </div>

      {data?.indicator === 'none'
        ? 'Operational'
        : data?.indicator || 'Unknown status'}
    </Button>
  )
}
