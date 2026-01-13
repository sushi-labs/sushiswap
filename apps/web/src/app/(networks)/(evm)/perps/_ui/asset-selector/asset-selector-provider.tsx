'use client'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
interface State {
  mutate: {
    setSearch: (val: string) => void
    setOpen: (open: boolean) => void
  }
  state: {
    search: string
    open: boolean
  }
}

const AssetSelectorStateContext = createContext<State>({} as State)

interface AssetSelectorStateProviderProps {
  children: React.ReactNode
}

const AssetSelectorStateProvider: FC<AssetSelectorStateProviderProps> = ({
  children,
}) => {
  const [search, setSearch] = useState<string>('')
  const [open, setOpen] = useState(false)
  return (
    <AssetSelectorStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSearch,
            setOpen,
          },
          state: {
            search,
            open,
          },
        }
      }, [search, open])}
    >
      {children}
    </AssetSelectorStateContext.Provider>
  )
}

const useAssetSelectorState = () => {
  const context = useContext(AssetSelectorStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside AssetSelectorState Context')
  }

  return context
}

export { AssetSelectorStateProvider, useAssetSelectorState }
