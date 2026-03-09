'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { TimeInForceType } from 'src/lib/perps/exchange'
import { useActiveAssetData } from 'src/lib/perps/subscription'
import type { PerpOrSpotAsset } from 'src/lib/perps/subscription'
import { useBalance, useUserPositions } from 'src/lib/perps/user'
import { useAccount } from 'src/lib/wallet'
import { useAssetListState } from '../asset-selector/asset-list-provider'
interface State {
  mutate: {
    setActiveAsset: (asset: string) => void
    setTradeType: (tradeType: TradeType) => void
    setTradeSide: (tradeSide: TradeSideType) => void
    setReduceOnly: (reduceOnly: boolean) => void
    setSize: (size: { base: string; quote: string }) => void
    setLimitPrice: (limitPrice: string) => void
    setTimeInForce: (timeInForce: TimeInForceType) => void
    setSizeSide: (sizeSide: 'base' | 'quote') => void
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
    size: { base: string; quote: string }
    limitPrice: string
    timeInForce: TimeInForceType
    sizeSide: 'base' | 'quote'
    asset: PerpOrSpotAsset | undefined
    percentage: number
    maxTradeSize: string
    availableToLong: string
    availableToShort: string
    markPrice: string
    //todo: come back and move this
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

export const TRADE_TYPES = [
  'market',
  'limit',
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
  const [_activeAsset, setActiveAsset] = useLocalStorage<string>(
    'sushi.perps.active-asset',
    'BTC',
  )
  const [tradeType, setTradeType] = useState<TradeType>('market')
  const [tradeSide, setTradeSide] = useState<TradeSideType>('long')
  const [reduceOnly, _setReduceOnly] = useState(false)
  const [size, setSize] = useState({ base: '', quote: '' })
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
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
  }>({ hours: '', minutes: '' })
  const [twapRandomize, setTwapRandomize] = useState<boolean>(false)

  const address = useAccount('evm')

  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()

  const activeAsset = useMemo(() => {
    //validates active asset from local storage against asset list, default to BTC if not valid
    if (!assetList) return _activeAsset
    return assetList.has(_activeAsset) ? _activeAsset : 'BTC'
  }, [_activeAsset, assetList])

  const activeAssetDataQuery = useActiveAssetData({
    address,
    assetString: activeAsset,
  })
  const { data: openPosition } = useUserPositions(activeAsset)
  const spotBalance = useBalance({ assetString: activeAsset })
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset if asset?.marketType changes
  useEffect(() => {
    setTpPrice('')
    setSlPrice('')
    setPercentage(0)
    setLimitPrice('')
    setTriggerPrice('')
    setHasTpSl(false)
    setReduceOnly(false)
    setTimeInForce('Gtc')
    setSize({ base: '', quote: '' })
  }, [asset?.marketType])

  return (
    <AssetStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setActiveAsset,
            setTradeType,
            setTradeSide,
            setReduceOnly,
            setSize,
            setLimitPrice,
            setTimeInForce,
            setSizeSide,
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
            limitPrice,
            timeInForce,
            sizeSide,
            asset,
            percentage,
            maxTradeSize,
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
        tradeType,
        tradeSide,
        reduceOnly,
        size,
        limitPrice,
        timeInForce,
        sizeSide,
        asset,
        percentage,
        maxTradeSize,
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
