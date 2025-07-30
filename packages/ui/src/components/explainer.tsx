import { InformationCircleIcon } from '@heroicons/react/20/solid'
import React, { type FC, type ReactNode } from 'react'

import classNames from 'classnames'
import type { IconComponent, IconProps } from '../types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

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
            <Icon
              className={classNames(iconProps?.className, 'self-center')}
              {...iconProps}
            />
          ) : (
            <InformationCircleIcon
              width={16}
              height={16}
              className={classNames(
                iconProps?.className,
                'self-center text-muted-foreground',
              )}
            />
          )}
        </TooltipTrigger>
        <TooltipContent className="bg-background !p-4 shadow-xl max-w-[20rem] !backdrop-blur-md">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
