import { CogIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { IconButton, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { CustomTokensOverlay } from './CustomTokensOverlay'
import { GasSettingsDisclosure } from './GasSettingsDisclosure'
import { SlippageToleranceOverlay } from './SlippageToleranceOverlay'

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
          <Overlay.Content className="!bg-slate-800">
            <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
            <div className="py-1 px-1">
              <GasSettingsDisclosure chainId={chainId} />
              <SlippageToleranceOverlay />
              <CustomTokensOverlay />
            </div>
          </Overlay.Content>
        </SlideIn.FromLeft>
      </SlideIn>
    </>
  )
}
