import React, { FC } from 'react'

const AuctionStatsSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <div className="w-full h-[24px] bg-dark-900 rounded" />
          <div className="w-full h-[24px] bg-dark-800 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-full h-[24px] bg-dark-900 rounded" />
          <div className="w-full h-[24px] bg-dark-800 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-full h-[24px] bg-dark-900 rounded" />
          <div className="w-full h-[24px] bg-dark-800 rounded" />
        </div>
      </div>
      <div className="w-full h-full rounded bg-dark-900" />
    </div>
  )
}

export default AuctionStatsSkeleton
