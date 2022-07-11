import { Signature } from '@ethersproject/bytes'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { _9995, _10000, JSBI, Percent, ZERO } from '@sushiswap/math'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { Badge, Button, classNames, Dots, GasIcon, Loader, NetworkIcon, Overlay, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { Approve, BENTOBOX_ADDRESS, useBalance, useSushiXSwapContract, Wallet } from '@sushiswap/wagmi'
import { usePrices } from '@sushiswap/wagmi/hooks/usePrices'
import {
  Caption,
  ConfirmationComponentController,
  CrossChainRoute,
  CurrencyInput,
  Rate,
  SameChainRoute,
  SettingsOverlay,
} from 'components'
import { defaultTheme, SUSHI_X_SWAP_ADDRESS } from 'config'
import { useBentoBoxRebase, useTrade } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { SushiXSwap } from 'lib/SushiXSwap'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Theme } from 'types'
import { useAccount, useFeeData, useNetwork, useSwitchNetwork } from 'wagmi'

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
    <div className="pt-20 space-y-12 pb-60">
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
  width = 360,
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

  const { rebase: srcTokenRebase } = useBentoBoxRebase(srcChainId, srcToken)
  // const { rebase: dstTokenRebase } = useBentoBoxRebase(dstChainId, dstToken)

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

    void router.replace(
      {
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
      }
      // undefined,
      // { shallow: true }
    )
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
    return crossChain ? srcMinimumAmountOut?.multiply(_10000)?.divide(_9995) : srcMinimumAmountOut
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

  const priceImpact = useMemo(() => {
    if (!crossChain && srcTrade) {
      return srcTrade.priceImpact
    } else if (
      crossChain &&
      srcTrade &&
      dstTrade &&
      !isStargateBridgeToken(srcToken) &&
      !isStargateBridgeToken(dstToken)
    ) {
      return srcTrade.priceImpact.add(dstTrade.priceImpact)
    } else if (crossChain && !srcTrade && dstTrade && !isStargateBridgeToken(dstToken)) {
      return dstTrade.priceImpact
    } else if (crossChain && srcTrade && !dstTrade && !isStargateBridgeToken(srcToken)) {
      return srcTrade.priceImpact
    }

    // Return zero percent
    return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
  }, [crossChain, dstToken, dstTrade, srcToken, srcTrade])

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
  ])

  useEffect(() => {
    if (!crossChain || isStargateBridgeToken(dstToken)) {
      setDstTypedAmount(srcTrade?.outputAmount?.toFixed() ?? '')
    } else if (!isStargateBridgeToken(dstToken)) {
      setDstTypedAmount(dstTrade?.outputAmount?.toFixed() ?? '')
    }
  }, [dstMinimumAmountOut, srcTrade, crossChain, dstToken, dstTrade])

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

  const showWrap = false

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
            weight={900}
            className={classNames(theme.primary.default, theme.primary.hover, 'flex items-center gap-2')}
          >
            Swap
          </Typography>
          <div className="flex justify-end">
            <SettingsOverlay chainId={srcChainId} />
          </div>
        </div>
        <div className="p-3 border-2 border-transparent">
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
        </div>
        <div className="flex items-center justify-center -mt-[8px] -mb-[8px] z-10">
          <div className="border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-slate-700" />
        </div>
        <div className={classNames(theme.background.secondary, 'p-3')}>
          <CurrencyInput
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
          />

          <Rate loading={Boolean(srcAmount && !dstMinimumAmountOut)} price={price} theme={theme} />

          {isMounted && !address ? (
            <Wallet.Button fullWidth color="blue">
              Connect Wallet
            </Wallet.Button>
          ) : isMounted && chain && chain.id !== srcChainId ? (
            <Button fullWidth onClick={() => switchNetwork && switchNetwork(srcChainId)}>
              Switch to {Chain.from(srcChainId).name}
            </Button>
          ) : showWrap ? (
            <Button fullWidth>Wrap</Button>
          ) : srcAmount?.greaterThan(0) && routeNotFound ? (
            <Button fullWidth disabled>
              Insufficient liquidity for this trade.
            </Button>
          ) : isMounted && chain && chain.id == srcChainId ? (
            <>
              <Approve
                components={
                  <Approve.Components className="flex gap-4">
                    <Approve.Bentobox
                      className="mb-2 whitespace-nowrap"
                      fullWidth
                      address={SUSHI_X_SWAP_ADDRESS[srcChainId]}
                      onSignature={setSignature}
                    />
                    <Approve.Token
                      className="mb-2 whitespace-nowrap"
                      fullWidth
                      amount={srcAmount}
                      address={BENTOBOX_ADDRESS[srcChainId]}
                    />
                  </Approve.Components>
                }
                render={({ approved }) => {
                  const inputUSD =
                    srcAmount && srcTokenPrice ? Number(srcAmount.toFixed()) * Number(srcTokenPrice) : undefined
                  const outputUSD =
                    dstMinimumAmountOut && dstTokenPrice
                      ? Number(dstMinimumAmountOut.toFixed()) * Number(dstTokenPrice)
                      : undefined
                  const usdPctChange = inputUSD && outputUSD ? ((outputUSD - inputUSD) / inputUSD) * 100 : undefined

                  return (
                    <ConfirmationComponentController
                      variant="overlay"
                      trigger={({ setOpen }) => (
                        <Button
                          fullWidth
                          variant="filled"
                          color={priceImpactTooHigh || priceImpactSeverity > 2 ? 'red' : 'gradient'}
                          disabled={
                            isWritePending ||
                            !approved ||
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
                      <div className="!my-0 rounded-xl py-2 grid grid-cols-12 min-h-[64px] items-center">
                        <div className="flex flex-col col-span-5 gap-1">
                          <span className="text-xs text-slate-400">{srcAmount?.currency.symbol}</span>
                          <div className="flex items-center gap-3">
                            {srcAmount && (
                              <Badge
                                badgeContent={
                                  <div className="rounded-full shadow-md ring-1 ring-black/20">
                                    <NetworkIcon chainId={srcAmount.currency.chainId} width={16} height={16} />
                                  </div>
                                }
                              >
                                <div className="w-5 h-5">
                                  <Icon currency={srcAmount.currency} width={20} height={20} />
                                </div>
                              </Badge>
                            )}
                            <Typography variant="lg" weight={700} className="truncate">
                              {srcAmount?.toSignificant(6)}{' '}
                            </Typography>
                          </div>
                          <Typography variant="xs" weight={700} className="text-slate-400">
                            {srcAmount && srcTokenPrice
                              ? `$${srcAmount.multiply(srcTokenPrice.asFraction).toFixed(2)}`
                              : '-'}
                          </Typography>
                        </div>
                        <div className="flex items-center justify-center col-span-2">
                          <ChevronRightIcon width={18} height={18} className="text-slate-500" />
                        </div>
                        <div className="flex flex-col w-full col-span-5 gap-1">
                          <span className="text-xs text-slate-400">{dstMinimumAmountOut?.currency.symbol}</span>
                          <div className="flex items-center gap-3">
                            {dstMinimumAmountOut && (
                              <Badge
                                badgeContent={
                                  <div className="rounded-full shadow-md ring-1 ring-black/20">
                                    <NetworkIcon
                                      chainId={dstMinimumAmountOut.currency.chainId}
                                      width={16}
                                      height={16}
                                    />
                                  </div>
                                }
                              >
                                <div className="w-5 h-5">
                                  <Icon currency={dstMinimumAmountOut.currency} width={20} height={20} />
                                </div>
                              </Badge>
                            )}
                            <Typography variant="lg" weight={700} className="text-right truncate">
                              {dstMinimumAmountOut?.toSignificant(6)}
                            </Typography>
                          </div>
                          <Typography variant="xs" weight={700} className="text-right text-slate-400">
                            {dstMinimumAmountOut && dstTokenPrice
                              ? dstMinimumAmountOut.multiply(dstTokenPrice.asFraction).toFixed(2)
                              : '-'}
                            {usdPctChange && (
                              <span className={classNames(usdPctChange > 0 ? 'text-green' : 'text-red', 'text-[10px]')}>
                                ({usdPctChange > 0 ? '+' : ''}
                                {usdPctChange}%)
                              </span>
                            )}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col flex-grow gap-1 px-3 pb-0 -ml-3 -mr-3 py-2 justify-end">
                        <div className="flex items-center justify-between gap-2">
                          <Rate loading={Boolean(srcAmount && !dstMinimumAmountOut)} price={price} theme={theme}>
                            {({ toggleInvert, content }) => (
                              <Typography
                                as="button"
                                onClick={() => toggleInvert()}
                                variant="xs"
                                weight={700}
                                className="flex items-center gap-1 text-slate-200"
                              >
                                {content}
                              </Typography>
                            )}
                          </Rate>
                          <div className="flex items-center gap-1">
                            <GasIcon width={10} />
                            <Typography variant="xs" weight={700}>
                              {feeData.data?.formatted.gasPrice} Gwei
                            </Typography>
                          </div>
                        </div>
                        <div className="flex justify-between gap-2">
                          <Typography variant="xs" className="text-slate-400">
                            Minimum Received
                          </Typography>
                          <Typography variant="xs" weight={700} className="text-right text-slate-200">
                            {dstMinimumAmountOut?.toSignificant(6)} {dstMinimumAmountOut?.currency.symbol}
                          </Typography>
                        </div>
                        <div className="flex justify-between gap-2">
                          <Typography variant="xs" className="text-slate-400">
                            Price Impact
                          </Typography>
                          <Typography variant="xs" weight={700} className="text-slate-200">
                            {priceImpact?.multiply(-1).toFixed(2)}%
                          </Typography>
                        </div>
                        <div className="flex justify-between gap-2">
                          <Typography variant="xs" className="text-slate-400">
                            Estimated Processing Time
                          </Typography>
                          <Typography variant="xs" weight={700} className="text-slate-300">
                            ~
                            {Math.ceil(
                              STARGATE_CONFIRMATION_SECONDS[srcChainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] /
                                60
                            )}{' '}
                            minutes
                          </Typography>
                        </div>
                        {crossChain ? (
                          <CrossChainRoute srcTrade={srcTrade} dstTrade={dstTrade} />
                        ) : (
                          <SameChainRoute trade={srcTrade} />
                        )}
                      </div>
                      <Overlay.Actions>
                        <Button fullWidth color="gradient" onClick={execute}>
                          Swap
                        </Button>
                      </Overlay.Actions>
                    </ConfirmationComponentController>
                  )
                }}
              />
            </>
          ) : (
            <Button fullWidth color="blue">
              <Loader size="16px" />
            </Button>
          )}
          {caption && <Caption theme={theme} />}
        </div>
      </article>
    </>
  )
}
