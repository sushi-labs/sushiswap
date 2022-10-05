import { ChevronDownIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI, Token, tryParseAmount, Type, USDC, USDT } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { FundSource, usePrevious } from '@sushiswap/hooks'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { App, Button, classNames, Container, Dots, Link, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components/CurrencyInput'
import { warningSeverity } from 'lib/functions'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'

import { Layout, SettingsOverlay, SwapReviewModalLegacy, TradeProvider, useTrade } from '../components'
import { SwapStatsDisclosure } from '../components/SwapStatsDisclosure'
import { useCustomTokens, useSettings } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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
}

const getDefaultToken1 = (chainId: number) => {
  if (chainId in DEAFAULT_TOKEN_1) {
    return DEAFAULT_TOKEN_1[chainId]
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
  const router = useRouter()

  const chainId = initialState.chainId ? Number(initialState.chainId) : chain ? chain.id : ChainId.ETHEREUM

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
          query: {
            ...router.query,
          },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [router, chain, previousChain])

  const tokens = useTokens(chainId)

  const inputToken =
    initialState.token0 && initialState.token0 in tokens ? tokens[initialState.token0] : Native.onChain(chainId)

  const outputToken = useMemo(() => {
    if (initialState.token1 && initialState.token1 in tokens) return tokens[initialState.token1]
    return getDefaultToken1(chainId)
  }, [chainId, initialState.token1, tokens])

  const [input0, setInput0] = useState<string>(initialState.input0)
  const [token0, setToken0] = useState<Type | undefined>(inputToken)
  const [input1, setInput1] = useState<string>('')
  const [token1, setToken1] = useState<Type | undefined>(outputToken)
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT)

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onInput0 = useCallback((val: string) => {
    setTradeType(TradeType.EXACT_INPUT)
    setInput0(val)
  }, [])

  const onInput1 = useCallback((val: string) => {
    setTradeType(TradeType.EXACT_OUTPUT)
    setInput1(val)
  }, [])

  const switchCurrencies = useCallback(() => {
    const srcToken = token0
    const dstToken = token1

    setToken0(dstToken)
    setToken1(srcToken)
  }, [token0, token1])

  const amounts = useMemo(() => [parsedInput0], [parsedInput0])

  useEffect(() => {
    setToken0(Native.onChain(chainId))
    setToken1(getDefaultToken1(chainId))
    setInput0('')
    setInput1('')
  }, [chainId])

  const onSuccess = useCallback(() => {
    setInput0('')
    setInput1('')
  }, [])

  return (
    <>
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
                  <App.NavItemInternal href="https://sushi.com/swap" label="Swap" />
                  <App.NavItemInternal href="https://sushi.com/xswap" label="xSwap" />
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
                onSelect={setToken0}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={chainId}
                tokenMap={tokenMap}
                inputType={TradeType.EXACT_INPUT}
                tradeType={tradeType}
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
                  value={input1}
                  onChange={onInput1}
                  currency={token1}
                  onSelect={setToken1}
                  customTokenMap={customTokensMap}
                  onAddToken={addCustomToken}
                  onRemoveToken={removeCustomToken}
                  chainId={chainId}
                  tokenMap={tokenMap}
                  inputType={TradeType.EXACT_OUTPUT}
                  tradeType={tradeType}
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
                      <Checker.Network
                        fullWidth
                        size="md"
                        chainId={chainId}
                        // onSuccess={(chain) => {
                        //   console.log('switch network success', chain)
                        //   delete router.query['chainId']
                        //   void router.replace({
                        //     pathname: router.pathname,
                        //     query: router.query,
                        //   })
                        // }}
                      >
                        <SwapReviewModalLegacy chainId={chainId} onSuccess={onSuccess}>
                          {({ isWritePending, setOpen }) => {
                            return <SwapButton isWritePending={isWritePending} setOpen={setOpen} />
                          }}
                        </SwapReviewModalLegacy>
                      </Checker.Network>
                    </Checker.Amounts>
                  </Checker.Connected>
                </div>
              </div>
            </Widget.Content>
          </Widget>
          <Container className="flex justify-center mx-auto" maxWidth="2xl">
            <Link.Internal href="https://sushi.com/xswap" passHref>
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
        </Layout>
      </TradeProvider>
    </>
  )
}

function SwapButton({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }) {
  const { isLoading, isError, trade } = useTrade()
  const [{ expertMode, slippageTolerance }] = useSettings()

  const swapSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance]
  )

  const priceImpact = useMemo(() => {
    if (trade) {
      return trade.priceImpact
    }
    return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
  }, [trade])

  const priceImpactSeverity = useMemo(() => warningSeverity(priceImpact), [priceImpact])

  const priceImpactTooHigh = priceImpactSeverity > 3 && !expertMode

  return (
    <Button
      fullWidth
      onClick={() => setOpen(true)}
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
      {isWritePending ? (
        <Dots>Confirm transaction</Dots>
      ) : priceImpactTooHigh ? (
        'High Price Impact'
      ) : trade && priceImpactSeverity > 2 ? (
        'Swap Anyway'
      ) : (
        'Swap'
      )}
    </Button>
  )
}

export default Swap
