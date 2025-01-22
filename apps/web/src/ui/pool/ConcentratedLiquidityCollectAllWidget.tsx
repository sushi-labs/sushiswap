'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  Dots,
  Switch,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Chain, ChainId } from 'sushi/chain'
import {
  SUSHISWAP_V3_POSTIION_MANAGER,
  isSushiSwapV3ChainId,
} from 'sushi/config'
import { Amount, Native, Type, unwrapToken } from 'sushi/currency'
import { NonfungiblePositionManager } from 'sushi/pool/sushiswap-v3'
import { Hex, SendTransactionReturnType, UserRejectedRequestError } from 'viem'
import {
  useCall,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { useTokenAmountDollarValues } from '../../lib/hooks'

interface ConcentratedLiquidityCollectAllWidget {
  positions: ConcentratedLiquidityPositionWithV3Pool[]
  chainId: ChainId
  account: `0x${string}` | undefined
}

export const ConcentratedLiquidityCollectAllWidget: FC<
  ConcentratedLiquidityCollectAllWidget
> = ({ positions, chainId, account }) => {
  const { chain } = useAccount()
  const client = usePublicClient()
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const [receiveWrapped, setReceiveWrapped] = useState(false)

  const nativeToken = useMemo(() => Native.onChain(chainId), [chainId])

  const hasNativeToken = useMemo(() => {
    return positions.some(({ pool: { token0, token1 } }) => {
      if (!token0 || !token1 || !nativeToken) return false
      return (
        token0.isNative ||
        token1.isNative ||
        token0.address === nativeToken.wrapped?.address ||
        token1.address === nativeToken.wrapped?.address
      )
    })
  }, [positions, nativeToken])

  const positionsToCollect = useMemo(() => {
    return positions.flatMap((position) => {
      const { token0, token1 } = position.pool
      if (!token0 || !token1 || !position?.fees || !account) return []

      const expectedToken0 = receiveWrapped
        ? token0.wrapped
        : unwrapToken(token0)
      const expectedToken1 = receiveWrapped
        ? token1.wrapped
        : unwrapToken(token1)

      const feeValue0 = Amount.fromRawAmount(expectedToken0, position.fees[0])
      const feeValue1 = Amount.fromRawAmount(expectedToken1, position.fees[1])

      if (feeValue0.equalTo(0n) && feeValue1.equalTo(0n)) return []

      return [
        {
          tokenId: position.tokenId.toString(),
          expectedCurrencyOwed0: feeValue0,
          expectedCurrencyOwed1: feeValue1,
          recipient: account,
        },
      ]
    })
  }, [positions, receiveWrapped, account])

  const aggregatedAmounts = useMemo(() => {
    const aggregatedAmounts = new Map<string, Amount<Type>>()

    positionsToCollect.forEach((position) => {
      const { expectedCurrencyOwed0, expectedCurrencyOwed1 } = position

      if (expectedCurrencyOwed0.greaterThan(0n)) {
        const existing = aggregatedAmounts.get(
          expectedCurrencyOwed0.currency.id,
        )
        aggregatedAmounts.set(
          expectedCurrencyOwed0.currency.id,
          existing
            ? existing.add(expectedCurrencyOwed0)
            : expectedCurrencyOwed0,
        )
      }

      if (expectedCurrencyOwed1.greaterThan(0n)) {
        const existing = aggregatedAmounts.get(
          expectedCurrencyOwed1.currency.id,
        )
        aggregatedAmounts.set(
          expectedCurrencyOwed1.currency.id,
          existing
            ? existing.add(expectedCurrencyOwed1)
            : expectedCurrencyOwed1,
        )
      }
    })

    return Array.from(aggregatedAmounts.values())
  }, [positionsToCollect])

  const feeValues = useTokenAmountDollarValues({
    chainId,
    amounts: aggregatedAmounts,
  })

  const totalFeeValue = useMemo(() => {
    return feeValues.reduce((sum, value) => sum + value, 0)
  }, [feeValues])

  const prepare = useMemo(() => {
    if (!isSushiSwapV3ChainId(chainId)) return

    if (positionsToCollect.length === 0) return

    const { calldata, value } =
      NonfungiblePositionManager.collectCallParameters(positionsToCollect)

    return {
      to: SUSHISWAP_V3_POSTIION_MANAGER[chainId],
      data: calldata as Hex,
      value: BigInt(value),
      chainId,
    }
  }, [positionsToCollect, chainId])

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'claimRewards',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: 'Collecting fees from all your pool positions',
          completed: 'Successfully collected fees from all your pool positions',
          failed: 'Something went wrong when trying to collect fees',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [account, chainId, client, refetchBalances],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const { isError: isSimulationError } = useCall({
    ...prepare,
    chainId,
    query: {
      enabled: Boolean(prepare && chainId === chain?.id),
    },
  })

  const {
    sendTransactionAsync,
    isPending: isWritePending,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const { status } = useWaitForTransactionReceipt({
    chainId,
    hash,
  })

  const send = useMemo(() => {
    if (!prepare || isSimulationError) return undefined

    return async (confirm: () => void) => {
      try {
        await sendTransactionAsync(prepare)
        confirm()
      } catch {}
    }
  }, [isSimulationError, prepare, sendTransactionAsync])

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="ml-auto">
              <Checker.Connect className="min-w-[160px]" size="sm" fullWidth>
                <Checker.Network
                  className="min-w-[160px]"
                  size="sm"
                  fullWidth
                  chainId={chainId}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="min-w-[160px]"
                      size="sm"
                      fullWidth
                      disabled={!aggregatedAmounts.length}
                      testId="claim-fees-all"
                    >
                      Claim Fees
                    </Button>
                  </DialogTrigger>
                </Checker.Network>
              </Checker.Connect>
            </div>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Claim V3 Fees</DialogTitle>
                <DialogDescription>
                  On {Chain.from(chainId)?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl dark:bg-slate-800">
                  <span className="font-semibold text-sm">Total Value</span>
                  <span className="font-semibold text-sm">
                    ${totalFeeValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4 bg-white rounded-xl dark:bg-slate-800">
                  <span className="text-xs text-gray-400">
                    You'll receive collected fees:
                  </span>
                  <div className="flex flex-col gap-4">
                    {aggregatedAmounts.map((amount, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Currency.Icon
                            currency={amount.currency}
                            width={18}
                            height={18}
                          />
                          <span className="text-sm text-gray-500 font-medium">
                            {amount.currency.symbol}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 font-semibold">
                            {amount.toSignificant(6)}
                          </span>
                          <span className="text-sm text-gray-400">
                            ${feeValues[i].toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {hasNativeToken && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 text-sm">
                      Receive {nativeToken?.wrapped.symbol} instead of{' '}
                      {nativeToken?.symbol}
                    </span>
                    <Switch
                      checked={receiveWrapped}
                      onCheckedChange={setReceiveWrapped}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  fullWidth
                  size="xl"
                  loading={!send || isWritePending}
                  onClick={() => send?.(confirm)}
                  disabled={isSimulationError}
                  testId="confirm-claim-fees"
                  type="button"
                >
                  {isSimulationError ? (
                    'Shoot! Something went wrong :('
                  ) : isWritePending ? (
                    <Dots>Confirm Claim</Dots>
                  ) : (
                    'Claim'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="make-another-swap"
        buttonText="Close"
        txHash={hash}
        successMessage="You successfully claimed fees from all your positions"
      />
    </DialogProvider>
  )
}
