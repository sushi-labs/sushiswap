'use client'

import { Pool } from '@sushiswap/client'
import { FundSource, useDebounce, useIsMounted } from '@sushiswap/hooks'
import { Dots } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { createToast } from '@sushiswap/ui/components/toast'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import {
  Address,
  SushiSwapV2PoolState,
  getSushiSwapRouterContractConfig,
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSushiSwapRouterContract,
  useSushiSwapV2Pool,
  useTotalSupply,
} from '@sushiswap/wagmi'
import {
  SendTransactionResult,
  waitForTransaction,
} from '@sushiswap/wagmi/actions'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Checker } from '@sushiswap/wagmi/systems'
import {
  useApproved,
  withCheckerRoot,
} from '@sushiswap/wagmi/systems/Checker/Provider'
import { APPROVE_TAG_REMOVE_LEGACY } from 'lib/constants'
import {
  useTokensFromPool,
  useTransactionDeadline,
  useUnderlyingTokenBalanceFromPool,
} from 'lib/hooks'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { gasMargin, slippageAmount } from 'sushi/calculate'
import { ChainId } from 'sushi/chain'
import { Amount, Native } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { encodeFunctionData } from 'viem'

import { usePoolPosition } from './PoolPositionProvider'
import { RemoveSectionWidget } from './RemoveSectionWidget'

interface RemoveSectionLegacyProps {
  pool: Pool
}

