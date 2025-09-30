'use client'

import {
  SlippageToleranceStorageKey,
  TTLStorageKey,
  useDebounce,
  useIsMounted,
} from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { Button, Dots } from '@sushiswap/ui'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { APPROVE_TAG_REMOVE_LEGACY } from 'src/lib/constants'
import {
  useTokensFromPool,
  useUnderlyingTokenBalanceFromPool,
} from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Amount, Percent, subtractSlippage } from 'sushi'
import { EvmNative, type SushiSwapV2ChainId, addGasMargin } from 'sushi/evm'
import {
  type SendTransactionReturnType,
  UserRejectedRequestError,
  encodeFunctionData,
} from 'viem'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { logger } from 'src/lib/logger'
import {
  type PermitInfo,
  PermitType,
} from 'src/lib/wagmi/hooks/approvals/hooks/useTokenPermit'
import {
  getSushiSwapRouterContractConfig,
  useSushiSwapRouterContract,
} from 'src/lib/wagmi/hooks/contracts/useSushiSwapRouter'
import {
  SushiSwapV2PoolState,
  useSushiSwapV2Pool,
} from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  useApproved,
  useSignature,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/provider'
import {
  type UseCallParameters,
  useAccount,
  useCall,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePoolPosition } from '../../../_common/ui/pool-position-provider'
import { RemoveSectionWidget } from './remove-section-widget'

const REMOVE_V2_LIQUIDITY_PERMIT_INFO: PermitInfo = {
  version: '1',
  name: 'SushiSwap LP Token',
  type: PermitType.AMOUNT,
}

interface RemoveSectionLegacyProps {
  pool: V2Pool
}

