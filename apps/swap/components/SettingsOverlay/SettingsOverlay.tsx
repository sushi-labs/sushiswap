import { CogIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Overlay, SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { CustomTokensOverlay } from './CustomTokensOverlay'
import { GasSettingsOverlay } from './GasSettingsOverlay'
import { SlippageToleranceOverlay } from './SlippageToleranceOverlay'

interface SettingsOverlay {
  chainId: ChainId | undefined
}

export const SettingsOverlay: FC<SettingsOverlay> = ({ chainId }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon width={20} height={20} />
      </button>
      <SlideIn>
        <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
          <Overlay.Content className="!bg-slate-800">
            <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
            <div className="py-1 px-1">
              <GasSettingsOverlay chainId={chainId} />
              <SlippageToleranceOverlay />
              <CustomTokensOverlay />
            </div>
          </Overlay.Content>
        </SlideIn.FromLeft>
      </SlideIn>
    </>
  )
}
