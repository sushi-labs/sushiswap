import { classNames } from '@sushiswap/ui'
import { forwardRef, ReactNode } from 'react'

import { Theme } from '../../types'

interface OverlayContent {
  className?: string
  children: ReactNode | ReactNode[]
  theme: Theme
}

export const OverlayContent = forwardRef<HTMLDivElement, OverlayContent>(({ className, children, theme }, ref) => {
  return (
    <div
      ref={ref}
      className={classNames(className, theme.background.primary, 'space-y-3 inline-block w-full p-3 !my-0 h-full')}
    >
      {children}
    </div>
  )
})
