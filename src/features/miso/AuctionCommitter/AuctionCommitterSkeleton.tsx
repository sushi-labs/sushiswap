import React, { FC } from 'react'

const AuctionCommitterSkeleton: FC = () => {
  return (
    <div className="mt-6 relative animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <div className="h-[20px] w-full bg-dark-900 rounded" />
        </div>
        <div className="h-[62px] w-[396px] bg-dark-900 rounded" />
        <div className="h-[74px] bg-dark-800 rounded" />
      </div>
    </div>
  )
}

export default AuctionCommitterSkeleton
