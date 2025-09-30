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
  DialogType,
  Dots,
  Switch,
  useDialog,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import type React from 'react'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { logger } from 'src/lib/logger'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Amount } from 'sushi'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  NonfungiblePositionManager,
  SUSHISWAP_V3_POSITION_MANAGER,
  getEvmChainById,
  isSushiSwapV3ChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import {
  type Hex,
  type SendTransactionReturnType,
  UserRejectedRequestError,
} from 'viem'
import {
  useCall,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface ConcentratedLiquidityCollectAllDialog {
  positions: ConcentratedLiquidityPositionWithV3Pool[]
  chainId: EvmChainId
  account: `0x${string}` | undefined
  children?:
    | React.ReactNode
    | ((args: { amounts: Amount<EvmCurrency>[] }) => ReactNode)
}

export const ConcentratedLiquidityCollectAllDialog: FC<
  ConcentratedLiquidityCollectAllDialog
> = ({ positions, chainId, account, children }) => {
  return (
    <DialogProvider>
      <_ConcentratedLiquidityCollectAllDialog
        positions={positions}
        chainId={chainId}
        account={account}
      >
        {children}
      </_ConcentratedLiquidityCollectAllDialog>
    </DialogProvider>
  )
}

const _ConcentratedLiquidityCollectAllDialog: FC<
  ConcentratedLiquidityCollectAllDialog
> = ({ positions, chainId, account, children }) => {
  const { open: isOpen } = useDialog(DialogType.Review)
  const { chain } = useAccount()
  const client = usePublicClient()
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const [receiveWrapped, setReceiveWrapped] = useState(false)

  const nativeToken = useMemo(() => EvmNative.fromChainId(chainId), [chainId])

  const hasNativeToken = useMemo(() => {
    return positions.some(({ pool: { token0, token1 } }) => {
      if (!token0 || !token1 || !nativeToken) return false
      return (
        token0.address === nativeToken.wrap()?.address ||
        token1.address === nativeToken.wrap()?.address
      )
    })
  }, [positions, nativeToken])

  const positionsToCollect = useMemo(() => {
    return positions.flatMap((position) => {
      const { token0, token1 } = position.pool
      if (!token0 || !token1 || !position?.fees || !account) return []

      const expectedToken0 = receiveWrapped
        ? token0.wrap()
        : unwrapEvmToken(token0)
      const expectedToken1 = receiveWrapped
        ? token1.wrap()
        : unwrapEvmToken(token1)

      const feeValue0 = new Amount(expectedToken0, position.fees[0])
      const feeValue1 = new Amount(expectedToken1, position.fees[1])

      if (feeValue0.eq(0n) && feeValue1.eq(0n)) return []

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
    const aggregatedAmounts = new Map<string, Amount<EvmCurrency>>()

    positionsToCollect.forEach((position) => {
      const { expectedCurrencyOwed0, expectedCurrencyOwed1 } = position

      if (expectedCurrencyOwed0.gt(0n)) {
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

      if (expectedCurrencyOwed1.gt(0n)) {
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
      to: SUSHISWAP_V3_POSITION_MANAGER[chainId],
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
    if (e.cause instanceof UserRejectedRequestError) {
      return
    }

    logger.error(e, {
      location: 'ConcentratedLiquidityCollectAllDialog',
      action: 'mutationError',
    })
    createErrorToast(e?.message, true)
  }, [])

  const { isError: isSimulationError } = useCall({
    ...prepare,
    chainId,
    query: {
      enabled: Boolean(isOpen && prepare && chainId === chain?.id),
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
    <>
      <DialogReview>
        {({ confirm }) => (
          <>
            {typeof children === 'function'
              ? children({ amounts: aggregatedAmounts })
              : children}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Claim V3 Fees</DialogTitle>
                <DialogDescription>
                  On {getEvmChainById(chainId).name}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl dark:bg-secondary border border-accent">
                  <span className="font-semibold text-sm text-gray-900 dark:text-slate-50">
                    Total Value
                  </span>
                  <span className="font-semibold text-sm text-gray-900 dark:text-slate-50">
                    ${totalFeeValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4 bg-white rounded-xl dark:bg-secondary border border-accent">
                  <span className="text-xs text-gray-400 dark:text-slate-400">
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
                          <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                            {amount.currency.symbol}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 dark:text-slate-50 font-semibold">
                            {amount.toSignificant(6)}
                          </span>
                          <span className="text-sm text-gray-400 dark:text-slate-400">
                            ${feeValues[i].toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {hasNativeToken && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 dark:text-slate-400 text-sm">
                      Receive {nativeToken?.wrap().symbol} instead of{' '}
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
    </>
  )
}
