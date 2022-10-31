import { ChevronDownIcon } from '@heroicons/react/solid'
import { TradeType } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI, Token, tryParseAmount, Type, USDC, USDT, WBTC, WETH9, WNATIVE } from '@sushiswap/currency'
import { FundSource, useIsMounted, usePrevious } from '@sushiswap/hooks'
import { Percent, ZERO } from '@sushiswap/math'
import { App, Button, classNames, Container, Dots, Link, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker, TokenListImportChecker, useWalletState, WrapType } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components/CurrencyInput'
import { isAddress } from 'ethers/lib/utils'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useConnect, useNetwork } from 'wagmi'

import { Layout, SettingsOverlay, SwapReviewModalLegacy, TradeProvider, useTrade, WrapReviewModal } from '../components'
import { SwapStatsDisclosure } from '../components/SwapStatsDisclosure'
import { warningSeverity } from '../lib/functions'
import { useCustomTokens, useSettings } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const { chainId, token0, token1, input0 } = query
  return {
    props: {
      chainId: chainId ?? null,
      token0: token0 ?? null,
      token1: token1 ?? null,
      input0: !isNaN(Number(input0)) ? input0 : '',
    },
  }
}

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

const DEAFAULT_TOKEN_1 = {
  [ChainId.ETHEREUM]: SUSHI[ChainId.ETHEREUM],
  [ChainId.GNOSIS]: new Token({
    address: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
    chainId: ChainId.GNOSIS,
    symbol: 'GNO',
    name: 'Gnosis Token',
    decimals: 18,
  }),
  [ChainId.OPTIMISM]: new Token({
    address: '0x4200000000000000000000000000000000000042',
    chainId: ChainId.OPTIMISM,
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18,
  }),
  [ChainId.BOBA]: new Token({
    address: '0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7',
    chainId: ChainId.BOBA,
    symbol: 'BOBA',
    name: 'Boba',
    decimals: 18,
  }),
  [ChainId.BOBA_AVAX]: new Token({
    chainId: ChainId.BOBA_AVAX,
    address: '0x4200000000000000000000000000000000000023',
    decimals: 18,
    symbol: 'AVAX',
    name: 'Avax',
  }),
}

const getDefaultToken1 = (chainId: number) => {
  if (chainId in DEAFAULT_TOKEN_1) {
    return DEAFAULT_TOKEN_1[chainId]
  }
  if (chainId in WETH9 && chainId in WNATIVE && WNATIVE[chainId] !== WETH9[chainId]) {
    return WETH9[chainId]
  }
  if (chainId in WBTC) {
    return WBTC[chainId]
  }
  if (chainId in USDC) {
    return USDC[chainId]
  }
  if (chainId in USDT) {
    return USDT[chainId]
  }
}

