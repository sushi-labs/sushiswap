'use client'

import { type ReactElement, useMemo, useState } from 'react'
import { Price } from 'sushi'
import type { StellarToken } from 'sushi/stellar'
import { useGetPool, usePoolInfo } from '~stellar/_common/lib/hooks'
import { useCalculateDependentAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-dependent-amount'
import { usePoolInitialized } from '~stellar/_common/lib/hooks/pool/use-pool-initialized'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import {
  calculatePriceFromSqrtPrice,
  encodePriceSqrt,
  isAddressLower,
} from '~stellar/_common/lib/soroban'
import { StellarAddPoolSubmitWidget } from './stellar-add-pool-submit-widget'
import { StellarPoolLiquidityWidget } from './stellar-pool-liquidity-widget'
import { StellarSelectPricesWidget } from './stellar-select-prices-widget'

interface StellarAddPoolPositionWidgetProps {
  token0: StellarToken | undefined
  token1: StellarToken | undefined
  selectedFee: number
}

export function StellarAddPoolPositionWidget({
  token0,
  token1,
  selectedFee,
}: StellarAddPoolPositionWidgetProps): ReactElement {
  const [token0Amount, setToken0Amount] = useState('')
  const [startPrice, setStartPrice] = useState('')
  const [priceInverted, setPriceInverted] = useState(false)

  const { data: existingPoolAddress } = useGetPool(
    token0 && token1
      ? {
          tokenA: token0.address,
          tokenB: token1.address,
          fee: selectedFee,
        }
      : null,
  )
  const { data: poolInitialized } = usePoolInitialized(existingPoolAddress)
  const { data: poolInfo } = usePoolInfo(existingPoolAddress ?? null)

  const poolOrderInverted = useMemo(() => {
    if (!token0 || !token1) {
      return false
    }

    if (poolInfo) {
      return poolInfo.token0.address !== token0.address
    }

    return !isAddressLower(token0.address, token1.address)
  }, [poolInfo, token0, token1])

  const [orderedToken0, orderedToken1] = poolOrderInverted
    ? [token1, token0]
    : [token0, token1]

  const canonicalStartPrice = useMemo(() => {
    if (!orderedToken0 || !orderedToken1) {
      return undefined
    }

    const parsedPrice = Price.tryFromHuman(
      priceInverted ? orderedToken1 : orderedToken0,
      priceInverted ? orderedToken0 : orderedToken1,
      startPrice,
    )

    return priceInverted ? parsedPrice?.invert() : parsedPrice
  }, [orderedToken0, orderedToken1, priceInverted, startPrice])

  const rawStartPrice = useMemo(() => {
    if (!canonicalStartPrice) {
      return undefined
    }

    const numericPrice = canonicalStartPrice.asFraction.toNumber()

    return Number.isFinite(numericPrice) && numericPrice > 0
      ? numericPrice
      : undefined
  }, [canonicalStartPrice])

  const initSqrtPriceX96 = useMemo(() => {
    if (!canonicalStartPrice) {
      return undefined
    }

    return encodePriceSqrt(
      canonicalStartPrice.numerator,
      canonicalStartPrice.denominator,
    )
  }, [canonicalStartPrice])

  const currentPrice = useMemo(() => {
    if (existingPoolAddress && poolInitialized === true) {
      return poolInfo ? calculatePriceFromSqrtPrice(poolInfo.sqrtPriceX96) : 1
    }

    return rawStartPrice ?? 1
  }, [existingPoolAddress, poolInfo, poolInitialized, rawStartPrice])

  const tickRange = useTickRangeSelector(selectedFee, currentPrice)
  const pairedAmount = useCalculateDependentAmount(
    existingPoolAddress || null,
    token0Amount,
    'token0',
    tickRange.tickLower,
    tickRange.tickUpper,
    orderedToken0,
    orderedToken1,
    poolInitialized === true ? undefined : initSqrtPriceX96,
  ).data
  const token1Amount = token0Amount ? (pairedAmount?.amount ?? '') : ''

  function handlePriceInvertedChange(inverted: boolean): void {
    if (inverted === priceInverted) {
      return
    }

    if (orderedToken0 && orderedToken1) {
      const parsedPrice = Price.tryFromHuman(
        priceInverted ? orderedToken1 : orderedToken0,
        priceInverted ? orderedToken0 : orderedToken1,
        startPrice,
      )
      const invertedPrice = parsedPrice?.invert()

      if (invertedPrice) {
        setStartPrice(invertedPrice.toString({ maxFixed: 18 }))
      }
    }

    setPriceInverted(inverted)
  }

  return (
    <>
      <StellarSelectPricesWidget
        token0={orderedToken0}
        token1={orderedToken1}
        noLiquidity={!existingPoolAddress || poolInitialized === false}
        startPrice={startPrice}
        inverted={priceInverted}
        tickRange={tickRange}
        onStartPriceChange={setStartPrice}
        onInvertedChange={handlePriceInvertedChange}
      />
      <StellarPoolLiquidityWidget
        token0={orderedToken0}
        token1={orderedToken1}
        token0Amount={token0Amount}
        token1Amount={token1Amount}
        existingPoolAddress={existingPoolAddress}
        poolInitialized={poolInitialized}
        tickLower={tickRange.tickLower}
        tickUpper={tickRange.tickUpper}
        pairedAmount={pairedAmount}
        onToken0AmountChange={setToken0Amount}
      >
        <StellarAddPoolSubmitWidget
          orderedToken0={orderedToken0}
          orderedToken1={orderedToken1}
          selectedFee={selectedFee}
          existingPoolAddress={existingPoolAddress}
          poolInitialized={poolInitialized}
          orderedToken0Amount={token0Amount}
          orderedToken1Amount={token1Amount}
          pairedAmountStatus={pairedAmount?.status ?? 'idle'}
          initSqrtPriceX96={initSqrtPriceX96}
          isTickRangeValid={tickRange.isTickRangeValid}
          tickLower={tickRange.tickLower}
          tickUpper={tickRange.tickUpper}
          ticksAligned={tickRange.ticksAligned}
          onLiquidityAdded={() => setToken0Amount('')}
        />
      </StellarPoolLiquidityWidget>
    </>
  )
}
