'use client'
import { type FC, createContext, useContext, useMemo } from 'react'
import { useAllDexClearinghouseState } from 'src/lib/perps/subscription/use-all-dex-clearinghouse-state'
import { useWebData3 } from 'src/lib/perps/subscription/use-web-data-3'
import { useAccount } from 'wagmi'
interface State {
  state: {
    webData3Query: ReturnType<typeof useWebData3>
    allDexClearinghouseStateQuery: ReturnType<
      typeof useAllDexClearinghouseState
    >
  }
}

const UserContext = createContext<State>({} as State)

interface UserProviderProps {
  children: React.ReactNode
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const { address } = useAccount()
  const allDexClearinghouseStateQuery = useAllDexClearinghouseState({
    address,
  })
  const webData3Query = useWebData3({
    address,
  })

  return (
    <UserContext.Provider
      value={useMemo(() => {
        return {
          state: {
            webData3Query,
            allDexClearinghouseStateQuery,
          },
        }
      }, [webData3Query, allDexClearinghouseStateQuery])}
    >
      {children}
    </UserContext.Provider>
  )
}

const useUserState = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('Hook can only be used inside User Context')
  }

  return context
}

export { UserProvider, useUserState }
