import { useBreakpoint, useIsMounted } from '@sushiswap/hooks'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useState } from 'react'

export const PopoverDrawer = ({
  trigger,
  dialogTitle,
  content,
  popoverContentClassName,
  dialogContentClassName,
  align,
  open,
  setOpen,
}: {
  trigger: ReactNode
  dialogTitle: string
  content: ReactNode
  popoverContentClassName?: string
  dialogContentClassName?: string
  align?: 'center' | 'start' | 'end'
  open?: boolean
  setOpen?: (open: boolean) => void
}) => {
  const { isMd: isMdScreen } = useBreakpoint('md')
  const isMounted = useIsMounted()

  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined && setOpen !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next)
    } else {
      setOpen(next)
    }
  }

  if (isMdScreen && isMounted) {
    return (
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align={align || 'end'}
          className={classNames(
            '!bg-[#FFFFFF24] !backdrop-blur-md dark:!bg-[#00000024] border border-[#EBEBEB] dark:border-[#FFFFFF14] px-5 py-5 !text-slate-900 dark:!text-pink-100 text-xs max-w-[250px]',
            popoverContentClassName,
          )}
        >
          {content}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        variant="semi-opaque"
        className="!px-3 border-t border-[#EBEBEB] !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800"
      >
        <DialogTitle className="mt-4 !font-medium">{dialogTitle}</DialogTitle>
        <div
          className={classNames(
            'my-4 text-xs max-w-[75%]',
            dialogContentClassName,
          )}
        >
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
