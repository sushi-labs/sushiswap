'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useCallback, useContext, useMemo } from 'react'
import { useSetUserAbstraction } from 'src/lib/perps/exchange'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { useUserState } from '~evm/perps/user-provider'
interface State {
  state: {
    quickCloseReversePositionEnabled: boolean
    quickCloseMarketPositionEnabled: boolean
    orderBookAnimationDisabled: boolean
    marketOrderSlippage: number
    quickConfirmPositionEnabled: boolean
    isUnifiedAccountModeEnabled: boolean
  }
  mutate: {
    setQuickCloseReversePositionEnabled: (enabled: boolean) => void
    setQuickCloseMarketPositionEnabled: (enabled: boolean) => void
    setOrderBookAnimationDisabled: (disabled: boolean) => void
    setMarketOrderSlippage: (slippage: number) => void
    setQuickConfirmPositionEnabled: (enabled: boolean) => void
    setUnifiedAccountModeEnabled: (enabled: boolean) => void
  }
}

export const MARKET_SLIPPAGE_DENOMINATOR = 100 //10000 bps = 100% slippage

const UserSettingsContext = createContext<State>({} as State)

interface UserSettingsProviderProps {
  children: React.ReactNode
}

const BASE_STORAGE_KEY = 'sushi.perps.user-settings'

const UserSettingsProvider: FC<UserSettingsProviderProps> = ({ children }) => {
  const address = useAccount('evm')
  const {
    state: {
      webData3Query: { data: webData3 },
    },
  } = useUserState()
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
  const [quickConfirmPositionEnabled, setQuickConfirmPositionEnabled] =
    useLocalStorage<boolean>(
      `${BASE_STORAGE_KEY}.open.position.quick.confirm`,
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
  const { setUserAbstraction } = useSetUserAbstraction()

  const setUnifiedAccountModeEnabled = useCallback(
    (enabled: boolean) => {
      if (!address) return
      setUserAbstraction({
        abstraction: !enabled ? 'unifiedAccount' : 'disabled',
        address,
      })
    },
    [setUserAbstraction, address],
  )

  const isUnifiedAccountModeEnabled = useMemo(() => {
    return webData3?.userState?.abstraction === 'unifiedAccount'
  }, [webData3?.userState?.abstraction])

  return (
    <UserSettingsContext.Provider
      value={useMemo(() => {
        return {
          state: {
            quickCloseReversePositionEnabled,
            quickCloseMarketPositionEnabled,
            orderBookAnimationDisabled,
            marketOrderSlippage,
            quickConfirmPositionEnabled,
            isUnifiedAccountModeEnabled,
          },
          mutate: {
            setQuickCloseReversePositionEnabled,
            setQuickCloseMarketPositionEnabled,
            setOrderBookAnimationDisabled,
            setMarketOrderSlippage,
            setQuickConfirmPositionEnabled,
            setUnifiedAccountModeEnabled,
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
        quickConfirmPositionEnabled,
        setQuickConfirmPositionEnabled,
        isUnifiedAccountModeEnabled,
        setUnifiedAccountModeEnabled,
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
