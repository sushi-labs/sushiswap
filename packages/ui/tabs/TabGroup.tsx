import { Tab as HeadlessTab } from '@headlessui/react'
import { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'

export type TabGroupProps = ExtractProps<typeof HeadlessTab.Group>

export const TabGroup: FC<TabGroupProps> = forwardRef<HTMLDivElement, TabGroupProps>(({ children, ...props }, ref) => {
  return (
    <HeadlessTab.Group {...props} ref={ref}>
      {children}
    </HeadlessTab.Group>
  )
})
