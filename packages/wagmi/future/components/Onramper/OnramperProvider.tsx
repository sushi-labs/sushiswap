'use client'

import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react'
import { Onramper } from '.'

interface OnramperContext {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const OnramperContext = createContext<OnramperContext | undefined>(undefined)

interface ProviderProps {
  children: (({ open, setOpen }: { open: boolean; setOpen(open: boolean): void }) => ReactNode) | ReactNode
}

export const OnramperProvider: FC<ProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <OnramperContext.Provider value={{ open, setOpen }}>
      {typeof children === 'function' ? children({ open, setOpen }) : children}
      <Onramper.Panel />
    </OnramperContext.Provider>
  )
}

export const useOnramperContext = () => {
  const context = useContext(OnramperContext)
  if (!context) {
    throw new Error('Hook can only be used inside Onramper Context')
  }

  return context
}
