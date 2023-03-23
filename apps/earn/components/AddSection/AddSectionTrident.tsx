import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { tryParseAmount } from '@sushiswap/currency'
import { Pool } from '@sushiswap/client'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import {
  Checker,
  ConstantProductPoolState,
  StablePoolState,
  useConstantProductPool,
  useStablePool,
} from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'

import { useTokensFromPool } from '../../lib/hooks'
import { AddSectionReviewModalTrident } from './AddSectionReviewModalTrident'
import { AddSectionWidget } from './AddSectionWidget'
import { ZERO } from '@sushiswap/math'

export const AddSectionTrident: FC<{ pool: Pool }> = ({ pool: _pool }) => {
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPool(_pool)
  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  // TODO: Standardize fee format
  const [constantProductPoolState, constantProductPool] = useConstantProductPool(
    _pool.chainId,
    token0,
    token1,
    _pool.swapFee * 10000,
    _pool.twapEnabled
  )
  const [stablePoolState, stablePool] = useStablePool(
    _pool.chainId,
    token0,
    token1,
    _pool.swapFee * 10000,
    _pool.twapEnabled
  )

  const [poolState, pool] = useMemo(() => {
    if (_pool.type === 'STABLE_POOL') return [stablePoolState, stablePool]
    if (_pool.type === 'CONSTANT_PRODUCT_POOL') return [constantProductPoolState, constantProductPool]
    return [undefined, undefined]
  }, [constantProductPool, constantProductPoolState, _pool.type, stablePool, stablePoolState])

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === ConstantProductPoolState.NOT_EXISTS ||
        poolState === StablePoolState.NOT_EXISTS ||
        (pool?.reserve0.equalTo(ZERO) && pool?.reserve1.equalTo(ZERO))
      ) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
        })
      }
    },
    [pool, poolState, token0]
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === ConstantProductPoolState.NOT_EXISTS ||
        poolState === StablePoolState.NOT_EXISTS ||
        (pool?.reserve0.equalTo(ZERO) && pool?.reserve1.equalTo(ZERO))
      ) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pool) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
          input1: value,
        })
      }
    },
    [pool, poolState, token1]
  )

  return useMemo(
    () => (
      <AddSectionReviewModalTrident
        poolAddress={_pool.id}
        poolState={poolState}
        pool={pool}
        chainId={_pool.chainId as BentoBoxV1ChainId}
        token0={token0}
        token1={token1}
        input0={parsedInput0}
        input1={parsedInput1}
      >
        {({ isWritePending, setOpen }) => (
          <AddSectionWidget
            isFarm={!!_pool.incentives && _pool.incentives.length > 0}
            chainId={_pool.chainId}
            input0={input0}
            input1={input1}
            token0={token0}
            token1={token1}
            onInput0={onChangeToken0TypedAmount}
            onInput1={onChangeToken1TypedAmount}
          >
            <Checker.Connected fullWidth size="md">
              <Checker.Custom
                showGuardIfTrue={
                  isMounted &&
                  !!poolState &&
                  [
                    ConstantProductPoolState.NOT_EXISTS,
                    ConstantProductPoolState.INVALID,
                    StablePoolState.NOT_EXISTS,
                    StablePoolState.INVALID,
                  ].includes(poolState)
                }
                guard={
                  <Button size="md" fullWidth disabled={true}>
                    Pool Not Found
                  </Button>
                }
              >
                <Checker.Network fullWidth size="md" chainId={_pool.chainId}>
                  <Checker.Amounts
                    fullWidth
                    size="md"
                    chainId={_pool.chainId}
                    fundSource={FundSource.WALLET}
                    amounts={[parsedInput0, parsedInput1]}
                  >
                    <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">
                      {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add Liquidity'}
                    </Button>
                  </Checker.Amounts>
                </Checker.Network>
              </Checker.Custom>
            </Checker.Connected>
          </AddSectionWidget>
        )}
      </AddSectionReviewModalTrident>
    ),
    [
      _pool.chainId,
      _pool.id,
      _pool.incentives,
      input0,
      input1,
      isMounted,
      onChangeToken0TypedAmount,
      onChangeToken1TypedAmount,
      parsedInput0,
      parsedInput1,
      pool,
      poolState,
      token0,
      token1,
    ]
  )
}
