export const MinMaxPrices = () => {
  return (
    <div className="flex justify-between gap-2">
      <div className="flex bg-[#F4F5F6] dark:bg-[#1E293B] flex-col p-3 rounded-lg w-full">
        <div className="font-medium text-pink bg-pink/10 rounded-full w-fit text-xs py-1 px-2">
          Min Price
        </div>
        <p className="dark:text-pink-100 text-[#374151] uppercase font-medium">
          123 Dai
        </p>
        <p className="pt-0.5 underline text-slate-700 text-sm dark:text-pink-200">
          {'(-0.067%)'}
        </p>
      </div>
      <div className="flex bg-[#F4F5F6] dark:bg-[#1E293B] flex-col p-3 rounded-lg w-full">
        <div className="font-medium text-blue-550 bg-blue-550/10 rounded-full w-fit text-xs py-1 px-2">
          Max Price
        </div>
        <p className="dark:text-pink-100 text-[#374151] uppercase font-medium">
          123 Dai
        </p>
        <p className="pt-0.5 underline text-slate-700 text-sm dark:text-pink-200">
          {'(+0.067%)'}
        </p>
      </div>
    </div>
  )
}
