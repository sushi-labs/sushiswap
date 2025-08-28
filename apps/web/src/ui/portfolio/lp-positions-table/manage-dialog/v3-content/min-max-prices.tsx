export const MinMaxPrices = () => {
  return (
    <div className="flex gap-2 justify-between">
      <div className="flex bg-[#F4F5F6] dark:bg-[#1E293B] flex-col gap-1 p-5 rounded-lg w-full">
        <div className="px-2 py-1 text-xs font-medium rounded-full text-pink bg-pink/10 w-fit">
          Min Price
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="dark:text-pink-100 text-[#374151] uppercase font-medium">
            123 Dai
          </p>
          <p className="pt-0.5 underline text-slate-700 text-sm dark:text-pink-200">
            {'(-0.067%)'}
          </p>
        </div>
      </div>
      <div className="flex bg-[#F4F5F6] dark:bg-[#1E293B] flex-col gap-1 p-5 rounded-lg w-full">
        <div className="px-2 py-1 text-xs font-medium rounded-full text-blue-550 bg-blue-550/10 w-fit">
          Max Price
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="dark:text-pink-100 text-[#374151] uppercase font-medium">
            123 Dai
          </p>
          <p className="pt-0.5 underline text-slate-700 text-sm dark:text-pink-200">
            {'(+0.067%)'}
          </p>
        </div>
      </div>
    </div>
  )
}
