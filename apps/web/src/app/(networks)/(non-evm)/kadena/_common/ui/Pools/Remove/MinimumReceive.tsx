import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import { Card, CardGroup, CardLabel } from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import { Amount, formatNumber } from 'sushi'
import { parseUnits } from 'viem'
import { KVM_PAIR_TOKEN } from '~kadena/_common/constants/pair'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
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
    const _percentage = (percentage / 100).toFixed(2)
    const parsedBal = parseUnits(lpBalance.toString(), KVM_PAIR_TOKEN.decimals)

    const amount = new Amount(KVM_PAIR_TOKEN, parsedBal).mulHuman(_percentage)

    return Number.parseFloat(amount.toString({ fixed: 12 }))
  }, [lpBalance, percentage])

  useEffect(() => {
    if (lpTokenAmountBeingRemoved) {
      setLPToRemove(lpTokenAmountBeingRemoved)
    }
  }, [lpTokenAmountBeingRemoved, setLPToRemove])

  const amountToken0: number = useMemo(() => {
    if (!lpTokenAmountBeingRemoved || !reserve0 || !token0) return 0
    const parsedBal = parseUnits(
      lpTokenAmountBeingRemoved.toString(),
      KVM_PAIR_TOKEN.decimals,
    )
    const parsedSupply = parseUnits(
      totalSupplyLP.toString(),
      KVM_PAIR_TOKEN.decimals,
    )
    const balance = new Amount(KVM_PAIR_TOKEN, parsedBal)
    const supply = new Amount(KVM_PAIR_TOKEN, parsedSupply).toString()
    const amount = balance.div(supply).mulHuman(reserve0)
    return Number.parseFloat(amount.toString({ fixed: token0?.decimals }))
  }, [lpTokenAmountBeingRemoved, reserve0, totalSupplyLP, token0])

  const amountToken1: number = useMemo(() => {
    if (!lpTokenAmountBeingRemoved || !reserve1 || !token1) return 0
    const parsedBal = parseUnits(
      lpTokenAmountBeingRemoved.toString(),
      KVM_PAIR_TOKEN.decimals,
    )
    const parsedSupply = parseUnits(
      totalSupplyLP.toString(),
      KVM_PAIR_TOKEN.decimals,
    )
    const balance = new Amount(KVM_PAIR_TOKEN, parsedBal)
    const supply = new Amount(KVM_PAIR_TOKEN, parsedSupply).toString()
    const amount = balance.div(supply).mulHuman(reserve1)
    return Number.parseFloat(amount.toString({ fixed: token1?.decimals }))
  }, [lpTokenAmountBeingRemoved, reserve1, totalSupplyLP, token1])

  const minAmountToken0: number = useMemo(() => {
    if (!amountToken0 || !token0) return 0
    const parsedAmount = parseUnits(amountToken0.toString(), token0?.decimals)
    const output = new Amount(token0, parsedAmount).mulHuman(1 - slippage)
    return Number.parseFloat(output.toString({ fixed: token0?.decimals }))
  }, [amountToken0, slippage, token0])

  useEffect(() => {
    if (minAmountToken0) {
      setMinAmountToken0(minAmountToken0)
    }
  }, [minAmountToken0, setMinAmountToken0])

  const minAmountToken1: number = useMemo(() => {
    if (!amountToken1 || !token1) return 0
    const parsedAmount = parseUnits(amountToken1.toString(), token1?.decimals)
    const output = new Amount(token1, parsedAmount).mulHuman(1 - slippage)
    return Number.parseFloat(output.toString({ fixed: token1?.decimals }))
  }, [amountToken1, slippage, token1])

  useEffect(() => {
    if (minAmountToken1) {
      setMinAmountToken1(minAmountToken1)
    }
  }, [minAmountToken1, setMinAmountToken1])

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
