import React, { FC } from 'react'

const AuctionDocumentsSkeleton: FC = () => {
  return (
    <>
      <div className="flex gap-4 items-center animate-pulse">
        <div className="w-full h-[24px] bg-dark-800 rounded" />
        <div className="w-full h-[24px] bg-dark-800 rounded" />
        <div className="w-full h-[24px] bg-dark-800 rounded" />
      </div>
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="w-full h-[20px] bg-dark-900 rounded" />
        <div className="flex gap-4">
          <div className="flex gap-2">
            <div className="w-full h-[20px] bg-dark-900 rounded" />
            <div className="w-full h-[20px] bg-dark-900 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-full h-[20px] bg-dark-900 rounded" />
            <div className="w-full h-[20px] bg-dark-900 rounded" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="w-full h-[20px] bg-dark-800 rounded" />
        <div className="flex gap-5">
          <div className="w-full h-[20px] bg-dark-900 rounded" />
          <div className="w-full h-[20px] bg-dark-900 rounded" />
          <div className="w-full h-[20px] bg-dark-900 rounded" />
          <div className="w-full h-[20px] bg-dark-900 rounded" />
        </div>
      </div>
    </>
  )
}

export default AuctionDocumentsSkeleton
