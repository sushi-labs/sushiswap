'use client'

import { V2Pool } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { FC, useCallback, useMemo, useState } from 'react'
import { isZapSupportedChainId } from 'src/config'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import { getSushiSwapRouterContractConfig } from 'src/lib/wagmi/hooks/contracts/useSushiSwapRouter'
import {
  SushiSwapV2PoolState,
  useSushiSwapV2Pool,
} from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { type ChainId } from 'sushi/chain'
import { SushiSwapV2ChainId } from 'sushi/config'
import { tryParseAmount } from 'sushi/currency'
import { useTokensFromPool } from '../../lib/hooks'
import { AddSectionReviewModalLegacy } from './AddSectionReviewModalLegacy'
import { AddSectionWidget } from './AddSectionWidget'
import { ZapSectionLegacy } from './ZapSectionLegacy'

export const AddSectionLegacy: FC<{ pool: V2Pool }> = ({ pool }) => {
  const [useZap, setUseZap] = useState(isZapSupportedChainId(pool.chainId))

  return useZap ? (
    <ZapSectionLegacy pool={pool} setUseZap={setUseZap} />
  ) : (
    <_AddSectionLegacy pool={pool} setUseZap={setUseZap} />
  )
}

interface AddSectionLegacyProps {
  pool: V2Pool
  setUseZap(value: boolean): void
}

const _AddSectionLegacy: FC<AddSectionLegacyProps> = ({
  pool: _pool,
  setUseZap,
}) => {
  const chainId = _pool.chainId as SushiSwapV2ChainId
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPool(_pool)
  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })
  const {
    data: [poolState, pool],
  } = useSushiSwapV2Pool(_pool.chainId as SushiSwapV2ChainId, token0, token1)

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (poolState === SushiSwapV2PoolState.NOT_EXISTS) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount
            ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact()
            : '',
        })
      }
    },
    [pool, poolState, token0],
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      if (poolState === SushiSwapV2PoolState.NOT_EXISTS) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pool) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount
            ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact()
            : '',
          input1: value,
        })
      }
    },
    [pool, poolState, token1],
  )

  const amounts = useMemo(
    () => [parsedInput0, parsedInput1],
    [parsedInput1, parsedInput0],
  )

  return (
    <CheckerProvider>
      <AddSectionWidget
        isFarm={!!_pool.incentives && _pool.incentives.length > 0}
        chainId={_pool.chainId as ChainId}
        input0={input0}
        input1={input1}
        token0={token0}
        token1={token1}
        onInput0={onChangeToken0TypedAmount}
        onInput1={onChangeToken1TypedAmount}
        setUseZap={setUseZap}
      >
        <Checker.Connect fullWidth>
          <Checker.Guard
            fullWidth
            guardWhen={
              isMounted &&
              [
                SushiSwapV2PoolState.NOT_EXISTS,
                SushiSwapV2PoolState.INVALID,
              ].includes(poolState)
            }
            guardText="Pool not found"
          >
            <Checker.Network fullWidth chainId={_pool.chainId as ChainId}>
              <Checker.Amounts
                fullWidth
                chainId={_pool.chainId as ChainId}
                amounts={amounts}
              >
                <Checker.ApproveERC20
                  fullWidth
                  id="approve-token-0"
                  className="whitespace-nowrap"
                  amount={parsedInput0}
                  contract={getSushiSwapRouterContractConfig(chainId).address}
                >
                  <Checker.ApproveERC20
                    fullWidth
                    id="approve-token-1"
                    className="whitespace-nowrap"
                    amount={parsedInput1}
                    contract={getSushiSwapRouterContractConfig(chainId).address}
                  >
                    <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                      <AddSectionReviewModalLegacy
                        poolAddress={pool?.liquidityToken.address}
                        poolState={poolState}
                        chainId={_pool.chainId as SushiSwapV2ChainId}
                        token0={token0}
                        token1={token1}
                        input0={parsedInput0}
                        input1={parsedInput1}
                        onSuccess={() => {
                          setTypedAmounts({ input0: '', input1: '' })
                        }}
                      >
                        <Button fullWidth>Add Liquidity</Button>
                      </AddSectionReviewModalLegacy>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.ApproveERC20>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Guard>
        </Checker.Connect>
      </AddSectionWidget>
    </CheckerProvider>
  )
}
