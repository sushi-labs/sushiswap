import { Tab as HeadlessTab } from '@headlessui/react'
import { FC } from 'react'
import { ExtractProps } from '../../../types'

export type TabGroupProps = ExtractProps<typeof HeadlessTab.Group>

export const TabGroup: FC<TabGroupProps> = ({ children, ...props }) => {
  return <HeadlessTab.Group {...props}>{children}</HeadlessTab.Group>
}
