import { classNames, Dialog, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, ReactElement, useCallback, useState } from 'react'

interface RenderProps {
  open: boolean
  setOpen(open: boolean): void
}

interface ConfirmationComponentController {
  variant: 'overlay' | 'dialog'
  trigger(payload: RenderProps): ReactElement
  children: ReactElement | ReactElement[] | ((payload: RenderProps) => ReactElement)
  className?: string
  onClose?(): void
}

export const ConfirmationComponentController: FC<ConfirmationComponentController> = ({
  variant,
  trigger,
  children,
  className,
  onClose,
}) => {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
    onClose && onClose()
  }, [onClose])

  return (
    <>
      {trigger({ setOpen, open })}
      {variant === 'overlay' ? (
        <SlideIn>
          <SlideIn.FromBottom show={open} onClose={handleClose}>
            <Overlay.Content className={classNames(className, 'flex flex-col flex-grow !bg-slate-800 !pb-0 px-4')}>
              <Overlay.Header arrowDirection="bottom" onClose={handleClose} title="Confirm Swap" />
              {typeof children === 'function' ? children({ setOpen, open }) : children}
            </Overlay.Content>
          </SlideIn.FromBottom>
        </SlideIn>
      ) : (
        <Dialog open={open} unmount={false} onClose={() => setOpen(false)} afterLeave={() => onClose && onClose()}>
          {typeof children === 'function' ? children({ setOpen, open }) : children}
        </Dialog>
      )}
    </>
  )
}
