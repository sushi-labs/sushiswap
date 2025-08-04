'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Button, Collapsible, Loader, classNames } from '@sushiswap/ui'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import { isSushiSwapV2Pool } from 'src/lib/functions'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { CurrencyInputBlade } from 'src/lib/wagmi/components/web3-input/Currency/CurrencyInputBlade'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { PoolFinder } from 'src/lib/wagmi/systems/PoolFinder/PoolFinder'
import { AddSectionReviewModalLegacy } from 'src/ui/pool/AddSectionReviewModalLegacy'
import {
  SUSHISWAP_V2_ROUTER_ADDRESS,
  defaultCurrency,
  isSushiSwapV2ChainId,
  isWNativeSupported,
} from 'sushi/config'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { Amount, Token, type Type, tryParseAmount } from 'sushi/currency'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { useCurrentChainId } from '../../../lib/hooks/useCurrentChainId'
import { DoesNotExistMessage } from './does-not-exist-message'
import { EstimatedValue } from './estimated-value'
import { InitialPrice } from './initial-price'

export const AddLiquidityBlade = ({
  initToken0,
  hideTokenSelectors,
}: {
  initToken0?: Type
  hideTokenSelectors?: boolean
}) => {
  const { chainId } = useCurrentChainId() as { chainId: SushiSwapV2ChainId }

  const [tokens, setTokens] = useState<Type[]>([])

  useEffect(() => {
    if (initToken0) {
      setTokens([initToken0])
    } else {
      setTokens([defaultCurrency[chainId as keyof typeof defaultCurrency]])
    }
  }, [chainId, initToken0])

  const appendToken = useCallback((token?: Type) => {
    if (!token) return
    setTokens((prev) => {
      if (prev.length >= 5) return prev
      if (prev.some((t) => t.id === token.id)) return prev
      return [...prev, token]
    })
  }, [])

  const replaceTokenAt = useCallback((index: number, token?: Type) => {
    if (!token) return
    setTokens((prev) => {
      if (index < 0 || index >= prev.length) return prev
      if (prev.some((t, i) => i !== index && t.id === token.id)) return prev
      const next = [...prev]
      next[index] = token
      return next
    })
    setInputs((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        if (k === token?.id) return
      })
      return next
    })
  }, [])

  const removeTokenAt = useCallback((index: number) => {
    setTokens((prev) => {
      if (index < 0 || index >= prev.length) return prev
      const removed = prev[index]
      const next = prev.toSpliced(index, 1)

      setInputs((prevInputs) => {
        const { [removed.id]: _omitted, ...rest } = prevInputs
        return rest
      })
      return next
    })
  }, [])

  const [inputs, setInputs] = useState<Record<string, string>>({})
  const updateInput = useCallback((tokenId: string, value: string) => {
    setInputs((prev) => ({ ...prev, [tokenId]: value }))
  }, [])

  const [independendField, setIndependendField] = useState<number>(0)

  const t0 = tokens[0]
  const t1 = tokens[1]
  const t2 = tokens[2]
  const t3 = tokens[3]
  const t4 = tokens[4]

  const { data: p0, isLoading: l0 } = usePrice({
    chainId: t0?.chainId,
    address: t0?.wrapped?.address,
    enabled: !!t0,
  })
  const { data: p1, isLoading: l1 } = usePrice({
    chainId: t1?.chainId,
    address: t1?.wrapped?.address,
    enabled: !!t1,
  })
  const { data: p2, isLoading: l2 } = usePrice({
    chainId: t2?.chainId,
    address: t2?.wrapped?.address,
    enabled: !!t2,
  })
  const { data: p3, isLoading: l3 } = usePrice({
    chainId: t3?.chainId,
    address: t3?.wrapped?.address,
    enabled: !!t3,
  })
  const { data: p4, isLoading: l4 } = usePrice({
    chainId: t4?.chainId,
    address: t4?.wrapped?.address,
    enabled: !!t4,
  })

  const priceFor = useCallback(
    (token?: Type): number | undefined => {
      if (!token) return undefined
      if (token.id === t0?.id) return p0
      if (token.id === t1?.id) return p1
      if (token.id === t2?.id) return p2
      if (token.id === t3?.id) return p3
      if (token.id === t4?.id) return p4
      return undefined
    },
    [t0?.id, t1?.id, t2?.id, t3?.id, t4?.id, p0, p1, p2, p3, p4],
  )

  const isAnyPriceLoading = l0 || l1 || l2 || l3 || l4

  const estimatedValue = useMemo(() => {
    if (!tokens.length) return '0.00'
    const total = tokens.reduce((sum, token) => {
      const raw = inputs[token.id]
      const amount = tryParseAmount(raw ?? '', token)?.quotient
      if (!amount) return sum
      const price = priceFor(token) ?? 0
      const value = (price * Number(amount)) / 10 ** token.decimals
      return sum + (Number.isNaN(value) ? 0 : value)
    }, 0)
    return total.toFixed(2)
  }, [tokens, inputs, priceFor])

  const tokenA = t0
  const tokenB = t1

  return (
    <PoolFinder
      components={
        <PoolFinder.Components>
          <PoolFinder.SushiSwapV2Pool
            chainId={chainId}
            token0={tokenA}
            token1={tokenB}
            enabled={isSushiSwapV2ChainId(chainId)}
          />
        </PoolFinder.Components>
      }
    >
      {({ pool: [poolState, pool] }) => {
        const hasPair = !!tokenA && !!tokenB
        const doesNotExist =
          poolState === SushiSwapV2PoolState.NOT_EXISTS && hasPair

        const title = !hasPair ? (
          'Select Tokens'
        ) : [SushiSwapV2PoolState.LOADING].includes(
            poolState as SushiSwapV2PoolState,
          ) ? (
          <div className="h-[20px] flex items-center justify-center">
            <Loader width={14} />
          </div>
        ) : [SushiSwapV2PoolState.EXISTS].includes(
            poolState as SushiSwapV2PoolState,
          ) ? (
          'Add Liquidity'
        ) : (
          'Create Pool'
        )

        return (
          <div className={classNames('flex flex-col gap-4 mt-4')}>
            {doesNotExist ? (
              <>
                <Collapsible open className="w-full">
                  <DoesNotExistMessage />
                </Collapsible>
                <Collapsible open className="w-full">
                  <div className="flex flex-col gap-4">
                    <p className="text-base font-medium text-slate-900 dark:text-pink-100">
                      Set Price
                    </p>
                    <InitialPrice
                      token0={tokenA}
                      token1={tokenB}
                      input0={inputs[tokenA!.id] ?? ''}
                      input1={inputs[tokenB!.id] ?? ''}
                    />
                  </div>
                </Collapsible>
              </>
            ) : null}

            <div className="flex flex-col gap-4">
              <AddLiquidityWidget
                chainId={chainId}
                pool={pool}
                poolState={poolState}
                title={title}
                tokens={tokens}
                setTokens={setTokens}
                maxTokens={5}
                inputs={inputs}
                updateInput={updateInput}
                independendField={independendField}
                setIndependendField={setIndependendField}
                appendToken={appendToken}
                replaceTokenAt={replaceTokenAt}
                removeTokenAt={removeTokenAt}
                hideTokenSelectors={hideTokenSelectors}
              />
            </div>

            <EstimatedValue
              dollarValue={estimatedValue}
              isLoading={isAnyPriceLoading}
            />

            <div className="px-4 py-2 text-sm font-medium text-blue dark:text-skyblue bg-[#4217FF14] dark:bg-[#3DB1FF14] rounded-lg">
              💡 For high value deposits, it might be more profitable if you
              deposit with multiple assets.
            </div>
          </div>
        )
      }}
    </PoolFinder>
  )
}

