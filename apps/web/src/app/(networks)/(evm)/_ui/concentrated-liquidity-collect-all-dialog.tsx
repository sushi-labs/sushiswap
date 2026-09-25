'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dots,
  Switch,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { logger } from 'src/lib/logger'
import {
  DialogConfirm,
  DialogProvider,
  DialogReview,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { getCollectFeesCalls } from 'src/lib/wagmi/hooks/positions/actions/get-collect-fees-calls'
import { getPositionCurrency } from 'src/lib/wagmi/hooks/positions/position-payment-currency'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Amount } from 'sushi'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  getEvmChainById,
  isEvmWNativeSupported,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { type SendTransactionReturnType, stringify } from 'viem'
import {
  useConfig,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useConnection } from 'wagmi'
import { usePublicClient } from 'wagmi'
import { call, getConnection } from 'wagmi/actions'
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
  const { chain } = useConnection()
  const config = useConfig()
  const client = usePublicClient({ chainId })
  const queryClient = useQueryClient()
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const [receiveWrapped, setReceiveWrapped] = useState(false)
  const [isCollecting, setIsCollecting] = useState(false)
  const collected = useRef(
    new Map<string, { hash: SendTransactionReturnType; success: boolean }>(),
  )
  const collectionSession = useRef(0)
  const isOpenRef = useRef(isOpen)

  useEffect(() => {
    isOpenRef.current = isOpen
    collectionSession.current++
    if (isOpen) collected.current.clear()
  }, [isOpen])

  const nativeToken = useMemo(() => EvmNative.fromChainId(chainId), [chainId])

  const hasNativeToken = useMemo(() => {
    if (!isEvmWNativeSupported(nativeToken.chainId)) return false
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

      const expectedToken0 = getPositionCurrency(token0, receiveWrapped)
      const expectedToken1 = getPositionCurrency(token1, receiveWrapped)

      const feeValue0 = new Amount(expectedToken0, position.fees[0])
      const feeValue1 = new Amount(expectedToken1, position.fees[1])

      if (feeValue0.eq(0n) && feeValue1.eq(0n)) return []

      return [
        {
          tokenId: position.tokenId.toString(),
          positionManager: position.positionManager,
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
    if (!isSushiSwapV3ChainId(chainId)) return []

    return getCollectFeesCalls({
      chainId,
      positions: positionsToCollect,
    })
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
          pending: 'Collecting fees from your pool positions',
          completed: 'Successfully collected position fees',
          failed: 'Something went wrong when trying to collect fees',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [account, chainId, client, refetchBalances],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'ConcentratedLiquidityCollectAllDialog',
      action: 'mutationError',
    })
    createErrorToast(e?.message, true)
  }, [])

  const { isError: isSimulationError, isSuccess: isSimulationSuccess } =
    useQuery({
      queryKey: ['simulateCollectFees', { prepare, account }],
      queryKeyHashFn: stringify,
      queryFn: async () => {
        return Promise.all(
          prepare.map((request) => call(config, { ...request, account })),
        )
      },
      enabled: Boolean(
        isOpen && account && prepare.length && chainId === chain?.id,
      ),
    })

  const {
    mutateAsync: sendTransactionAsync,
    isPending: isWritePending,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess,
    },
  })

  const { status } = useWaitForTransactionReceipt({
    chainId,
    hash,
  })

  const send = useMemo(() => {
    if (
      !prepare.length ||
      !isSimulationSuccess ||
      isCollecting ||
      !account ||
      chainId !== chain?.id
    )
      return undefined

    return async (confirm: () => void) => {
      const session = collectionSession.current
      setIsCollecting(true)
      try {
        for (const request of prepare) {
          // Closing or reopening the dialog cancels the remaining wallet prompts.
          if (!isOpenRef.current || session !== collectionSession.current)
            return
          const connection = getConnection(config)
          if (
            connection.address?.toLowerCase() !== account.toLowerCase() ||
            connection.chainId !== chainId
          ) {
            throw new Error(
              'Fee collection stopped because the wallet or network changed',
            )
          }
          const key = `${chainId}:${account.toLowerCase()}:${request.to}`
          let collection = collected.current.get(key)
          if (collection?.success) continue
          if (!collection) {
            const hash = await sendTransactionAsync({ ...request, account })
            collection = { hash, success: false }
            collected.current.set(key, collection)
          }
          const receipt = await client.waitForTransactionReceipt({
            hash: collection.hash,
          })
          if (receipt.status !== 'success') {
            collected.current.delete(key)
            throw new Error('Collecting position fees reverted')
          }
          collection.success = true
        }
        if (isOpenRef.current && session === collectionSession.current)
          confirm()
      } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)))
      } finally {
        setIsCollecting(false)
        void queryClient.invalidateQueries({
          queryKey: ['useConcentratedLiquidityPositions'],
        })
      }
    }
  }, [
    prepare,
    isSimulationSuccess,
    isCollecting,
    account,
    chainId,
    chain?.id,
    sendTransactionAsync,
    client,
    config,
    onError,
    queryClient,
  ])

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
                  {prepare.length > 1
                    ? ` · ${prepare.length} transactions required`
                    : ''}
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
                  loading={!send || isWritePending || isCollecting}
                  onClick={() => send?.(confirm)}
                  disabled={isSimulationError || isCollecting}
                  testId="confirm-claim-fees"
                  type="button"
                >
                  {isSimulationError ? (
                    'Shoot! Something went wrong :('
                  ) : isWritePending || isCollecting ? (
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
