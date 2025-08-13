'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Button, classNames } from '@sushiswap/ui'
import {
  type FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { APPROVE_TAG_ADD_BLADE } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { isWNativeSupported } from 'sushi/config'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { isBladeChainId } from 'sushi/config'
import {
  Amount,
  Token,
  type Type,
  tryParseAmount,
  unwrapToken,
} from 'sushi/currency'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useCurrentChainId } from '../../../lib/hooks/useCurrentChainId'
import { EstimatedValue } from './estimated-value'

export const AddLiquidityBlade = ({ bladePool }: { bladePool: BladePool }) => {
  const { chainId } = useCurrentChainId() as { chainId: SushiSwapV2ChainId }

  const _token0 = useMemo(() => {
    const token = bladePool.tokens[0]
    return unwrapToken(
      new Token({
        chainId: token.chainId,
        address: token?.address,
        decimals: token?.decimals,
        symbol: token.symbol,
        name: token?.name,
      }),
    )
  }, [bladePool])

  const [tokens, setTokens] = useState<Type[]>([])
  const maxTokens = bladePool?.tokens.length

  useEffect(() => {
    if (tokens.length === 0) {
      setTokens(() => [_token0])
    }
  }, [tokens, _token0])

  const appendToken = useCallback(
    (token?: Type) => {
      if (!token) return
      setTokens((prev) => {
        if (prev.length >= maxTokens) return prev
        if (prev.some((t) => t.id === token.id)) return prev
        return [...prev, token]
      })
    },
    [maxTokens],
  )

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

  const { data: priceMap, isLoading: isLoadingPrices } = usePrices({
    chainId: bladePool.tokens?.[0]?.chainId,
    enabled: !!bladePool.tokens?.[0],
  })

  const estimatedValue = useMemo(() => {
    if (!tokens.length || !priceMap) return '0.00'
    const total = tokens.reduce((sum, token) => {
      const raw = inputs[token.id]
      const amount = tryParseAmount(raw ?? '', token)?.quotient
      if (!amount) return sum
      const price = priceMap.get(token.wrapped.address) ?? 0
      const value = (price * Number(amount)) / 10 ** token.decimals
      return sum + (Number.isNaN(value) ? 0 : value)
    }, 0)
    return total.toFixed(2)
  }, [tokens, inputs, priceMap])

  return (
    <div className={classNames('flex flex-col gap-4 mt-4')}>
      <div className="flex flex-col gap-4">
        <AddLiquidityWidget
          pool={bladePool}
          chainId={chainId}
          tokens={tokens}
          setTokens={setTokens}
          maxTokens={maxTokens}
          inputs={inputs}
          updateInput={updateInput}
          independendField={independendField}
          setIndependendField={setIndependendField}
          appendToken={appendToken}
          replaceTokenAt={replaceTokenAt}
          removeTokenAt={removeTokenAt}
        />
      </div>

      <EstimatedValue
        dollarValue={estimatedValue}
        isLoading={isLoadingPrices}
      />

      <div className="px-4 py-2 text-sm font-medium text-blue dark:text-skyblue bg-[#4217FF14] dark:bg-[#3DB1FF14] rounded-lg">
        💡 For high value deposits, it might be more profitable if you deposit
        with multiple assets.
      </div>
    </div>
  )
}

export type AddLiquidityWidgetProps = {
  chainId: SushiSwapV2ChainId
  pool: BladePool

  tokens: Type[]
  setTokens: React.Dispatch<React.SetStateAction<Type[]>>
  maxTokens: number

  inputs: Record<string, string>
  updateInput: (tokenId: string, value: string) => void
  independendField: number
  setIndependendField: React.Dispatch<React.SetStateAction<number>>

  appendToken?: (token?: Type) => void
  replaceTokenAt?: (index: number, token?: Type) => void
  removeTokenAt: (index: number) => void
}

