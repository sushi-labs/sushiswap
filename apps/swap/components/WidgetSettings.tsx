import { CogIcon } from '@heroicons/react/outline'
import { SlideIn } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { Theme } from '../types'
import { OverlayContent, OverlayHeader } from './Overlay'

interface WidgetSettings {
  theme: Theme
}

export const WidgetSettings: FC<WidgetSettings> = ({ theme }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
        <CogIcon width={20} height={20} />
      </button>
      <SlideIn.FromLeft show={open} unmount={false} onClose={() => setOpen(false)}>
        <OverlayContent theme={theme}>
          <OverlayHeader onClose={() => setOpen(false)} title="Settings" theme={theme} />
        </OverlayContent>
      </SlideIn.FromLeft>
    </>
  )
}
