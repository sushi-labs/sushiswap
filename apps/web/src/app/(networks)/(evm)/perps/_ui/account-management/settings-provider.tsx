'use client'
import type { L2BookParameters } from '@nktkas/hyperliquid'
import { useLocalStorage } from '@sushiswap/hooks'
import { createInfoToast } from '@sushiswap/notifications'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  TOAST_AUTOCLOSE_TIME,
  useSetUserAbstraction,
  useSpotDustToggle,
  useUserNotifications,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { useUserState } from '~evm/perps/user-provider'
import {
  type AnyTradeType,
  ShareClosedPnlDialog,
} from '../trade-tables/_common/share-closed-pnl-dialog'
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
    nSigFigs?: number
    mantissa: L2BookParameters['mantissa']
    isDexAbstractionEnabled: boolean
    orderBookSide: 'base' | 'quote'
    showPnlCardOnMarketClose: boolean
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
    setNSigFigs: (nSigFigs: number | undefined) => void
    setMantissa: (mantissa: L2BookParameters['mantissa']) => void
    setDexAbstractionEnabled: (enabled: boolean) => void
    setOrderBookSide: (side: 'base' | 'quote') => void
    setShowPnlCardOnMarketClose: (enabled: boolean) => void
    handleOpenPnLCard: (trade: AnyTradeType) => void
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
  const [orderBookSide, setOrderBookSide] = useState<'base' | 'quote'>('quote')
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
  const [showPnlCardOnMarketClose, setShowPnlCardOnMarketClose] =
    useLocalStorage<boolean>(
      `${BASE_STORAGE_KEY}.show.pnl.card.on.market.close`,
      true,
    )
  const { isPending, updateSpotDusting } = useSpotDustToggle()
  const [nSigFigs, setNSigFigs] = useState<number | undefined>(undefined)
  const [mantissa, setMantissa] =
    useState<L2BookParameters['mantissa']>(undefined)
  const [isOpenPnLCard, setIsOpenPnLCard] = useState(false)

  const [anyTrade, setAnyTrade] = useState<AnyTradeType | null>(null)

  const handleOpenPnLCard = useCallback(
    (trade: AnyTradeType) => {
      if (!showPnlCardOnMarketClose) return
      setAnyTrade(trade)
      setIsOpenPnLCard(true)
    },
    [showPnlCardOnMarketClose],
  )

  const handleClosePnLCard = useCallback(() => {
    setAnyTrade(null)
    setIsOpenPnLCard(false)
  }, [])

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
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    }
  }, [notification, address, disableBgFillNotifs])

  const { setUserAbstraction, isPending: isUserAbstractionPending } =
    useSetUserAbstraction()

  const setUnifiedAccountModeEnabled = useCallback(
    (enabled: boolean) => {
      if (!address || isUserAbstractionPending) return
      setUserAbstraction({
        abstraction: !enabled ? 'unifiedAccount' : 'disabled',
        address,
      })
    },
    [setUserAbstraction, address, isUserAbstractionPending],
  )

  const isUnifiedAccountModeEnabled = useMemo(() => {
    return webData3?.userState?.abstraction === 'unifiedAccount'
  }, [webData3?.userState?.abstraction])

  const optOutOfSpotDustCollection = useMemo(() => {
    return webData3?.userState?.optOutOfSpotDusting || false
  }, [webData3])

  const isDexAbstractionEnabled = useMemo(() => {
    return webData3?.userState?.dexAbstractionEnabled || false
  }, [webData3])

  const setDexAbstractionEnabled = useCallback(
    (enabled: boolean) => {
      if (!address || isUserAbstractionPending) return
      setUserAbstraction({
        abstraction: !enabled ? 'dexAbstraction' : 'disabled',
        address,
      })
    },
    [setUserAbstraction, address, isUserAbstractionPending],
  )

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
            nSigFigs,
            mantissa,
            isDexAbstractionEnabled,
            orderBookSide,
            showPnlCardOnMarketClose,
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
            setNSigFigs,
            setMantissa,
            setDexAbstractionEnabled,
            setOrderBookSide,
            setShowPnlCardOnMarketClose,
            handleOpenPnLCard,
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
        nSigFigs,
        mantissa,
        isDexAbstractionEnabled,
        setDexAbstractionEnabled,
        orderBookSide,
        showPnlCardOnMarketClose,
        setShowPnlCardOnMarketClose,
        handleOpenPnLCard,
      ])}
    >
      <>
        {children}
        {anyTrade && isOpenPnLCard && showPnlCardOnMarketClose ? (
          <ShareClosedPnlDialog
            trade={anyTrade}
            isOpen={isOpenPnLCard}
            onOpenChange={handleClosePnLCard}
          />
        ) : null}
      </>
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
