import { tryParseAmount } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Button, Dots } from '@sushiswap/ui'
import { Checker, PoolState, useConstantProductPool } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'

import { Pair } from '../../.graphclient'
import { useTokensFromPair } from '../../lib/hooks'
import { AddSectionReviewModalTrident } from './AddSectionReviewModalTrident'
import { AddSectionWidget } from './AddSectionWidget'

export const AddSectionTrident: FC<{ pair: Pair; isFarm: boolean }> = ({ pair, isFarm }) => {
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPair(pair)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [poolState, pool] = useConstantProductPool(pair.chainId, token0, token1, pair.swapFee, pair.twapEnabled)

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value) => {
      if (poolState === PoolState.NOT_EXISTS) {
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
      if (poolState === PoolState.NOT_EXISTS) {
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
            isFarm={isFarm}
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
                showGuardIfTrue={isMounted && [PoolState.NOT_EXISTS, PoolState.INVALID].includes(poolState)}
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
      isFarm,
      isMounted,
      onChangeToken0TypedAmount,
      onChangeToken1TypedAmount,
      pair.chainId,
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
