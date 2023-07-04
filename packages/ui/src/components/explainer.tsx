import { InformationCircleIcon } from '@heroicons/react/20/solid'
import React, { FC, ReactNode } from 'react'

import { classNames } from '../index'
import { IconComponent, IconProps } from '../types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export const Explainer: FC<{
  children: ReactNode
  icon?: IconComponent
  iconProps?: IconProps
}> = ({ icon: Icon, iconProps, children }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {Icon ? (
            <Icon className={classNames(iconProps?.className, 'self-center')} {...iconProps} />
          ) : (
            <InformationCircleIcon
              width={16}
              height={16}
              className={classNames(iconProps?.className, 'self-center text-muted-foreground')}
            />
          )}
        </TooltipTrigger>
        <TooltipContent className="paper !bg-white/50 dark:!bg-slate-800/50 dark:!text-slate-200 !text-gray-700 !p-4 shadow-xl w-80">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
