'use client'
import { type FC, createContext, useContext, useMemo } from 'react'
import { useWebData2 } from 'src/lib/perps/subscription/use-web-data-2'
import { useAccount } from 'wagmi'
interface State {
  state: {
    webData2Query: ReturnType<typeof useWebData2>
  }
}

const UserContext = createContext<State>({} as State)

interface UserProviderProps {
  children: React.ReactNode
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const { address } = useAccount()

  const webData2Query = useWebData2({
    address,
  })

  return (
    <UserContext.Provider
      value={useMemo(() => {
        return {
          state: {
            webData2Query,
          },
        }
      }, [webData2Query])}
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
