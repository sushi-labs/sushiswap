'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Amount, type ID } from 'sushi'
import {
  type BladeChainId,
  type EvmAddress,
  type EvmCurrency,
  EvmToken,
  unwrapEvmToken,
} from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { AddLiquidityWidgetBlade } from './add-liquidity-widget-blade'
import { EstimatedValue } from './estimated-value'

export type IDExtended = ID | `${string}:NATIVE`

export const AddLiquidityBlade = ({ bladePool }: { bladePool: BladePool }) => {
  const chainId = bladePool.chainId as BladeChainId
  const [inputs, setInputs] = useState<Record<IDExtended, string>>({})
  const [tokens, setTokens] = useState<EvmCurrency[]>([])

  const _token0 = useMemo(() => {
    const token = bladePool.tokens[0]
    return unwrapEvmToken(
      new EvmToken({
        chainId: chainId,
        address: token.token.address as EvmAddress,
        decimals: token.token.decimals,
        symbol: token.token.symbol,
        name: token.token.name,
      }),
    )
  }, [bladePool, chainId])
  const maxTokens = bladePool?.tokens.length

  useEffect(() => {
    if (tokens.length === 0) {
      setTokens(() => [_token0])
    }
  }, [tokens, _token0])

  const replaceTokenAt = useCallback(
    (index: number, token?: EvmCurrency) => {
      if (!token) return
      const currentTokenAtIndex = tokens[index]
      setTokens((prev) => {
        if (index < 0 || index >= prev.length) return prev
        if (prev.some((t, i) => i !== index && t.id === token.id)) return prev
        const next = [...prev]
        next[index] = token
        return next
      })
      setInputs((prev) => {
        const { [currentTokenAtIndex.id]: _omitted, ...rest } = prev
        return rest
      })
    },
    [tokens],
  )

  const removeTokenAt = useCallback(
    (index: number) => {
      setTokens((prev) => {
        if (index < 0 || index >= prev.length) return prev
        const next = prev.toSpliced(index, 1)
        return next
      })
      const foundToken = tokens[index]
      if (foundToken) {
        updateInput(foundToken.id, '', true)
      }
    },
    [tokens],
  )

  const updateInput = useCallback(
    (tokenId: IDExtended, value: string, removeToken?: boolean) => {
      if (removeToken) {
        setTokens((prev) => prev.filter((t) => t.id !== tokenId))
        //remove from inputs
        setInputs((prev) => {
          const { [tokenId]: _omitted, ...rest } = prev
          return rest
        })
        return
      }
      setInputs((prev) => ({ ...prev, [tokenId]: value }))
    },
    [],
  )

  const [independendField, setIndependendField] = useState<number>(0)

  const { data: priceMap, isLoading: isLoadingPrices } = usePrices({
    chainId: bladePool.chainId,
    enabled: !!bladePool,
  })

  const estimatedValue = useMemo(() => {
    if (!tokens.length || !priceMap) return '0.00'
    const total = tokens.reduce((sum, token) => {
      const raw = inputs[token.id]
      const amount = Amount.tryFromHuman(token, raw ?? '')?.amount
      if (!amount) return sum
      const price = priceMap.get(token.wrap().address) ?? 0
      const value = (price * Number(amount)) / 10 ** token.decimals
      return sum + (Number.isNaN(value) ? 0 : value)
    }, 0)
    return total.toFixed(2)
  }, [tokens, inputs, priceMap])

  return (
    <div className={'flex flex-col gap-4 mt-4'}>
      <div className="flex flex-col gap-4">
        <AddLiquidityWidgetBlade
          pool={bladePool}
          chainId={chainId}
          tokens={tokens}
          setTokens={setTokens}
          maxTokens={maxTokens}
          inputs={inputs}
          updateInput={updateInput}
          independendField={independendField}
          setIndependendField={setIndependendField}
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
