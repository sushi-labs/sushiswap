import { CogIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { IconButton, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { CarbonOffsetOverlay } from './CarbonOffsetOverlay'
import { CustomTokensOverlay } from './CustomTokensOverlay'
import { ExpertMode } from './ExpertMode'
import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'

interface SettingsOverlay {
  chainId: ChainId | undefined
}

export const SettingsOverlay: FC<SettingsOverlay> = ({ chainId }) => {
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
                {/*<GasSettingsDisclosure chainId={chainId} />*/}
                <SlippageToleranceDisclosure />
                <CustomTokensOverlay />
                <ExpertMode />
                <CarbonOffsetOverlay />
                {/* <DustAmount /> */}
              </div>
            </div>
          </Overlay.Content>
        </SlideIn.FromLeft>
      </SlideIn>
    </>
  )
}
