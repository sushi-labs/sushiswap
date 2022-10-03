import { tryParseAmount } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client/.graphclient'
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

import { useTokensFromPair } from '../../lib/hooks'
import { AddSectionReviewModalTrident } from './AddSectionReviewModalTrident'
import { AddSectionWidget } from './AddSectionWidget'

export const AddSectionTrident: FC<{ pair: Pair }> = ({ pair }) => {
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPair(pair)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [constantProductPoolState, constantProductPool] = useConstantProductPool(
    pair.chainId,
    token0,
    token1,
    pair.swapFee,
    pair.twapEnabled
  )
  const [stablePoolState, stablePool] = useStablePool(pair.chainId, token0, token1, pair.swapFee, pair.twapEnabled)

  const [poolState, pool] = useMemo(() => {
    if (pair.type === 'STABLE_POOL') return [stablePoolState, stablePool]
    if (pair.type === 'CONSTANT_PRODUCT_POOL') return [constantProductPoolState, constantProductPool]
    return [undefined, undefined]
  }, [constantProductPool, constantProductPoolState, pair.type, stablePool, stablePoolState])

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value) => {
      if (poolState === ConstantProductPoolState.NOT_EXISTS || poolState === StablePoolState.NOT_EXISTS) {
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
    (value) => {
      if (poolState === ConstantProductPoolState.NOT_EXISTS || poolState === StablePoolState.NOT_EXISTS) {
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
        poolAddress={pair.id}
        poolState={poolState}
        pool={pool}
        chainId={pair.chainId}
        token0={token0}
        token1={token1}
        input0={parsedInput0}
        input1={parsedInput1}
      >
        {({ isWritePending, setOpen }) => (
          <AddSectionWidget
            isFarm={!!pair.farm}
            chainId={pair.chainId}
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
                <Checker.Network fullWidth size="md" chainId={pair.chainId}>
                  <Checker.Amounts
                    fullWidth
                    size="md"
                    chainId={pair.chainId}
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
      input0,
      input1,
      isMounted,
      onChangeToken0TypedAmount,
      onChangeToken1TypedAmount,
      pair.chainId,
      pair.farm,
      pair.id,
      parsedInput0,
      parsedInput1,
      pool,
      poolState,
      token0,
      token1,
    ]
  )
}
