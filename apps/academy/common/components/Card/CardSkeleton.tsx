export const CardSkeleton = () => {
  return (
    <div className="relative overflow-hidden bg-slate-800 animate-pulse h-[400px] rounded-xl">
      <div className="bg-slate-700 h-[240px]" />
      <div className="flex flex-col gap-3 px-4 mt-3">
        <div className="w-16 h-6 bg-slate-700 rounded-xl" />
        <div className="bg-slate-600 w-[200px] h-5 rounded-xl" />
        <div className="flex flex-col gap-2">
          <div className="w-full h-4 bg-slate-700 rounded-xl" />
          <div className="w-full h-4 bg-slate-700 rounded-xl" />
        </div>
      </div>
      <div className="absolute bottom-3 left-4 right-4">
        <div className="flex items-center justify-between">
          <div className="bg-slate-700 w-[100px] h-5 rounded-xl" />
          <div className="bg-slate-700 w-[100px] h-5 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
