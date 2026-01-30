'use client'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import { useAllDexClearinghouseState } from 'src/lib/perps/subscription/use-all-dex-clearinghouse-state'
import { useOpenOrders } from 'src/lib/perps/subscription/use-open-orders'
import { useUserFills } from 'src/lib/perps/subscription/use-user-fills'
import { useUserFundings } from 'src/lib/perps/subscription/use-user-fundings'
import { useUserHistoricalOrders } from 'src/lib/perps/subscription/use-user-historical-orders'
import { useWebData2 } from 'src/lib/perps/subscription/use-web-data-2'
import { useWebData3 } from 'src/lib/perps/subscription/use-web-data-3'
import { useAccount } from 'wagmi'
interface State {
  state: {
    webData2Query: ReturnType<typeof useWebData2>
    webData3Query: ReturnType<typeof useWebData3>
    userHistoricalOrdersQuery: ReturnType<typeof useUserHistoricalOrders>
    userFundingsQuery: ReturnType<typeof useUserFundings>
    allDexClearinghouseStateQuery: ReturnType<
      typeof useAllDexClearinghouseState
    >
    userFillsQuery: ReturnType<typeof useUserFills>
    openOrdersQuery: ReturnType<typeof useOpenOrders>
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
  const webData3Query = useWebData3({
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
  const openOrdersQuery = useOpenOrders({ address })
  return (
    <UserContext.Provider
      value={useMemo(() => {
        return {
          state: {
            webData2Query,
            webData3Query,
            userHistoricalOrdersQuery,
            userFundingsQuery,
            allDexClearinghouseStateQuery,
            userFillsQuery,
            aggregateFillsByTime,
            openOrdersQuery,
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
        openOrdersQuery,
        webData3Query,
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
