import React, { FC } from 'react'

const AuctionHeaderSkeleton: FC = () => {
  return (
    <div className="animate-pulse grid grid-cols-3 items-end">
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-dark-900 rounded" />
        <div className="h-8 bg-dark-800 rounded" />
      </div>
      <div />
      <div className="flex flex-col gap-4">
        <div className="h-8 bg-dark-900 rounded" />
        <div className="h-8 bg-dark-800 rounded" />
      </div>
    </div>
  )
}

export default AuctionHeaderSkeleton
