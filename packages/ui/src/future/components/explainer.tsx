import React, { FC, ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export const Explainer: FC<{
  children: ReactNode
  icon: ReactNode
}> = ({ icon, children }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <TooltipContent className="paper !bg-white/50 dark:!bg-slate-800/50 dark:!text-slate-200 !text-gray-700 !p-4 shadow-xl w-80">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
