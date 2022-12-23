import { CogIcon } from '@heroicons/react/24/outline'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { IconButton } from '@sushiswap/ui13/components/IconButton'
import { Overlay } from '@sushiswap/ui13/components/overlay'
import React, { FC, useState } from 'react'

import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'

export const TokenSelectorSettingsOverlay: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        className="hover:animate-spin-slow w-[24px] h-[24px] flex items-center justify-center"
        onClick={() => {
          setOpen(true)
        }}
      >
        <CogIcon width={20} height={20} className="hover:text-slate-50 text-slate-100" />
      </IconButton>
      <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
        <Overlay.Content className="!bg-slate-800">
          <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
          <div className="py-1 px-1">
            <TokenSelectorCustomTokensOverlay />
          </div>
        </Overlay.Content>
      </SlideIn.FromLeft>
    </>
  )
}
