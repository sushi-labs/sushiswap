import { classNames, Dialog, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, ReactElement, useState } from 'react'

interface RenderProps {
  open: boolean
  setOpen(open: boolean): void
}

interface ConfirmationComponentController {
  variant: 'overlay' | 'dialog'
  trigger(payload: RenderProps): ReactElement
  children: ReactElement | ReactElement[] | ((payload: RenderProps) => ReactElement)
  className?: string
}

export const ConfirmationComponentController: FC<ConfirmationComponentController> = ({
  variant,
  trigger,
  children,
  className,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {trigger({ setOpen, open })}
      {variant === 'overlay' ? (
        <SlideIn>
          <SlideIn.FromBottom show={open} onClose={() => setOpen(false)}>
            <Overlay.Content className={classNames(className, 'flex flex-col flex-grow !bg-slate-800 !pb-0 px-4')}>
              <Overlay.Header arrowDirection="bottom" onClose={() => setOpen(false)} title="Confirm Swap" />
              {typeof children === 'function' ? children({ setOpen, open }) : children}
            </Overlay.Content>
          </SlideIn.FromBottom>
        </SlideIn>
      ) : (
        <Dialog open={open} unmount={false} onClose={() => setOpen(false)}>
          <Dialog.Content className={classNames(className, 'max-w-sm !bg-slate-800 px-4 !pb-4 overflow-hidden')}>
            <SlideIn>
              <>
                <Dialog.Header border={false} title="Confirm Swap" onClose={() => setOpen(false)} />
                {typeof children === 'function' ? children({ setOpen, open }) : children}
              </>
            </SlideIn>
          </Dialog.Content>
        </Dialog>
      )}
    </>
  )
}
