import { tryParseAmount } from '@sushiswap/currency'
import { Pool } from '@sushiswap/client'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { UniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { Button, Dots } from '@sushiswap/ui'
import { Checker, PairState, usePair } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'

import { useTokensFromPool } from '../../lib/hooks'
import { AddSectionReviewModalLegacy } from './AddSectionReviewModalLegacy'
import { AddSectionWidget } from './AddSectionWidget'

export const AddSectionLegacy: FC<{ pool: Pool }> = ({ pool: _pool }) => {
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPool(_pool)
  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })
  const {
    data: [poolState, pool],
  } = usePair(_pool.chainId as UniswapV2Router02ChainId, token0, token1)

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (poolState === PairState.NOT_EXISTS) {
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
      if (poolState === PairState.NOT_EXISTS) {
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

  return useMemo(() => {
    return (
      <AddSectionReviewModalLegacy
        poolState={poolState}
        chainId={_pool.chainId as UniswapV2Router02ChainId}
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
                showGuardIfTrue={isMounted && [PairState.NOT_EXISTS, PairState.INVALID].includes(poolState)}
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
      </AddSectionReviewModalLegacy>
    )
  }, [
    input0,
    input1,
    isMounted,
    onChangeToken0TypedAmount,
    onChangeToken1TypedAmount,
    _pool.chainId,
    _pool.incentives,
    parsedInput0,
    parsedInput1,
    poolState,
    token0,
    token1,
  ])
}
