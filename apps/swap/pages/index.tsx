import { Signature } from '@ethersproject/bytes'
import { ChevronRightIcon } from '@heroicons/react/outline'
import chain, { ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { formatUSD } from '@sushiswap/format'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { _9995, _10000, JSBI, Percent, ZERO } from '@sushiswap/math'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { Button, Chip, classNames, Dots, GasIcon, Loader, Typography } from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, useSushiXSwapContract, Wallet } from '@sushiswap/wagmi'
import { Caption, ConfirmationComponentController, CurrencyInput, Rate, SettingsOverlay } from 'components'
import { CrossChainRoute, SameChainRoute } from 'components'
import { defaultTheme, SUSHI_X_SWAP_ADDRESS } from 'config'
import { useBentoBoxRebase, useTrade } from 'lib/hooks'
import { useTokenBalance } from 'lib/hooks/useTokenBalance'
import { useTokens } from 'lib/state/token-lists'
import { SushiXSwap } from 'lib/SushiXSwap'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Theme } from 'types'
import { useAccount, useFeeData, useNetwork, useSwitchNetwork } from 'wagmi'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

const theme: Theme = {
  ...defaultTheme,
}

export default function Swap() {
  const router = useRouter()

  // TODO: Sync from local storage if no query params

  // const { data } = useSWR<SwapCache>('swap-cache', storage, {
  //   fallbackData: { srcChainId: ChainId.AVALANCHE, dstChainId: ChainId.FANTOM },
  // })
  // function mutateSwapCache(value: SwapCache) {
  //   localStorage.setItem('swap-cache', JSON.stringify(value))
  //   mutate('swap-cache', value)
  // }

  const defaultSrcChainId = ChainId.AVALANCHE
  const defaultDstChainId = ChainId.OPTIMISM

  // query is empty __/^-_-^/_
  const srcChainId = Number(router.query.srcChainId) || defaultSrcChainId
  const dstChainId = Number(router.query.dstChainId) || defaultDstChainId

  // console.log({ router, defaultSrcChainId, defaultDstChainId, srcChainId, dstChainId })

  return (
    <div className="mt-40 space-y-12 mb-60">
      <Widget
        theme={theme}
        initialState={{
          srcChainId,
          dstChainId,
          srcToken: Native.onChain(srcChainId),
          dstToken: Native.onChain(dstChainId),
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
  initialState?: {
    srcChainId: number
    dstChainId: number
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
  initialState = {
    srcChainId: ChainId.AVALANCHE,
    dstChainId: ChainId.FANTOM,
    srcToken: Native.onChain(ChainId.AVALANCHE),
    dstToken: Native.onChain(ChainId.FANTOM),
  },
  caption = false,
  // swapCache,
  // mutateSwapCache,
}) => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const [isWritePending, setIsWritePending] = useState<boolean>()

  const [signature, setSignature] = useState<Signature>()

  const router = useRouter()

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

  const [srcTypedAmount, setSrcTypedAmount] = useState<string>('')
  const [dstTypedAmount, setDstTypedAmount] = useState<string>('')

  const [srcUseBentoBox, setSrcUseBentoBox] = useState(false)
  const [dstUseBentoBox, setDstUseBentoBox] = useState(false)

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
    setDstTypedAmount(dstMinimumAmountOut?.toFixed() ?? '')
  }, [dstMinimumAmountOut])

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

  const { data: srcBalance } = useTokenBalance(
    srcChainId,
    address,
    srcToken.wrapped,
    srcUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET
  )

  const { data: dstBalance } = useTokenBalance(
    dstChainId,
    address,
    dstToken.wrapped,
    dstUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET
  )

  const { data: srcPrices } = useSWR(
    `https://price-git-feature-price-v0-api-teamsushi.vercel.app/v0/${srcChainId}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const { data: dstPrices } = useSWR(
    `https://price-git-feature-price-v0-api-teamsushi.vercel.app/v0/${dstChainId}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const srcTokenPrice = srcPrices?.[srcToken.wrapped.address.toLowerCase()]
  const dstTokenPrice = dstPrices?.[dstToken.wrapped.address.toLowerCase()]
  console.log({ srcPrices, dstPrices })

  return (
    <article
      id="sushixswap"
      className={classNames(
        theme.background.primary,
        'flex flex-col mx-auto rounded-2xl relative overflow-hidden min-w-[320px]'
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
      <div className="p-3 pb-0 border-2 border-transparent">
        <CurrencyInput
          value={srcTypedAmount}
          onChange={setSrcTypedAmount}
          onCurrencySelect={setSrcToken}
          onFundSourceSelect={(source) => setSrcUseBentoBox(source === FundSource.BENTOBOX)}
          fundSource={srcUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET}
          currency={srcToken}
          network={chain[srcChainId]}
          onNetworkSelect={(chainId) => {
            setSrcChainId(chainId)
            // mutateSwapCache({
            //   ...swapCache,
            //   srcChainId: chainId,
            // })
          }}
          tokenList={srcTokens}
          theme={theme}
          balance={srcBalance}
          onMax={(value) => setSrcTypedAmount(value)}
        />
      </div>
      <div className={classNames(theme.background.secondary, 'p-3 m-0.5 rounded-2xl')}>
        <CurrencyInput
          disabled
          value={dstTypedAmount}
          onChange={setDstTypedAmount}
          onCurrencySelect={setDstToken}
          onFundSourceSelect={(source) => setDstUseBentoBox(source === FundSource.BENTOBOX)}
          fundSource={dstUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET}
          currency={dstToken}
          network={chain[dstChainId]}
          onNetworkSelect={setDstChainId}
          tokenList={dstTokens}
          theme={theme}
          disableMaxButton
          balance={dstBalance}
        />

        <Rate loading={!!srcAmount && !dstMinimumAmountOut} price={price} theme={theme} />

        <div className="flex gap-2">
          {!address && isMounted ? (
            <Wallet.Button fullWidth color="blue">
              Connect Wallet
            </Wallet.Button>
          ) : activeChain?.id !== srcChainId && isMounted ? (
            <Button fullWidth onClick={() => switchNetwork && switchNetwork(srcChainId)}>
              Switch to {chain[srcChainId].name}
            </Button>
          ) : activeChain?.id == srcChainId && isMounted ? (
            <>
              <Approve
                components={
                  <Approve.Components className="flex gap-4">
                    <Approve.Bentobox
                      className="whitespace-nowrap"
                      fullWidth
                      address={SUSHI_X_SWAP_ADDRESS[srcChainId]}
                      onSignature={setSignature}
                    />
                    <Approve.Token
                      className="whitespace-nowrap"
                      fullWidth
                      amount={srcAmount}
                      address={BENTOBOX_ADDRESS[srcChainId]}
                    />
                  </Approve.Components>
                }
                render={({ approved }) => (
                  <ConfirmationComponentController
                    variant="overlay"
                    trigger={({ setOpen }) => (
                      <Button
                        fullWidth
                        variant="filled"
                        color="gradient"
                        disabled={isWritePending || !approved || !srcAmount?.greaterThan(ZERO)}
                        onClick={() => setOpen(true)}
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Swap'}
                      </Button>
                    )}
                  >
                    <div className="h-px bg-slate-200/5 w-full px-0.5" />
                    <div className="!my-0 rounded-xl py-2 grid grid-cols-12">
                      <div className="flex flex-col col-span-5">
                        <Typography variant="lg" weight={700} className="truncate">
                          {srcAmount?.toSignificant(6)}{' '}
                          <span className="text-xs text-slate-400">{srcAmount?.currency.symbol}</span>
                        </Typography>
                        <Typography variant="xs" weight={700} className="text-slate-400">
                          {srcAmount && srcTokenPrice
                            ? formatUSD(String(Number(srcAmount.toFixed()) * Number(srcTokenPrice)))
                            : '-'}
                        </Typography>
                      </div>
                      <div className="flex items-center justify-center col-span-2">
                        <ChevronRightIcon width={18} height={18} className="text-slate-500" />
                      </div>
                      <div className="flex flex-col w-full col-span-5">
                        <Typography variant="lg" weight={700} className="text-right truncate">
                          {dstMinimumAmountOut?.toSignificant(6)}{' '}
                          <span className="text-xs text-slate-400">{dstMinimumAmountOut?.currency.symbol}</span>
                        </Typography>
                        <Typography variant="xs" weight={700} className="text-right text-slate-400">
                          {dstMinimumAmountOut && dstTokenPrice
                            ? formatUSD(String(Number(dstMinimumAmountOut.toFixed()) * Number(dstTokenPrice)))
                            : '-'}
                          {/* <span className="text-[10px] text-green">(+0.00%)</span> */}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-3 py-2 bg-slate-700 rounded-xl">
                      <div className="flex items-center justify-between gap-2">
                        <Rate loading={!!srcAmount && !dstMinimumAmountOut} price={price} theme={theme}>
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
                        <Chip
                          label={
                            <div className="flex items-center gap-1">
                              <GasIcon width={10} />
                              <Typography variant="xs" weight={700}>
                                {feeData.data?.formatted.gasPrice} Gwei
                              </Typography>
                            </div>
                          }
                          color="gray"
                        />
                      </div>
                      <div className="w-full h-px my-1 bg-slate-200/5" />
                      <div className="flex justify-between gap-2">
                        <Typography variant="xs" className="text-slate-400">
                          Minimum Received After Slippage
                        </Typography>
                        <Typography variant="xs" weight={700} className="text-slate-200">
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
                            STARGATE_CONFIRMATION_SECONDS[srcChainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] / 60
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
                    <Button fullWidth color="gradient" onClick={execute}>
                      Swap
                    </Button>
                  </ConfirmationComponentController>
                )}
              />
            </>
          ) : (
            <Button fullWidth color="blue">
              <Loader size="16px" />
            </Button>
          )}
        </div>
        {caption && <Caption theme={theme} />}
      </div>
    </article>
  )
}
