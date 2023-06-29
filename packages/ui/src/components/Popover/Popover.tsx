import { FC, ReactNode } from 'react'
import { PopoverPanel, PopoverPanelInterface } from './PopoverPanel'
import { PopoverProvider } from './PopoverProvider'
import { PopoverButton, PopoverButtonInterface } from './PopoverButton'
import * as PopperJS from '@popperjs/core'

type Popover<T> = FC<T> & {
  Panel: FC<PopoverPanelInterface>
  Button: FC<PopoverButtonInterface>
}

interface PopoverProps {
  children: ReactNode
  options?: Partial<PopperJS.Options>
}

export const Popover: Popover<PopoverProps> = ({ children, options }) => {
  return <PopoverProvider options={options}>{children}</PopoverProvider>
}

Popover.Panel = PopoverPanel
Popover.Button = PopoverButton
