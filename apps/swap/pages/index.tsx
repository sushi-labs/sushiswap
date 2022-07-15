import { Signature } from '@ethersproject/bytes'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import chains, { Chain, ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { _9994, _10000, JSBI, Percent, ZERO } from '@sushiswap/math'
import {
  isStargateBridgeToken,
  STARGATE_BRIDGE_TOKENS,
  STARGATE_CHAIN_ID,
  STARGATE_CONFIRMATION_SECONDS,
  STARGATE_POOL_ADDRESS,
  STARGATE_POOL_ID,
} from '@sushiswap/stargate'
import { Button, classNames, Dots, Loader, NetworkIcon, Popover, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { Approve, BENTOBOX_ADDRESS, useBalance, useSushiXSwapContract, Wallet } from '@sushiswap/wagmi'
import { useBentoBoxTotal, usePrices } from '@sushiswap/wagmi'
import STARGATE_FEE_LIBRARY_V03_ABI from 'abis/stargate-fee-library-v03.json'
import STARGATE_POOL_ABI from 'abis/stargate-pool.json'
import {
  Caption,
  ConfirmationComponentController,
  CrossChainRoute,
  CurrencyInput,
  Rate,
  SameChainRoute,
  SettingsOverlay,
  SwitchCurrenciesButton,
} from 'components'
import { defaultTheme, SUSHI_X_SWAP_ADDRESS } from 'config'
import { useTrade } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { SushiXSwap } from 'lib/SushiXSwap'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Theme } from 'types'
import { useAccount, useContractRead, useContractReads, useFeeData, useNetwork, useSwitchNetwork } from 'wagmi'

const BIPS_BASE = JSBI.BigInt(10000)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
]

type WarningSeverity = 0 | 1 | 2 | 3 | 4

export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
  if (!priceImpact) return 4
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lessThan(priceImpact)) return impact
    impact--
  }
  return 0
}

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

const theme: Theme = {
  ...defaultTheme,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { srcChainId, dstChainId, srcTypedAmount, dstTypedAmount, srcUseBentoBox, dstUseBentoBox } = query
  return {
    props: {
      srcChainId: srcChainId ?? ChainId.AVALANCHE,
      dstChainId: dstChainId ?? ChainId.OPTIMISM,
      srcTypedAmount: srcTypedAmount ?? '',
      dstTypedAmount: dstTypedAmount ?? '',
      srcUseBentoBox: srcUseBentoBox ?? false,
      dstUseBentoBox: dstUseBentoBox ?? false,
    },
  }
}

