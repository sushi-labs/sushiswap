import { InformationCircleIcon } from '@heroicons/react/outline'
import { Switch, Tooltip, Typography } from '@sushiswap/ui'

import { useSettings } from '../../lib/state/storage'

export const SushiGuard = () => {
  const [{ sushiGuard }, { updateSushiGuard }] = useSettings()

  return (
    <div className="h-[52px] flex items-center border-b border-slate-200/5">
      <div className="relative flex items-center justify-between w-full gap-3 group rounded-xl">
        <div className="flex items-center justify-center w-5 h-5">
          <svg
            className="-ml-0.5 text-slate-500"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m10 18.75-3.86-2.058a6.865 6.865 0 0 1-3.64-6.067V2.5a1.251 1.251 0 0 1 1.25-1.25h12.5A1.251 1.251 0 0 1 17.5 2.5v8.125a6.864 6.864 0 0 1-3.64 6.067L10 18.75ZM3.75 2.5v8.125a5.616 5.616 0 0 0 2.979 4.964L10 17.333l3.271-1.744a5.616 5.616 0 0 0 2.979-4.964V2.5H3.75Z"
              fill="#97A3B7"
            />
            <path d="M10 15.798V3.75h5v6.753a4.375 4.375 0 0 1-2.313 3.858L10 15.798Z" fill="#97A3B7" />
          </svg>
        </div>
        <div className="flex items-center justify-between w-full gap-1">
          <div className="flex items-center gap-1">
            <Typography variant="sm" weight={500}>
              Sushi Guard
            </Typography>
            <Tooltip
              button={<InformationCircleIcon width={14} height={14} />}
              panel={
                <Typography variant="xs" weight={500} className="w-80 text-slate-300">
                  ....
                </Typography>
              }
            />
          </div>
          <div className="flex gap-1">
            <Switch checked={sushiGuard} onChange={() => updateSushiGuard(!sushiGuard)} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
