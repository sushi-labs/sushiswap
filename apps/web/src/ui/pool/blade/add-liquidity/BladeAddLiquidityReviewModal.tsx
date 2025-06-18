import type { BladePool } from '@sushiswap/graph-client/data-api'
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
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { type FC, type ReactNode, useCallback, useEffect, useMemo } from 'react'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import {
  type RfqAllowDepositResponse,
  type useBladeAllowDeposit,
  useBladeDepositRequest,
  useBladeDepositTransaction,
} from 'src/lib/pool/blade/useBladeDeposit'
import { useUnlockDeposit } from 'src/lib/pool/blade/useUnlockDeposit'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { formatUSD } from 'sushi'
import { ChainKey } from 'sushi/chain'
import type { BladeChainId } from 'sushi/config'
import { type Type, tryParseAmount } from 'sushi/currency'
import { UserRejectedRequestError } from 'viem'
import { usePublicClient } from 'wagmi'
import { useAccount } from 'wagmi'
import { useWaitForTransactionReceipt } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useBladePoolPosition } from '../BladePoolPositionProvider'

interface BladeAddLiquidityReviewModalProps {
  pool: BladePool
  chainId: BladeChainId
  validInputs: Array<{ token: Type; amount: string }>
  depositPermission: RfqAllowDepositResponse
  children: ReactNode
  onSuccess: () => void
}

export const BladeAddLiquidityReviewModal: FC<
  BladeAddLiquidityReviewModalProps