function Swap(initialState: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const connect = useConnect()
  const { connecting, notConnected } = useWalletState(!!connect.pendingConnector)
  const router = useRouter()

  const defaultChainId = ChainId.ETHEREUM
  const activeChainId = chain ? chain.id : undefined
  const queryChainId = router.query.chainId ? Number(router.query.chainId) : undefined
  const chainId = queryChainId
    ? queryChainId
    : activeChainId
    ? activeChainId
    : !connecting && notConnected
    ? defaultChainId
    : undefined

  const previousChain = usePrevious(chain)

  useEffect(() => {
    if (chain && previousChain && chain.id !== previousChain.id && chain.id !== Number(router?.query?.chainId)) {
      // Clear up the query string if user changes network
      // whilst there is a chainId parameter in the query...
      delete router.query['chainId']
      delete router.query['token0']
      delete router.query['token1']
      delete router.query['input0']
      void router.replace(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { shallow: true }
      )
    }
  }, [router, chain, previousChain])

  const tokenMap = useTokens(chainId)
  const [customTokensMap, { addCustomToken, removeCustomToken, addCustomTokens }] = useCustomTokens(chainId)

  const inputToken = useMemo(() => {
    if (!chainId || !isMounted || Object.keys(tokenMap).length === 0) return
    if (initialState.token0 && initialState.token0 in tokenMap) return tokenMap[initialState.token0]
    if (initialState.token0 && initialState.token0.toLowerCase() in customTokensMap)
      return customTokensMap[initialState.token0.toLowerCase()]
    return Native.onChain(chainId)
  }, [chainId, customTokensMap, initialState.token0, isMounted, tokenMap])

  const outputToken = useMemo(() => {
    if (!chainId || !isMounted || Object.keys(tokenMap).length === 0) return
    if (initialState.token1 && initialState.token1 in tokenMap) return tokenMap[initialState.token1]
    if (initialState.token1 && initialState.token1.toLowerCase() in customTokensMap)
      return customTokensMap[initialState.token1.toLowerCase()]
    return getDefaultToken1(chainId)
  }, [chainId, customTokensMap, initialState.token1, isMounted, tokenMap])

  const [input0, setInput0] = useState<string>(initialState.input0)
  const [[token0, token1], setTokens] = useState<[Type | undefined, Type | undefined]>([inputToken, outputToken])
  const [input1, setInput1] = useState<string>('')
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT)

  const wrap = Boolean(token0 && token1 && token0.isNative && token1.equals(Native.onChain(token1.chainId).wrapped))
  const unwrap = Boolean(token0 && token1 && token1.isNative && token0.equals(Native.onChain(token0.chainId).wrapped))
  const isWrap = wrap || unwrap

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(isWrap ? input0 : input1, token1)]
  }, [input0, input1, isWrap, token0, token1])

  const onInput0 = useCallback((val: string) => {
    setTradeType(TradeType.EXACT_INPUT)
    setInput0(val)
  }, [])

  const onInput1 = useCallback((val: string) => {
    setTradeType(TradeType.EXACT_OUTPUT)
    setInput1(val)
  }, [])

  const switchCurrencies = useCallback(() => {
    setTokens(([prevSrc, prevDst]) => [prevDst, prevSrc])
  }, [])

  const amounts = useMemo(() => [parsedInput0], [parsedInput0])

  useEffect(() => {
    setTokens([inputToken, outputToken])
    setInput0(initialState.input0)
    setInput1('')
  }, [chainId, initialState.input0, inputToken, outputToken])

  const onSuccess = useCallback(() => {
    setInput0('')
    setInput1('')
  }, [])

  const _setToken0 = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevDst && currency.equals(prevDst) ? [prevDst, prevSrc] : [currency, prevDst]
    })
  }, [])

  const _setToken1 = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevSrc && currency.equals(prevSrc) ? [prevDst, prevSrc] : [prevSrc, currency]
    })
  }, [])

  const checkIfImportedTokens = useMemo(() => {
    const tokens: { address: string; chainId: number }[] = []
    if (initialState.token0 && isAddress(initialState.token0))
      tokens.push({ address: initialState.token0, chainId: Number(initialState.chainId) })
    if (initialState.token1 && isAddress(initialState.token1))
      tokens.push({ address: initialState.token1, chainId: Number(initialState.chainId) })
    return tokens
  }, [initialState.chainId, initialState.token0, initialState.token1])

  return (
    <TokenListImportChecker
      onAddTokens={addCustomTokens}
      customTokensMap={customTokensMap}
      tokenMap={tokenMap}
      tokens={checkIfImportedTokens}
    >
      <TradeProvider
        chainId={chainId}
        tradeType={tradeType}
        amountSpecified={tradeType === TradeType.EXACT_INPUT ? parsedInput0 : parsedInput1}
        mainCurrency={token0}
        otherCurrency={token1}
      >
        <Layout>
          <Widget id="swap" maxWidth={400}>
            <Widget.Content>
              <div className={classNames('p-3 mx-0.5 grid grid-cols-2 items-center pb-4 font-medium')}>
                <App.NavItemList hideOnMobile={false}>
                  <App.NavItem href="https://www.sushi.com/swap" label="Swap" />
                  <App.NavItem href="https://www.sushi.com/xswap" label="xSwap" />
                </App.NavItemList>
                <div className="flex justify-end">
                  <SettingsOverlay chainId={chainId} />
                </div>
              </div>
              <CurrencyInput
                className="p-3"
                value={input0}
                onChange={onInput0}
                currency={token0}
                onSelect={_setToken0}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={chainId}
                tokenMap={tokenMap}
                inputType={TradeType.EXACT_INPUT}
                tradeType={tradeType}
                loading={!token0}
              />
              <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                <button
                  type="button"
                  onClick={switchCurrencies}
                  className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
                >
                  <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                    <ChevronDownIcon width={16} height={16} />
                  </div>
                </button>
              </div>
              <div className="bg-slate-800">
                <CurrencyInput
                  disabled={true}
                  className="p-3"
                  value={isWrap ? input0 : input1}
                  onChange={onInput1}
                  currency={token1}
                  onSelect={_setToken1}
                  customTokenMap={customTokensMap}
                  onAddToken={addCustomToken}
                  onRemoveToken={removeCustomToken}
                  chainId={chainId}
                  tokenMap={tokenMap}
                  inputType={TradeType.EXACT_OUTPUT}
                  tradeType={tradeType}
                  loading={!token1}
                  isWrap={isWrap}
                />
                <SwapStatsDisclosure />
                <div className="p-3 pt-0">
                  <Checker.Connected fullWidth size="md">
                    <Checker.Amounts
                      fullWidth
                      size="md"
                      chainId={chainId}
                      fundSource={FundSource.WALLET}
                      amounts={amounts}
                    >
                      <Checker.Network fullWidth size="md" chainId={chainId}>
                        {isWrap ? (
                          <WrapReviewModal
                            chainId={chainId}
                            input0={parsedInput0}
                            input1={parsedInput1}
                            wrapType={wrap ? WrapType.Wrap : WrapType.Unwrap}
                          >
                            {({ isWritePending, setOpen }) => {
                              return (
                                <Button disabled={isWritePending} fullWidth size="md" onClick={() => setOpen(true)}>
                                  {wrap ? 'Wrap' : 'Unwrap'}
                                </Button>
                              )
                            }}
                          </WrapReviewModal>
                        ) : (
                          <SwapReviewModalLegacy chainId={chainId} onSuccess={onSuccess}>
                            {({ isWritePending, setOpen }) => {
                              return <SwapButton isWritePending={isWritePending} setOpen={setOpen} />
                            }}
                          </SwapReviewModalLegacy>
                        )}
                      </Checker.Network>
                    </Checker.Amounts>
                  </Checker.Connected>
                </div>
              </div>
            </Widget.Content>
          </Widget>
          <Container className="flex justify-center mx-auto" maxWidth="2xl">
            <Link.Internal href="https://www.sushi.com/xswap" passHref>
              <a className="text-baseline whitespace-nowrap hover:text-white hover:underline focus:text-white active:text-white flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl">
                <Typography
                  variant="xs"
                  weight={500}
                  className="flex items-center gap-1 text-slate-500 py-1 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
                >
                  Are you looking for cross chain swap?
                </Typography>
              </a>
            </Link.Internal>
          </Container>
          {/* <Container className="flex justify-center mx-auto" maxWidth="3xl">
            <Route />
          </Container> */}
        </Layout>
      </TradeProvider>
    </TokenListImportChecker>
  )
}

