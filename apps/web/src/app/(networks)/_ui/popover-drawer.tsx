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
import { type ReactNode, useEffect, useState } from 'react'

export const PopoverDrawer = ({
  trigger,
  dialogTitle,
  content,
  popoverContentClassName,
  dialogContentClassName,
  align,
}: {
  trigger: ReactNode
  dialogTitle: string
  content: ReactNode
  popoverContentClassName?: string
  dialogContentClassName?: string
  align?: 'center' | 'start' | 'end'
}) => {
  const { isMd: isMdScreen } = useBreakpoint('md')
  const [isOpen, setIsOpen] = useState(false)
  const isMounted = useIsMounted()

  useEffect(() => {
    if (isMdScreen && isOpen) {
      setIsOpen(false)
    }
  }, [isMdScreen, isOpen])

  if (isMdScreen && isMounted) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align={align || 'end'}
          className={classNames(
            '!bg-[#FFFFFF24] !backdrop-blur-[40px] dark:!bg-[#00000024] border border-[#EBEBEB] dark:border-[#FFFFFF14] px-5 py-5 !text-slate-900 dark:!text-pink-100 text-xs max-w-[250px]',
            popoverContentClassName,
          )}
        >
          {content}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        variant="semi-opaque"
        className="!px-3 border-t border-[#EBEBEB] !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800"
      >
        <DialogTitle className="mt-4 !font-medium">{dialogTitle}</DialogTitle>
        <div
          className={classNames(
            'my-4 text-xs max-w-[75%] ',
            dialogContentClassName,
          )}
        >
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
