import { InformationCircleIcon } from '@heroicons/react/outline'
import { Switch, Tooltip, Typography } from '@sushiswap/ui'

import { useSettings } from '../../lib/state/storage'

export const ExpertMode = () => {
  const [{ expertMode }, { updateExpertMode }] = useSettings()

  return (
    <div className="h-[52px] flex items-center border-b border-slate-200/5">
      <div className="relative flex items-center justify-between w-full gap-3 group rounded-xl">
        <div className="flex items-center justify-center w-5 h-5">
          <svg
            className="-ml-0.5 text-slate-500"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.167 1.333 6.75.5l-.417.833-.833.105.695.59L5.917 3l.833-.555.833.555-.278-.973.695-.59-.833-.104Zm6.945 8.889-.695-1.389-.695 1.389-1.389.174 1.158.984-.463 1.62 1.389-.926 1.388.926-.463-1.62 1.158-.984-1.388-.174ZM3.556 3.278 3 2.167l-.556 1.11-1.11.14.925.786L1.89 5.5 3 4.76l1.11.74-.37-1.297.927-.786-1.111-.14ZM.845 12.166c0 .445.173.863.488 1.178l1.322 1.322c.315.315.733.488 1.178.488.445 0 .864-.173 1.179-.488l9.655-9.655c.315-.315.488-.734.488-1.179 0-.445-.173-.863-.488-1.178l-1.322-1.322c-.63-.63-1.727-.63-2.357 0l-9.655 9.655a1.655 1.655 0 0 0-.488 1.179Zm11.322-9.655 1.321 1.321-2.988 2.99L9.178 5.5l2.989-2.988Z"
              fill="#97A3B7"
            />
          </svg>
        </div>
        <div className="flex items-center justify-between w-full gap-1">
          <div className="flex items-center gap-1">
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