const SwapButton: FC<{
  isWritePending: boolean
  setOpen(open: boolean): void
}> = ({ isWritePending, setOpen }) => {
  const { isLoading: isLoadingTrade, trade, route } = useTrade()
  const [{ expertMode, slippageTolerance }] = useSettings()
  const swapSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance]
  )

  const priceImpactSeverity = useMemo(() => warningSeverity(trade?.priceImpact), [trade])
  const priceImpactTooHigh = priceImpactSeverity > 3 && !expertMode

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <Checker.Custom
      showGuardIfTrue={!route}
      guard={
        <Button fullWidth disabled size="md">
          No trade found
        </Button>
      }
    >
      <Button
        fullWidth
        onClick={onClick}
        disabled={
          isWritePending ||
          priceImpactTooHigh ||
          trade?.minimumAmountOut(swapSlippage)?.equalTo(ZERO) ||
          Boolean(!trade && priceImpactSeverity > 2 && !expertMode)
        }
        size="md"
        color={priceImpactTooHigh || priceImpactSeverity > 2 ? 'red' : 'blue'}
        {...(Boolean(!trade && priceImpactSeverity > 2 && !expertMode) && {
          title: 'Enable expert mode to swap with high price impact',
        })}
      >
        {isLoadingTrade ? (
          'Finding Best Price'
        ) : isWritePending ? (
          <Dots>Confirm transaction</Dots>
        ) : priceImpactTooHigh ? (
          'High Price Impact'
        ) : trade && priceImpactSeverity > 2 ? (
          'Swap Anyway'
        ) : (
          'Swap'
        )}
      </Button>
    </Checker.Custom>
  )
}

export default Swap
