import { AcademicCapIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { Switch, Tooltip, Typography } from '@sushiswap/ui'

import { useSettings } from '../../lib/state/storage'

export const ExpertMode = () => {
  const [{ expertMode }, { updateExpertMode }] = useSettings()

  return (
    <div className="h-[52px] flex items-center border-b border-slate-200/5">
      <div className="relative flex items-center justify-between w-full gap-3 group rounded-xl">
        <div className="flex items-center justify-center w-5 h-5">
          <AcademicCapIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex items-center justify-between w-full gap-1">
          <div className="flex gap-1 items-center">
            <Typography variant="sm" weight={500}>
              Expert Mode
            </Typography>
            <Tooltip
              button={<InformationCircleIcon width={14} height={14} />}
              panel={
                <Typography variant="xs" weight={500} className="w-80 text-slate-300">
                  WARNING: Enabling Expert Mode will bypass all confirmation messages and will allow for high slippage
                  trades. ONLY use if you are an advanced user and know what you are doing. Use at your own risk.
                </Typography>
              }
            />
          </div>
          <div className="flex gap-1">
            <Switch checked={expertMode} onChange={() => updateExpertMode(!expertMode)} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
