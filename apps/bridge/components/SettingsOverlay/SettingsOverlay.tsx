import { CogIcon } from '@heroicons/react/outline'
import { IconButton, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { ExpertMode } from './ExpertMode'
import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'

export const SettingsOverlay: FC = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon width={20} height={20} />
      </IconButton>
      <SlideIn>
        <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
          <Overlay.Content className="!bg-slate-800 !pb-0">
            <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
              <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
              <div className="px-1 py-1">
                <SlippageToleranceDisclosure />
                <ExpertMode />
              </div>
            </div>
          </Overlay.Content>
        </SlideIn.FromLeft>
      </SlideIn>
    </>
  )
}
