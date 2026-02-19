'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useContext, useMemo } from 'react'
interface State {
  state: {
    quickCloseReversePositionEnabled: boolean
    quickCloseMarketPositionEnabled: boolean
    orderBookAnimationDisabled: boolean
    marketOrderSlippage: number
  }
  mutate: {
    setQuickCloseReversePositionEnabled: (enabled: boolean) => void
    setQuickCloseMarketPositionEnabled: (enabled: boolean) => void
    setOrderBookAnimationDisabled: (disabled: boolean) => void
    setMarketOrderSlippage: (slippage: number) => void
  }
}

export const MARKET_SLIPPAGE_DENOMINATOR = 100 //10000 bps = 100% slippage

const UserSettingsContext = createContext<State>({} as State)

interface UserSettingsProviderProps {
  children: React.ReactNode
}

const BASE_STORAGE_KEY = 'sushi.perps.user-settings'

const UserSettingsProvider: FC<UserSettingsProviderProps> = ({ children }) => {
  const [
    quickCloseReversePositionEnabled,
    setQuickCloseReversePositionEnabled,
  ] = useLocalStorage<boolean>(
    `${BASE_STORAGE_KEY}.reverse.position.quick.close`,
    false,
  )
  const [quickCloseMarketPositionEnabled, setQuickCloseMarketPositionEnabled] =
    useLocalStorage<boolean>(
      `${BASE_STORAGE_KEY}.market.position.quick.close`,
      false,
    )
  const [orderBookAnimationDisabled, setOrderBookAnimationDisabled] =
    useLocalStorage<boolean>(
      `${BASE_STORAGE_KEY}.order.book.animation.disabled`,
      false,
    )
  const [marketOrderSlippage, setMarketOrderSlippage] = useLocalStorage<number>(
    `${BASE_STORAGE_KEY}.market.order.slippage`,
    800, //800 = 8% slippage by default
  )

  return (
    <UserSettingsContext.Provider
      value={useMemo(() => {
        return {
          state: {
            quickCloseReversePositionEnabled,
            quickCloseMarketPositionEnabled,
            orderBookAnimationDisabled,
            marketOrderSlippage,
          },
          mutate: {
            setQuickCloseReversePositionEnabled,
            setQuickCloseMarketPositionEnabled,
            setOrderBookAnimationDisabled,
            setMarketOrderSlippage,
          },
        }
      }, [
        quickCloseReversePositionEnabled,
        setQuickCloseReversePositionEnabled,
        quickCloseMarketPositionEnabled,
        setQuickCloseMarketPositionEnabled,
        orderBookAnimationDisabled,
        setOrderBookAnimationDisabled,
        marketOrderSlippage,
        setMarketOrderSlippage,
      ])}
    >
      {children}
    </UserSettingsContext.Provider>
  )
}

const useUserSettingsState = () => {
  const context = useContext(UserSettingsContext)
  if (!context) {
    throw new Error('Hook can only be used inside User Settings Context')
  }

  return context
}

export { UserSettingsProvider, useUserSettingsState }
