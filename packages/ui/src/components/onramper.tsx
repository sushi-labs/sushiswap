'use client'
import { Slot } from '@radix-ui/react-slot'
import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useCallback, useContext, useState } from 'react'

import { Dialog } from './dialog'

export const OnramperButton: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  const { setOpen } = useOnramperContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <Slot onClick={onClick} className={className}>
      {children}
    </Slot>
  )
}

interface OnramperPanelProps {
  address?: string
}

export const OnramperPanel: FC<OnramperPanelProps> = ({ address }) => {
  const { open, setOpen } = useOnramperContext()
  const onClose = useCallback(() => setOpen(false), [setOpen])

  let src = 'https://buy.onramper.com?themeName=sushi&apiKey=pk_prod_01GTYEN8CHRVPKES7HK2S9JXDJ&defaultCrypto=ETH'
  if (address) {
    src += `&wallets=ETH:${address}`
  }

  return (
    <Dialog open={open} unmount={true} onClose={() => {}} maxWidth="lg">
      <Dialog.Header title="" onClose={onClose} className="mr-1" />
      <div className="flex items-center justify-center w-full h-[75vh] sm:h-[620px] rounded-t-2xl sm:rounded-2xl overflow-hidden mt-3">
        <iframe
          src={src}
          height="100%"
          width="100%"
          title="Onramper widget"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
        />
      </div>
    </Dialog>
  )
}

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
      <OnramperPanel />
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