export const RemoveSectionLegacy: FC<RemoveSectionLegacyProps> =
  withCheckerRoot(({ pool: _pool }) => {
    const { token0, token1, liquidityToken } = useTokensFromPool(_pool)
    const { signature } = useSignature(APPROVE_TAG_REMOVE_LEGACY)
    const { approved } = useApproved(APPROVE_TAG_REMOVE_LEGACY)
    const isMounted = useIsMounted()
    const client = usePublicClient()
    const { address, chain } = useAccount()
    const { data: deadline } = useTransactionDeadline({
      storageKey: TTLStorageKey.RemoveLiquidity,
      chainId: _pool.chainId,
    })
    const contract = useSushiSwapRouterContract(
      _pool.chainId as SushiSwapV2ChainId,
    )
    const [slippageTolerance] = useSlippageTolerance(
      SlippageToleranceStorageKey.RemoveLiquidity,
    )

    const [percentage, setPercentage] = useState<string>('0')
    const percentToRemove = useMemo(
      () => new Percent({ numerator: percentage, denominator: 100 }),
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
      balance: balance,
    })

    const [underlying0, underlying1] = underlying

    const currencyAToRemove = useMemo(
      () =>
        token0
          ? percentToRemoveDebounced?.gt('0') && underlying0
            ? new Amount(
                token0,
                percentToRemoveDebounced.mul(underlying0.amount).quotient ||
                  '0',
              )
            : new Amount(token0, '0')
          : undefined,
      [percentToRemoveDebounced, token0, underlying0],
    )

    const currencyBToRemove = useMemo(
      () =>
        token1
          ? percentToRemoveDebounced?.gt('0') && underlying1
            ? new Amount(
                token1,
                percentToRemoveDebounced.mul(underlying1.amount).quotient ||
                  '0',
              )
            : new Amount(token1, '0')
          : undefined,
      [percentToRemoveDebounced, token1, underlying1],
    )

    const [minAmount0, minAmount1] = useMemo(() => {
      return [
        currencyAToRemove
          ? subtractSlippage(currencyAToRemove, slippageTolerance.toNumber())
          : undefined,
        currencyBToRemove
          ? subtractSlippage(currencyBToRemove, slippageTolerance.toNumber())
          : undefined,
      ]
    }, [slippageTolerance, currencyAToRemove, currencyBToRemove])

    const debouncedMinAmount0 = useDebounce(minAmount0, 500)
    const debouncedMinAmount1 = useDebounce(minAmount1, 500)

    const amountToRemove = useMemo(() => {
      return balance &&
        percentToRemoveDebounced &&
        percentToRemoveDebounced.gt('0')
        ? new Amount(
            balance.currency,
            percentToRemoveDebounced.mul(balance.amount).quotient,
          )
        : undefined
    }, [balance, percentToRemoveDebounced])

    const trace = useTrace()

    const { refetchChain: refetchBalances } = useRefetchBalances()

    const onSuccess = useCallback(
      (hash: SendTransactionReturnType) => {
        setPercentage('0')

        if (!chain?.id) return

        sendAnalyticsEvent(LiquidityEventName.REMOVE_LIQUIDITY_SUBMITTED, {
          chain_id: chain.id,
          address,
          source: LiquiditySource.V2,
          label: [token0.symbol, token1.symbol].join('/'),
          ...trace,
        })

        const receipt = client.waitForTransactionReceipt({ hash })
        receipt.then(() => {
          refetchBalances(chain.id)
        })

        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'burn',
          chainId: chain.id,
          txHash: hash,
          promise: receipt,
          summary: {
            pending: `Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
            completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
            failed: 'Something went wrong when removing liquidity',
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      },
      [
        refetchBalances,
        client,
        chain,
        token0.symbol,
        token1.symbol,
        address,
        trace,
      ],
    )

    const [prepare, setPrepare] = useState<UseCallParameters | undefined>(
      undefined,
    )

    useEffect(() => {
      const prep = async () => {
        if (
          !approved ||
          !token0 ||
          !token1 ||
          !chain?.id ||
          !contract ||
          !underlying0 ||
          !underlying1 ||
          !address ||
          !pool ||
          !amountToRemove ||
          !debouncedMinAmount0 ||
          !debouncedMinAmount1 ||
          !deadline ||
          Number(percentage) === 0
        ) {
          return
        }

        const token1IsNative =
          EvmNative.fromChainId(_pool.chainId).wrap().address ===
          pool.token1.wrap().address

        const withNative =
          token1IsNative ||
          EvmNative.fromChainId(_pool.chainId).wrap().address ===
            pool.token0.address

        const config = (() => {
          if (signature?.message?.deadline) {
            if (withNative) {
              return {
                functionNames: [
                  'removeLiquidityETHWithPermit',
                  'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
                ],
                args: [
                  token1IsNative
                    ? pool.token0.wrap().address
                    : pool.token1.wrap().address,
                  amountToRemove.amount,
                  token1IsNative
                    ? debouncedMinAmount0.amount
                    : debouncedMinAmount1.amount,
                  token1IsNative
                    ? debouncedMinAmount1.amount
                    : debouncedMinAmount0.amount,
                  address,
                  signature.message.deadline,
                  false,
                  signature.v,
                  signature.r,
                  signature.s,
                ],
              } as const
            }

            return {
              functionNames: ['removeLiquidityWithPermit'],
              args: [
                pool.token0.wrap().address,
                pool.token1.wrap().address,
                amountToRemove.amount,
                debouncedMinAmount0.amount,
                debouncedMinAmount1.amount,
                address,
                signature.message.deadline,
                false,
                signature.v,
                signature.r,
                signature.s,
              ],
            } as const
          }

          if (withNative) {
            return {
              functionNames: [
                'removeLiquidityETH',
                'removeLiquidityETHSupportingFeeOnTransferTokens',
              ],
              args: [
                token1IsNative
                  ? pool.token0.wrap().address
                  : pool.token1.wrap().address,
                amountToRemove.amount,
                token1IsNative
                  ? debouncedMinAmount0.amount
                  : debouncedMinAmount1.amount,
                token1IsNative
                  ? debouncedMinAmount1.amount
                  : debouncedMinAmount0.amount,
                address,
                deadline,
              ],
            } as const
          }

          return {
            functionNames: ['removeLiquidity'],
            args: [
              pool.token0.wrap().address,
              pool.token1.wrap().address,
              amountToRemove.amount,
              debouncedMinAmount0.amount,
              debouncedMinAmount1.amount,
              address,
              deadline,
            ],
          } as const
        })()

        const safeGasEstimates = await Promise.all(
          config.functionNames.map(async (methodName) => {
            try {
              const estimatedGas: bigint = await (
                contract.estimateGas[methodName] as any
              )(config.args)
              return addGasMargin(estimatedGas)
            } catch (error) {
              logger.error(error, {
                location: 'RemoveSectionLegacy',
                action: 'estimateGas',
                functionName: methodName,
              })
              return undefined
            }
          }),
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
          } satisfies UseCallParameters
        }
      }

      prep()
        .then((config) => {
          setPrepare(config)
        })
        .catch((error) => {
          logger.error(error, {
            location: 'RemoveSectionLegacy',
            action: 'prepareTransaction',
          })
        })
    }, [
      approved,
      token0,
      token1,
      chain?.id,
      contract,
      underlying0,
      underlying1,
      address,
      pool,
      amountToRemove,
      debouncedMinAmount0,
      debouncedMinAmount1,
      deadline,
      _pool.chainId,
      percentage,
      signature,
    ])

    const { isError: isSimulationError } = useCall({
      ...prepare,
      chainId: _pool.chainId,
      query: {
        enabled: Boolean(approved && Number(percentage) > 0),
      },
    })

    const { sendTransactionAsync, isPending: isWritePending } =
      useSendTransaction({
        mutation: {
          onSuccess,
          onError: (error) => {
            if (error instanceof UserRejectedRequestError) {
              return
            }

            logger.error(error, {
              location: 'RemoveSectionLegacy',
              action: 'mutationError',
            })
          },
        },
      })

    const send = useMemo(() => {
      if (!prepare || isSimulationError) return undefined

      return async () => {
        // TODO: Fix this
        try {
          await sendTransactionAsync(prepare as any)
        } catch {}
      }
    }, [isSimulationError, prepare, sendTransactionAsync])

    return (
      <div>
        <RemoveSectionWidget
          isFarm={!!_pool.incentives && _pool.incentives.length > 0}
          chainId={_pool.chainId}
          percentage={percentage}
          token0={token0}
          token1={token1}
          token0Minimum={minAmount0}
          token1Minimum={minAmount1}
          setPercentage={setPercentage}
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
              <Checker.Network fullWidth chainId={_pool.chainId}>
                <Checker.Guard
                  fullWidth
                  guardWhen={+percentage <= 0}
                  guardText="Enter amount"
                >
                  <Checker.Slippage
                    fullWidth
                    text="Continue With High Slippage"
                    slippageTolerance={slippageTolerance}
                  >
                    <Checker.ApproveERC20WithPermit
                      fullWidth
                      id="approve-remove-liquidity-slp"
                      chainId={_pool.chainId}
                      amount={amountToRemove}
                      contract={
                        getSushiSwapRouterContractConfig(
                          _pool.chainId as SushiSwapV2ChainId,
                        ).address
                      }
                      permitInfo={REMOVE_V2_LIQUIDITY_PERMIT_INFO}
                      tag={APPROVE_TAG_REMOVE_LEGACY}
                      ttlStorageKey={TTLStorageKey.RemoveLiquidity}
                    >
                      <Checker.Success tag={APPROVE_TAG_REMOVE_LEGACY}>
                        <Button
                          fullWidth
                          onClick={() => send?.()}
                          disabled={!approved || isWritePending || !send}
                          testId="remove-liquidity"
                          size="xl"
                        >
                          {isWritePending ? (
                            <Dots>Confirm transaction</Dots>
                          ) : (
                            'Remove Liquidity'
                          )}
                        </Button>
                      </Checker.Success>
                    </Checker.ApproveERC20WithPermit>
                  </Checker.Slippage>
                </Checker.Guard>
              </Checker.Network>
            </Checker.Guard>
          </Checker.Connect>
        </RemoveSectionWidget>
      </div>
    )
  })
