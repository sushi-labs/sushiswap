import { Button, SlideIn } from '@sushiswap/ui'
import { FC, ReactElement, useState } from 'react'

import { Theme } from '../types'
import { OverlayContent, OverlayHeader } from './Overlay'

interface RenderProps {
  open: boolean
  setOpen(open: boolean): void
}

interface ConfirmationOverlay {
  theme: Theme
  onConfirm(): void
  children(payload: RenderProps): ReactElement
}

export const ConfirmationOverlay: FC<ConfirmationOverlay> = ({ children, theme, onConfirm }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {children({ setOpen, open })}
      <SlideIn.FromBottom show={open} unmount={false} onClose={() => setOpen(false)}>
        <OverlayContent theme={theme} className="flex flex-col flex-grow">
          <OverlayHeader arrowDirection="bottom" onClose={() => setOpen(false)} title="Confirm Swap" theme={theme} />
          <div className="flex flex-grow" />
          <Button fullWidth color="gradient" onClick={onConfirm}>
            Swap
          </Button>
        </OverlayContent>
      </SlideIn.FromBottom>
    </>
  )
}
