'use client'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
interface State {
  mutate: {
    setSearch: (val: string) => void
    setFilter: (val: UserVaultsFilterType[]) => void
    setPnLTimeframe: (val: UserVaultsPnLTimeframeType) => void
  }
  state: {
    search: string
    filter: UserVaultsFilterType[]
    pnlTimeframe: UserVaultsPnLTimeframeType
  }
}
export const USER_VAULTS_FILTERS = [
  'leading',
  'deposited',
  'others',
  'closed',
] as const
export type UserVaultsFilterType = (typeof USER_VAULTS_FILTERS)[number]
export const USER_VAULTS_PNL_TIMEFRAMES = ['24H', '7D', '30D', 'All'] as const
export type UserVaultsPnLTimeframeType =
  (typeof USER_VAULTS_PNL_TIMEFRAMES)[number]

const UserVaultsStateContext = createContext<State>({} as State)

interface UserVaultsStateProviderProps {
  children: React.ReactNode
}

const UserVaultsStateProvider: FC<UserVaultsStateProviderProps> = ({
  children,
}) => {
  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<UserVaultsFilterType[]>([
    'leading',
    'deposited',
    'others',
  ])
  const [pnlTimeframe, setPnLTimeframe] =
    useState<UserVaultsPnLTimeframeType>('24H')
  return (
    <UserVaultsStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSearch,
            setFilter,
            setPnLTimeframe,
          },
          state: {
            search,
            filter,
            pnlTimeframe,
          },
        }
      }, [search, filter, pnlTimeframe])}
    >
      {children}
    </UserVaultsStateContext.Provider>
  )
}

const useUserVaultsState = () => {
  const context = useContext(UserVaultsStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside UserVaultsState Context')
  }

  return context
}

export { UserVaultsStateProvider, useUserVaultsState }