export const RemoveSectionLegacy: FC<RemoveSectionLegacyProps> =
  withCheckerRoot(({ pool: _pool }) => {
    const { token0, token1, liquidityToken } = useTokensFromPool(_pool)
    const { chain } = useNetwork()
    const { approved } = useApproved(APPROVE_TAG_REMOVE_LEGACY)
    const isMounted = useIsMounted()
    const { address } = useAccount()
    const deadline = useTransactionDeadline(_pool.chainId)
    const contract = useSushiSwapRouterContract(
      _pool.chainId as SushiSwapV2ChainId,
    )
    const [slippageTolerance] = useSlippageTolerance('removeLiquidity')

    const [percentage, setPercentage] = useState<string>('0')
    const percentToRemove = useMemo(
      () => new Percent(percentage, 100),
      [percentage],
    )
    const percentToRemoveDebounced = useDebounce(percentToRemove, 300)

    const {
      data: [poolState, pool],
    } = useSushiSwapV2Pool(_pool.chainId as SushiSwapV2ChainId, token0, token1)

    const { balance } = usePoolPosition()
    const totalSupply = useTotalSupply(liquidityToken)

    const [reserve0, reserve1] = useMemo(() => {
      return [pool?.reserve0, pool?.reserve1]
    }, [pool?.reserve0, pool?.reserve1])

    const underlying = useUnderlyingTokenBalanceFromPool({
      reserve0,
      reserve1,
      totalSupply,
      balance: balance?.[FundSource.WALLET],
    })

    const [underlying0, underlying1] = underlying

    const currencyAToRemove = useMemo(
      () =>
        token0
          ? percentToRemove?.greaterThan('0') && underlying0
            ? Amount.fromRawAmount(
                token0,
                percentToRemove.multiply(underlying0.quotient).quotient || '0',
              )
            : Amount.fromRawAmount(token0, '0')
          : undefined,
      [percentToRemove, token0, underlying0],
    )

    const currencyBToRemove = useMemo(
      () =>
        token1
          ? percentToRemove?.greaterThan('0') && underlying1
            ? Amount.fromRawAmount(
                token1,
                percentToRemove.multiply(underlying1.quotient).quotient || '0',
              )
            : Amount.fromRawAmount(token1, '0')
          : undefined,
      [percentToRemove, token1, underlying1],
    )

    const [minAmount0, minAmount1] = useMemo(() => {
      return [
        currencyAToRemove
          ? Amount.fromRawAmount(
              currencyAToRemove.currency,
              slippageAmount(currencyAToRemove, slippageTolerance)[0],
            )
          : undefined,
        currencyBToRemove
          ? Amount.fromRawAmount(
              currencyBToRemove.currency,
              slippageAmount(currencyBToRemove, slippageTolerance)[0],
            )
          : undefined,
      ]
    }, [slippageTolerance, currencyAToRemove, currencyBToRemove])

    const debouncedMinAmount0 = useDebounce(minAmount0, 500)
    const debouncedMinAmount1 = useDebounce(minAmount1, 500)

    const amountToRemove = useMemo(
      () => balance?.[FundSource.WALLET].multiply(percentToRemove),
      [balance, percentToRemove],
    )

    const onSettled = useCallback(
      (data: SendTransactionResult | undefined) => {
        if (!data || !chain?.id) return
        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'burn',
          chainId: chain.id,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
            completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
            failed: 'Something went wrong when removing liquidity',
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      },
      [chain, token0.symbol, token1.symbol, address],
    )

    const [prepare, setPrepare] = useState<
      UsePrepareSendTransactionConfig | undefined
    >(undefined)

    useEffect(() => {
      const prep = async (): Promise<UsePrepareSendTransactionConfig> => {
        if (
          !token0 ||
          !token1 ||
          !chain?.id ||
          !contract ||
          !underlying0 ||
          !underlying1 ||
          !address ||
          !pool ||
          !balance?.[FundSource.WALLET] ||
          !debouncedMinAmount0 ||
          !debouncedMinAmount1 ||
          !deadline
        ) {
          return
        }

        const withNative =
          Native.onChain(_pool.chainId).wrapped.address ===
            pool.token0.address ||
          Native.onChain(_pool.chainId).wrapped.address === pool.token1.address

        const config = (function () {
          if (withNative) {
            const token1IsNative =
              Native.onChain(_pool.chainId).wrapped.address ===
              pool.token1.wrapped.address

            return {
              functionNames: [
                'removeLiquidityETH',
                'removeLiquidityETHSupportingFeeOnTransferTokens',
              ],
              args: [
                token1IsNative
                  ? (pool.token0.wrapped.address as Address)
                  : (pool.token1.wrapped.address as Address),
                balance[FundSource.WALLET].multiply(percentToRemoveDebounced)
                  .quotient,
                token1IsNative
                  ? debouncedMinAmount0.quotient
                  : debouncedMinAmount1.quotient,
                token1IsNative
                  ? debouncedMinAmount1.quotient
                  : debouncedMinAmount0.quotient,
                address,
                deadline,
              ],
            } as const
          }

          return {
            functionNames: ['removeLiquidity'],
            args: [
              pool.token0.wrapped.address as Address,
              pool.token1.wrapped.address as Address,
              balance[FundSource.WALLET].multiply(percentToRemoveDebounced)
                .quotient,
              debouncedMinAmount0.quotient,
              debouncedMinAmount1.quotient,
              address,
              deadline,
            ],
          } as const
        })()

        const safeGasEstimates = await Promise.all(
          config.functionNames.map((methodName) =>
            contract.estimateGas[methodName](config.args as any)
              .then(gasMargin)
              .catch((e) => {
                console.error(e)
                return undefined
              }),
          ),
        )

        const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
          (safeGasEstimate) => typeof safeGasEstimate === 'bigint',
        )

        if (indexOfSuccessfulEstimation !== -1) {
          const methodName = config.functionNames[indexOfSuccessfulEstimation]
          const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

          return {
            account: address,
            to: contract.address,
            data: encodeFunctionData({
              abi: contract.abi,
              functionName: methodName,
              args: config.args as any,
            }),
            gas: safeGasEstimate,
          }
        }
      }

      prep()
        .then((config) => {
          setPrepare(config)
        })
        .catch((e) => {
          console.error('remove prepare error', e)
        })
    }, [
      token0,
      token1,
      chain?.id,
      contract,
      underlying0,
      underlying1,
      address,
      pool,
      balance,
      debouncedMinAmount0,
      debouncedMinAmount1,
      deadline,
      _pool.chainId,
      percentToRemoveDebounced,
    ])

    const { config } = usePrepareSendTransaction({
      ...prepare,
      chainId: _pool.chainId,
      enabled: Boolean(approved && Number(percentage) > 0),
    })

    const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
      ...config,
      onSettled,
      onSuccess: () => {
        setPercentage('')
      },
    })

    return (
      <div>
        <RemoveSectionWidget
          isFarm={!!_pool.incentives && _pool.incentives.length > 0}
          chainId={_pool.chainId as ChainId}
          percentage={percentage}
          token0={token0}
          token1={token1}
          token0Minimum={minAmount0}
          token1Minimum={minAmount1}
          setPercentage={setPercentage}
        >
          <Checker.Connect size="default" variant="outline" fullWidth>
            <Checker.Guard
              size="default"
              variant="outline"
              guardWhen={
                isMounted &&
                [
                  SushiSwapV2PoolState.NOT_EXISTS,
                  SushiSwapV2PoolState.INVALID,
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
                <Checker.Guard
                  size="default"
                  variant="outline"
                  guardWhen={+percentage <= 0}
                  guardText="Enter amount"
                >
                  <Checker.ApproveERC20
                    size="default"
                    variant="outline"
                    fullWidth
                    id="approve-remove-liquidity-slp"
                    amount={amountToRemove}
                    contract={
                      getSushiSwapRouterContractConfig(
                        _pool.chainId as SushiSwapV2ChainId,
                      ).address as Address
                    }
                  >
                    <Checker.Success tag={APPROVE_TAG_REMOVE_LEGACY}>
                      <Button
                        size="default"
                        onClick={() => sendTransaction?.()}
                        fullWidth
                        disabled={
                          !approved || isWritePending || !sendTransaction
                        }
                        testId="remove-liquidity"
                      >
                        {isWritePending ? (
                          <Dots>Confirm transaction</Dots>
                        ) : (
                          'Remove Liquidity'
                        )}
                      </Button>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Guard>
              </Checker.Network>
            </Checker.Guard>
          </Checker.Connect>
        </RemoveSectionWidget>
      </div>
    )
  })