export default function Swap({
  srcChainId = ChainId.AVALANCHE,
  dstChainId = ChainId.OPTIMISM,
  srcTypedAmount = '',
  dstTypedAmount = '',
  srcUseBentoBox = false,
  dstUseBentoBox = false,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // TODO: Sync from local storage if no query params

  // const { data } = useSWR<SwapCache>('swap-cache', storage, {
  //   fallbackData: { srcChainId: ChainId.AVALANCHE, dstChainId: ChainId.FANTOM },
  // })
  // function mutateSwapCache(value: SwapCache) {
  //   localStorage.setItem('swap-cache', JSON.stringify(value))
  //   mutate('swap-cache', value)
  // }

  return (
    <div className="pt-10 sm:pt-20 space-y-12 pb-60">
      <Widget
        theme={theme}
        initialState={{
          srcChainId: Number(srcChainId),
          dstChainId: Number(dstChainId),
          srcTypedAmount,
          dstTypedAmount,
          srcUseBentoBox: JSON.parse(srcUseBentoBox),
          dstUseBentoBox: JSON.parse(dstUseBentoBox),
          srcToken: Native.onChain(Number(srcChainId)),
          dstToken: Native.onChain(Number(dstChainId)),
        }}
        // swapCache={data}
        // mutateSwapCache={mutateSwapCache}
      />
      {/* <Widget header={<>Swap</>} /> */}
    </div>
  )
}

interface Swap {
  width?: number | string
  theme?: Theme
  initialState: {
    srcChainId: number
    dstChainId: number
    srcTypedAmount: string
    dstTypedAmount: string
    srcUseBentoBox: boolean
    dstUseBentoBox: boolean
    srcToken: Currency
    dstToken: Currency
  }
  caption?: boolean
  // swapCache: SwapCache
  // mutateSwapCache: (cache: SwapCache) => void
}

const Widget: FC<Swap> = ({
  width = 400,
  theme = defaultTheme,
  initialState,
  caption = false,
  // swapCache,
  // mutateSwapCache,
}) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const [isWritePending, setIsWritePending] = useState<boolean>()

  const [signature, setSignature] = useState<Signature>()

  const router = useRouter()

  const [expertMode, setExpertMode] = useState<boolean>(false)

  const [srcChainId, setSrcChainId] = useState<number>(initialState.srcChainId)
  const [dstChainId, setDstChainId] = useState<number>(initialState.dstChainId)

  const [srcToken, setSrcToken] = useState<Currency>(initialState.srcToken)
  const [dstToken, setDstToken] = useState<Currency>(initialState.dstToken)

  useEffect(() => setSrcToken(Native.onChain(srcChainId)), [srcChainId])
  useEffect(() => setDstToken(Native.onChain(dstChainId)), [dstChainId])

  const feeData = useFeeData({
    chainId: srcChainId,
    formatUnits: 'gwei',
  })

  const [srcTypedAmount, setSrcTypedAmount] = useState<string>(initialState.srcTypedAmount)
  const [dstTypedAmount, setDstTypedAmount] = useState<string>(initialState.dstTypedAmount)

  const [srcUseBentoBox, setSrcUseBentoBox] = useState(initialState.srcUseBentoBox)
  const [dstUseBentoBox, setDstUseBentoBox] = useState(initialState.dstUseBentoBox)

  const srcTokens = useTokens(srcChainId)
  const dstTokens = useTokens(dstChainId)

  const srcTokenRebase = useBentoBoxTotal(srcChainId, srcToken)

  // This effect is responsible for encoding the swap state into the URL, to add statefullness
  // to the swapper. It has an escape hatch to prevent uneeded re-runs, this is important.
  useEffect(() => {
    // Escape hatch if already synced (could probably pull something like this out to generic...)
    // console.debug([
    //   srcChainId === Number(router.query.srcChainId),
    //   dstChainId === Number(router.query.dstChainId),
    //   srcToken.wrapped.address === router.query.srcToken,
    //   dstToken.wrapped.address === router.query.dstToken,
    //   srcTypedAmount === router.query.srcTypedAmount,
    //   dstTypedAmount === router.query.dstTypedAmount,
    //   srcUseBentoBox === JSON.parse((router?.query?.srcUseBentoBox as string) || 'false'),
    //   dstUseBentoBox === JSON.parse((router?.query?.dstUseBentoBox as string) || 'false'),
    // ])

    if (
      srcChainId === Number(router.query.srcChainId) &&
      dstChainId === Number(router.query.dstChainId) &&
      srcToken.wrapped.address === router.query.srcToken &&
      dstToken.wrapped.address === router.query.dstToken &&
      srcTypedAmount === router.query.srcTypedAmount &&
      dstTypedAmount === router.query.dstTypedAmount &&
      srcUseBentoBox === JSON.parse((router?.query?.srcUseBentoBox as string) || 'false') &&
      dstUseBentoBox === JSON.parse((router?.query?.dstUseBentoBox as string) || 'false')
    ) {
      return
    }

    void router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        srcChainId,
        dstChainId,
        // TODO: currencyId to handle native currencyId#
        // srcToken: srcToken && srcToken.isNative ? srcToken.symbol : srcToken.wrapped.address,
        // dstToken: dstToken && dstToken.isNative ? dstToken.symbol : dstToken.wrapped.address,
        srcToken: srcToken.wrapped.address,
        dstToken: dstToken.wrapped.address,
        srcTypedAmount,
        dstTypedAmount,
        srcUseBentoBox,
        dstUseBentoBox,
      },
    })
  }, [
    dstChainId,
    dstToken.wrapped.address,
    dstTypedAmount,
    dstUseBentoBox,
    router,
    srcChainId,
    srcToken.wrapped.address,
    srcTypedAmount,
    srcUseBentoBox,
  ])

  const contract = useSushiXSwapContract(srcChainId)

  // Computed
  const crossChain = srcChainId !== dstChainId

  // useContractEvent(
  //   {
  //     addressOrName: STARGATE_ROUTER_ADDRESS[dstChainId],
  //     contractInterface: STARGATE_ROUTER_ABI,
  //   },
  //   'CreditChainPath',
  //   (event) => {
  //     console.log(event)
  //     if (event.to === account?.address) {
  //       console.log('GOT EVENT!!!', event)
  //     }
  //   },
  //   {
  //     chainId: dstChainId,
  //   }
  // )

  // First we'll check if bridge tokens for srcChainId includes srcToken, if so use srcToken as srcBridgeToken,
  // else take first stargate bridge token as srcBridgeToken
  const srcBridgeToken =
    srcToken.isToken && isStargateBridgeToken(srcToken) ? srcToken : STARGATE_BRIDGE_TOKENS[srcChainId][0]

  // First we'll check if bridge tokens for dstChainId includes dstToken, if so use dstToken as dstBridgeToken,
  // else take first stargate bridge token as dstBridgeToken
  const dstBridgeToken =
    dstToken.isToken && isStargateBridgeToken(dstToken) ? dstToken : STARGATE_BRIDGE_TOKENS[dstChainId][0]

  // Parse the srcTypedAmount into a srcAmount
  const srcAmount = useMemo<Amount<Currency> | undefined>(() => {
    return tryParseAmount(srcTypedAmount, srcToken)
  }, [srcToken, srcTypedAmount])

  // srcTrade
  const srcTrade = useTrade(
    srcChainId,
    TradeType.EXACT_INPUT,
    srcAmount,
    srcToken,
    crossChain ? srcBridgeToken : dstToken
  )

  const srcMinimumAmountOut =
    (crossChain && !isStargateBridgeToken(srcToken)) || !crossChain
      ? srcTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE)
      : srcAmount

  const srcAmountOutMinusStargateFee = useMemo(() => {
    return crossChain ? srcMinimumAmountOut?.multiply(_10000)?.divide(_9994) : srcMinimumAmountOut
  }, [crossChain, srcMinimumAmountOut])

  const stargateFee = srcAmountOutMinusStargateFee
    ? srcMinimumAmountOut?.subtract(srcAmountOutMinusStargateFee)
    : undefined

  const dstAmountIn = useMemo(() => {
    return tryParseAmount(
      crossChain ? srcAmountOutMinusStargateFee?.toFixed() : srcMinimumAmountOut?.toFixed(),
      crossChain ? dstBridgeToken : dstToken
    )
  }, [crossChain, dstBridgeToken, dstToken, srcAmountOutMinusStargateFee, srcMinimumAmountOut])

  // dstTrade
  const dstTrade = useTrade(dstChainId, TradeType.EXACT_INPUT, dstAmountIn, dstBridgeToken, dstToken)

  const { data: stargatePoolResults } = useContractReads({
    contracts: [
      {
        addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address],
        functionName: 'getChainPath',
        args: [STARGATE_CHAIN_ID[dstChainId], STARGATE_POOL_ID[dstChainId][dstBridgeToken.address]],
        contractInterface: STARGATE_POOL_ABI,
        chainId: srcChainId,
      },
      {
        addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address],
        functionName: 'feeLibrary',
        contractInterface: STARGATE_POOL_ABI,
        chainId: srcChainId,
      },
    ],
    enabled: crossChain,
  })

  const { data: equilibriumFee } = useContractRead({
    addressOrName: String(stargatePoolResults?.[1]),
    functionName: 'getEquilibriumFee',
    args: [
      stargatePoolResults?.[0].idealBalance.toString(),
      stargatePoolResults?.[0].balance.toString(),
      srcMinimumAmountOut?.quotient?.toString(),
    ],
    contractInterface: STARGATE_FEE_LIBRARY_V03_ABI,
    chainId: srcChainId,
    enabled: Boolean(crossChain && stargatePoolResults && srcMinimumAmountOut),
  })

  // console.log([
  //   {
  //     contracts: [
  //       {
  //         addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address],
  //         functionName: 'getChainPath',
  //         args: [STARGATE_CHAIN_ID[dstChainId], STARGATE_POOL_ID[dstChainId][dstBridgeToken.address]],
  //         chainId: srcChainId,
  //       },
  //       {
  //         addressOrName: STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address],
  //         functionName: 'feeLibrary',
  //         chainId: srcChainId,
  //       },
  //     ],
  //     enabled: crossChain,
  //   },
  //   {
  //     addressOrName: String(stargatePoolResults?.[1]),
  //     functionName: 'getEquilibriumFee',
  //     args: [
  //       stargatePoolResults?.[0].idealBalance.toString(),
  //       stargatePoolResults?.[0].balance.toString(),
  //       srcMinimumAmountOut?.quotient?.toString(),
  //     ],
  //   },
  //   equilibriumFee?.[0]?.toString() / 1e6,
  // ])

  const priceImpact = useMemo(() => {
    if (!crossChain && srcTrade) {
      return srcTrade.priceImpact
    }

    if (!stargateFee || !equilibriumFee || !srcMinimumAmountOut) {
      return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
    }

    const bridgeImpact = new Percent(
      JSBI.add(stargateFee.quotient, JSBI.BigInt(equilibriumFee[0].toString())),
      srcMinimumAmountOut.quotient
    )

    if (crossChain && srcTrade && dstTrade && !isStargateBridgeToken(srcToken) && !isStargateBridgeToken(dstToken)) {
      return srcTrade.priceImpact.add(dstTrade.priceImpact).add(bridgeImpact)
    } else if (crossChain && !srcTrade && dstTrade && !isStargateBridgeToken(dstToken)) {
      return dstTrade.priceImpact.add(bridgeImpact)
    } else if (crossChain && srcTrade && !dstTrade && !isStargateBridgeToken(srcToken)) {
      return srcTrade.priceImpact.add(bridgeImpact)
    }

    // Return zero percent
    return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
  }, [crossChain, dstToken, dstTrade, equilibriumFee, srcMinimumAmountOut, srcToken, srcTrade, stargateFee])

  const dstMinimumAmountOut =
    crossChain && !isStargateBridgeToken(dstToken)
      ? dstTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE)
      : srcMinimumAmountOut

  const price =
    srcAmount && dstMinimumAmountOut
      ? new Price({ baseAmount: srcAmount, quoteAmount: dstMinimumAmountOut })
      : undefined

  // DEBUG
  useEffect(() => {
    console.debug('SRC CHAIN', srcChainId)
    console.debug('DST CHAIN', dstChainId)
    console.debug('SRC TOKEN', srcToken)
    console.debug('DST TOKEN', dstToken)
    console.debug('SRC TRADE', srcTrade)
    console.debug('DST TRADE', dstTrade)
    console.debug('SRC AMOUNT IN', srcAmount?.toFixed())
    console.debug('SRC MINIMUM AMOUNT OUT', srcMinimumAmountOut?.toFixed())
    console.debug('STARGATE FEE', stargateFee?.toFixed())
    console.debug('SRC MINIMUM AMOUNT OUT MINUS SG FEE', srcAmountOutMinusStargateFee?.toFixed())
    console.debug('DST AMOUNT IN', dstAmountIn?.toFixed())
    console.debug('DST MINIMUM AMOUNT OUT', dstMinimumAmountOut?.toFixed())
    console.debug('SRC TRADE PRICE IMPACT', srcTrade?.priceImpact?.multiply(-1).toFixed(2))
    console.debug('DST TRADE PRICE IMPACT', dstTrade?.priceImpact?.multiply(-1).toFixed(2))
    console.debug('PRICE IMPACT', priceImpact?.multiply(-1).toFixed(2))
  }, [
    srcTrade,
    dstTrade,
    srcAmount,
    srcMinimumAmountOut,
    stargateFee,
    srcAmountOutMinusStargateFee,
    dstAmountIn,
    dstMinimumAmountOut,
    priceImpact,
    dstChainId,
    srcToken,
    dstToken,
    srcChainId,
  ])

  useEffect(() => {
    if (!crossChain || isStargateBridgeToken(dstToken)) {
      setDstTypedAmount(srcTrade?.outputAmount?.toFixed() ?? '')
    } else if (!isStargateBridgeToken(dstToken)) {
      setDstTypedAmount(dstTrade?.outputAmount?.toFixed() ?? '')
    }
  }, [dstMinimumAmountOut, srcTrade, crossChain, dstToken, dstTrade])

  const switchCurrencies = useCallback(() => {
    const _srcChainId = srcChainId
    const _srcToken = srcToken
    const _srcUseBento = srcUseBentoBox
    const _dstChainId = dstChainId
    const _dstToken = dstToken
    const _dstUseBento = dstUseBentoBox

    setSrcChainId(_dstChainId)
    setSrcToken(_dstToken)
    setDstChainId(_srcChainId)
    setDstToken(_srcToken)
    setDstUseBentoBox(_srcUseBento)
    setSrcUseBentoBox(_dstUseBento)
  }, [dstChainId, dstToken, dstUseBentoBox, srcChainId, srcToken, srcUseBentoBox])

  const execute = useCallback(() => {
    console.log([
      !srcChainId,
      !srcAmount,
      !srcMinimumAmountOut,
      !srcAmountOutMinusStargateFee,
      !dstChainId,
      !dstMinimumAmountOut,
      !address,
      !srcTokenRebase,
      // !dstTokenRebase,
      !contract,
    ])
    if (
      !srcChainId ||
      !srcAmount ||
      !srcMinimumAmountOut ||
      !srcAmountOutMinusStargateFee ||
      !dstChainId ||
      !dstMinimumAmountOut ||
      !address ||
      !srcTokenRebase ||
      // !dstTokenRebase ||
      !contract
    ) {
      return
    }

    const srcShare = srcAmount.toShare(srcTokenRebase)

    const srcMinimumShareOut = srcMinimumAmountOut.toShare(srcTokenRebase)
    // const dstMinimumShareOut = dstMinimumAmountOut.toShare(dstTokenRebase)

    setIsWritePending(true)

    const sushiXSwap = new SushiXSwap({
      contract,
      srcToken,
      dstToken,
      srcTrade,
      dstTrade,
      srcUseBentoBox,
      dstUseBentoBox,
      user: address,
      debug: true,
    })

    if (signature) {
      sushiXSwap.srcCooker.setMasterContractApproval(signature)
    }

    if (crossChain && isStargateBridgeToken(srcToken) && isStargateBridgeToken(dstToken)) {
      sushiXSwap.transfer(srcAmount, srcShare)
    } else if (!crossChain && srcTrade && srcTrade.route.legs.length) {
      sushiXSwap.swap(srcAmount, srcShare, srcMinimumAmountOut, srcMinimumShareOut)
    } else if (crossChain && ((srcTrade && srcTrade.route.legs.length) || (dstTrade && dstTrade.route.legs.length))) {
      sushiXSwap.crossChainSwap(
        srcAmount,
        srcShare,
        srcMinimumAmountOut,
        srcMinimumShareOut,
        dstMinimumAmountOut
        // dstMinimumShareOut
      )
    }

    if (crossChain) {
      sushiXSwap.teleport(srcBridgeToken, dstBridgeToken, dstTrade ? dstTrade.route.gasSpent + 500000 : undefined)
    }

    console.debug('attempt cook')
    sushiXSwap
      .cook(dstTrade ? dstTrade.route.gasSpent + 500000 : undefined)
      .then((res) => {
        console.debug('then cooked', res)
      })
      .catch((err) => {
        console.error('catch err', err)
      })
      .finally(() => {
        setIsWritePending(false)
      })
  }, [
    address,
    contract,
    crossChain,
    dstBridgeToken,
    dstChainId,
    dstMinimumAmountOut,
    dstToken,
    // dstTokenRebase,
    dstTrade,
    dstUseBentoBox,
    signature,
    srcAmount,
    srcTokenRebase,
    srcBridgeToken,
    srcChainId,
    srcMinimumAmountOut,
    srcAmountOutMinusStargateFee,
    srcToken,
    srcTrade,
    srcUseBentoBox,
  ])

  const isMounted = useIsMounted()

  const { data: srcBalance } = useBalance({ chainId: srcChainId, account: address, currency: srcToken })
  const { data: dstBalance } = useBalance({ chainId: dstChainId, account: address, currency: dstToken })

  const { data: srcPrices } = usePrices({ chainId: srcChainId })
  const { data: dstPrices } = usePrices({ chainId: dstChainId })

  const srcTokenPrice = srcPrices?.[srcToken.wrapped.address]
  const dstTokenPrice = dstPrices?.[dstToken.wrapped.address]

  const routeNotFound = useMemo(() => {
    if (crossChain && (isStargateBridgeToken(srcToken) || isStargateBridgeToken(dstToken))) {
      return (
        (isStargateBridgeToken(srcToken) && (!dstTrade || !dstTrade.route.legs.length)) ||
        (isStargateBridgeToken(dstToken) && (!srcTrade || !srcTrade.route.legs.length))
      )
    } else if (!crossChain && srcTrade && srcTrade.route.legs.length) {
      return !srcTrade
    } else if (crossChain && ((srcTrade && srcTrade.route.legs.length) || (dstTrade && dstTrade.route.legs.length))) {
      return !srcTrade || !dstTrade
    }
    return false
  }, [crossChain, srcToken, dstToken, srcTrade, dstTrade])

  const priceImpactSeverity = useMemo(() => warningSeverity(priceImpact), [priceImpact])

  const priceImpactTooHigh = priceImpactSeverity > 3 && !expertMode

  const [inputUsd, outputUsd, usdPctChange] = useMemo(() => {
    const inputUSD = srcAmount && srcTokenPrice ? srcAmount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD =
      dstMinimumAmountOut && dstTokenPrice ? dstMinimumAmountOut.multiply(dstTokenPrice.asFraction) : undefined
    const usdPctChange =
      inputUSD && outputUSD
        ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
        : undefined

    return [inputUSD, outputUSD, usdPctChange]
  }, [dstMinimumAmountOut, dstTokenPrice, srcAmount, srcTokenPrice])

  const showWrap = false

  const stats = useMemo(() => {
    return (
      <>
        <Typography variant="sm" className="text-slate-400">
          Min. Received
        </Typography>
        <Typography variant="sm" weight={700} className="text-right text-slate-200 truncate">
          {dstMinimumAmountOut?.toSignificant(6)} {dstMinimumAmountOut?.currency.symbol}
        </Typography>
        <Typography variant="sm" className="text-slate-400">
          Price Impact
        </Typography>
        <Typography variant="sm" weight={700} className="text-slate-200 text-right truncate">
          {priceImpact?.multiply(-1).toFixed(2)}%
        </Typography>
        <Typography variant="sm" className="text-slate-400">
          Est. Processing Time
        </Typography>
        <Typography variant="sm" weight={700} className="text-slate-200 text-right truncate">
          ~{Math.ceil(STARGATE_CONFIRMATION_SECONDS[srcChainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] / 60)}{' '}
          minutes
        </Typography>
      </>
    )
  }, [dstMinimumAmountOut, priceImpact, srcChainId])

  return (
    <>
      <article
        id="sushixswap"
        className={classNames(
          theme.background.primary,
          'flex flex-col mx-auto rounded-2xl relative overflow-hidden min-w-[320px] shadow shadow-slate-900'
        )}
        style={{ width }}
      >
        <div className="p-3 mx-[2px] grid grid-cols-2 items-center pb-4 font-medium">
          <Typography
            weight={500}
            className={classNames(theme.primary.default, theme.primary.hover, 'flex items-center gap-2')}
          >
            Swap
          </Typography>
          <div className="flex justify-end">
            <SettingsOverlay chainId={srcChainId} />
          </div>
        </div>
        <CurrencyInput
          value={srcTypedAmount}
          onChange={setSrcTypedAmount}
          onCurrencySelect={setSrcToken}
          onFundSourceSelect={(source) => setSrcUseBentoBox(source === FundSource.BENTOBOX)}
          fundSource={srcUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET}
          currency={srcToken}
          network={Chain.from(srcChainId)}
          onNetworkSelect={(chainId) => {
            setSrcChainId(chainId)
            // mutateSwapCache({
            //   ...swapCache,
            //   srcChainId: chainId,
            // })
          }}
          tokenList={srcTokens}
          theme={theme}
          onMax={(value) => setSrcTypedAmount(value)}
          balance={srcBalance?.[srcUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET]}
        />
        <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
          <SwitchCurrenciesButton onClick={switchCurrencies} />
        </div>
        <div className="bg-slate-800">
          <CurrencyInput
            className="pb-1"
            disabled
            value={dstTypedAmount}
            onChange={setDstTypedAmount}
            onCurrencySelect={setDstToken}
            onFundSourceSelect={(source) => setDstUseBentoBox(source === FundSource.BENTOBOX)}
            fundSource={dstUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET}
            currency={dstToken}
            network={Chain.from(dstChainId)}
            onNetworkSelect={setDstChainId}
            tokenList={dstTokens}
            theme={theme}
            disableMaxButton
            balance={dstBalance?.[dstUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET]}
            usdPctChange={usdPctChange}
          />

          <div className="px-3 pb-3">
            <Rate price={price} theme={theme}>
              {({ content, usdPrice, toggleInvert }) => (
                <div
                  className={classNames(
                    'text-slate-300 hover:text-slate-200 flex justify-between border-t border-opacity-40 border-slate-700 py-2'
                  )}
                >
                  <Typography variant="sm" className={classNames('cursor-pointer h-[36px] flex items-center gap-1')}>
                    <Popover
                      hover
                      panel={<div className="bg-slate-700 p-3 grid grid-cols-2 gap-1">{stats}</div>}
                      button={<InformationCircleIcon width={16} height={16} />}
                    />
                    Rate
                  </Typography>
                  <Typography variant="sm" className={classNames('cursor-pointer h-[36px] flex items-center ')}>
                    {price ? (
                      <div className="flex items-center h-full gap-1 font-medium" onClick={toggleInvert}>
                        {content} <span className="text-slate-500">(${usdPrice})</span>
                      </div>
                    ) : (
                      'Enter an amount'
                    )}
                  </Typography>
                </div>
              )}
            </Rate>

            {isMounted && !address ? (
              <Wallet.Button fullWidth color="blue" size="md">
                Connect Wallet
              </Wallet.Button>
            ) : isMounted && chain && chain.id !== srcChainId ? (
              <Button size="md" fullWidth onClick={() => switchNetwork && switchNetwork(srcChainId)}>
                Switch to {Chain.from(srcChainId).name}
              </Button>
            ) : showWrap ? (
              <Button size="md" fullWidth>
                Wrap
              </Button>
            ) : srcAmount?.greaterThan(0) && routeNotFound ? (
              <Button size="md" fullWidth disabled>
                Insufficient liquidity for this trade.
              </Button>
            ) : isMounted && chain && chain.id == srcChainId ? (
              <>
                <ConfirmationComponentController
                  variant="dialog"
                  trigger={({ setOpen }) => (
                    <Button
                      fullWidth
                      size="md"
                      variant="filled"
                      color={priceImpactTooHigh || priceImpactSeverity > 2 ? 'red' : 'blue'}
                      disabled={
                        isWritePending ||
                        !srcAmount?.greaterThan(ZERO) ||
                        Boolean(srcAmount && !dstMinimumAmountOut) ||
                        priceImpactTooHigh
                      }
                      onClick={() => setOpen(true)}
                    >
                      {isWritePending ? (
                        <Dots>Confirm transaction</Dots>
                      ) : priceImpactTooHigh ? (
                        'High Price Impact'
                      ) : !routeNotFound && priceImpactSeverity > 2 ? (
                        'Swap Anyway'
                      ) : (
                        'Swap'
                      )}
                    </Button>
                  )}
                >
                  <div className="!my-0 grid grid-cols-12 items-center">
                    <div className="relative flex flex-col col-span-12 gap-1 p-4 rounded-2xl bg-slate-700/40 border border-slate-200/5">
                      <div className="flex justify-between gap-2">
                        {srcAmount && (
                          <Typography variant="xs" weight={500} className="flex gap-1 items-center text-slate-400">
                            <NetworkIcon type="naked" chainId={srcAmount.currency.chainId} width={16} height={16} />
                            <span>{chains[srcAmount.currency.chainId].name}</span>
                          </Typography>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                          {srcUseBentoBox ? 'Pay From BentoBox' : 'Pay From Wallet'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex justify-between items-center w-full gap-2">
                          <Typography variant="h3" weight={700} className="truncate text-slate-50">
                            {srcAmount?.toSignificant(6)}{' '}
                          </Typography>
                          <div className="flex gap-2 text-right justify-end items-center">
                            {srcAmount && (
                              <div className="w-5 h-5">
                                <Icon currency={srcAmount.currency} width={20} height={20} />
                              </div>
                            )}
                            <Typography variant="h3" weight={500} className="text-slate-50 text-right">
                              {srcAmount?.currency.symbol}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <Typography variant="sm" weight={700} className="text-slate-500">
                        {inputUsd ? `$${inputUsd.toFixed(2)}` : '-'}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
                      <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                        <ChevronDownIcon width={18} height={18} className="text-slate-200" />
                      </div>
                    </div>
                    <div className="flex flex-col col-span-12 gap-1 p-4 rounded-2xl bg-slate-700/40 border border-slate-200/5">
                      <div className="flex justify-between gap-2">
                        {dstMinimumAmountOut && (
                          <Typography variant="xs" weight={500} className="flex gap-1 items-center text-slate-400">
                            <NetworkIcon
                              type="naked"
                              chainId={dstMinimumAmountOut.currency.chainId}
                              width={16}
                              height={16}
                            />
                            <span>{chains[dstMinimumAmountOut.currency.chainId].name}</span>
                          </Typography>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                          {dstUseBentoBox ? 'Receive In BentoBox' : 'Receive In Wallet'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex justify-between items-center w-full gap-2">
                          <Typography variant="h3" weight={700} className="truncate text-slate-50">
                            {dstMinimumAmountOut?.toSignificant(6)}{' '}
                          </Typography>
                          <div className="flex gap-2 text-right justify-end items-center">
                            {dstMinimumAmountOut && (
                              <div className="w-5 h-5">
                                <Icon currency={dstMinimumAmountOut.currency} width={20} height={20} />
                              </div>
                            )}
                            <Typography variant="h3" weight={500} className="text-slate-50 text-right">
                              {dstMinimumAmountOut?.currency.symbol}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <Typography variant="sm" weight={700} className="text-slate-500">
                        {outputUsd ? `$${outputUsd.toFixed(2)}` : '-'}
                        {usdPctChange && (
                          <span
                            className={classNames(
                              usdPctChange === 0 ? '' : usdPctChange > 0 ? 'text-green' : 'text-red'
                            )}
                          >
                            {' '}
                            {`${usdPctChange === 0 ? '' : usdPctChange > 0 ? '(+' : '('}${
                              usdPctChange === 0 ? '0.00' : usdPctChange?.toFixed(2)
                            }%)`}
                          </span>
                        )}
                      </Typography>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <Rate price={price} theme={theme}>
                      {({ toggleInvert, content, usdPrice }) => (
                        <Typography
                          as="button"
                          onClick={() => toggleInvert()}
                          variant="sm"
                          weight={600}
                          className="flex items-center gap-1 text-slate-100"
                        >
                          {content} <span className="text-slate-300 font-normal">(${usdPrice})</span>
                        </Typography>
                      )}
                    </Rate>
                  </div>
                  <div className="grid grid-cols-2 gap-1 rounded-2xl p-4 border border-slate-200/5 bg-slate-700/40">
                    {stats}
                    {crossChain ? (
                      <CrossChainRoute
                        srcTrade={srcTrade}
                        dstTrade={dstTrade}
                        inputAmount={srcAmount}
                        outputAmount={dstMinimumAmountOut}
                        dstBridgeToken={dstBridgeToken}
                        srcBridgeToken={srcBridgeToken}
                      />
                    ) : (
                      <SameChainRoute trade={srcTrade} />
                    )}
                  </div>
                  <Approve
                    className="flex-grow !justify-end pt-4"
                    components={
                      <Approve.Components>
                        <Approve.Bentobox
                          size="md"
                          className="whitespace-nowrap"
                          fullWidth
                          address={SUSHI_X_SWAP_ADDRESS[srcChainId]}
                          onSignature={setSignature}
                        />
                        <Approve.Token
                          size="md"
                          className="whitespace-nowrap"
                          fullWidth
                          amount={srcAmount}
                          address={BENTOBOX_ADDRESS[srcChainId]}
                        />
                      </Approve.Components>
                    }
                    render={({ approved }) => {
                      return (
                        <Button size="md" disabled={!approved} fullWidth color="gradient" onClick={execute}>
                          Confirm Swap
                        </Button>
                      )
                    }}
                  />
                </ConfirmationComponentController>
              </>
            ) : (
              <Button fullWidth color="blue">
                <Loader size="16px" />
              </Button>
            )}
            {caption && <Caption theme={theme} />}
          </div>
        </div>
      </article>
    </>
  )
}
