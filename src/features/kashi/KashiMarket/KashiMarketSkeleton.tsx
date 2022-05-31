import { FC } from 'react'

export const KashiMarketSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-3 p-2 md:p-4 pt-4 rounded-[24px] bg-dark-800 shadow-md shadow-dark-1000">
      <div className="grid grid-cols-3 gap-2 h-[42px] rounded-full">
        <div className="w-full h-full bg-dark-700 rounded-full animate-pulse" />
        <div className="w-full h-full bg-dark-700 rounded-full animate-pulse" />
        <div className="w-full h-full bg-dark-700 rounded-full animate-pulse" />
        <div className="w-full h-full bg-dark-700 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-2 h-[36px] rounded-full">
        <div className="w-full h-full bg-dark-700 rounded-full animate-pulse" />
        <div className="w-full h-full bg-dark-700 rounded-full animate-pulse" />
        <div className="w-full h-full bg-dark-700 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col justify-between bg-dark-900 rounded h-[114px] p-4 pt-3">
        <div className="flex items-center justify-between h-9">
          <div className="flex gap-2">
            <div className="bg-dark-700 rounded-full w-5 h-5 animate-pulse" />
            <div className="bg-dark-700 rounded-full h-5 w-20 animate-pulse" />
            <div className="bg-dark-700 rounded-full h-5 w-20 animate-pulse" />
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-dark-700 rounded-full h-5 w-10 animate-pulse" />
            <div className="bg-dark-700 rounded-full h-5 w-12 animate-pulse" />
            <div className="bg-dark-700 rounded-full w-3 h-3 animate-pulse" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="bg-dark-700 rounded-full h-9 w-[120px] animate-pulse" />
          <div className="bg-dark-700 rounded-full h-5 w-20 animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col justify-between bg-dark-900 rounded h-[114px] p-4 pt-3">
        <div className="flex items-center justify-between h-9">
          <div className="flex gap-2">
            <div className="bg-dark-700 rounded-full w-5 h-5 animate-pulse" />
            <div className="bg-dark-700 rounded-full h-5 w-20 animate-pulse" />
            <div className="bg-dark-700 rounded-full h-5 w-20 animate-pulse" />
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-dark-700 rounded-full h-5 w-10 animate-pulse" />
            <div className="bg-dark-700 rounded-full h-5 w-12 animate-pulse" />
            <div className="bg-dark-700 rounded-full w-3 h-3 animate-pulse" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="bg-dark-700 rounded-full h-9 w-[120px] animate-pulse" />
          <div className="bg-dark-700 rounded-full h-5 w-20 animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between gap-2 p-4 border-2 border-dark-700 h-12 rounded">
        <div className="flex gap-2 items-center">
          <div className="bg-dark-700 rounded-full w-3 h-3 animate-pulse" />
          <div className="bg-dark-700 rounded-full h-5 w-10 animate-pulse" />
        </div>
        <div className="bg-dark-700 rounded-full w-5 h-5 animate-pulse" />
      </div>
      <div className="rounded animate-pulse bg-dark-700 h-[52px]" />
    </div>
  )
}
