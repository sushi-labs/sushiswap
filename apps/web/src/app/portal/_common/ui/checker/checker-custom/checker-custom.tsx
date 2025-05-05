import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'

interface CheckerCustom {
  disableWhen: boolean
  message: string
  children(disabled: boolean): React.ReactNode
}

export function CheckerCustom({
  children,
  disableWhen,
  message,
}: CheckerCustom) {
  if (!disableWhen) {
    return <span>{children(false)}</span>
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span>{children(true)}</span>
        </TooltipTrigger>
        <TooltipContent align="end" className="!bg-background !p-4">
          {message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
