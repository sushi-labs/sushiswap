import {
  Card,
  CardContent,
  Collapsible,
  Stat,
  StatLabel,
  StatValue,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import type { SushiSwapV2Pool } from 'sushi'
import type { Amount, Type } from 'sushi/currency'
import { formatPercent } from 'sushi/format'

interface AddSectionPoolShareCardV2 {
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
}

export const AddSectionPoolShareCardV2: FC<AddSectionPoolShareCardV2> = ({
  pool,
  poolState,
  input0,
  input1,
}) => {
  const [token0Input, token1Input] = useMemo(() => {
    if (!pool && poolState === SushiSwapV2PoolState.NOT_EXISTS)
      return [input0, input1]

    if (!pool || !input0 || !input1) return [undefined, undefined]

    return [
      input0.currency.wrapped.id === pool.token0.id
        ? input0.wrapped
        : input1.wrapped,
      input1.currency.wrapped.id === pool.token1.id
        ? input1.wrapped
        : input0.wrapped,
    ]
  }, [pool, poolState, input0, input1])

  const [token1Per0, token0Per1] = useMemo(() => {
    if (
      !token0Input ||
      !token1Input ||
      token0Input?.equalTo(0) ||
      token1Input?.equalTo(0)
    )
      return [undefined, undefined]

    const token1Per0 = token1Input
      .divide(token0Input)
      .multiply(10n ** BigInt(token0Input.currency.decimals))
      .toSignificant(6)

    const token0Per1 = token0Input
      .divide(token1Input)
      .multiply(10n ** BigInt(token1Input.currency.decimals))
      .toSignificant(6)

    return [token1Per0, token0Per1]
  }, [token0Input, token1Input])

  const poolShare = useMemo(() => {
    if (poolState === SushiSwapV2PoolState.NOT_EXISTS) return 1

    if (!pool || !token0Input || token0Input.equalTo(0)) return 0

    return (
      Number(token0Input.quotient) /
      (Number(pool.reserve0.quotient) + Number(token0Input.quotient))
    )
  }, [poolState, pool, token0Input])

  if (!token0Input || !token1Input) return <></>

  return (
    <Collapsible open={Boolean(token1Per0 && token1Per0)}>
      <Card variant="outline">
        <CardContent className="grid grid-cols-3 pt-6">
          <Stat>
            <StatValue size="sm">{token1Per0 || '-'}</StatValue>
            <StatLabel size="sm">
              {token1Input.currency.symbol} per {token0Input.currency.symbol}
            </StatLabel>
          </Stat>
          <Stat>
            <StatValue size="sm">{token0Per1 || '-'}</StatValue>
            <StatLabel size="sm">
              {token0Input.currency.symbol} per {token1Input.currency.symbol}
            </StatLabel>
          </Stat>
          <Stat>
            <StatValue size="sm">{formatPercent(poolShare)}</StatValue>
            <StatLabel size="sm">Share of pool</StatLabel>
          </Stat>
        </CardContent>
      </Card>
    </Collapsible>
  )
}
