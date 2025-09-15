import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import { Card, CardGroup, CardLabel } from '@sushiswap/ui'
import { Decimal } from 'decimal.js-light'
import { useEffect, useMemo } from 'react'
import { formatNumber } from 'sushi'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import { formatToMaxDecimals } from '~kadena/_common/lib/utils/formatters'
import { usePoolState } from '../../../../pool/pool-provider'
import { LiquidityItem } from '../PoolDetails/LiquidityItem'
import { useRemoveLiqDispatch, useRemoveLiqState } from './pool-remove-provider'

export const MinimumReceive = () => {
  const { percentage, lpBalance } = useRemoveLiqState()
  const { setLPToRemove, setMinAmountToken0, setMinAmountToken1 } =
    useRemoveLiqDispatch()
  const { token0, token1, reserve0, reserve1, totalSupplyLP } = usePoolState()
  const { data: priceUsd0, isLoading: isLoadingPrice0 } = useTokenPrice({
    token: token0,
  })
  const { data: priceUsd1, isLoading: isLoadingPrice1 } = useTokenPrice({
    token: token1,
  })

  const token0Price = priceUsd0 ?? 0
  const token1Price = priceUsd1 ?? 0

  const isLoading = isLoadingPrice0 || isLoadingPrice1

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.RemoveLiquidity,
  )
  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100

  const lpTokenAmountBeingRemoved: number = useMemo(() => {
    if (!lpBalance) return 0
    const _percentage = new Decimal(percentage).div(100)
    const amount = _percentage.mul(lpBalance)

    return Number(amount.toFixed(12))
  }, [lpBalance, percentage])

  useEffect(() => {
    if (lpTokenAmountBeingRemoved) {
      setLPToRemove(lpTokenAmountBeingRemoved)
    }
  }, [lpTokenAmountBeingRemoved, setLPToRemove])

  const amountToken0: number = useMemo(() => {
    if (!lpTokenAmountBeingRemoved || !reserve0) return 0
    const fraction = new Decimal(lpTokenAmountBeingRemoved).div(totalSupplyLP)
    return fraction.mul(reserve0).toNumber()
  }, [lpTokenAmountBeingRemoved, reserve0, totalSupplyLP])

  const amountToken1: number = useMemo(() => {
    if (!lpTokenAmountBeingRemoved || !reserve1) return 0
    const fraction = new Decimal(lpTokenAmountBeingRemoved).div(totalSupplyLP)
    return fraction.mul(reserve1).toNumber()
  }, [lpTokenAmountBeingRemoved, reserve1, totalSupplyLP])

  const minAmountToken0: number = useMemo(() => {
    if (!amountToken0) return 0
    const output = new Decimal(amountToken0).mul(1 - slippage)
    return output.toNumber()
  }, [amountToken0, slippage])

  useEffect(() => {
    if (minAmountToken0 && token0) {
      setMinAmountToken0(
        new Decimal(
          formatToMaxDecimals(minAmountToken0, token0?.decimals),
        ).toNumber(),
      )
    }
  }, [minAmountToken0, setMinAmountToken0, token0])

  const minAmountToken1: number = useMemo(() => {
    if (!amountToken1) return 0
    const output = new Decimal(amountToken1).mul(1 - slippage)
    return output.toNumber()
  }, [amountToken1, slippage])

  useEffect(() => {
    if (minAmountToken1 && token1) {
      setMinAmountToken1(
        new Decimal(
          formatToMaxDecimals(minAmountToken1, token1?.decimals),
        ).toNumber(),
      )
    }
  }, [minAmountToken1, setMinAmountToken1, token1])

  return (
    <Card variant="outline" className="p-6">
      <CardGroup>
        <CardLabel>You&apos;ll receive at least:</CardLabel>
        <LiquidityItem
          isLoading={isLoading}
          token={token0}
          amount={formatNumber(minAmountToken0)}
          usdAmount={String(token0Price * minAmountToken0)}
        />
        <LiquidityItem
          isLoading={isLoading}
          token={token1}
          amount={formatNumber(minAmountToken1)}
          usdAmount={String(token1Price * minAmountToken1)}
        />
      </CardGroup>
    </Card>
  )
}
