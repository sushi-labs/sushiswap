'use client'

import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export enum DialogType {
  Review = 0,
  Confirm = 1,
}

interface DialogContext {
  state: Record<DialogType, boolean>

  confirm(): void

  setState: Dispatch<SetStateAction<Record<DialogType, boolean>>>
}

const DialogContext = createContext<DialogContext | undefined>(undefined)

interface DialogProviderProps {
  children: ReactNode
}

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [state, setState] = useState<Record<DialogType, boolean>>({
    [DialogType.Review]: false,
    [DialogType.Confirm]: false,
  })

  const confirm = useCallback(() => {
    setState({
      [DialogType.Review]: false,
      [DialogType.Confirm]: true,
    })
  }, [])

  return (
    <DialogContext.Provider value={{ state, confirm, setState }}>
      {children}
    </DialogContext.Provider>
  )
}

export type UseDialog<T extends DialogType> = {
  open: boolean
  setOpen(open: boolean): void
} & (T extends DialogType.Review ? { confirm(): void } : Record<never, never>)

export const useDialog = <T extends DialogType>(type: T): UseDialog<T> => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used inside a DialogProvider')
  }

  const { state, setState, confirm } = context

  return useMemo(() => {
    if (type === DialogType.Review) {
      return {
        open: Boolean(state[type]),
        setOpen: (val) =>
          setState((prev) => ({ ...prev, [DialogType.Review]: val })),
        confirm,
      } as UseDialog<T>
    } else {
      return {
        open: Boolean(state[type]),
        setOpen: (val) =>
          setState((prev) => ({ ...prev, [DialogType.Confirm]: val })),
      } as UseDialog<T>
    }
  }, [state, setState, confirm, type])
}
