import { tryParseAmount } from '@sushiswap/currency'
import { Pool } from '@sushiswap/client'
import { useIsMounted } from '@sushiswap/hooks'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { Address, getSushiSwapRouterContractConfig, PairState, usePair } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo, useState } from 'react'

import { useTokensFromPool } from '../../lib/hooks'
import { AddSectionReviewModalLegacy } from './AddSectionReviewModalLegacy'
import { AddSectionWidget } from './AddSectionWidget'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { Button } from '@sushiswap/ui/future/components/button'
import { APPROVE_TAG_ADD_LEGACY } from '../../lib/constants'
import { ChainId } from '@sushiswap/chain'

export const AddSectionLegacy: FC<{ pool: Pool }> = ({ pool: _pool }) => {
  const chainId = _pool.chainId as SushiSwapV2ChainId
  const [open, setOpen] = useState(false)
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPool(_pool)
  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })
  const {
    data: [poolState, pool],
  } = usePair(_pool.chainId as SushiSwapV2ChainId, token0, token1)

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

  const close = useCallback(() => setOpen(false), [])

  return (
    <Checker.Root>
      <AddSectionWidget
        isFarm={!!_pool.incentives && _pool.incentives.length > 0}
        chainId={_pool.chainId as ChainId}
        input0={input0}
        input1={input1}
        token0={token0}
        token1={token1}
        onInput0={onChangeToken0TypedAmount}
        onInput1={onChangeToken1TypedAmount}
      >
        <Checker.Connect fullWidth size="xl">
          <Checker.Custom
            showGuardIfTrue={isMounted && [PairState.NOT_EXISTS, PairState.INVALID].includes(poolState)}
            guard={
              <Button size="xl" fullWidth disabled={true}>
                Pool Not Found
              </Button>
            }
          >
            <Checker.Network fullWidth size="xl" chainId={_pool.chainId}>
              <Checker.Amounts fullWidth size="xl" chainId={_pool.chainId} amounts={[parsedInput0, parsedInput1]}>
                <Checker.ApproveERC20
                  id="approve-token-0"
                  size="xl"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInput0}
                  contract={getSushiSwapRouterContractConfig(chainId).address as Address}
                >
                  <Checker.ApproveERC20
                    id="approve-token-1"
                    size="xl"
                    className="whitespace-nowrap"
                    fullWidth
                    amount={parsedInput1}
                    contract={getSushiSwapRouterContractConfig(chainId).address as Address}
                  >
                    <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                      <Button fullWidth onClick={() => setOpen(true)} size="xl">
                        Add Liquidity
                      </Button>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.ApproveERC20>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Custom>
        </Checker.Connect>
      </AddSectionWidget>
      <AddSectionReviewModalLegacy
        poolState={poolState}
        chainId={_pool.chainId as SushiSwapV2ChainId}
        token0={token0}
        token1={token1}
        input0={parsedInput0}
        input1={parsedInput1}
        open={open}
        close={close}
      />
    </Checker.Root>
  )
}
