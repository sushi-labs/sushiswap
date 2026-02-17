'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useContext, useMemo } from 'react'
interface State {
  state: {
    quickCloseReversePositionEnabled: boolean
    quickCloseMarketPositionEnabled: boolean
    orderBookAnimationDisabled: boolean
  }
  mutate: {
    setQuickCloseReversePositionEnabled: (enabled: boolean) => void
    setQuickCloseMarketPositionEnabled: (enabled: boolean) => void
    setOrderBookAnimationDisabled: (disabled: boolean) => void
  }
}

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

  return (
    <UserSettingsContext.Provider
      value={useMemo(() => {
        return {
          state: {
            quickCloseReversePositionEnabled,
            quickCloseMarketPositionEnabled,
            orderBookAnimationDisabled,
          },
          mutate: {
            setQuickCloseReversePositionEnabled,
            setQuickCloseMarketPositionEnabled,
            setOrderBookAnimationDisabled,
          },
        }
      }, [
        quickCloseReversePositionEnabled,
        setQuickCloseReversePositionEnabled,
        quickCloseMarketPositionEnabled,
        setQuickCloseMarketPositionEnabled,
        orderBookAnimationDisabled,
        setOrderBookAnimationDisabled,
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
