import { AcademicCapIcon } from '@heroicons/react/outline'
import { Switch, Typography } from '@sushiswap/ui'

import { useSettings } from '../../lib/state/storage'

export const ExpertMode = () => {
  const [{ expertMode }, { updateExpertMode }] = useSettings()

  return (
    <div className="h-[52px] flex items-center">
      <div className="relative flex items-center justify-between w-full gap-3 group rounded-xl">
        <div className="flex items-center justify-center w-5 h-5">
          <AcademicCapIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex items-center justify-between w-full gap-1">
          <Typography variant="sm" weight={500}>
            Expert Mode
          </Typography>
          <div className="flex gap-1">
            <Switch checked={expertMode} onChange={() => updateExpertMode(!expertMode)} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
