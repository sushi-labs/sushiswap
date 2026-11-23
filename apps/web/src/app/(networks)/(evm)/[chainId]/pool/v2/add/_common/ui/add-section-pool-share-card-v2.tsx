import {
  Card,
  CardContent,
  Collapsible,
  Stat,
  StatLabel,
  StatValue,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/use-sushi-swap-v2-pools'
import { type Amount, Price, formatPercent } from 'sushi'
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
  if (
    !input0 ||
    !input1 ||
    (!pool && poolState !== SushiSwapV2PoolState.NOT_EXISTS)
  )
    return null

  const [token0Input, token1Input] = pool?.token0.isSame(input1.currency.wrap())
    ? [input1, input0]
    : [input0, input1]
  if (
    pool &&
    (!pool.token0.isSame(token0Input.currency.wrap()) ||
      !pool.token1.isSame(token1Input.currency.wrap()))
  )
    return null

  const [baseAmount, quoteAmount] =
    pool && (pool.reserve0.gt(0n) || pool.reserve1.gt(0n))
      ? [pool.reserve0, pool.reserve1]
      : [token0Input, token1Input]
  const price =
    baseAmount.gt(0n) && quoteAmount.gt(0n)
      ? new Price({ baseAmount, quoteAmount })
      : undefined

  let poolShare = 1
  if (pool) {
    const deposit0 = token0Input.wrap().amount
    poolShare =
      deposit0 > 0n
        ? Number(deposit0) / Number(pool.reserve0.amount + deposit0)
        : 0
  }

  return (
    <Collapsible open={Boolean(price)}>
      <Card variant="outline">
        <CardContent className="grid sm:grid-cols-3 pt-6">
          <Stat>
            <StatValue size="sm">{price?.toSignificant(6) ?? '-'}</StatValue>
            <StatLabel size="sm">
              {token1Input.currency.symbol} per {token0Input.currency.symbol}
            </StatLabel>
          </Stat>
          <Stat>
            <StatValue size="sm">
              {price?.invert().toSignificant(6) ?? '-'}
            </StatValue>
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
