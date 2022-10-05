import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/outline'
import chains, { Chain, ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { Button, classNames, Dialog, Dots, Loader, NetworkIcon, SlideIn, Tooltip, Typography } from '@sushiswap/ui'
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
import {
  ConfirmationComponentController,
  CurrencyInputWithNetworkSelector,
  Layout,
  Rate,
  SettingsOverlay,
  SwitchCurrenciesButton,
  TransactionProgressOverlay,
} from 'components'
import { defaultTheme } from 'config'
import { useBridgeFees } from 'lib/hooks/useBridgeFees'
import { SushiBridge } from 'lib/SushiBridge'
import { nanoid } from 'nanoid'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Theme } from 'types'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import { useCustomTokens, useNotifications, useSettings } from '../lib/state/storage'

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

const BRIDGE_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

const theme: Theme = {
  ...defaultTheme,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { srcToken, dstToken, srcChainId, dstChainId, srcTypedAmount } = query
  return {
    props: {
      srcToken: srcToken ?? null,
      dstToken: dstToken ?? null,
      srcChainId: srcChainId ?? ChainId.ETHEREUM,
      dstChainId: dstChainId ?? ChainId.ARBITRUM,
      srcTypedAmount: !isNaN(Number(srcTypedAmount)) ? srcTypedAmount : '',
    },
  }
}

