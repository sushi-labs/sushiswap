import React from 'react'

const AuctionTabsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div
        className="flex space-x-8 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b border-dark-800 pb-2"
        aria-label="Tabs"
      >
        <div className="h-[20px] bg-dark-900 rounded w-[100px]" />
        <div className="h-[20px] bg-dark-900 rounded w-[100px]" />
        <div className="h-[20px] bg-dark-900 rounded w-[100px]" />
      </div>
    </div>
  )
}

export default AuctionTabsSkeleton
