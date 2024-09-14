import { PlusIcon } from '@heroicons/react-v1/solid'

export const Plus = () => {
  return (
    <div className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-2 bg-gray-100 rounded-full dark:bg-slate-900">
      <PlusIcon
        strokeWidth={3}
        className="w-4 h-4 dark:text-slate-400 text-slate-600"
      />
    </div>
  )
}
