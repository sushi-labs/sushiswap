'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useContext, useMemo, useState } from 'react'

export type AssetSelectorListMode = 'strict' | 'all'

interface State {
  mutate: {
    setSearch: (val: string) => void
    setOpen: (open: boolean) => void
    setListMode: (mode: AssetSelectorListMode) => void
  }
  state: {
    search: string
    open: boolean
    listMode: AssetSelectorListMode
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
  const [listMode, setListMode] = useLocalStorage<AssetSelectorListMode>(
    'sushi.perps.asset-selector-list-mode',
    'strict',
  )

  return (
    <AssetSelectorStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSearch,
            setOpen,
            setListMode,
          },
          state: {
            search,
            open,
            listMode,
          },
        }
      }, [search, open, listMode, setListMode])}
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
