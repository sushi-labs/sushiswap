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
import { type Amount, formatPercent } from 'sushi'
import type { EvmCurrency, SushiSwapV2Pool } from 'sushi/evm'

interface AddSectionPoolShareCardV2 {
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  input0: Amount<EvmCurrency> | undefined
  input1: Amount<EvmCurrency> | undefined
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
      input0.currency.wrap().id === pool.token0.id
        ? input0.wrap()
        : input1.wrap(),
      input1.currency.wrap().id === pool.token1.id
        ? input1.wrap()
        : input0.wrap(),
    ]
  }, [pool, poolState, input0, input1])

  const [token1Per0, token0Per1] = useMemo(() => {
    if (
      !token0Input ||
      !token1Input ||
      token0Input?.eq(0n) ||
      token1Input?.eq(0n)
    )
      return [undefined, undefined]

    const token1Per0 = token1Input
      .divToFraction(token0Input)
      .mul(10n ** BigInt(token0Input.currency.decimals))
      .toSignificant(6)

    const token0Per1 = token0Input
      .divToFraction(token1Input)
      .mul(10n ** BigInt(token1Input.currency.decimals))
      .toSignificant(6)

    return [token1Per0, token0Per1]
  }, [token0Input, token1Input])

  const poolShare = useMemo(() => {
    if (poolState === SushiSwapV2PoolState.NOT_EXISTS) return 1

    if (!pool || !token0Input || token0Input.eq(0n)) return 0

    return (
      Number(token0Input.amount) /
      (Number(pool.reserve0.amount) + Number(token0Input.amount))
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
