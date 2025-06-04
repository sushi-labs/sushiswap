'use client'

import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface State {
  mutate: {
    onValueChange(val: boolean, symbol?: string): void
  }
  state: {
    isOpen: boolean
    selectedSymbol: string
  }
}

const QuickSelectContext = createContext<State>({} as State)

interface QuickSelectProviderProps {
  children: React.ReactNode
}

const QuickSelectProvider: FC<QuickSelectProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')

  const onValueChange = useCallback((value: boolean, symbol?: string) => {
    setIsOpen(value)
    if (symbol) {
      setSelectedSymbol(symbol)
    } else {
      setSelectedSymbol('')
    }
  }, [])

  return (
    <QuickSelectContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            onValueChange,
          },
          state: {
            isOpen,
            selectedSymbol,
          },
        }
      }, [onValueChange, isOpen, selectedSymbol])}
    >
      {children}
    </QuickSelectContext.Provider>
  )
}

const useQuickSelectContext = () => {
  const context = useContext(QuickSelectContext)
  if (!context) {
    throw new Error('Hook can only be used inside QuickSelect Context')
  }

  return context
}

export { QuickSelectProvider, useQuickSelectContext }
