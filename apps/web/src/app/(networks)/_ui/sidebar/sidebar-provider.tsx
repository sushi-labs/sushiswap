'use client'

import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Sidebar } from './sidebar'
import { DefaultSidebarView, type SidebarState, SidebarView } from './types'

type SidebarContextValue = {
  isOpen: boolean
  view: SidebarState['view']
  context: SidebarState['context']
  open: (view?: SidebarState['view'], context?: SidebarState['context']) => void
  close: () => void
  setView: (
    view: SidebarState['view'],
    context?: SidebarState['context'],
  ) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

const DefaultState = { view: DefaultSidebarView, isOpen: false }

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SidebarState>(DefaultState)

  const value = useMemo(() => {
    const setView = (
      view: SidebarState['view'],
      context?: SidebarState['context'],
    ) => {
      setState(
        view === SidebarView.Connect
          ? { view, context, isOpen: state.isOpen }
          : { view, isOpen: state.isOpen },
      )
    }

    const open = (
      view: SidebarState['view'] = DefaultState.view,
      context?: SidebarState['context'],
    ) => {
      setState(
        view === SidebarView.Connect
          ? { view, context, isOpen: true }
          : { view, isOpen: true },
      )
    }

    const close = () => {
      setState((prev) => ({ ...prev, isOpen: false }))
    }

    return {
      view: state.view,
      context: state.context,
      isOpen: state.isOpen,
      open,
      close,
      setView,
    }
  }, [state])

  return (
    <SidebarContext.Provider value={value}>
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
