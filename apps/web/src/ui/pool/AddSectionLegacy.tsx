'use client'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { type FC, useCallback, useMemo, useState } from 'react'
import { isZapSupportedChainId } from 'src/config'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { getSushiSwapRouterContractConfig } from 'src/lib/wagmi/hooks/contracts/useSushiSwapRouter'
import {
  SushiSwapV2PoolState,
  useSushiSwapV2Pool,
} from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { Amount } from 'sushi'
import type {
  EvmCurrency,
  SushiSwapV2ChainId,
  SushiSwapV2Pool,
} from 'sushi/evm'
import { useTokensFromPool } from '../../lib/hooks'
import { AddSectionReviewModalLegacy } from './AddSectionReviewModalLegacy'
import { AddSectionWidget } from './AddSectionWidget'
import { ZapSectionLegacy } from './ZapSectionLegacy'

export const AddSectionLegacy: FC<{ pool: V2Pool }> = ({ pool }) => {
  const [isZapModeEnabled, setIsZapModeEnabled] = useState(
    isZapSupportedChainId(pool.chainId),
  )

  const { token0, token1 } = useTokensFromPool(pool)

  const {
    data: [poolState, _pool],
  } = useSushiSwapV2Pool(pool.chainId as SushiSwapV2ChainId, token0, token1)

  return isZapModeEnabled ? (
    <ZapSectionLegacy
      chainId={pool.chainId}
      pool={_pool}
      poolState={poolState}
      toggleZapMode={setIsZapModeEnabled}
    />
  ) : (
    <_AddSectionLegacy
      chainId={pool.chainId}
      pool={_pool}
      poolState={poolState}
      token0={token0}
      token1={token1}
      isFarm={!!pool.incentives && pool.incentives.length > 0}
      toggleZapMode={setIsZapModeEnabled}
    />
  )
}

interface AddSectionLegacyProps {
  chainId: SushiSwapV2ChainId
  pool: SushiSwapV2Pool | null
  token0: EvmCurrency
  token1: EvmCurrency
  poolState: SushiSwapV2PoolState
  isFarm: boolean
  toggleZapMode(value: boolean): void
}

const _AddSectionLegacy: FC<AddSectionLegacyProps> = ({
  chainId,
  pool,
  token0,
  token1,
  poolState,
  isFarm,
  toggleZapMode,
}) => {
  const [slippagePercent] = useSlippageTolerance()
  const isMounted = useIsMounted()

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [Amount.fromHuman(token0, input0), Amount.fromHuman(token1, input1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (poolState === SushiSwapV2PoolState.NOT_EXISTS) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        const parsedAmount = Amount.fromHuman(token0, value)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount
            ? pool
                .priceOf(token0.wrap())
                .getQuote(parsedAmount.wrap())
                .toString()
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
        const parsedAmount = Amount.fromHuman(token1, value)
        setTypedAmounts({
          input0: parsedAmount
            ? pool
                .priceOf(token1.wrap())
                .getQuote(parsedAmount.wrap())
                .toString()
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
        isFarm={isFarm}
        chainId={chainId}
        input0={input0}
        input1={input1}
        token0={token0}
        token1={token1}
        onInput0={onChangeToken0TypedAmount}
        onInput1={onChangeToken1TypedAmount}
        toggleZapMode={toggleZapMode}
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
            <Checker.Network fullWidth chainId={chainId}>
              <Checker.Amounts fullWidth chainId={chainId} amounts={amounts}>
                <Checker.Slippage
                  fullWidth
                  slippageTolerance={slippagePercent}
                  text="Continue With High Slippage"
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
                      contract={
                        getSushiSwapRouterContractConfig(chainId).address
                      }
                    >
                      <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                        <AddSectionReviewModalLegacy
                          poolAddress={pool?.liquidityToken.address}
                          poolState={poolState}
                          chainId={chainId}
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
                </Checker.Slippage>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Guard>
        </Checker.Connect>
      </AddSectionWidget>
    </CheckerProvider>
  )
}
