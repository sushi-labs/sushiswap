'use client'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import { useAllDexClearinghouseState } from 'src/lib/perps/subscription/use-all-dex-clearinghouse-state'
import { useUserFills } from 'src/lib/perps/subscription/use-user-fills'
import { useUserFundings } from 'src/lib/perps/subscription/use-user-fundings'
import { useUserHistoricalOrders } from 'src/lib/perps/subscription/use-user-historical-orders'
import { useWebData2 } from 'src/lib/perps/subscription/use-web-data-2'
import { useAccount } from 'wagmi'
interface State {
  state: {
    webData2Query: ReturnType<typeof useWebData2>
    userHistoricalOrdersQuery: ReturnType<typeof useUserHistoricalOrders>
    userFundingsQuery: ReturnType<typeof useUserFundings>
    allDexClearinghouseStateQuery: ReturnType<
      typeof useAllDexClearinghouseState
    >
    userFillsQuery: ReturnType<typeof useUserFills>
    aggregateFillsByTime: boolean
  }
  mutate: {
    setAggregateFillsByTime: (aggregate: boolean) => void
  }
}

const UserContext = createContext<State>({} as State)

interface UserProviderProps {
  children: React.ReactNode
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [aggregateFillsByTime, setAggregateFillsByTime] = useState(false)
  const { address } = useAccount()
  const userHistoricalOrdersQuery = useUserHistoricalOrders({
    address,
  })
  const webData2Query = useWebData2({
    address,
  })
  const userFundingsQuery = useUserFundings({
    address,
  })
  const allDexClearinghouseStateQuery = useAllDexClearinghouseState({ address })
  const userFillsQuery = useUserFills({
    address,
    aggregateByTime: aggregateFillsByTime,
  })
  return (
    <UserContext.Provider
      value={useMemo(() => {
        return {
          state: {
            webData2Query,
            userHistoricalOrdersQuery,
            userFundingsQuery,
            allDexClearinghouseStateQuery,
            userFillsQuery,
            aggregateFillsByTime,
          },
          mutate: {
            setAggregateFillsByTime,
          },
        }
      }, [
        webData2Query,
        userHistoricalOrdersQuery,
        userFundingsQuery,
        allDexClearinghouseStateQuery,
        userFillsQuery,
        aggregateFillsByTime,
      ])}
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
