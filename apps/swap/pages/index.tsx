import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/outline'
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
import { Button, classNames, Dialog, Dots, Loader, NetworkIcon, Popover, SlideIn, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import {
  Approve,
  BENTOBOX_ADDRESS,
  getSushiXSwapContractConfig,
  useBalance,
  useBentoBoxTotal,
  usePrices,
  useSushiXSwapContract,
  useSushiXSwapContractWithProvider,
  Wallet,
} from '@sushiswap/wagmi'
import STARGATE_FEE_LIBRARY_V03_ABI from 'abis/stargate-fee-library-v03.json'
import STARGATE_POOL_ABI from 'abis/stargate-pool.json'
import {
  Caption,
  ConfirmationComponentController,
  CrossChainRoute,
  CurrencyInput,
  Layout,
  Rate,
  SameChainRoute,
  SettingsOverlay,
  SwitchCurrenciesButton,
  TransactionProgressOverlay,
} from 'components'
import { defaultTheme } from 'config'
import { useTrade } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { SushiXSwap } from 'lib/SushiXSwap'
import { nanoid } from 'nanoid'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Theme } from 'types'
import { useAccount, useContractRead, useContractReads, useNetwork, useSwitchNetwork } from 'wagmi'

import { useSettings } from '../lib/state/storage'

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
  const { srcToken, dstToken, srcChainId, dstChainId, srcTypedAmount, dstTypedAmount } = query
  return {
    props: {
      srcToken: srcToken ?? null,
      dstToken: dstToken ?? null,
      srcChainId: srcChainId ?? ChainId.ETHEREUM,
      dstChainId: dstChainId ?? ChainId.ARBITRUM,
      srcTypedAmount: srcTypedAmount ?? '',
      dstTypedAmount: dstTypedAmount ?? '',
    },
  }
}