const AddLiquidityWidget: FC<AddLiquidityWidgetProps> = ({
  chainId,
  pool,
  tokens,
  setTokens,
  maxTokens,
  inputs,
  updateInput,
  removeTokenAt,
}) => {
  const [slippagePercent] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )

  const parsedInputs = useMemo(() => {
    return tokens.map((token) => {
      const value = inputs[token.id] ?? ''
      return tryParseAmount(value, token) || Amount.fromRawAmount(token, 0)
    })
  }, [tokens, inputs])

  const allTokens = useMemo(() => {
    return pool.tokens.map((token) =>
      unwrapToken(
        new Token({
          chainId: token.chainId,
          address: token?.address,
          decimals: token?.decimals,
          symbol: token.symbol,
          name: token?.name,
        }),
      ),
    )
  }, [pool])

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

  const currencies = useMemo(() => {
    return allTokens
      .filter((i) => !tokens.some((x) => x.id === i.id))
      .reduce<Record<string, Type>>((acc, cur) => {
        acc[cur.wrapped.address] = cur
        return acc
      }, {})
  }, [allTokens, tokens])

  const renderRow = (t: Type, i: number) => {
    const value = inputs[t.id] ?? ''
    const isPair0 = i === 0
    const isPair1 = i === 1

    const onChange = isPair0
      ? (v: string) => updateInput(t.id, v)
      : isPair1
        ? (v: string) => updateInput(t.id, v)
        : (v: string) => updateInput(t.id, v)

    const onSelect = (next?: Type) => replaceTokenAt(i, next)

    return (
      <Fragment key={`${t.id}-${i}`}>
        <div className="flex gap-2 items-start relative">
          {i > 0 && (
            <button
              type="button"
              onClick={() => removeTokenAt(i)}
              className="px-3 w-9 bg-gray-100 rounded-full z-10 aspect-1 shrink-0 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 absolute top-1 left-1"
              aria-label="Remove token"
            >
              ✕
            </button>
          )}
          <Web3Input.Currency
            id={`add-liquidity-token-${i}`}
            type="INPUT"
            className="flex-1 p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
            currencies={currencies}
            chainId={chainId}
            value={value}
            onChange={onChange}
            onSelect={
              Object.keys(currencies).length === 0 ? undefined : onSelect
            }
            currency={t}
            hidePercentageInputs
            disabled={!t}
            allowNative={isWNativeSupported(chainId)}
          />
        </div>
        {i < maxTokens - 1 && tokens[i + 1] && (
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
      </Fragment>
    )
  }

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Dynamic token rows */}
      <div className="flex flex-col gap-3">
        {tokens.map((t, i) => renderRow(t, i))}
      </div>
      {tokens.length < maxTokens && (
        <button
          type="button"
          className="flex gap-1 items-center pt-3 mx-auto"
          onClick={() => {
            const newToken = allTokens.find(
              (t) => !tokens.some((x) => x.id === t.id),
            )!
            updateInput(newToken.id, '')
            setTokens([...tokens, newToken])
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
      <CheckerProvider>
        <Checker.Connect fullWidth>
          <Checker.Network fullWidth chainId={chainId}>
            <Checker.Amounts
              fullWidth
              chainId={chainId}
              amounts={useMemo(() => parsedInputs, [parsedInputs])}
            >
              <Checker.Slippage
                fullWidth
                slippageTolerance={slippagePercent}
                text="Continue With High Slippage"
              >
                {(!pool || isBladeChainId(pool.chainId)) &&
                  tokens.map((token, i) => {
                    const value = inputs[token.id] ?? ''
                    const parsedInput =
                      tryParseAmount(value, token) ||
                      Amount.fromRawAmount(token, 0)
                    return (
                      <Checker.ApproveERC20
                        key={`${token.wrapped.address}-${i}-approve`}
                        id="approve-token-1"
                        className="whitespace-nowrap"
                        fullWidth
                        amount={parsedInput}
                        contract={pool.address}
                      >
                        <Checker.Success tag={APPROVE_TAG_ADD_BLADE}>
                          {/* <AddSectionReviewModalLegacy
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
                          > */}
                          {i === tokens.length - 1 ? ( // Only show button on last token row}
                            <Button
                              size="xl"
                              fullWidth
                              testId="add-liquidity"
                              // disabled={!token0 || !token1}
                            >
                              Deposit
                            </Button>
                          ) : null}
                          {/* </AddSectionReviewModalLegacy> */}
                        </Checker.Success>
                      </Checker.ApproveERC20>
                    )
                  })}
              </Checker.Slippage>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </CheckerProvider>
    </div>
  )
}

export default AddLiquidityWidget