export default function Swap({
  srcChainId,
  dstChainId,
  srcToken,
  dstToken,
  srcTypedAmount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const srcTokens = STARGATE_BRIDGE_TOKENS[srcChainId]
  const dstTokens = STARGATE_BRIDGE_TOKENS[dstChainId]
  return (
    <Layout>
      <Head>
        <title>Bridge | Sushi</title>
        <meta property="og:title" content="Bridge | Sushi" key="title" />
      </Head>
      <Widget
        theme={theme}
        initialState={{
          srcChainId: Number(srcChainId),
          dstChainId: Number(dstChainId),
          srcToken: srcTokens.includes(srcToken) ? srcTokens[srcTokens.indexOf(srcToken)] : srcTokens[0],
          dstToken: dstTokens.includes(dstToken) ? dstTokens[dstTokens.indexOf(dstToken)] : dstTokens[0],
          srcTypedAmount,
        }}
      />
    </Layout>
  )
}

interface Bridge {
  maxWidth?: number | string
  theme?: Theme
  initialState: {
    srcChainId: number
    dstChainId: number
    srcTypedAmount: string
    srcToken: Currency
    dstToken: Currency
  }
}

const STARGATE_TOKEN_MAP = Object.fromEntries(
  Object.entries(STARGATE_BRIDGE_TOKENS).map(([chainId, tokens]) => [
    chainId,
    Object.fromEntries(tokens.map((token) => [token.address, token])),
  ])
)

const Widget: FC<Bridge> = ({ maxWidth = 400, theme = defaultTheme, initialState }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const [, { createNotification }] = useNotifications(address)

  const [isWritePending, setIsWritePending] = useState<boolean>(false)

  const [signature, setSignature] = useState<Signature>()

  const router = useRouter()

  const [{ expertMode, slippageTolerance }] = useSettings()

  const bridgeSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : BRIDGE_DEFAULT_SLIPPAGE),
    [slippageTolerance]
  )

  const [srcChainId, setSrcChainId] = useState<number>(initialState.srcChainId)
  const [dstChainId, setDstChainId] = useState<number>(initialState.dstChainId)
  const [srcToken, setSrcToken] = useState<Currency>(initialState.srcToken)
  const [dstToken, setDstToken] = useState<Currency>(initialState.dstToken)
  const [srcCustomTokenMap, { addCustomToken: onAddSrcCustomToken, removeCustomToken: onRemoveSrcCustomToken }] =
    useCustomTokens(srcChainId)
  const [dstCustomTokenMap, { addCustomToken: onAddDstCustomToken, removeCustomToken: onRemoveDstCustomToken }] =
    useCustomTokens(dstChainId)

  useEffect(() => {
    setSrcToken(initialState.srcToken)
  }, [initialState.srcToken])
  useEffect(() => {
    setDstToken(initialState.dstToken)
  }, [initialState.dstToken])

  // First we'll check if bridge tokens for srcChainId includes srcToken, if so use srcToken as srcBridgeToken,
  // else take first stargate bridge token as srcBridgeToken
  const srcBridgeToken =
    srcToken.isToken && isStargateBridgeToken(srcToken) ? srcToken : STARGATE_BRIDGE_TOKENS[srcChainId][0]

  // First we'll check if bridge tokens for dstChainId includes dstToken, if so use dstToken as dstBridgeToken,
  // else take first stargate bridge token as dstBridgeToken
  const dstBridgeToken =
    dstToken.isToken && isStargateBridgeToken(dstToken) ? dstToken : STARGATE_BRIDGE_TOKENS[dstChainId][0]

  const feeRef = useRef<Amount<Native>>()
  const [nanoId] = useState(nanoid())
  const [srcTxHash, setSrcTxHash] = useState<string>()

  const [srcTypedAmount, setSrcTypedAmount] = useState<string>(initialState.srcTypedAmount)
  const [dstTypedAmount, setDstTypedAmount] = useState<string>('')

  const srcTokens = useMemo(() => STARGATE_TOKEN_MAP[srcChainId], [srcChainId])
  const dstTokens = useMemo(() => STARGATE_TOKEN_MAP[dstChainId], [dstChainId])

  // Computed

  // Same chain
  const sameChainSwap = srcChainId === dstChainId

  // Cross chain
  const crossChain = srcChainId !== dstChainId

  // A regular bridge transfer, no swaps on either end
  const transfer = crossChain && isStargateBridgeToken(srcToken) && isStargateBridgeToken(dstToken)

  const srcInputCurrencyRebase = useBentoBoxTotal(srcChainId, srcToken)
  const srcOutputCurrencyRebase = useBentoBoxTotal(srcChainId, sameChainSwap ? dstToken : srcBridgeToken)

  const dstInputCurrencyRebase = useBentoBoxTotal(dstChainId, dstBridgeToken)
  const dstOutputCurrencyRebase = useBentoBoxTotal(dstChainId, dstToken)

  // console.log('INDEX', srcTokenRebase?.base?.toString(), srcTokenRebase?.elastic?.toString())

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
    ])

    if (
      srcChainId === Number(router.query.srcChainId) &&
      dstChainId === Number(router.query.dstChainId) &&
      (srcToken.symbol === router.query.srcToken || srcToken.wrapped.address === router.query.srcToken) &&
      (dstToken.symbol === router.query.dstToken || dstToken.wrapped.address === router.query.dstToken) &&
      srcTypedAmount === router.query.srcTypedAmount
    ) {
      return
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          srcToken: srcToken && srcToken.isToken ? srcToken.address : srcToken.symbol,
          dstToken: dstToken && dstToken.isToken ? dstToken.address : dstToken.symbol,
          srcChainId,
          dstChainId,
          srcTypedAmount,
        },
      },
      undefined,
      { shallow: true }
    )
  }, [srcToken, dstToken, srcChainId, dstChainId, srcTypedAmount, router])

  const contract = useSushiXSwapContract(srcChainId)

  const contractWithProvider = useSushiXSwapContractWithProvider(srcChainId)

  // Parse the srcTypedAmount into a srcAmount
  const srcAmount = useMemo<Amount<Currency> | undefined>(() => {
    return tryParseAmount(srcTypedAmount, srcToken)
  }, [srcToken, srcTypedAmount])

  // Parse the dstTypedAmount into a dstAmount
  const dstAmount = useMemo<Amount<Currency> | undefined>(() => {
    return tryParseAmount(dstTypedAmount, dstToken)
  }, [dstToken, dstTypedAmount])

  const [eqFee, eqReward, lpFee, protocolFee] = useBridgeFees({
    srcChainId,
    dstChainId,
    srcBridgeToken,
    dstBridgeToken,
    amount: srcAmount,
  })

  const bridgeFee = useMemo(() => {
    if (!eqFee || !eqReward || !lpFee || !protocolFee) {
      return undefined
    }
    return eqFee.subtract(eqReward).add(lpFee).add(protocolFee)
  }, [eqFee, eqReward, lpFee, protocolFee])

  const srcAmountOut = useMemo(() => (bridgeFee ? srcAmount?.subtract(bridgeFee) : undefined), [bridgeFee, srcAmount])

  const dstAmountIn = useMemo(() => {
    if (!srcAmountOut) return
    return tryParseAmount(
      srcAmountOut.toFixed(
        srcAmountOut.currency.decimals > dstBridgeToken.decimals ? dstBridgeToken.decimals : undefined
      ),
      dstBridgeToken
    )
  }, [dstBridgeToken, srcAmountOut])

  // Output amount displayed... not including slippage for sameChainSwap, transferSwap, crossChainSwap
  const dstAmountOut = useMemo(() => {
    return dstAmountIn
  }, [dstAmountIn])

  const dstMinimumAmountOut = useMemo(() => {
    return dstAmountOut
  }, [dstAmountOut])

  useEffect(() => setDstTypedAmount(dstAmountOut?.toFixed() ?? ''), [dstAmountOut])

  const price = useMemo(
    () => (srcAmount && dstAmountOut ? new Price({ baseAmount: srcAmount, quoteAmount: dstAmountOut }) : undefined),
    [dstAmountOut, srcAmount]
  )

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
    // console.log([
    //   !srcChainId,
    //   !srcAmount,
    //   !dstChainId,
    //   !dstMinimumAmountOut,
    //   !address,
    //   !srcInputCurrencyRebase,
    //   !srcOutputCurrencyRebase,
    //   !dstOutputCurrencyRebase,
    //   !contract,
    // ])
    if (
      !srcChainId ||
      !srcAmount ||
      !dstChainId ||
      !dstMinimumAmountOut ||
      !address ||
      !srcInputCurrencyRebase ||
      !srcOutputCurrencyRebase ||
      !dstOutputCurrencyRebase ||
      !contract
    ) {
      return
    }

    const srcShare = srcAmount.toShare(srcInputCurrencyRebase)

    setIsWritePending(true)

    const sushiXSwap = new SushiBridge({
      contract,
      srcToken,
      dstToken,
      srcUseBentoBox: false,
      dstUseBentoBox: false,
      user: address,
      debug: true,
    })

    if (signature) {
      sushiXSwap.srcCooker.setMasterContractApproval(signature)
    }

    if (transfer) {
      sushiXSwap.transfer(srcAmount, srcShare)
    }
    if (crossChain && srcAmountOut && dstAmountIn) {
      sushiXSwap.teleport(
        srcBridgeToken,
        dstBridgeToken,
        1000000, // TODO: figure out exact extra gas required
        nanoId
      )
    }

    console.debug('attempt cook')
    sushiXSwap
      .cook(1000000)
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
    dstAmountIn,
    dstBridgeToken,
    dstChainId,
    dstMinimumAmountOut,
    dstOutputCurrencyRebase,
    dstToken,
    nanoId,
    signature,
    srcAmount,
    srcAmountOut,
    srcBridgeToken,
    srcChainId,
    srcInputCurrencyRebase,
    srcOutputCurrencyRebase,
    srcToken,
    transfer,
  ])

  const priceImpact = useMemo(() => {
    if (!bridgeFee || !srcAmount) {
      return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
    }
    return new Percent(bridgeFee.quotient, srcAmount.quotient)
  }, [bridgeFee, srcAmount])

  const { data: nativeBalance } = useBalance({
    chainId: srcChainId,
    account: address,
    currency: Native.onChain(srcChainId),
  })

  const { data: srcBalance } = useBalance({ chainId: srcChainId, account: address, currency: srcToken })

  const { data: srcPrices } = usePrices({ chainId: srcChainId })
  const { data: dstPrices } = usePrices({ chainId: dstChainId })

  const srcTokenPrice = srcPrices?.[srcToken.wrapped.address]
  const dstTokenPrice = dstPrices?.[dstToken.wrapped.address]

  const routeNotFound = useMemo(() => {
    return false
  }, [])

  const priceImpactSeverity = useMemo(() => warningSeverity(priceImpact), [priceImpact])

  const priceImpactTooHigh = priceImpactSeverity > 3 && !expertMode

  const [inputUsd, outputUsd, usdPctChange] = useMemo(() => {
    const inputUSD = srcAmount && srcTokenPrice ? srcAmount.multiply(srcTokenPrice.asFraction) : undefined
    const outputUSD = dstAmountOut && dstTokenPrice ? dstAmountOut.multiply(dstTokenPrice.asFraction) : undefined
    const usdPctChange =
      inputUSD && outputUSD && inputUSD?.greaterThan(ZERO)
        ? ((Number(outputUSD?.toExact()) - Number(inputUSD?.toExact())) / Number(inputUSD?.toExact())) * 100
        : undefined
    return [inputUSD, outputUSD, usdPctChange]
  }, [dstAmountOut, dstTokenPrice, srcAmount, srcTokenPrice])

  useEffect(() => {
    console.log('getFee escape hatch', [
      !srcChainId,
      !srcAmount,
      !dstChainId,
      !dstMinimumAmountOut,
      !address,
      !srcInputCurrencyRebase,
      !srcOutputCurrencyRebase,
      !dstOutputCurrencyRebase,
      !contractWithProvider,
    ])
    if (
      !srcChainId ||
      !srcAmount ||
      !dstChainId ||
      !dstMinimumAmountOut ||
      !address ||
      !srcInputCurrencyRebase ||
      !srcOutputCurrencyRebase ||
      !dstOutputCurrencyRebase ||
      !contractWithProvider
    ) {
      return
    }

    const getFee = async () => {
      const srcShare = srcAmount.toShare(srcInputCurrencyRebase)

      const sushiXSwap = new SushiBridge({
        contract: contractWithProvider,
        srcToken,
        dstToken,
        srcUseBentoBox: false,
        dstUseBentoBox: false,
        user: AddressZero,
        debug: false,
      })

      if (transfer) {
        sushiXSwap.transfer(srcAmount, srcShare)
      }

      if (crossChain && srcAmountOut && dstAmountIn) {
        sushiXSwap.teleport(srcBridgeToken, dstBridgeToken, 1000000, nanoId)
      }

      try {
        const [fee] = await sushiXSwap.getFee(1000000)
        feeRef.current = Amount.fromRawAmount(Native.onChain(srcChainId), fee.toString())
      } catch (e) {
        console.log(e)
      }
    }

    void getFee()
  }, [
    address,
    contractWithProvider,
    crossChain,
    dstAmountIn,
    dstBridgeToken,
    dstChainId,
    dstMinimumAmountOut,
    dstOutputCurrencyRebase,
    dstToken,
    nanoId,
    sameChainSwap,
    slippageTolerance,
    srcAmount,
    srcAmountOut,
    srcBridgeToken,
    srcChainId,
    srcInputCurrencyRebase,
    srcOutputCurrencyRebase,
    srcToken,
    bridgeSlippage,
    transfer,
  ])

  const stats = useMemo(() => {
    return (
      <>
        <Typography variant="sm" className="text-slate-400">
          Price Impact
        </Typography>
        <Typography
          variant="sm"
          weight={500}
          className={classNames(
            priceImpactSeverity === 2 ? 'text-yellow' : priceImpactSeverity > 2 ? 'text-red' : 'text-slate-200',
            'text-right truncate'
          )}
        >
          {priceImpact?.multiply(-1).toFixed(2)}%
        </Typography>
        {crossChain && (
          <>
            <Typography variant="sm" className="text-slate-400">
              Est. Processing Time
            </Typography>
            <Typography variant="sm" weight={500} className="text-right truncate text-slate-200">
              ~{Math.ceil(STARGATE_CONFIRMATION_SECONDS[srcChainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] / 60)}{' '}
              minutes
            </Typography>
          </>
        )}
        <div className="col-span-2 border-t border-slate-200/5 w-full py-0.5" />
        <Typography variant="sm" className="text-slate-400">
          Min. Received
        </Typography>
        <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
          {dstMinimumAmountOut?.toSignificant(6)} {dstMinimumAmountOut?.currency.symbol}
        </Typography>
        {crossChain && (
          <>
            <Typography variant="sm" className="text-slate-400">
              Bridge Fee
            </Typography>
            {bridgeFee && srcPrices?.[srcBridgeToken.wrapped.address] ? (
              <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
                ~$
                {bridgeFee?.greaterThan(0)
                  ? bridgeFee?.multiply(srcPrices[srcBridgeToken.wrapped.address].asFraction)?.toSignificant(6)
                  : 0}
              </Typography>
            ) : (
              <div className="flex items-center justify-end">
                <Loader size={14} />
              </div>
            )}
            <Typography variant="sm" className="text-slate-400">
              Gas Cost
            </Typography>
            {feeRef.current && srcPrices?.[Native.onChain(srcChainId).wrapped.address] ? (
              <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
                {feeRef.current.toSignificant(6)} {Native.onChain(srcChainId).symbol}
                {/* ~${feeRef.current.multiply(srcPrices[Native.onChain(srcChainId).wrapped.address].asFraction)?.toFixed(2)} */}
              </Typography>
            ) : (
              <div className="flex items-center justify-end">
                <Loader size={14} />
              </div>
            )}
          </>
        )}
      </>
    )
  }, [
    priceImpactSeverity,
    priceImpact,
    srcChainId,
    dstMinimumAmountOut,
    crossChain,
    srcPrices,
    srcBridgeToken.wrapped.address,
    bridgeFee,
  ])

  const onSrcNetworkSelect = useCallback((chainId: number) => {
    setSrcChainId(chainId)
    setSrcToken(STARGATE_BRIDGE_TOKENS[chainId][0])
  }, [])

  const onDstNetworkSelect = useCallback((chainId: number) => {
    setDstChainId(chainId)
    setDstToken(STARGATE_BRIDGE_TOKENS[chainId][0])
  }, [])

  const isMounted = useIsMounted()

  return useMemo(
    () => (
      <>
        <article
          id="bridge"
          className={classNames(
            theme.background.primary,
            'flex flex-col mx-auto rounded-2xl relative overflow-hidden min-w-[320px] shadow shadow-slate-900'
          )}
          style={{ maxWidth }}
        >
          <div className={classNames('p-3 mx-0.5 grid grid-cols-2 items-center pb-4 font-medium')}>
            <Typography
              weight={500}
              className="flex items-center gap-2 select-none text-slate-100 hover:text-slate-200"
            >
              Bridge
            </Typography>
            <div className="flex justify-end">
              <SettingsOverlay chainId={srcChainId} />
            </div>
          </div>
          <CurrencyInputWithNetworkSelector
            onNetworkSelect={onSrcNetworkSelect}
            value={srcTypedAmount}
            onChange={setSrcTypedAmount}
            onSelect={setSrcToken}
            currency={srcToken}
            chainId={srcChainId}
            tokenMap={srcTokens}
            customTokenMap={srcCustomTokenMap}
            onAddToken={onAddSrcCustomToken}
            onRemoveToken={onRemoveSrcCustomToken}
          />
          <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
            <SwitchCurrenciesButton onClick={switchCurrencies} />
          </div>
          <div className="bg-slate-800">
            <CurrencyInputWithNetworkSelector
              className="!pb-1"
              disabled
              disableMaxButton
              onNetworkSelect={onDstNetworkSelect}
              value={dstTypedAmount}
              onChange={setDstTypedAmount}
              onSelect={setDstToken}
              currency={dstToken}
              chainId={dstChainId}
              tokenMap={dstTokens}
              customTokenMap={dstCustomTokenMap}
              usdPctChange={usdPctChange}
              onAddToken={onAddDstCustomToken}
              onRemoveToken={onRemoveDstCustomToken}
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
                          <div className="flex justify-between items-center bg-white bg-opacity-[0.04] hover:bg-opacity-[0.08] rounded-2xl px-4 mb-4 py-2 gap-2">
                            <div
                              className="text-sm text-slate-300 hover:text-slate-50 cursor-pointer flex items-center h-full gap-1 font-semibold tracking-tight h-[36px] flex items-center truncate"
                              onClick={toggleInvert}
                            >
                              <Tooltip
                                panel={<div className="grid grid-cols-2 gap-1">{stats}</div>}
                                button={<InformationCircleIcon width={16} height={16} />}
                              />{' '}
                              <>
                                {content}{' '}
                                {usdPrice && <span className="font-medium text-slate-500">(${usdPrice})</span>}
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
              ) : !transfer && srcAmount?.greaterThan(0) && routeNotFound ? (
                <Button size="md" fullWidth disabled>
                  Insufficient liquidity for this trade.
                </Button>
              ) : isMounted &&
                ((srcAmount?.greaterThan(0) &&
                  feeRef.current &&
                  nativeBalance &&
                  feeRef.current.greaterThan(nativeBalance[FundSource.WALLET])) ||
                  (srcBalance && srcAmount?.greaterThan(srcBalance[FundSource.WALLET]))) ? (
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
                          !srcAmount ||
                          !srcAmount.greaterThan(ZERO) ||
                          priceImpactTooHigh ||
                          !dstMinimumAmountOut ||
                          dstMinimumAmountOut?.equalTo(ZERO) ||
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
                                      <Typography variant="h3" weight={500} className="truncate text-slate-50">
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
                                    <Typography variant="sm" weight={500} className="text-slate-500">
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
                                      <Typography variant="h3" weight={500} className="truncate text-slate-50">
                                        {dstAmountOut?.toSignificant(6)}{' '}
                                      </Typography>
                                      <div className="flex items-center justify-end gap-2 text-right">
                                        {dstAmountOut && (
                                          <div className="w-5 h-5">
                                            <Icon currency={dstAmountOut.currency} width={20} height={20} />
                                          </div>
                                        )}
                                        <Typography variant="h3" weight={500} className="text-right text-slate-50">
                                          {dstAmountOut?.currency.symbol}
                                        </Typography>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between gap-2">
                                    <Typography variant="sm" weight={500} className="text-slate-500">
                                      {outputUsd ? `$${outputUsd.toFixed(2)}` : ''}
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
                                    {dstAmountOut && (
                                      <Typography
                                        variant="xs"
                                        weight={500}
                                        className="flex items-center gap-1 text-slate-400"
                                      >
                                        <NetworkIcon
                                          type="naked"
                                          chainId={dstAmountOut.currency.chainId}
                                          width={16}
                                          height={16}
                                        />
                                        <span>{chains[dstAmountOut.currency.chainId].name}</span>
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
                              </div>
                              <Approve
                                className="flex-grow !justify-end pt-4"
                                onSuccess={createNotification}
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
            </div>
          </div>
        </article>
      </>
    ),
    [
      address,
      chain,
      createNotification,
      crossChain,
      dstAmountOut,
      dstBridgeToken,
      dstChainId,
      dstCustomTokenMap,
      dstMinimumAmountOut,
      dstToken,
      dstTokens,
      dstTypedAmount,
      execute,
      expertMode,
      inputUsd,
      isMounted,
      isWritePending,
      maxWidth,
      nanoId,
      nativeBalance,
      onAddDstCustomToken,
      onAddSrcCustomToken,
      onDstNetworkSelect,
      onRemoveDstCustomToken,
      onRemoveSrcCustomToken,
      onSrcNetworkSelect,
      outputUsd,
      price,
      priceImpactSeverity,
      priceImpactTooHigh,
      routeNotFound,
      srcAmount,
      srcBalance,
      srcBridgeToken,
      srcChainId,
      srcCustomTokenMap,
      srcToken,
      srcTokens,
      srcTxHash,
      srcTypedAmount,
      stats,
      switchCurrencies,
      switchNetwork,
      theme,
      transfer,
      usdPctChange,
    ]
  )
}
