'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { createInfoToast } from '@sushiswap/notifications'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import {
  useSetUserAbstraction,
  useSpotDustToggle,
  useUserNotifications,
} from 'src/lib/perps'
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
    showBuySellInChart: boolean
    disableBgFillNotifs: boolean
    hidePnl: boolean
    optOutOfSpotDustCollection: boolean
  }
  mutate: {
    setQuickCloseReversePositionEnabled: (enabled: boolean) => void
    setQuickCloseMarketPositionEnabled: (enabled: boolean) => void
    setOrderBookAnimationDisabled: (disabled: boolean) => void
    setMarketOrderSlippage: (slippage: number) => void
    setQuickConfirmPositionEnabled: (enabled: boolean) => void
    setUnifiedAccountModeEnabled: (enabled: boolean) => void
    setShowBuySellInChart: (enabled: boolean) => void
    setDisableBgFillNotifs: (disabled: boolean) => void
    setHidePnl: (hide: boolean) => void
    setOptOutOfSpotDustCollection: () => void
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
  const [showBuySellInChart, setShowBuySellInChart] = useLocalStorage<boolean>(
    `${BASE_STORAGE_KEY}.show.buy.sell.in.chart`,
    false,
  )
  const [disableBgFillNotifs, setDisableBgFillNotifs] =
    useLocalStorage<boolean>(
      `${BASE_STORAGE_KEY}.disable.bg.fill.notifs`,
      false,
    )
  const [hidePnl, setHidePnl] = useLocalStorage<boolean>(
    `${BASE_STORAGE_KEY}.hide.pnl`,
    false,
  )
  const { isPending, updateSpotDusting } = useSpotDustToggle()

  const { data: notification } = useUserNotifications({ address })

  useEffect(() => {
    if (notification && !disableBgFillNotifs) {
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
  }, [notification, address, disableBgFillNotifs])

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

  const optOutOfSpotDustCollection = useMemo(() => {
    return webData3?.userState?.optOutOfSpotDusting || false
  }, [webData3])

  const setOptOutOfSpotDustCollection = useCallback(() => {
    if (isPending) return

    updateSpotDusting({ optOut: !optOutOfSpotDustCollection })
  }, [updateSpotDusting, isPending, optOutOfSpotDustCollection])

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
            showBuySellInChart,
            disableBgFillNotifs,
            hidePnl,
            optOutOfSpotDustCollection,
          },
          mutate: {
            setQuickCloseReversePositionEnabled,
            setQuickCloseMarketPositionEnabled,
            setOrderBookAnimationDisabled,
            setMarketOrderSlippage,
            setQuickConfirmPositionEnabled,
            setUnifiedAccountModeEnabled,
            setShowBuySellInChart,
            setDisableBgFillNotifs,
            setHidePnl,
            setOptOutOfSpotDustCollection,
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
        showBuySellInChart,
        setShowBuySellInChart,
        disableBgFillNotifs,
        setDisableBgFillNotifs,
        hidePnl,
        setHidePnl,
        optOutOfSpotDustCollection,
        setOptOutOfSpotDustCollection,
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
