import { SlideIn } from '@sushiswap/ui'
import { FC, ReactElement, useState } from 'react'

interface RenderProps {
  open: boolean
  setOpen(open: boolean): void
}

interface ConfirmationOverlay {
  trigger(payload: RenderProps): ReactElement
  children(payload: RenderProps): ReactElement
}

export const ConfirmationOverlay: FC<ConfirmationOverlay> = ({ trigger, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {trigger({ setOpen, open })}
      <SlideIn.FromBottom show={open} unmount={false} onClose={() => setOpen(false)}>
        {children({ setOpen, open })}
      </SlideIn.FromBottom>
    </>
  )
}
