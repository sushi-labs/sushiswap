import { CogIcon } from '@heroicons/react/outline'
import { Dialog, IconButton, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'

interface SettingsOverlay {
  variant?: 'dialog' | 'overlay'
}

export const SettingsOverlay: FC<SettingsOverlay> = ({ variant = 'overlay' }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon width={20} height={20} />
      </IconButton>
      {variant === 'dialog' ? (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <Dialog.Content className="!bg-slate-800 !pb-0 min-h-[320px] max-w-sm">
            <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
              <Dialog.Header onClose={() => setOpen(false)} title="Settings" />
              <div className="px-1 py-1">
                <SlippageToleranceDisclosure />
              </div>
            </div>
          </Dialog.Content>
        </Dialog>
      ) : (
        <SlideIn>
          <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
            <Overlay.Content className="!bg-slate-800 !pb-0">
              <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
                <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
                <div className="px-1 py-1">
                  <SlippageToleranceDisclosure />
                </div>
              </div>
            </Overlay.Content>
          </SlideIn.FromLeft>
        </SlideIn>
      )}
    </>
  )
}