export type AddLiquidityWidgetProps = {
  chainId: SushiSwapV2ChainId
  pool: unknown
  poolState: SushiSwapV2PoolState
  title: React.ReactNode

  tokens: Type[]
  setTokens: React.Dispatch<React.SetStateAction<Type[]>>
  maxTokens?: number

  inputs: Record<string, string>
  updateInput: (tokenId: string, value: string) => void
  independendField: number
  setIndependendField: React.Dispatch<React.SetStateAction<number>>

  appendToken?: (token?: Type) => void
  replaceTokenAt?: (index: number, token?: Type) => void
  removeTokenAt?: (index: number) => void

  hideTokenSelectors?: boolean
}

const AddLiquidityWidget: FC<AddLiquidityWidgetProps> = ({
  chainId,
  pool,
  poolState,
  title,
  tokens,
  setTokens,
  maxTokens = 5,
  inputs,
  updateInput,
  hideTokenSelectors,
}) => {
  const [slippagePercent] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )

  const token0 = tokens[0]
  const token1 = tokens[1]

  const input0 = token0 ? (inputs[token0.id] ?? '') : ''
  const input1 = token1 ? (inputs[token1.id] ?? '') : ''

  const parsedInput0 = useMemo(() => {
    if (!token0) return undefined
    return tryParseAmount(input0, token0) || Amount.fromRawAmount(token0, 0)
  }, [token0, input0])

  const parsedInput1 = useMemo(() => {
    if (!token1) return undefined
    return tryParseAmount(input1, token1) || Amount.fromRawAmount(token1, 0)
  }, [token1, input1])

  // const appendToken = useCallback(
  //   (t?: Type) => {
  //     if (!t) return
  //     setTokens((prev) => {
  //       if (prev.length >= maxTokens) return prev
  //       if (prev.some((x) => x.id === t.id)) return prev
  //       return [...prev, t]
  //     })
  //   },
  //   [maxTokens, setTokens],
  // )

  const replaceTokenAt = useCallback(
    (index: number, t?: Type) => {
      if (!t) return
      setTokens((prev) => {
        if (index < 0 || index >= prev.length) return prev
        if (prev.some((x, i) => i !== index && x.id === t.id)) return prev
        const next = [...prev]
        const old = next[index]
        next[index] = t
        if (old?.id && old.id !== t.id) {
          updateInput(old.id, '')
        }
        return next
      })
      updateInput(t.id, '')
    },
    [setTokens, updateInput],
  )

  // const removeTokenAt = useCallback(
  //   (index: number) => {
  //     setTokens((prev) => {
  //       if (index < 0 || index >= prev.length) return prev
  //       const removed = prev[index]
  //       const next = prev.toSpliced(index, 1)
  //       if (removed?.id) updateInput(removed.id, '')
  //       if (index === 0 || index === 1) setIndependendField(null)
  //       return next
  //     })
  //   },
  //   [setTokens, updateInput, setIndependendField],
  // )

  // const getTokenKey = (t?: Type): string => {
  //   if (!t) return ''
  //   return t.isNative
  //     ? `native:${t.chainId}`
  //     : `${t.chainId}:${t.wrapped.address.toLowerCase()}`
  // }

  // const currencies: Type[] = useMemo(() => {
  //   console.log(
  //     '[AddLiquidityBlade] Building currencies array for Blade add-liquidity',
  //   )
  //   const tokens = [
  //     new Token({
  //       chainId,
  //       address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  //       decimals: 18,
  //       symbol: 'WETH',
  //       name: 'Wrapped Ether',
  //       logoUrl:
  //         'https://assets.coingecko.com/coins/images/2518/large/weth.png',
  //       approved: true,
  //     }),
  //     new Token({
  //       chainId,
  //       address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  //       decimals: 18,
  //       symbol: 'MATIC',
  //       name: 'Polygon',
  //       logoUrl:
  //         'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
  //       approved: true,
  //     }),
  //     new Token({
  //       chainId,
  //       address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  //       decimals: 6,
  //       symbol: 'USDT',
  //       name: 'Tether USD',
  //       logoUrl:
  //         'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
  //       approved: true,
  //     }),
  //     new Token({
  //       chainId,
  //       address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  //       decimals: 6,
  //       symbol: 'USDC',
  //       name: 'USD Coin',
  //       logoUrl:
  //         'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  //       approved: true,
  //     }),
  //     new Token({
  //       chainId,
  //       address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  //       decimals: 18,
  //       symbol: 'DAI',
  //       name: 'Dai Stablecoin',
  //       logoUrl:
  //         'https://assets.coingecko.com/coins/images/9956/large/4943.png',
  //       approved: true,
  //     }),
  //   ]
  //   console.log(
  //     '[AddLiquidityBlade] Currencies array built:',
  //     tokens.map((t) => t.symbol).join(', '),
  //   )
  //   return tokens
  // }, [chainId])

  //// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // const tokenOptionsByIndex = useMemo(() => {
  //   const selectedKeys = new Set(tokens.map(getTokenKey))

  //   return tokens.map((_) => {
  //     return Object.fromEntries(
  //       Object.entries(currencies).filter(
  //         ([_, token]) => !selectedKeys.has(getTokenKey(token)),
  //       ),
  //     )
  //   })
  // }, [tokens, currencies])

  const renderRow = (t: Type, i: number) => {
    const value = inputs[t.id] ?? ''
    const isPair0 = i === 0
    const isPair1 = i === 1

    const onChange = isPair0
      ? (v: string) => updateInput(t.id, v)
      : isPair1
        ? (v: string) => updateInput(t.id, v)
        : (v: string) => updateInput(t.id, v)

    const onSelect = hideTokenSelectors
      ? undefined
      : (next?: Type) => replaceTokenAt(i, next)

    return (
      <>
        <div key={t.id} className="flex gap-2 items-start">
          {/* {i > 0 && (
            <button
              type="button"
              onClick={() => removeTokenAt(i)}
              className="px-3 w-9 bg-gray-100 rounded-full aspect-1 shrink-0 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800"
              aria-label="Remove token"
            >
              ✕
            </button>
          )} */}
          <Web3Input.Currency
            id={`add-liquidity-token-${i}`}
            type="INPUT"
            className="flex-1 p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
            // currencies={tokenOptionsByIndex[i]}
            chainId={chainId}
            value={value}
            onChange={onChange}
            onSelect={onSelect}
            currency={t}
            hidePercentageInputs
            disabled={
              !t ||
              poolState === SushiSwapV2PoolState.LOADING ||
              poolState === SushiSwapV2PoolState.INVALID
            }
            loading={poolState === SushiSwapV2PoolState.LOADING}
            allowNative={isWNativeSupported(chainId)}
          />
        </div>
        {i < 4 && tokens[i + 1] && (
          <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
            <button
              type="button"
              className="z-10 p-2 bg-gray-100 rounded-full border dark:bg-slate-900 border-slate-50 dark:border-slate-800"
            >
              <PlusIcon
                strokeWidth={3}
                className="w-4 h-4 dark:text-skyblue text-blue"
              />
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Dynamic token rows */}
      <div className="flex flex-col gap-3">
        {tokens.map((t, i) => renderRow(t, i))}
      </div>
      {tokens.length < maxTokens && (
        <button
          type="button"
          className="flex gap-1 items-center pt-3 mx-auto"
          onClick={() => {
            setTokens([
              ...tokens,
              defaultCurrency[chainId as keyof typeof defaultCurrency],
            ])
          }}
        >
          <PlusIcon
            strokeWidth={3}
            className="w-4 h-4 dark:text-skyblue text-blue"
          />
          <span className="font-semibold text-blue dark:text-skyblue">
            Deposit Multiple Assets
          </span>
        </button>
      )}
      {/* Checker flow remains pair-based for V2 */}
      <CheckerProvider>
        <Checker.Connect fullWidth>
          <Checker.Network fullWidth chainId={chainId}>
            <Checker.Amounts
              fullWidth
              chainId={chainId}
              amounts={useMemo(
                () => [parsedInput0, parsedInput1],
                [parsedInput0, parsedInput1],
              )}
            >
              <Checker.Slippage
                fullWidth
                slippageTolerance={slippagePercent}
                text="Continue With High Slippage"
              >
                {/* @ts-expect-error - ok until we have a blade pool type */}
                {(!pool || isSushiSwapV2Pool(pool)) &&
                  isSushiSwapV2ChainId(chainId) && (
                    <Checker.ApproveERC20
                      id="approve-token-0"
                      className="whitespace-nowrap"
                      fullWidth
                      amount={parsedInput0}
                      contract={SUSHISWAP_V2_ROUTER_ADDRESS[chainId]}
                    >
                      <Checker.ApproveERC20
                        id="approve-token-1"
                        className="whitespace-nowrap"
                        fullWidth
                        amount={parsedInput1}
                        contract={SUSHISWAP_V2_ROUTER_ADDRESS[chainId]}
                      >
                        <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                          <AddSectionReviewModalLegacy
                            // @ts-expect-error - ok until we have a blade pool type
                            poolAddress={pool?.liquidityToken.address}
                            poolState={poolState as SushiSwapV2PoolState}
                            chainId={chainId}
                            token0={token0}
                            token1={token1}
                            input0={parsedInput0}
                            input1={parsedInput1}
                            onSuccess={() => {
                              if (token0) updateInput(token0.id, '')
                              if (token1) updateInput(token1.id, '')
                            }}
                          >
                            <Button
                              size="xl"
                              fullWidth
                              className="!mt-10"
                              testId="add-liquidity"
                              disabled={!token0 || !token1}
                            >
                              {title}
                            </Button>
                          </AddSectionReviewModalLegacy>
                        </Checker.Success>
                      </Checker.ApproveERC20>
                    </Checker.ApproveERC20>
                  )}
              </Checker.Slippage>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </CheckerProvider>
    </div>
  )
}

export default AddLiquidityWidget
