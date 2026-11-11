import { InformationCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
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
        <TooltipContent className="bg-background !p-4 shadow-xl max-w-[20rem]">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
