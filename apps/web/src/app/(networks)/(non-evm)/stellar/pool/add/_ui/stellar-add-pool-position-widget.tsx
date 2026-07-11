'use client'

import { type ReactElement, useEffect, useMemo, useState } from 'react'
import type { StellarToken } from 'sushi/stellar'
import { useGetPool, usePoolInfo } from '~stellar/_common/lib/hooks'
import { useCalculatePairedAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-paired-amount'
import { usePoolInitialized } from '~stellar/_common/lib/hooks/pool/use-pool-initialized'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import {
  calculatePriceFromSqrtPrice,
  encodePriceSqrt,
  isAddressLower,
} from '~stellar/_common/lib/soroban'
import { StellarAddPoolSubmitWidget } from './stellar-add-pool-submit-widget'
import { StellarPoolLiquidityWidget } from './stellar-pool-liquidity-widget'

interface StellarAddPoolPositionWidgetProps {
  token0: StellarToken | undefined
  token1: StellarToken | undefined
  selectedFee: number
}

interface LiquidityFormState {
  selectionId: string
  orderedToken0Amount: string
  manualOrderedToken1Amount: string
}

export function StellarAddPoolPositionWidget({
  token0,
  token1,
  selectedFee,
}: StellarAddPoolPositionWidgetProps): ReactElement {
  const selectionId = `${token0?.address ?? ''}:${token1?.address ?? ''}:${selectedFee}`
  const [liquidityForm, setLiquidityForm] = useState<LiquidityFormState>(
    () => ({
      selectionId,
      orderedToken0Amount: '',
      manualOrderedToken1Amount: '',
    }),
  )
  const orderedToken0Amount =
    liquidityForm.selectionId === selectionId
      ? liquidityForm.orderedToken0Amount
      : ''
  const manualOrderedToken1Amount =
    liquidityForm.selectionId === selectionId
      ? liquidityForm.manualOrderedToken1Amount
      : ''

  useEffect(() => {
    setLiquidityForm((previous) => {
      if (previous.selectionId === selectionId) {
        return previous
      }

      return {
        selectionId,
        orderedToken0Amount: '',
        manualOrderedToken1Amount: '',
      }
    })
  }, [selectionId])

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

  const reversedPoolTokenOrder = useMemo(() => {
    if (!token0 || !token1) {
      return false
    }

    if (poolInfo) {
      return poolInfo.token0.address !== token0.address
    }

    // Stellar pool tokens are ordered by decoded bytes, not string comparison.
    return !isAddressLower(token0.address, token1.address)
  }, [poolInfo, token0, token1])

  const [orderedToken0, orderedToken1] = reversedPoolTokenOrder
    ? [token1, token0]
    : [token0, token1]

  const currentPrice = poolInfo
    ? calculatePriceFromSqrtPrice(poolInfo.sqrtPriceX96)
    : undefined

  const initSqrtPriceX96 = useMemo(() => {
    if (!orderedToken0 || !orderedToken1) {
      return undefined
    }

    const orderedToken0AmountRaw = BigInt(
      Math.floor(Number(orderedToken0Amount) * 10 ** orderedToken0.decimals),
    )
    const orderedToken1AmountRaw = BigInt(
      Math.floor(
        Number(manualOrderedToken1Amount) * 10 ** orderedToken1.decimals,
      ),
    )

    if (orderedToken0AmountRaw === 0n || orderedToken1AmountRaw === 0n) {
      return undefined
    }

    return encodePriceSqrt(orderedToken1AmountRaw, orderedToken0AmountRaw)
  }, [
    manualOrderedToken1Amount,
    orderedToken0,
    orderedToken0Amount,
    orderedToken1,
  ])

  const initPrice =
    initSqrtPriceX96 !== undefined
      ? calculatePriceFromSqrtPrice(initSqrtPriceX96)
      : undefined

  const tickRangeSelectorState = useTickRangeSelector(
    selectedFee,
    (existingPoolAddress && poolInitialized === true
      ? currentPrice
      : initPrice) ?? 1,
  )
  const { tickLower, tickUpper, isTickRangeValid, ticksAligned } =
    tickRangeSelectorState

  const { data: pairedAmountData } = useCalculatePairedAmount(
    existingPoolAddress || null,
    orderedToken0Amount,
    tickLower,
    tickUpper,
    orderedToken0?.decimals ?? 7,
    orderedToken0?.symbol,
  )

  const orderedToken1Amount = useMemo(() => {
    if (manualOrderedToken1Amount) {
      return manualOrderedToken1Amount
    }

    if (pairedAmountData && orderedToken0Amount) {
      return pairedAmountData.token1Amount
    }

    return ''
  }, [manualOrderedToken1Amount, orderedToken0Amount, pairedAmountData])

  function setOrderedToken0Amount(value: string): void {
    setLiquidityForm((previous) => {
      const previousManualOrderedToken1Amount =
        previous.selectionId === selectionId
          ? previous.manualOrderedToken1Amount
          : ''

      return {
        selectionId,
        orderedToken0Amount: value,
        manualOrderedToken1Amount: previousManualOrderedToken1Amount,
      }
    })
  }

  function setManualOrderedToken1Amount(value: string): void {
    setLiquidityForm((previous) => {
      const previousOrderedToken0Amount =
        previous.selectionId === selectionId ? previous.orderedToken0Amount : ''

      return {
        selectionId,
        orderedToken0Amount: previousOrderedToken0Amount,
        manualOrderedToken1Amount: value,
      }
    })
  }

  return (
    <>
      <StellarPoolLiquidityWidget
        orderedToken0={orderedToken0}
        orderedToken1={orderedToken1}
        orderedToken0Amount={orderedToken0Amount}
        orderedToken1Amount={orderedToken1Amount}
        setOrderedToken0Amount={setOrderedToken0Amount}
        setManualOrderedToken1Amount={setManualOrderedToken1Amount}
        existingPoolAddress={existingPoolAddress}
        poolInitialized={poolInitialized}
        poolInfo={poolInfo}
        tickRangeSelectorState={tickRangeSelectorState}
        pairedAmountData={pairedAmountData}
      />
      <StellarAddPoolSubmitWidget
        orderedToken0={orderedToken0}
        orderedToken1={orderedToken1}
        selectedFee={selectedFee}
        existingPoolAddress={existingPoolAddress}
        poolInitialized={poolInitialized}
        orderedToken0Amount={orderedToken0Amount}
        orderedToken1Amount={orderedToken1Amount}
        pairedAmountStatus={pairedAmountData?.status ?? 'idle'}
        initSqrtPriceX96={initSqrtPriceX96}
        isTickRangeValid={isTickRangeValid}
        tickLower={tickLower}
        tickUpper={tickUpper}
        ticksAligned={ticksAligned}
      />
    </>
  )
}
