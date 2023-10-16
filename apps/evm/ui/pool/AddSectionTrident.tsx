'use client'

import {
  BENTOBOX_ADDRESS,
  BentoBoxChainId,
  isBentoBoxChainId,
} from '@sushiswap/bentobox-sdk'
import { ChainId } from 'sushi/chain'
import { Pool, Protocol } from '@sushiswap/client'
import { tryParseAmount } from 'sushi/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { ZERO } from 'sushi/math'
import { Button } from '@sushiswap/ui/components/button'
import {
  getTridentRouterContractConfig,
  TridentConstantPoolState,
  TridentStablePoolState,
  useTridentConstantPool,
  useTridentStablePool,
} from '@sushiswap/wagmi'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { CheckerProvider } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { APPROVE_TAG_ADD_TRIDENT } from 'lib/constants'
import { useTokensFromPool } from 'lib/hooks'
import { FC, useCallback, useMemo, useState } from 'react'

import { AddSectionReviewModalTrident } from './AddSectionReviewModalTrident'
import { AddSectionWidget } from './AddSectionWidget'

interface AddSectionTrident {
  pool: Pool
}

export const AddSectionTrident: FC<AddSectionTrident> = ({ pool: _pool }) => {
  const chainId = _pool.chainId as BentoBoxChainId
  const isMounted = useIsMounted()
  const { token0, token1 } = useTokensFromPool(_pool)
  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  // TODO: Standardize fee format
  const [constantProductPoolState, constantProductPool] =
    useTridentConstantPool(
      _pool.chainId,
      token0,
      token1,
      _pool.swapFee * 10000,
      _pool.twapEnabled,
    )
  const [stablePoolState, stablePool] = useTridentStablePool(
    _pool.chainId,
    token0,
    token1,
    _pool.swapFee * 10000,
    _pool.twapEnabled,
  )

  const [poolState, pool] = useMemo(() => {
    if (_pool.protocol === Protocol.BENTOBOX_STABLE)
      return [stablePoolState, stablePool]
    if (_pool.protocol === Protocol.BENTOBOX_CLASSIC)
      return [constantProductPoolState, constantProductPool]
    return [undefined, undefined]
  }, [
    _pool.protocol,
    stablePoolState,
    stablePool,
    constantProductPoolState,
    constantProductPool,
  ])

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === TridentConstantPoolState.NOT_EXISTS ||
        poolState === TridentStablePoolState.NOT_EXISTS ||
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
      if (
        poolState === TridentConstantPoolState.NOT_EXISTS ||
        poolState === TridentStablePoolState.NOT_EXISTS ||
        (pool?.reserve0.equalTo(ZERO) && pool?.reserve1.equalTo(ZERO))
      ) {
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
    [parsedInput0, parsedInput1],
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
      >
        <Checker.Connect fullWidth>
          <Checker.Guard
            guardWhen={
              isMounted &&
              !!poolState &&
              [
                TridentConstantPoolState.NOT_EXISTS,
                TridentConstantPoolState.INVALID,
                TridentStablePoolState.NOT_EXISTS,
                TridentStablePoolState.INVALID,
              ].includes(poolState)
            }
            guardText="Pool not found"
          >
            <Checker.Network
              size="default"
              variant="outline"
              fullWidth
              chainId={_pool.chainId}
            >
              <Checker.Amounts
                size="default"
                variant="outline"
                fullWidth
                chainId={_pool.chainId as ChainId}
                amounts={amounts}
              >
                <Checker.ApproveBentobox
                  tag={APPROVE_TAG_ADD_TRIDENT}
                  chainId={chainId}
                  size="default"
                  variant="outline"
                  id="add-liquidity-trident-approve-bentobox"
                  className="whitespace-nowrap"
                  fullWidth
                  masterContract={
                    getTridentRouterContractConfig(chainId).address
                  }
                  enabled={Boolean(
                    getTridentRouterContractConfig(chainId).address,
                  )}
                >
                  <Checker.ApproveERC20
                    size="default"
                    variant="outline"
                    id="add-liquidity-trident-approve-token0"
                    className="whitespace-nowrap"
                    fullWidth
                    amount={parsedInput0}
                    contract={BENTOBOX_ADDRESS[chainId]}
                    enabled={isBentoBoxChainId(chainId)}
                  >
                    <Checker.ApproveERC20
                      size="default"
                      variant="outline"
                      id="add-liquidity-trident-approve-token1"
                      className="whitespace-nowrap"
                      fullWidth
                      amount={parsedInput1}
                      contract={BENTOBOX_ADDRESS[chainId]}
                      enabled={isBentoBoxChainId(chainId)}
                    >
                      <Checker.Success tag={APPROVE_TAG_ADD_TRIDENT}>
                        <AddSectionReviewModalTrident
                          poolAddress={_pool.id}
                          poolState={poolState}
                          pool={pool}
                          chainId={_pool.chainId as BentoBoxChainId}
                          token0={token0}
                          token1={token1}
                          input0={parsedInput0}
                          input1={parsedInput1}
                          onSuccess={() => {
                            setTypedAmounts({ input0: '', input1: '' })
                          }}
                        >
                          <Button variant="outline" size="default" fullWidth>
                            Add Liquidity
                          </Button>
                        </AddSectionReviewModalTrident>
                      </Checker.Success>
                    </Checker.ApproveERC20>
                  </Checker.ApproveERC20>
                </Checker.ApproveBentobox>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Guard>
        </Checker.Connect>
      </AddSectionWidget>
    </CheckerProvider>
  )
}
