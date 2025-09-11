'use client'

import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'

export const FiatSwitchTokensButton = () => {
  return (
    <div className="left-0 right-0 mt-[-26px] mb-[-26px] flex items-center justify-center">
      <button
        disabled
        type="button"
        className="hover:shadow-sm cursor-not-allowed transition-border z-10 group bg-background p-2 border border-slate-50 dark:border-slate-800 transition-all rounded-full"
      >
        <div>
          <ArrowsUpDownIcon
            strokeWidth={3}
            className="w-3 h-3 text-blue dark:text-skyblue"
          />
        </div>
      </button>
    </div>
  )
}
