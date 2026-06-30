'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { usePathname, useRouter } from 'next/navigation'
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
  type PerpOrSpotAsset,
  type TimeInForceType,
  useActiveAssetData,
  useBalance,
  useUserPositions,
} from 'src/lib/perps'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { type BasisTradeAsset, useAssetListState } from '../asset-selector'

type OrderSize = { base: string; quote: string }

interface State {
  mutate: {
    setActiveAsset: (asset: string) => void
    setActiveBasisTradeAsset: (basisTradeAsset: BasisTradeAsset) => void
    setTradeType: (tradeType: TradeType) => void
    setTradeSide: (tradeSide: TradeSideType) => void
    setReduceOnly: (reduceOnly: boolean) => void
    setSize: (size: OrderSize) => void
    setBasisTradeSize: (leg: BasisTradeSizeKey, size: OrderSize) => void
    setLimitPrice: (limitPrice: string) => void
    setTimeInForce: (timeInForce: TimeInForceType) => void
    setSizeSide: (sizeSide: 'base' | 'quote') => void
    setBasisTradeSizeSide: (
      leg: BasisTradeSizeKey,
      sizeSide: 'base' | 'quote',
    ) => void
    setPercentage: (percentage: number) => void
    setTpPrice: (tpPrice: string) => void
    setSlPrice: (slPrice: string) => void
    setHasTpSl: (hasTpSl: boolean) => void
    setTriggerPrice: (triggerPrice: string) => void
    setScaleStartEnd: (scaleStartEnd: ScaleStartEnd) => void
    setTotalOrders: (totalOrders: string) => void
    setSizeSkew: (sizeSkew: string) => void
    setTwapRunningTime: (twapRunningTime: {
      hours: string
      minutes: string
    }) => void
    setTwapRandomize: (twapRandomize: boolean) => void
  }
  state: {
    activeAsset: string
    tradeType: TradeType
    tradeSide: TradeSideType
    reduceOnly: boolean
    size: OrderSize
    basisTradeSize: BasisTradeSize
    limitPrice: string
    timeInForce: TimeInForceType
    sizeSide: 'base' | 'quote'
    basisTradeSizeSide: BasisTradeSizeSide
    asset: PerpOrSpotAsset | undefined
    basisTradeAsset: BasisTradeAsset | undefined
    percentage: number
    maxTradeSize: string
    maxTradeSizeLong: string
    maxTradeSizeShort: string
    availableToLong: string
    availableToShort: string
    markPrice: string
    activeAssetDataQuery: ReturnType<typeof useActiveAssetData>
    currentLeverageForAsset: number
    tpPrice: string
    slPrice: string
    hasTpSl: boolean
    currentLeverageTypeForAsset: 'cross' | 'isolated'
    triggerPrice: string
    isTpSlOrder: boolean
    isTpSlLimitOrder: boolean
    scaleStartEnd: ScaleStartEnd
    totalOrders: string
    sizeSkew: string
    twapRunningTime: { hours: string; minutes: string }
    twapRandomize: boolean
    totalRunningTimeInMinutes: number
    isLimitOrder: boolean
  }
}

const AssetStateContext = createContext<State>({} as State)

interface AssetStateProviderProps {
  children: React.ReactNode
}

export type ScaleStartEnd = {
  start: string
  end: string
}

export type BasisTradeSizeKey = 'spot' | 'perp'

export type BasisTradeSize = Record<BasisTradeSizeKey, OrderSize>

export type BasisTradeSizeSide = Record<BasisTradeSizeKey, 'base' | 'quote'>

type BasisTradeAssetKeys = {
  spotAsset: string
  perpAsset: string
}

export const TRADE_TYPES = [
  'market',
  'limit',
  'basis trade',
  'scale',
  'stop limit',
  'stop market',
  'take limit',
  'take market',
  'TWAP',
] as const

export const TIME_IN_FORCE = ['Gtc', 'Ioc', 'Alo'] as const

export type TradeType = (typeof TRADE_TYPES)[number]

export type TradeSideType = 'long' | 'short'

