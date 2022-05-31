const AuctionSkeleton = () => {
  return (
    <div className="h-[443px] animate-pulse rounded bg-dark-900 pt-4 overflow-hidden transition-all shadow-md hover:translate-y-[-3px] hover:shadow-xl hover:shadow-pink/5">
      <div className="h-full flex flex-col gap-3">
        <div className="justify-between grid grid-cols-3 px-5 gap-2">
          <div className="w-20 h-2 bg-dark-800 rounded" />
          <div />
          <div className="w-20 h-5 bg-dark-800 rounded" />
        </div>
        <div className="flex flex-col px-5 pt-2 gap-2">
          <div className="w-20 h-2 bg-dark-800 rounded" />
          <div className="w-[124px] h-6 bg-dark-700 rounded" />
        </div>
        <div className="flex justify-between bg-dark-800 px-5 py-3 items-center ">
          <div className="grid grid-cols-4 gap-3 items-center">
            <div className="rounded-full bg-dark-700 h-[18px] w-[18px]" />
            <div className="col-span-3 h-4 bg-dark-700 rounded" />
          </div>
          <div className="h-4 bg-dark-700 rounded" />
        </div>
        <div className="flex justify-between px-5 gap-2">
          <div className="flex flex-col w-full gap-2">
            <div className="h-1 bg-dark-800 rounded w-full" />
            <div className="h-3 bg-dark-700 rounded w-full" />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="h-1 bg-dark-800 rounded" />
            <div className="h-3 bg-dark-700 rounded" />
          </div>
        </div>
        <div className="flex h-full items-center px-5 h-[90px]">
          <div className="h-1 rounded bg-dark-700 px-5 w-full transform rotate-[10deg]" />
        </div>
        <div className="grid grid-cols-2 gap-3 px-5 py-4 bg-dark-800 flex-grow">
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded w-full" />
            <div className="h-3 bg-dark-700 rounded w-full" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded" />
            <div className="h-3 bg-dark-700 rounded" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded w-full" />
            <div className="h-3 bg-dark-700 rounded w-full" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded" />
            <div className="h-3 bg-dark-700 rounded" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded w-full" />
            <div className="h-3 bg-dark-700 rounded w-full" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded" />
            <div className="h-3 bg-dark-700 rounded" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded w-full" />
            <div className="h-3 bg-dark-700 rounded w-full" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="h-1 bg-dark-800 rounded" />
            <div className="h-3 bg-dark-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionSkeleton
