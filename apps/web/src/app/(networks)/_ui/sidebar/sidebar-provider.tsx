'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'
import { Sidebar } from './sidebar'
import { SidebarView } from './types'

type SidebarContextValue = {
  isOpen: boolean
  view: SidebarView
  open: (view?: SidebarView) => void
  close: () => void
  setView: (view: SidebarView) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<SidebarView>(SidebarView.Portfolio)

  const open = (view = SidebarView.Portfolio) => {
    setView(view)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  return (
    <SidebarContext.Provider value={{ isOpen, view, open, close, setView }}>
      {children}
      <Sidebar />
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider')
  return ctx
}