const AssetStateProvider: FC<AssetStateProviderProps> = ({ children }) => {
  const [_activeAsset, _setActiveAsset] = useLocalStorage<string>(
    'sushi.perps.active-asset',
    'BTC',
  )
  const [lastUsedLeverages, setLastUsedLeverages] = useLocalStorage<
    Record<string, number>
  >('hyperliquid.last_used_leverage', {})
  const [tradeType, _setTradeType] = useState<TradeType>('market')
  const [tradeSide, setTradeSide] = useState<TradeSideType>('long')
  const [reduceOnly, _setReduceOnly] = useState(false)
  const [size, setSize] = useState({ base: '', quote: '' })
  const [basisTradeAssetKeys, setBasisTradeAssetKeys] =
    useState<BasisTradeAssetKeys>()
  const [basisTradeSize, setBasisTradeSizeState] = useState<BasisTradeSize>({
    spot: { base: '', quote: '' },
    perp: { base: '', quote: '' },
  })
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [basisTradeSizeSide, setBasisTradeSizeSideState] =
    useState<BasisTradeSizeSide>({
      spot: 'base',
      perp: 'base',
    })
  const [limitPrice, setLimitPrice] = useState('')
  const [timeInForce, setTimeInForce] = useState<TimeInForceType>('Gtc')
  const [percentage, setPercentage] = useState(0)
  const [hasTpSl, _setHasTpSl] = useState(false)
  const [tpPrice, setTpPrice] = useState<string>('')
  const [slPrice, setSlPrice] = useState<string>('')
  const [triggerPrice, setTriggerPrice] = useState<string>('')
  const [scaleStartEnd, setScaleStartEnd] = useState<ScaleStartEnd>({
    start: '',
    end: '',
  })
  const [totalOrders, setTotalOrders] = useState<string>('2')
  const [sizeSkew, setSizeSkew] = useState<string>('1')
  const [twapRunningTime, setTwapRunningTime] = useState<{
    hours: string
    minutes: string
  }>({ hours: '', minutes: '30' })
  const [twapRandomize, setTwapRandomize] = useState<boolean>(false)

  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress

  const {
    state: {
      assetListQuery: { data: assetList },
      basisTradeAssets,
    },
  } = useAssetListState()
  const pathname = usePathname()
  const isTradePage = pathname === '/perps'
  const { push } = useRouter()

  const setActiveAsset = useCallback(
    (asset: string) => {
      _setActiveAsset(asset)
      setBasisTradeAssetKeys(undefined)
      if (tradeType === 'basis trade') {
        _setTradeType('market')
      }
      reset()
      if (!isTradePage) {
        push('/perps')
      }
    },
    [_setActiveAsset, push, isTradePage, tradeType],
  )

  const reset = useCallback(() => {
    setTpPrice('')
    setSlPrice('')
    setPercentage(0)
    setLimitPrice('')
    setTriggerPrice('')
    setHasTpSl(false)
    setReduceOnly(false)
    setTimeInForce('Gtc')
    setSize({ base: '', quote: '' })
    setBasisTradeSizeState({
      spot: { base: '', quote: '' },
      perp: { base: '', quote: '' },
    })
    setBasisTradeSizeSideState({
      spot: 'base',
      perp: 'base',
    })
    setScaleStartEnd({ start: '', end: '' })
    setTotalOrders('2')
    setSizeSkew('1')
    setTwapRunningTime({ hours: '', minutes: '' })
    setTwapRandomize(false)
  }, [])

  const activeAsset = useMemo(() => {
    //validates active asset from local storage against asset list, default to BTC if not valid
    if (!assetList) return _activeAsset
    return assetList.has(_activeAsset) ? _activeAsset : 'BTC'
  }, [_activeAsset, assetList])

  const basisTradeAsset = useMemo(() => {
    if (!basisTradeAssets.length) return undefined

    if (basisTradeAssetKeys) {
      return basisTradeAssets.find(
        (asset) =>
          asset.spotAsset.name === basisTradeAssetKeys.spotAsset &&
          asset.perpAsset.name === basisTradeAssetKeys.perpAsset,
      )
    }

    return basisTradeAssets.find(
      (asset) =>
        asset.perpAsset.name === activeAsset ||
        asset.spotAsset.name === activeAsset,
    )
  }, [activeAsset, basisTradeAssetKeys, basisTradeAssets])

  const setActiveBasisTradeAsset = useCallback(
    (_basisTradeAsset: BasisTradeAsset) => {
      _setActiveAsset(_basisTradeAsset.perpAsset.name)
      setBasisTradeAssetKeys({
        spotAsset: _basisTradeAsset.spotAsset.name,
        perpAsset: _basisTradeAsset.perpAsset.name,
      })
      reset()
      _setTradeType('basis trade')
      if (!isTradePage) {
        push('/perps')
      }
    },
    [_setActiveAsset, push, isTradePage, reset],
  )

  const setTradeType = useCallback(
    (_tradeType: TradeType) => {
      if (_tradeType === 'basis trade') {
        if (basisTradeAsset) {
          setBasisTradeAssetKeys({
            spotAsset: basisTradeAsset.spotAsset.name,
            perpAsset: basisTradeAsset.perpAsset.name,
          })
          _setActiveAsset(basisTradeAsset.perpAsset.name)
        }
        _setReduceOnly(false)
        _setHasTpSl(false)
        _setTradeType(_tradeType)
        return
      }

      if (tradeType === 'basis trade') {
        setBasisTradeAssetKeys(undefined)
        setBasisTradeSizeState({
          spot: { base: '', quote: '' },
          perp: { base: '', quote: '' },
        })
      }

      _setTradeType(_tradeType)
    },
    [_setActiveAsset, basisTradeAsset, tradeType],
  )

  const setBasisTradeSize = useCallback(
    (leg: BasisTradeSizeKey, _size: OrderSize) => {
      setBasisTradeSizeState((prev) => ({ ...prev, [leg]: _size }))
    },
    [],
  )

  const setBasisTradeSizeSide = useCallback(
    (leg: BasisTradeSizeKey, _sizeSide: 'base' | 'quote') => {
      setBasisTradeSizeSideState((prev) => ({ ...prev, [leg]: _sizeSide }))
    },
    [],
  )

  const activeAssetDataQuery = useActiveAssetData({
    address,
    assetString: activeAsset,
  })
  const { data: openPosition } = useUserPositions(activeAsset)
  const spotBalance = useBalance({
    assetString: activeAsset,
    coin: activeAsset === 'PURR/USDC' ? 'PURR' : undefined,
  })
  const spotUsdcBalance = useBalance({ assetString: 'PURR/USDC' })
  const totalRunningTimeInMinutes = useMemo(() => {
    const hours = Number.parseInt(twapRunningTime.hours) || 0
    const minutes = Number.parseInt(twapRunningTime.minutes) || 0
    return minutes + hours * 60
  }, [twapRunningTime])

  const isTpSlOrder = useMemo(() => {
    return (
      tradeType === 'take market' ||
      tradeType === 'take limit' ||
      tradeType === 'stop limit' ||
      tradeType === 'stop market'
    )
  }, [tradeType])

  const isLimitOrder = useMemo(() => {
    return (
      tradeType === 'limit' ||
      tradeType === 'stop limit' ||
      tradeType === 'take limit'
    )
  }, [tradeType])

  const isTpSlLimitOrder = useMemo(() => {
    return tradeType === 'take limit' || tradeType === 'stop limit'
  }, [tradeType])

  const asset = useMemo(() => {
    if (!assetList || !activeAsset) return undefined
    return assetList.get(activeAsset)
  }, [assetList, activeAsset])

  const markPrice = useMemo(() => {
    if (asset?.marketType === 'spot') {
      return asset.markPrice || '0'
    }
    return activeAssetDataQuery?.data?.markPx || '0'
  }, [activeAssetDataQuery?.data?.markPx, asset])

  const [availableSpotToBuy, availableSpotToSell] = useMemo(() => {
    if (asset?.marketType !== 'spot') return ['0', '0']
    const balance = spotBalance?.availableBalance || '0'

    const usdcBalance = spotUsdcBalance?.availableBalance || '0'
    const price = asset.markPrice || '1'
    const availableToBuy = (Number(usdcBalance) / Number(price)).toString()

    return [availableToBuy, balance]
  }, [asset, spotBalance, spotUsdcBalance])

  const [availableToLong, availableToShort] = useMemo(() => {
    if (asset?.marketType === 'spot') {
      return [availableSpotToBuy, availableSpotToSell]
    }
    return activeAssetDataQuery?.data?.availableToTrade || ['0', '0']
  }, [
    activeAssetDataQuery?.data?.availableToTrade,
    availableSpotToBuy,
    availableSpotToSell,
    asset?.marketType,
  ])
  const [maxTradeSizeLong, maxTradeSizeShort] = useMemo(
    () => activeAssetDataQuery?.data?.maxTradeSzs || ['0', '0'],
    [activeAssetDataQuery?.data?.maxTradeSzs],
  )

  const maxTradeSize = useMemo(() => {
    if (asset?.marketType === 'spot') {
      return tradeSide === 'long' ? availableSpotToBuy : availableSpotToSell
    }
    if (reduceOnly && (!openPosition || openPosition.length === 0)) {
      return '0'
    }
    if (reduceOnly && openPosition && openPosition.length > 0) {
      const pos = openPosition?.[0]
      const side = pos.side
      const positionSize = Math.abs(Number.parseFloat(pos.position.szi))
      return tradeSide === 'short' && side === 'B'
        ? positionSize.toString()
        : tradeSide === 'long' && side === 'A'
          ? positionSize.toString()
          : '0'
    }
    return tradeSide === 'long' ? maxTradeSizeLong : maxTradeSizeShort
  }, [
    tradeSide,
    maxTradeSizeLong,
    maxTradeSizeShort,
    reduceOnly,
    openPosition,
    availableSpotToBuy,
    availableSpotToSell,
    asset?.marketType,
  ])

  const currentLeverageForAsset = useMemo(
    () => activeAssetDataQuery?.data?.leverage?.value ?? 1,
    [activeAssetDataQuery?.data?.leverage?.value],
  )

  const currentLeverageTypeForAsset = useMemo(
    () => activeAssetDataQuery?.data?.leverage?.type ?? 'cross',
    [activeAssetDataQuery?.data?.leverage?.type],
  )

  // Write leverage to localStorage when it changes
  useEffect(() => {
    const leverage = activeAssetDataQuery?.data?.leverage?.value
    if (!activeAsset || leverage === undefined) return
    if (lastUsedLeverages[activeAsset] === leverage) return

    setLastUsedLeverages((prev) => ({
      ...prev,
      [activeAsset]: leverage,
    }))
  }, [
    activeAsset,
    activeAssetDataQuery?.data?.leverage?.value,
    lastUsedLeverages,
    setLastUsedLeverages,
  ])

  const setReduceOnly = useCallback(
    (_reduceOnly: boolean) => {
      _setReduceOnly(_reduceOnly)
      if (_reduceOnly && hasTpSl) {
        setHasTpSl(false)
        setTpPrice('')
        setSlPrice('')
        setPercentage(0)
        setSize({ base: '', quote: '' })
      }
    },
    [hasTpSl],
  )

  const setHasTpSl = useCallback(
    (_hasTpSl: boolean) => {
      _setHasTpSl(_hasTpSl)
      if (_hasTpSl && reduceOnly) {
        setReduceOnly(false)
        setTpPrice('')
        setSlPrice('')
        setPercentage(0)
        setSize({ base: '', quote: '' })
      }
    },
    [setReduceOnly, reduceOnly],
  )

  return (
    <AssetStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setActiveAsset,
            setActiveBasisTradeAsset,
            setTradeType,
            setTradeSide,
            setReduceOnly,
            setSize,
            setBasisTradeSize,
            setLimitPrice,
            setTimeInForce,
            setSizeSide,
            setBasisTradeSizeSide,
            setPercentage,
            setTpPrice,
            setSlPrice,
            setHasTpSl,
            setTriggerPrice,
            setScaleStartEnd,
            setTotalOrders,
            setSizeSkew,
            setTwapRunningTime,
            setTwapRandomize,
          },
          state: {
            activeAsset,
            tradeType,
            tradeSide,
            reduceOnly,
            size,
            basisTradeSize,
            limitPrice,
            timeInForce,
            sizeSide,
            basisTradeSizeSide,
            asset,
            basisTradeAsset,
            percentage,
            maxTradeSize,
            maxTradeSizeLong,
            maxTradeSizeShort,
            availableToLong,
            availableToShort,
            markPrice,
            activeAssetDataQuery,
            currentLeverageForAsset,
            tpPrice,
            slPrice,
            hasTpSl,
            currentLeverageTypeForAsset,
            triggerPrice,
            isTpSlOrder,
            isTpSlLimitOrder,
            scaleStartEnd,
            totalOrders,
            sizeSkew,
            twapRunningTime,
            twapRandomize,
            totalRunningTimeInMinutes,
            isLimitOrder,
          },
        }
      }, [
        activeAsset,
        setActiveAsset,
        setActiveBasisTradeAsset,
        setTradeType,
        tradeType,
        tradeSide,
        reduceOnly,
        size,
        basisTradeSize,
        limitPrice,
        timeInForce,
        sizeSide,
        basisTradeSizeSide,
        asset,
        basisTradeAsset,
        percentage,
        maxTradeSize,
        maxTradeSizeLong,
        maxTradeSizeShort,
        availableToLong,
        availableToShort,
        markPrice,
        activeAssetDataQuery,
        currentLeverageForAsset,
        tpPrice,
        slPrice,
        hasTpSl,
        setHasTpSl,
        setReduceOnly,
        currentLeverageTypeForAsset,
        triggerPrice,
        isTpSlOrder,
        isTpSlLimitOrder,
        scaleStartEnd,
        totalOrders,
        sizeSkew,
        twapRunningTime,
        twapRandomize,
        totalRunningTimeInMinutes,
        isLimitOrder,
        setBasisTradeSize,
        setBasisTradeSizeSide,
      ])}
    >
      {children}
    </AssetStateContext.Provider>
  )
}

const useAssetState = () => {
  const context = useContext(AssetStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside AssetState State Context')
  }

  return context
}

export { AssetStateProvider, useAssetState }