> = ({
  pool,
  chainId,
  validInputs,
  depositPermission,
  children,
  onSuccess: _onSuccess,
}) => {
  const { address } = useAccount()
  const { approved } = useApproved(APPROVE_TAG_ADD_LEGACY)
  const client = usePublicClient()
  const { liquidityToken, vestingDeposit } = useBladePoolPosition()
  const poolTotalSupply = useTotalSupply(liquidityToken)

  const { refetchChain: refetchBalances } = useRefetchBalances()
  const { data: prices } = usePrices({ chainId })

  const hasLockedPosition = useMemo(() => {
    return Boolean(vestingDeposit?.balance && vestingDeposit.balance > 0n)
  }, [vestingDeposit?.balance])

  const canUnlockPosition = useMemo(() => {
    if (!vestingDeposit?.balance || !vestingDeposit.lockedUntil) return false
    return (
      vestingDeposit.balance > 0n && new Date() >= vestingDeposit.lockedUntil
    )
  }, [vestingDeposit?.balance, vestingDeposit?.lockedUntil])

  const { write: unlockDeposit, isPending: isUnlockingDeposit } =
    useUnlockDeposit({
      pool,
      enabled: canUnlockPosition,
      onSuccess: () => {
        // Re-trigger RFQ after unlock
        handleRfqCall()
      },
    })

  const {
    mutate,
    data: rfqResponse,
    isPending: rfqLoading,
    error: rfqError,
  } = useBladeDepositRequest()
  const transactionMutation = useBladeDepositTransaction({
    pool,
  })

  useEffect(() => {
    if (transactionMutation.data && validInputs.length > 0) {
      _onSuccess()

      const receipt = client.waitForTransactionReceipt({
        hash: transactionMutation.data,
      })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: transactionMutation.data,
        promise: receipt,
        summary: {
          pending: `Adding liquidity to the Blade pool`,
          completed: `Successfully added liquidity to the Blade pool`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    }
  }, [
    transactionMutation.data,
    validInputs,
    _onSuccess,
    chainId,
    address,
    client,
    refetchBalances,
  ])

  useEffect(() => {
    if (
      transactionMutation.error &&
      !(transactionMutation.error.cause instanceof UserRejectedRequestError)
    ) {
      createErrorToast(transactionMutation.error?.message, true)
    }
  }, [transactionMutation.error])

  const handleRfqCall = useCallback(async () => {
    if (!address || validInputs.length === 0) return

    const minLockDays =
      depositPermission && 'min_days_to_lock' in depositPermission
        ? depositPermission.min_days_to_lock
        : 0
    const minLockTime =
      depositPermission && 'min_lock_time' in depositPermission
        ? depositPermission.min_lock_time
        : 0

    mutate({
      pool_address: pool.address,
      sender: address,
      days_to_lock: minLockDays,
      lock_time: minLockTime,
      deposit: validInputs.reduce(
        (acc, input) => {
          const parsedAmount = tryParseAmount(input.amount, input.token)
          if (!parsedAmount) return acc
          acc[input.token.wrapped.address] = parsedAmount.quotient.toString()
          return acc
        },
        {} as Record<string, string>,
      ),
      chain_id: chainId,
    })
  }, [address, validInputs, pool.address, chainId, mutate, depositPermission])

  const handleConfirmTransaction = useCallback(
    async (confirm: () => void) => {
      if (!rfqResponse) return

      try {
        await transactionMutation.mutateAsync(rfqResponse)
        confirm()
      } catch (error) {
        console.error('Transaction failed:', error)
      }
    },
    [rfqResponse, transactionMutation],
  )

  const estimatedValue = useMemo(() => {
    if (!rfqResponse?.pool_tokens) return 0
    const estimatedPoolTokens = Number(rfqResponse.pool_tokens)
    const poolProportion =
      poolTotalSupply?.quotient && poolTotalSupply.quotient > 0
        ? estimatedPoolTokens /
          (Number(poolTotalSupply.quotient) + estimatedPoolTokens)
        : undefined
    const estimatedValue = poolProportion
      ? pool.liquidityUSD * poolProportion
      : 0
    return estimatedValue
  }, [rfqResponse, pool.liquidityUSD, poolTotalSupply])

  const { status } = useWaitForTransactionReceipt({
    chainId,
    hash: transactionMutation.data,
  })

  let lockTime:
    | {
        message: string
        seconds: number
      }
    | undefined
  if (rfqResponse && 'lock_time' in rfqResponse) {
    lockTime = {
      message: `${rfqResponse.lock_time} ${rfqResponse.lock_time === 1 ? 'minute' : 'minutes'}`,
      seconds: rfqResponse.lock_time * 60,
    }
  } else if (rfqResponse && 'n_days' in rfqResponse) {
    lockTime = {
      message: `${rfqResponse.n_days} ${rfqResponse.n_days === 1 ? 'day' : 'days'}`,
      seconds: rfqResponse.n_days * 24 * 60 * 60,
    }
  }

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild onClick={handleRfqCall}>
              {children}
            </DialogTrigger>
            <DialogContent>
              <div className="flex justify-between">
                <DialogHeader>
                  <DialogTitle>Add liquidity</DialogTitle>
                  <DialogDescription>
                    Please review your deposit details.
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Deposit amounts display */}
              <div className="flex flex-col gap-3 p-4 bg-white rounded-xl dark:bg-secondary border border-accent">
                <div className="flex flex-col gap-4">
                  {validInputs.map((input, index) => {
                    const parsedAmount = tryParseAmount(
                      input.amount,
                      input.token,
                    )
                    if (!parsedAmount) return null

                    const price = prices?.get(input.token.wrapped.address) || 0
                    const usdValue = Number(parsedAmount.toExact()) * price

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Currency.Icon
                            currency={input.token}
                            width={18}
                            height={18}
                          />
                          <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                            {input.token.symbol}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-900 dark:text-slate-50 font-semibold">
                            {parsedAmount.toSignificant(6)}
                          </span>
                          <span className="text-sm text-gray-400 dark:text-slate-400">
                            ${usdValue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {rfqResponse || rfqError ? (
                <div className="flex flex-col gap-3 p-4 bg-white rounded-xl dark:bg-secondary border border-accent">
                  {/* Show error if RFQ fails */}
                  {rfqError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-red-600 dark:text-red-400">
                        {rfqError.message}
                      </span>
                    </div>
                  )}

                  {/* Show estimated value when RFQ succeeds */}
                  {rfqResponse ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 dark:text-slate-400">
                        Estimated Value
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        {formatUSD(estimatedValue || 0)}
                      </span>
                    </div>
                  ) : null}

                  {lockTime?.message ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 dark:text-slate-400">
                        Lock time
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                        {lockTime.message}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <DialogFooter>
                <Checker.Custom
                  showChildren={!hasLockedPosition || !lockTime?.seconds}
                  onClick={unlockDeposit!}
                  buttonText={
                    canUnlockPosition
                      ? 'Unlock position'
                      : 'Wait for position to unlock'
                  }
                  loading={isUnlockingDeposit}
                  disabled={
                    !canUnlockPosition || !unlockDeposit || isUnlockingDeposit
                  }
                  fullWidth
                >
                  <Button
                    size="xl"
                    disabled={
                      rfqLoading ||
                      !!rfqError ||
                      !rfqResponse ||
                      transactionMutation.isPending ||
                      !approved
                    }
                    loading={transactionMutation.isPending}
                    fullWidth
                    onClick={() => handleConfirmTransaction(confirm)}
                    testId="confirm-add-blade-liquidity"
                  >
                    {transactionMutation.isPending ? (
                      <Dots>Confirm transaction</Dots>
                    ) : rfqError ? (
                      'Try again'
                    ) : rfqLoading ? (
                      <Dots>Getting quote</Dots>
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                </Checker.Custom>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="blade-confirmation-modal"
        successMessage="Successfully added liquidity"
        buttonText="Go to pool"
        buttonLink={`/${ChainKey[chainId]}/pool/blade/${pool.address}`}
        txHash={transactionMutation.data}
      />
    </DialogProvider>
  )
}
