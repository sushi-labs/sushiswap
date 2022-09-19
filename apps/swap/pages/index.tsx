import { ChevronDownIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI, tryParseAmount, Type } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components/CurrencyInput'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'

import { Layout, SettingsOverlay, SwapReviewModalLegacy, TradeProvider } from '../components'
import { SwapStatsDisclosure } from '../components/SwapStatsDisclosure'
import { useCustomTokens } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'

const Index: FC = () => {
  const { chain } = useNetwork()

  // Add query param fetching here
  const chainId = chain?.id
  const chainIdWithDefault = chainId || ChainId.ETHEREUM

  const [input0, setInput0] = useState<string>('')
  const [token0, setToken0] = useState<Type | undefined>(Native.onChain(chainIdWithDefault))
  const [input1, setInput1] = useState<string>('')
  const [token1, setToken1] = useState<Type | undefined>(SUSHI[chainIdWithDefault])
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
    setToken0(Native.onChain(chain ? chain.id : chainIdWithDefault))
    setToken1(SUSHI[chain ? chain.id : chainIdWithDefault])
    setInput0('')
    setInput1('')
  }, [chain, chainIdWithDefault])

  const onSuccess = useCallback(() => {
    setInput0('')
    setInput1('')
  }, [])

  return (
    <>
      <TradeProvider
        chainId={chainIdWithDefault}
        tradeType={tradeType}
        amountSpecified={tradeType === TradeType.EXACT_INPUT ? parsedInput0 : parsedInput1}
        mainCurrency={token0}
        otherCurrency={token1}
      >
        <Layout>
          <Widget id="swap" maxWidth={400}>
            <Widget.Content>
              <Widget.Header title="Swap">
                <SettingsOverlay chainId={chainIdWithDefault} />
              </Widget.Header>
              <CurrencyInput
                className="p-3"
                value={input0}
                onChange={onInput0}
                currency={token0}
                onSelect={setToken0}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={chainIdWithDefault}
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
                  chainId={chainIdWithDefault}
                  tokenMap={tokenMap}
                  inputType={TradeType.EXACT_OUTPUT}
                  tradeType={tradeType}
                />
                <SwapStatsDisclosure />
                <div className="p-3 pt-0">
                  <Checker.Amounts
                    fullWidth
                    size="md"
                    chainId={chainIdWithDefault}
                    fundSource={FundSource.WALLET}
                    amounts={amounts}
                  >
                    <Checker.Connected fullWidth size="md">
                      <Checker.Network fullWidth size="md" chainId={chainIdWithDefault}>
                        <SwapReviewModalLegacy chainId={chainIdWithDefault} onSuccess={onSuccess}>
                          {({ isWritePending, setOpen }) => {
                            return (
                              <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">
                                {isWritePending ? <Dots>Executing Swap</Dots> : 'Confirm Swap'}
                              </Button>
                            )
                          }}
                        </SwapReviewModalLegacy>
                      </Checker.Network>
                    </Checker.Connected>
                  </Checker.Amounts>
                </div>
              </div>
            </Widget.Content>
          </Widget>
        </Layout>
      </TradeProvider>
    </>
  )
}

export default Index