export default function Swap({
  srcChainId,
  dstChainId,
  srcToken,
  dstToken,
  srcTypedAmount,
  dstTypedAmount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const srcTokens = useTokens(srcChainId)
  const dstTokens = useTokens(dstChainId)
  return (
    <Layout>
      <Widget
        theme={theme}
        initialState={{
          srcChainId: Number(srcChainId),
          dstChainId: Number(dstChainId),
          srcToken: srcToken in srcTokens ? srcTokens[srcToken] : Native.onChain(srcChainId),
          dstToken: dstToken in dstTokens ? dstTokens[dstToken] : Native.onChain(dstChainId),
          srcTypedAmount,
          dstTypedAmount,
        }}
        // swapCache={data}
        // mutateSwapCache={mutateSwapCache}
      />
      {/* <Widget header={<>Swap</>} /> */}
    </Layout>
  )
}

interface Swap {
  maxWidth?: number | string
  theme?: Theme
  initialState: {
    srcChainId: number
    dstChainId: number
    srcTypedAmount: string
    dstTypedAmount: string
    srcToken: Currency
    dstToken: Currency
  }
  caption?: boolean
  // swapCache: SwapCache
  // mutateSwapCache: (cache: SwapCache) => void
}

const Widget: FC<Swap> = ({
  maxWidth = 400,
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

  const [{ expertMode, slippageTolerance }] = useSettings()

  const SWAP_SLIPPAGE = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance]
  )

  const [srcChainId, setSrcChainId] = useState<number>(initialState.srcChainId)
  const [dstChainId, setDstChainId] = useState<number>(initialState.dstChainId)
  const [srcToken, setSrcToken] = useState<Currency>(initialState.srcToken)
  const [dstToken, setDstToken] = useState<Currency>(initialState.dstToken)
  useEffect(() => {
    setSrcToken(initialState.srcToken)
  }, [initialState.srcToken])
  useEffect(() => {
    setDstToken(initialState.dstToken)
  }, [initialState.dstToken])

  const feeRef = useRef<Amount<Native>>()
  const [nanoId] = useState(nanoid())
  const [srcTxHash, setSrcTxHash] = useState<string>()

  const [srcTypedAmount, setSrcTypedAmount] = useState<string>(initialState.srcTypedAmount)
  const [dstTypedAmount, setDstTypedAmount] = useState<string>(initialState.dstTypedAmount)

  const [srcUseBentoBox, setSrcUseBentoBox] = useState(false)
  const [dstUseBentoBox, setDstUseBentoBox] = useState(false)

  const srcTokens = useTokens(srcChainId)
  const dstTokens = useTokens(dstChainId)

  const srcTokenRebase = useBentoBoxTotal(srcChainId, srcToken)

  // This effect is responsible for encoding the swap state into the URL, to add statefullness
  // to the swapper. It has an escape hatch to prevent uneeded re-runs, this is important.
  useEffect(() => {
    // Escape hatch if already synced (could probably pull something like this out to generic...)

    console.debug([
      srcChainId === Number(router.query.srcChainId),
      dstChainId === Number(router.query.dstChainId),
      srcToken.symbol === router.query.srcToken || srcToken.wrapped.address === router.query.srcToken,
      dstToken.symbol === router.query.dstToken || dstToken.wrapped.address === router.query.dstToken,
      srcTypedAmount === router.query.srcTypedAmount,
      dstTypedAmount === router.query.dstTypedAmount,
    ])

    if (
      srcChainId === Number(router.query.srcChainId) &&
      dstChainId === Number(router.query.dstChainId) &&
      (srcToken.symbol === router.query.srcToken || srcToken.wrapped.address === router.query.srcToken) &&
      (dstToken.symbol === router.query.dstToken || dstToken.wrapped.address === router.query.dstToken) &&
      srcTypedAmount === router.query.srcTypedAmount &&
      dstTypedAmount === router.query.dstTypedAmount
    ) {
      return
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          srcToken: srcToken && srcToken.isNative ? srcToken.symbol : srcToken.address,
          dstToken: dstToken && dstToken.isNative ? dstToken.symbol : dstToken.address,
          srcChainId,
          dstChainId,
          srcTypedAmount,
          dstTypedAmount,
        },
      },
      undefined,
      { shallow: true }
    )
  }, [srcToken, dstToken, srcChainId, dstChainId, srcTypedAmount, dstTypedAmount, router])

  const contract = useSushiXSwapContract(srcChainId)

  const contractWithProvider = useSushiXSwapContractWithProvider(srcChainId)

  // Computed

  // Same chain
  const sameChainSwap = srcChainId === dstChainId

  // Cross chain
  const crossChain = srcChainId !== dstChainId

  // A cross chain swap, a swap on the source and a swap on the destination
  const crossChainSwap = crossChain && !isStargateBridgeToken(srcToken) && !isStargateBridgeToken(dstToken)

  // A regular bridge transfer, no swaps on either end
  const transfer = crossChain && isStargateBridgeToken(srcToken) && isStargateBridgeToken(dstToken)

  // A swap transfer, a swap on the source, but not swap on the destination
  const swapTransfer = crossChain && !isStargateBridgeToken(srcToken) && isStargateBridgeToken(dstToken)

  // A transfer swap, no swap on the source, but a swap on the destination
  const transferSwap = crossChain && isStargateBridgeToken(srcToken) && !isStargateBridgeToken(dstToken)

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

  // Parse the dstTypedAmount into a dstAmount
  const dstAmount = useMemo<Amount<Currency> | undefined>(() => {
    return tryParseAmount(dstTypedAmount, dstToken)
  }, [dstToken, dstTypedAmount])

  // srcTrade
  const srcTrade = useTrade(
    srcChainId,
    TradeType.EXACT_INPUT,
    sameChainSwap || crossChainSwap || swapTransfer ? srcAmount : undefined,
    sameChainSwap || crossChainSwap || swapTransfer ? srcToken : undefined,
    crossChainSwap || swapTransfer ? srcBridgeToken : dstToken
  )

  const srcMinimumAmountOut = srcTrade?.minimumAmountOut(SWAP_SLIPPAGE)

  const srcAmountMinusStargateFee = srcAmount?.multiply(_9994)?.divide(_10000)

  const srcMinimumAmountOutMinusStargateFee = srcMinimumAmountOut?.multiply(_9994)?.divide(_10000)

  const srcAmountOut = useMemo(() => {
    if (sameChainSwap) {
      return srcMinimumAmountOut
    } else if (transfer) {
      return srcAmountMinusStargateFee
    } else if (transferSwap) {
      return srcAmountMinusStargateFee
    } else if (swapTransfer) {
      return srcMinimumAmountOutMinusStargateFee
    } else if (crossChainSwap) {
      return srcMinimumAmountOutMinusStargateFee
    }
  }, [
    sameChainSwap,
    transfer,
    transferSwap,
    swapTransfer,
    crossChainSwap,
    srcMinimumAmountOut,
    srcAmountMinusStargateFee,
    srcMinimumAmountOutMinusStargateFee,
  ])

  const stargateFee = useMemo(() => {
    if (!srcAmountMinusStargateFee || !srcMinimumAmountOutMinusStargateFee) return
    if (transfer || transferSwap) {
      return srcAmount?.subtract(srcAmountMinusStargateFee)
    } else if (crossChainSwap || swapTransfer) {
      return srcMinimumAmountOut?.subtract(srcMinimumAmountOutMinusStargateFee)
    }
  }, [
    crossChainSwap,
    srcAmount,
    srcAmountMinusStargateFee,
    srcMinimumAmountOut,
    srcMinimumAmountOutMinusStargateFee,
    swapTransfer,
    transfer,
    transferSwap,
  ])

  const dstAmountIn = useMemo(() => {
    const currency = crossChain ? dstBridgeToken : dstToken
    if (!srcAmountOut) return
    return tryParseAmount(
      Amount.fromFractionalAmount(currency, srcAmountOut.numerator, srcAmountOut.denominator).toFixed()
    )
  }, [crossChain, dstBridgeToken, dstToken, srcAmountOut])

  const dstTrade = useTrade(
    dstChainId,
    TradeType.EXACT_INPUT,
    crossChainSwap || transferSwap ? dstAmountIn : undefined,
    crossChainSwap || transferSwap ? dstBridgeToken : undefined,
    crossChainSwap || transferSwap ? dstToken : undefined
  )

  const dstMinimumAmountOut = dstTrade?.minimumAmountOut(SWAP_SLIPPAGE)

  const dstAmountOut = useMemo(() => {
    if (transfer) {
      return srcAmountMinusStargateFee
    } else if (sameChainSwap) {
      return srcMinimumAmountOut
    } else if (swapTransfer) {
      return srcMinimumAmountOutMinusStargateFee
    } else if (crossChainSwap || transferSwap) {
      return dstMinimumAmountOut
    }
  }, [
    crossChainSwap,
    dstMinimumAmountOut,
    sameChainSwap,
    srcAmountMinusStargateFee,
    srcMinimumAmountOut,
    srcMinimumAmountOutMinusStargateFee,
    swapTransfer,
    transfer,
    transferSwap,
  ])

  const price =
    srcAmount && dstMinimumAmountOut
      ? new Price({ baseAmount: srcAmount, quoteAmount: dstMinimumAmountOut })
      : undefined

  useEffect(() => {
    if (transfer) {
      setDstTypedAmount(srcAmountMinusStargateFee?.toFixed() ?? '')
    } else if (swapTransfer) {
      setDstTypedAmount(srcMinimumAmountOutMinusStargateFee?.toFixed() ?? '')
    } else if (sameChainSwap) {
      setDstTypedAmount(srcMinimumAmountOut?.toFixed() ?? '')
    } else if (crossChainSwap || transferSwap) {
      setDstTypedAmount(dstMinimumAmountOut?.toFixed() ?? '')
    }
  }, [
    crossChainSwap,
    dstMinimumAmountOut,
    sameChainSwap,
    srcAmountMinusStargateFee,
    srcMinimumAmountOut,
    srcMinimumAmountOutMinusStargateFee,
    swapTransfer,
    transfer,
    transferSwap,
  ])

  const switchCurrencies = useCallback(() => {
    const _srcChainId = srcChainId
    const _srcToken = srcToken
    const _dstChainId = dstChainId
    const _dstToken = dstToken

    setSrcChainId(_dstChainId)
    setSrcToken(_dstToken)
    setDstChainId(_srcChainId)
    setDstToken(_srcToken)
  }, [dstChainId, dstToken, srcChainId, srcToken])

  const execute = useCallback(() => {
    console.log([
      !srcChainId,
      !srcAmount,
      !srcMinimumAmountOut,
      !dstChainId,
      !dstMinimumAmountOut,
      !address,
      !srcTokenRebase,
      !contract,
    ])
    if (
      !srcChainId ||
      !srcAmount ||
      !srcMinimumAmountOut ||
      !dstChainId ||
      !dstMinimumAmountOut ||
      !address ||
      !srcTokenRebase ||
      !contract
    ) {
      return
    }

    const srcShare = srcAmount.toShare(srcTokenRebase)

    const srcMinimumShareOut = srcMinimumAmountOut.toShare(srcTokenRebase)

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

    if (transfer) {
      sushiXSwap.transfer(srcAmount, srcShare)
    } else if (sameChainSwap && srcTrade && srcTrade.route.legs.length) {
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
      sushiXSwap.teleport(
        srcBridgeToken,
        dstBridgeToken,
        dstTrade ? dstTrade.route.gasSpent + 1000000 : undefined,
        nanoId
      )
    }

    console.debug('attempt cook')
    sushiXSwap
      .cook(dstTrade ? dstTrade.route.gasSpent + 1000000 : undefined)
      .then((res) => {
        if (res) {
          setSrcTxHash(res.hash)
        }
        console.debug('then cooked', res)
      })
      .catch((err) => {
        console.error('catch err', err)
      })
      .finally(() => {
        setSignature(undefined)
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
    dstTrade,
    dstUseBentoBox,
    nanoId,
    sameChainSwap,
    signature,
    srcAmount,
    srcBridgeToken,
    srcChainId,
    srcMinimumAmountOut,
    srcToken,
    srcTokenRebase,
    srcTrade,
    srcUseBentoBox,
    transfer,
  ])

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
      stargatePoolResults?.[0]?.idealBalance?.toString(),
      stargatePoolResults?.[0]?.balance?.toString(),
      srcMinimumAmountOut?.quotient?.toString(),
    ],
    contractInterface: STARGATE_FEE_LIBRARY_V03_ABI,
    chainId: srcChainId,
    enabled: Boolean(crossChain && stargatePoolResults && srcMinimumAmountOut),
  })

  const bridgeImpact = useMemo(() => {
    if (!stargateFee || !equilibriumFee || !srcMinimumAmountOut) {
      return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
    }
    return new Percent(
      JSBI.add(stargateFee.quotient, JSBI.BigInt(equilibriumFee[0].toString())),
      srcMinimumAmountOut.quotient
    )
  }, [equilibriumFee, srcMinimumAmountOut, stargateFee])

  const priceImpact = useMemo(() => {
    if (transfer) {
      return bridgeImpact
    } else if (sameChainSwap && srcTrade) {
      return srcTrade.priceImpact
    } else if (crossChainSwap && srcTrade && dstTrade) {
      return srcTrade.priceImpact.add(dstTrade.priceImpact).add(bridgeImpact)
    } else if (transferSwap && !srcTrade && dstTrade) {
      return dstTrade.priceImpact.add(bridgeImpact)
    } else if (swapTransfer && srcTrade && !dstTrade) {
      return srcTrade.priceImpact.add(bridgeImpact)
    }
    return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
  }, [sameChainSwap, srcTrade, transfer, crossChainSwap, dstTrade, transferSwap, swapTransfer, bridgeImpact])

  const { data: nativeBalance } = useBalance({
    chainId: srcChainId,
    account: address,
    currency: Native.onChain(srcChainId),
  })

  const { data: srcBalance } = useBalance({ chainId: srcChainId, account: address, currency: srcToken })
  const { data: dstBalance } = useBalance({ chainId: dstChainId, account: address, currency: dstToken })

  const { data: srcPrices } = usePrices({ chainId: srcChainId })
  const { data: dstPrices } = usePrices({ chainId: dstChainId })

  const srcTokenPrice = srcPrices?.[srcToken.wrapped.address]
  const dstTokenPrice = dstPrices?.[dstToken.wrapped.address]

  const routeNotFound = useMemo(() => {
    if (swapTransfer || transferSwap) {
      return (
        (isStargateBridgeToken(srcToken) && (!dstTrade || !dstTrade.route.legs.length)) ||
        (isStargateBridgeToken(dstToken) && (!srcTrade || !srcTrade.route.legs.length))
      )
    } else if (sameChainSwap && srcTrade && srcTrade.route.legs.length) {
      return !srcTrade
    } else if (
      crossChainSwap &&
      ((srcTrade && srcTrade.route.legs.length) || (dstTrade && dstTrade.route.legs.length))
    ) {
      return !srcTrade || !dstTrade
    }
    return false
  }, [swapTransfer, transferSwap, sameChainSwap, srcTrade, crossChainSwap, dstTrade, srcToken, dstToken])

  const priceImpactSeverity = useMemo(() => warningSeverity(priceImpact), [priceImpact])

  const priceImpactTooHigh = priceImpactSeverity > 3 && !expertMode

  const [inputUsd, outputUsd, usdPctChange] = useMemo(() => {
    const inputUSD = srcAmount && srcTokenPrice ? srcAmount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD =
      dstMinimumAmountOut && dstTokenPrice ? dstMinimumAmountOut.multiply(dstTokenPrice.asFraction) : undefined
    const usdPctChange =
      inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
        ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
        : undefined
    return [inputUSD, outputUSD, usdPctChange]
  }, [dstMinimumAmountOut, dstTokenPrice, srcAmount, srcTokenPrice])

  // DEBUG
  useEffect(() => {
    console.debug('SRC CHAIN', srcChainId)
    console.debug('DST CHAIN', dstChainId)
    console.debug('SRC TOKEN', srcToken)
    console.debug('DST TOKEN', dstToken)
    console.debug('SRC BRIDGE TOKEN', srcBridgeToken)
    console.debug('DST BRIDGE TOKEN', dstBridgeToken)
    console.debug('SRC TRADE', srcTrade)
    console.debug('DST TRADE', dstTrade)
    console.debug('SRC AMOUNT IN', srcAmount?.toFixed())
    console.debug('SRC MINIMUM AMOUNT OUT', srcMinimumAmountOut?.toFixed())
    console.debug('STARGATE FEE', stargateFee?.toFixed())
    console.debug('SRC AMOUNT OUT MINUS SG FEE', srcAmountMinusStargateFee?.toFixed())
    console.debug('DST AMOUNT IN', dstAmountIn?.toFixed())
    console.debug('DST MINIMUM AMOUNT OUT', dstMinimumAmountOut?.toFixed())
    console.debug('SRC TRADE PRICE IMPACT', srcTrade?.priceImpact?.multiply(-1).toFixed(2))
    console.debug('DST TRADE PRICE IMPACT', dstTrade?.priceImpact?.multiply(-1).toFixed(2))
    console.debug('PRICE IMPACT', priceImpact?.multiply(-1).toFixed(2))

    console.debug('DST TRADE GAS USED', dstTrade?.route?.gasSpent)
  }, [
    srcTrade,
    dstTrade,
    srcAmount,
    srcMinimumAmountOut,
    stargateFee,
    srcAmountMinusStargateFee,
    dstAmountIn,
    dstMinimumAmountOut,
    priceImpact,
    dstChainId,
    srcToken,
    dstToken,
    srcChainId,
    srcBridgeToken,
    dstBridgeToken,
  ])

  useEffect(() => {
    if (
      !srcChainId ||
      !srcAmount ||
      !srcMinimumAmountOut ||
      !dstChainId ||
      !dstMinimumAmountOut ||
      !srcTokenRebase ||
      !contractWithProvider
    ) {
      return
    }

    const getFee = async () => {
      const srcShare = srcAmount.toShare(srcTokenRebase)
      const srcMinimumShareOut = srcMinimumAmountOut.toShare(srcTokenRebase)

      const sushiXSwap = new SushiXSwap({
        contract: contractWithProvider,
        srcToken,
        dstToken,
        srcTrade,
        dstTrade,
        srcUseBentoBox,
        dstUseBentoBox,
        user: AddressZero,
      })

      if (crossChain && isStargateBridgeToken(srcToken) && isStargateBridgeToken(dstToken)) {
        sushiXSwap.transfer(srcAmount, srcShare)
      } else if (!crossChain && srcTrade && srcTrade.route.legs.length) {
        sushiXSwap.swap(srcAmount, srcShare, srcMinimumAmountOut, srcMinimumShareOut)
      } else if (crossChain && ((srcTrade && srcTrade.route.legs.length) || (dstTrade && dstTrade.route.legs.length))) {
        sushiXSwap.crossChainSwap(srcAmount, srcShare, srcMinimumAmountOut, srcMinimumShareOut, dstMinimumAmountOut)
      }

      if (crossChain) {
        sushiXSwap.teleport(
          srcBridgeToken,
          dstBridgeToken,
          dstTrade ? dstTrade.route.gasSpent + 1000000 : undefined,
          nanoId
        )
      }

      try {
        const [fee] = await sushiXSwap.getFee(dstTrade ? dstTrade.route.gasSpent + 1000000 : undefined)
        feeRef.current = Amount.fromRawAmount(Native.onChain(srcChainId), fee.toString())
      } catch (e) {
        console.log(e)
      }
    }

    void getFee()
  }, [
    contractWithProvider,
    crossChain,
    dstBridgeToken,
    dstChainId,
    dstMinimumAmountOut,
    dstToken,
    dstTrade,
    dstUseBentoBox,
    nanoId,
    srcAmount,
    srcBridgeToken,
    srcChainId,
    srcMinimumAmountOut,
    srcToken,
    srcTokenRebase,
    srcTrade,
    srcUseBentoBox,
  ])

  const stats = useMemo(() => {
    return (
      <>
        <Typography variant="sm" className="text-slate-400">
          Price Impact
        </Typography>
        <Typography
          variant="sm"
          weight={700}
          className={classNames(
            priceImpactSeverity === 2 ? 'text-yellow' : priceImpactSeverity > 2 ? 'text-red' : 'text-slate-200',
            'text-right truncate'
          )}
        >
          {priceImpact?.multiply(-1).toFixed(2)}%
        </Typography>
        <Typography variant="sm" className="text-slate-400">
          Est. Processing Time
        </Typography>
        <Typography variant="sm" weight={700} className="text-right truncate text-slate-200">
          ~{Math.ceil(STARGATE_CONFIRMATION_SECONDS[srcChainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] / 60)}{' '}
          minutes
        </Typography>
        <div className="col-span-2 border-t border-slate-200/5 w-full py-0.5" />
        <Typography variant="sm" className="text-slate-400">
          Min. Received
        </Typography>
        <Typography variant="sm" weight={700} className="text-right truncate text-slate-400">
          {dstMinimumAmountOut?.toSignificant(6)} {dstMinimumAmountOut?.currency.symbol}
        </Typography>
        <Typography variant="sm" className="text-slate-400">
          Transaction Fee
        </Typography>
        {feeRef.current && srcPrices?.[Native.onChain(srcChainId).wrapped.address] ? (
          <Typography variant="sm" weight={700} className="text-right truncate text-slate-400">
            ~${feeRef.current.multiply(srcPrices[Native.onChain(srcChainId).wrapped.address].asFraction)?.toFixed(2)}
          </Typography>
        ) : (
          <div className="flex items-center justify-end">
            <Loader size={14} />
          </div>
        )}
      </>
    )
  }, [dstMinimumAmountOut, priceImpact, priceImpactSeverity, srcChainId, srcPrices])

  const onSrcNetworkSelect = useCallback((chainId: number) => {
    setSrcChainId(chainId)
    setSrcToken(Native.onChain(chainId))
  }, [])

  const onDstNetworkSelect = useCallback((chainId: number) => {
    setDstChainId(chainId)
    setDstToken(Native.onChain(chainId))
  }, [])

  const isMounted = useIsMounted()

  const showWrap = false

  return (
    <>
      <article
        id="sushixswap"
        className={classNames(
          theme.background.primary,
          'flex flex-col mx-auto rounded-2xl relative overflow-hidden min-w-[320px] shadow shadow-slate-900'
        )}
        style={{ maxWidth }}
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
          onNetworkSelect={onSrcNetworkSelect}
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
            onNetworkSelect={onDstNetworkSelect}
            tokenList={dstTokens}
            theme={theme}
            disableMaxButton
            balance={dstBalance?.[dstUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET]}
            usdPctChange={usdPctChange}
          />

          <div className="p-3">
            <Transition
              show={!!price}
              unmount={false}
              className="transition-[max-height] overflow-hidden"
              enter="duration-300 ease-in-out"
              enterFrom="transform max-h-0"
              enterTo="transform max-h-[380px]"
              leave="transition-[max-height] duration-250 ease-in-out"
              leaveFrom="transform max-h-[380px]"
              leaveTo="transform max-h-0"
            >
              <Disclosure>
                {({ open }) => (
                  <>
                    <Rate price={price} theme={theme}>
                      {({ content, usdPrice, toggleInvert }) => (
                        <div className="flex justify-between bg-white bg-opacity-[0.04] hover:bg-opacity-[0.08] rounded-2xl px-4 mb-4 py-1 gap-2">
                          <div
                            className="text-sm text-slate-300 hover:text-slate-50 cursor-pointer flex items-center h-full gap-1 font-semibold tracking-tight h-[36px] flex items-center truncate"
                            onClick={toggleInvert}
                          >
                            <Popover
                              hover
                              panel={
                                <div className="grid grid-cols-2 gap-1 p-3 border bg-slate-800 border-slate-200/10">
                                  {stats}
                                </div>
                              }
                              button={<InformationCircleIcon width={16} height={16} />}
                            />{' '}
                            <>
                              {content} {usdPrice && <span className="font-medium text-slate-500">(${usdPrice})</span>}
                            </>
                          </div>
                          <Disclosure.Button className="flex items-center justify-end flex-grow cursor-pointer">
                            <ChevronDownIcon
                              width={24}
                              height={24}
                              className={classNames(
                                open ? '!rotate-180' : '',
                                'rotate-0 transition-[transform] duration-300 ease-in-out delay-200'
                              )}
                            />
                          </Disclosure.Button>
                        </div>
                      )}
                    </Rate>
                    <Transition
                      show={open}
                      unmount={false}
                      className="transition-[max-height] overflow-hidden"
                      enter="duration-300 ease-in-out"
                      enterFrom="transform max-h-0"
                      enterTo="transform max-h-[380px]"
                      leave="transition-[max-height] duration-250 ease-in-out"
                      leaveFrom="transform max-h-[380px]"
                      leaveTo="transform max-h-0"
                    >
                      <Disclosure.Panel
                        as="div"
                        className="grid grid-cols-2 gap-1 px-4 py-2 mb-4 border border-slate-200/5 rounded-2xl"
                      >
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
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </Transition>

            {isMounted && !address ? (
              <Wallet.Button appearOnMount={false} fullWidth color="blue" size="md">
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
            ) : !transfer && srcAmount?.greaterThan(0) && routeNotFound ? (
              <Button size="md" fullWidth disabled>
                Insufficient liquidity for this trade.
              </Button>
            ) : isMounted &&
              ((srcAmount?.greaterThan(0) &&
                feeRef.current &&
                nativeBalance &&
                feeRef.current.greaterThan(nativeBalance[FundSource.WALLET])) ||
                (srcBalance &&
                  srcAmount?.greaterThan(srcBalance[srcUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET]))) ? (
              <Button size="md" fullWidth disabled>
                Insufficient Balance
              </Button>
            ) : isMounted && chain && chain.id == srcChainId ? (
              <>
                <ConfirmationComponentController
                  variant="dialog"
                  onClose={() => setTimeout(() => setSrcTxHash(undefined), 1000)}
                  trigger={({ setOpen }) => (
                    <Button
                      fullWidth
                      size="md"
                      variant="filled"
                      color={priceImpactTooHigh || priceImpactSeverity > 2 ? 'red' : 'blue'}
                      {...(Boolean(!routeNotFound && priceImpactSeverity > 2 && !expertMode) && {
                        title: 'Enable expert mode to swap with high price impact',
                      })}
                      disabled={
                        isWritePending ||
                        !srcAmount?.greaterThan(ZERO) ||
                        Boolean(srcAmount && !dstMinimumAmountOut) ||
                        priceImpactTooHigh ||
                        Boolean(!routeNotFound && priceImpactSeverity > 2 && !expertMode)
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
                  {({ setOpen }) => (
                    <Dialog.Content className="max-w-sm !bg-slate-800 px-4 !pb-4 overflow-hidden">
                      {srcTxHash ? (
                        <TransactionProgressOverlay
                          onClose={() => setOpen(false)}
                          id={nanoId}
                          srcTxHash={srcTxHash}
                          inputAmount={srcAmount}
                          outputAmount={dstMinimumAmountOut}
                          srcBridgeToken={srcBridgeToken}
                          dstBridgeToken={dstBridgeToken}
                          crossChain={crossChain}
                        />
                      ) : (
                        <SlideIn>
                          <>
                            <Dialog.Header border={false} title="Confirm Swap" onClose={() => setOpen(false)} />
                            <div className="!my-0 grid grid-cols-12 items-center">
                              <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <Typography variant="h3" weight={700} className="truncate text-slate-50">
                                      {srcAmount?.toSignificant(6)}{' '}
                                    </Typography>
                                    <div className="flex items-center justify-end gap-2 text-right">
                                      {srcAmount && (
                                        <div className="w-5 h-5">
                                          <Icon currency={srcAmount.currency} width={20} height={20} />
                                        </div>
                                      )}
                                      <Typography variant="h3" weight={500} className="text-right text-slate-50">
                                        {srcAmount?.currency.symbol}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <Typography variant="sm" weight={700} className="text-slate-500">
                                    {inputUsd ? `$${inputUsd.toFixed(2)}` : '-'}
                                  </Typography>
                                  {srcAmount && (
                                    <Typography
                                      variant="xs"
                                      weight={500}
                                      className="flex items-center gap-1 text-slate-400"
                                    >
                                      <NetworkIcon
                                        type="naked"
                                        chainId={srcAmount.currency.chainId}
                                        width={16}
                                        height={16}
                                      />
                                      <span>{chains[srcAmount.currency.chainId].name}</span>
                                    </Typography>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
                                <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                                  <ChevronDownIcon width={18} height={18} className="text-slate-200" />
                                </div>
                              </div>
                              <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <Typography variant="h3" weight={700} className="truncate text-slate-50">
                                      {dstMinimumAmountOut?.toSignificant(6)}{' '}
                                    </Typography>
                                    <div className="flex items-center justify-end gap-2 text-right">
                                      {dstMinimumAmountOut && (
                                        <div className="w-5 h-5">
                                          <Icon currency={dstMinimumAmountOut.currency} width={20} height={20} />
                                        </div>
                                      )}
                                      <Typography variant="h3" weight={500} className="text-right text-slate-50">
                                        {dstMinimumAmountOut?.currency.symbol}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <Typography variant="sm" weight={700} className="text-slate-500">
                                    {outputUsd ? `$${outputUsd.toFixed(2)}` : '-'}
                                    {usdPctChange && (
                                      <span
                                        className={classNames(
                                          usdPctChange === 0
                                            ? ''
                                            : usdPctChange > 0
                                            ? 'text-green'
                                            : usdPctChange < -3
                                            ? 'text-red'
                                            : usdPctChange < -2
                                            ? 'text-yellow'
                                            : 'text-slate-500'
                                        )}
                                      >
                                        {' '}
                                        {`${usdPctChange === 0 ? '' : usdPctChange > 0 ? '(+' : '('}${
                                          usdPctChange === 0 ? '0.00' : usdPctChange?.toFixed(2)
                                        }%)`}
                                      </span>
                                    )}
                                  </Typography>
                                  {dstMinimumAmountOut && (
                                    <Typography
                                      variant="xs"
                                      weight={500}
                                      className="flex items-center gap-1 text-slate-400"
                                    >
                                      <NetworkIcon
                                        type="naked"
                                        chainId={dstMinimumAmountOut.currency.chainId}
                                        width={16}
                                        height={16}
                                      />
                                      <span>{chains[dstMinimumAmountOut.currency.chainId].name}</span>
                                    </Typography>
                                  )}
                                </div>
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
                                    {content}{' '}
                                    {usdPrice && <span className="font-normal text-slate-300">(${usdPrice})</span>}
                                  </Typography>
                                )}
                              </Rate>
                            </div>
                            <div className="grid grid-cols-2 gap-1 p-2 border rounded-2xl sm:p-4 border-slate-200/5 bg-slate-700/40">
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
                                    address={getSushiXSwapContractConfig(srcChainId).addressOrName}
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
                          </>
                        </SlideIn>
                      )}
                    </Dialog.Content>
                  )}
                </ConfirmationComponentController>
              </>
            ) : (
              // Placeholder
              <Button fullWidth color="blue" size="md">
                Connect Wallet
              </Button>
            )}
            {caption && <Caption theme={theme} />}
          </div>
        </div>
      </article>
    </>
  )
}
