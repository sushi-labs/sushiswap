'use client'
import { createInfoToast } from '@sushiswap/notifications'
import {
  type FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useAllDexClearinghouseState,
  useOpenOrders,
  useSpotState,
  useUserFills,
  useUserFundings,
  useUserHistoricalOrders,
  useUserNotifications,
  useWebData2,
  useWebData3,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'

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
    spotStateQuery: ReturnType<typeof useSpotState>
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
  const address = useAccount('evm')
  const { data: notification } = useUserNotifications({ address })

  useEffect(() => {
    if (notification) {
      const ts = Date.now()

      createInfoToast({
        summary: notification,
        account: address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: 2_000,
      })
    }
  }, [notification, address])

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
  const spotStateQuery = useSpotState({ address })

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
            spotStateQuery,
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
        spotStateQuery,
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
