import { ChevronDownIcon } from '@heroicons/react/solid'
import { FC } from 'react'

interface SwitchCurrenciesButton {
  onClick(): void
}

export const SwitchCurrenciesButton: FC<SwitchCurrenciesButton> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
    >
      <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
        <ChevronDownIcon width={16} height={16} />
      </div>
    </button>
  )
}
