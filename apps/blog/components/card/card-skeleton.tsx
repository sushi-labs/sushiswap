export function CardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-slate-800 animate-pulse h-[400px] rounded-xl">
      <div className="bg-slate-700 h-[240px]" />
      <div className="flex flex-col gap-3 px-4 mt-3">
        <div className="bg-slate-700 w-16 h-6 rounded-xl" />
        <div className="bg-slate-600 w-[200px] h-5 rounded-xl" />
        <div className="flex flex-col gap-2">
          <div className="bg-slate-700 w-full h-4 rounded-xl" />
          <div className="bg-slate-700 w-full h-4 rounded-xl" />
        </div>
      </div>
      <div className="absolute bottom-3 left-4 right-4">
        <div className="flex justify-between items-center">
          <div className="bg-slate-700 w-[100px] h-5 rounded-xl" />
          <div className="bg-slate-700 w-[100px] h-5 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
