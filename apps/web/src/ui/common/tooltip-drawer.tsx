import { useBreakpoint } from '@sushiswap/hooks'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useEffect, useState } from 'react'

export const TooltipDrawer = ({
  trigger,
  dialogTitle,
  content,
}: {
  trigger: ReactNode
  dialogTitle: string
  content: ReactNode
}) => {
  const { isMd: isMdScreen } = useBreakpoint('md')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isMdScreen && isOpen) {
      setIsOpen(false)
    }
  }, [isMdScreen, isOpen])

  if (isMdScreen) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent
            side="top"
            className="dark:bg-black/10 bg-white/10 py-4 px-5 !text-slate-900 dark:!text-pink-100 text-xs max-w-[250px]"
          >
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
        className="!px-3"
      >
        <DialogTitle className="mt-4 !font-medium">{dialogTitle}</DialogTitle>
        <div className="my-4 text-xs max-w-[75%]">{content}</div>
      </DialogContent>
    </Dialog>
  )
}
