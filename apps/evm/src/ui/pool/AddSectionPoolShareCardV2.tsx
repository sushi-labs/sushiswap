import { Card, CardContent, CardHeader, Loader } from '@sushiswap/ui'
import { SushiSwapV2Pool } from '@sushiswap/v2-sdk'
import { SushiSwapV2PoolState } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'
import { Amount, Type } from 'sushi/currency'
import { formatPercent } from 'sushi/format'

interface AddSectionPoolShareCardV2 {
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
}

const title = {
  [SushiSwapV2PoolState.NOT_EXISTS]: 'Initial prices and pool share',
  [SushiSwapV2PoolState.EXISTS]: 'Prices and pool share',
  [SushiSwapV2PoolState.INVALID]: 'Invalid pool',
  [SushiSwapV2PoolState.LOADING]: (
    <span className="flex flex-row space-x-2 items-center">
      <span>Loading</span>
      {<Loader />}
    </span>
  ),
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

  return (
    <Card>
      <CardHeader>{title[poolState]}</CardHeader>
      <CardContent className="grid grid-cols-3">
        <CardContent className="items-center">
          {token0Input && token1Input ? (
            <>
              <div>{token1Per0 || '-'}</div>
              <div className="text-xs">
                {token1Input.currency.symbol} per {token0Input.currency.symbol}
              </div>
            </>
          ) : (
            <div>-</div>
          )}
        </CardContent>
        <CardContent className="items-center">
          {token0Input && token1Input ? (
            <>
              <div>{token0Per1 || '-'}</div>
              <div className="text-xs">
                {token0Input.currency.symbol} per {token1Input.currency.symbol}
              </div>{' '}
            </>
          ) : (
            <div>-</div>
          )}
        </CardContent>
        <CardContent className="items-center">
          <div>{formatPercent(poolShare)}</div>
          <div className="text-xs">Share of pool</div>
        </CardContent>
      </CardContent>
    </Card>
  )
}
