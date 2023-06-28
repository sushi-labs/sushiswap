'use client'

import React, {
  createContext,
  CSSProperties,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react'
import { usePopper } from 'react-popper'
import * as PopperJS from '@popperjs/core'

interface PopoverContext {
  open: boolean
  close(): void
  setReferenceElement: Dispatch<SetStateAction<HTMLDivElement | null>>
  setPopperElement: Dispatch<SetStateAction<HTMLDivElement | null>>
  setHovers: Dispatch<SetStateAction<{ button: boolean; panel: boolean }>>
  styles: { [key: string]: CSSProperties }
  attributes: { [key: string]: { [key: string]: string } | undefined }
}

const PopoverContext = createContext<PopoverContext | undefined>(undefined)

interface ProviderProps {
  children: (({ open, close }: { open: boolean; close(): void }) => ReactNode) | ReactNode
  options?: Partial<PopperJS.Options>
}

export const PopoverProvider: FC<ProviderProps> = ({ children, options }) => {
  const [hovers, setHovers] = useState({ button: false, panel: false })
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, options)
  const close = useCallback(() => setHovers({ button: false, panel: false }), [])
  const open = hovers.panel || hovers.button

  return (
    <PopoverContext.Provider
      value={{ open, setReferenceElement, setPopperElement, styles, attributes, close, setHovers }}
    >
      {typeof children === 'function' ? children({ open, close }) : children}
    </PopoverContext.Provider>
  )
}

export const usePopoverContext = () => {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error('Hook can only be used inside Popover Context')
  }

  return context
}
