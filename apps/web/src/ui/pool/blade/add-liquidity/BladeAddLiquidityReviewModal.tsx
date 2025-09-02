import type { BladePool } from '@sushiswap/graph-client/data-api'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  Currency,
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
} from '@sushiswap/ui'
import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import {
  type RfqAllowDepositResponse,
  useBladeDepositRequest,
  useBladeDepositTransaction,
} from 'src/lib/pool/blade/useBladeDeposit'
import { useUnlockDeposit } from 'src/lib/pool/blade/useUnlockDeposit'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { Amount, formatUSD } from 'sushi'
import { type BladeChainId, type EvmCurrency, getEvmChainById } from 'sushi/evm'
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useBladePoolPosition } from '../BladePoolPositionProvider'

interface BladeAddLiquidityReviewModalContextType {
  onClick: () => void
}

const BladeAddLiquidityReviewModalContext = createContext<
  BladeAddLiquidityReviewModalContextType | undefined
>(undefined)

export const useBladeAddLiquidityReviewModal = () => {
  const context = useContext(BladeAddLiquidityReviewModalContext)
  if (!context) {
    throw new Error(
      'Hook must be used within a BladeAddLiquidityReviewModalProvider',
    )
  }
  return context
}
interface BladeAddLiquidityReviewModalProps {
  pool: BladePool
  chainId: BladeChainId
  validInputs: Array<{ token: EvmCurrency; amount: string }>
  depositPermission: RfqAllowDepositResponse | undefined
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

  const onSuccess = useCallback(
    (hash: `0x${string}`) => {
      _onSuccess()

      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: `Adding liquidity to the Blade pool`,
          completed: `Successfully added liquidity to the Blade pool`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [refetchBalances, _onSuccess, address, chainId, client],
  )

  const onTransactionError = useCallback((e: Error) => {
    if (!isUserRejectedError(e)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const onDepositRequestError = useCallback((e: Error) => {
    createErrorToast(e?.message, true)
  }, [])

  const depositRequest = useBladeDepositRequest({
    onError: onDepositRequestError,
  })
  const transactionMutation = useBladeDepositTransaction({
    pool,
    onSuccess,
    onError: onTransactionError,
  })

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

    depositRequest.mutate({
      pool_address: pool.address,
      sender: address,
      days_to_lock: minLockDays,
      lock_time: minLockTime,
      deposit: validInputs.reduce(
        (acc, input) => {
          const parsedAmount = Amount.tryFromHuman(input.token, input.amount)
          if (!parsedAmount) return acc
          const wrappedToken = input.token.wrap()
          acc[wrappedToken.address] = `${parsedAmount.amount}`
          return acc
        },
        {} as Record<string, string>,
      ),
      chain_id: chainId,
      single_asset:
        depositPermission?.feature_single_asset_deposit &&
        validInputs.length === 1,
    })
  }, [
    address,
    validInputs,
    pool.address,
    chainId,
    depositRequest,
    depositPermission,
  ])

  const handleConfirmTransaction = useCallback(
    async (confirm: () => void) => {
      if (!depositRequest.data || !address) return
      try {
        await transactionMutation.mutateAsync({
          deposit: depositRequest.data,
          amounts: validInputs,
        })
        confirm()
      } catch {}
    },
    [depositRequest.data, address, transactionMutation, validInputs],
  )

  const estimatedValue = useMemo(() => {
    if (!depositRequest.data?.pool_tokens) return 0
    const estimatedPoolTokens = Number(depositRequest.data.pool_tokens)
    const poolProportion =
      poolTotalSupply?.amount && poolTotalSupply.amount > 0
        ? estimatedPoolTokens /
          (Number(poolTotalSupply.amount) + estimatedPoolTokens)
        : undefined
    const estimatedValue = poolProportion
      ? pool.liquidityUSD * poolProportion
      : 0
    return estimatedValue
  }, [depositRequest.data, pool.liquidityUSD, poolTotalSupply])

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
  if (depositRequest.data && 'lock_time' in depositRequest.data) {
    lockTime = {
      message: `${depositRequest.data.lock_time} ${depositRequest.data.lock_time === 1 ? 'minute' : 'minutes'}`,
      seconds: depositRequest.data.lock_time * 60,
    }
  } else if (depositRequest.data && 'n_days' in depositRequest.data) {
    lockTime = {
      message: `${depositRequest.data.n_days} ${depositRequest.data.n_days === 1 ? 'day' : 'days'}`,
      seconds: depositRequest.data.n_days * 24 * 60 * 60,
    }
  }

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <BladeAddLiquidityReviewModalContext.Provider
              value={{ onClick: handleRfqCall }}
            >
              {children}
            </BladeAddLiquidityReviewModalContext.Provider>
            <DialogContent>
              <div className="flex justify-between">
                <DialogHeader>
                  <DialogTitle>Add liquidity</DialogTitle>
                  <DialogDescription>
                    Please review your deposit details.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-white rounded-xl dark:bg-secondary border border-accent">
                <div className="flex flex-col gap-4">
                  {validInputs.map((input, index) => {
                    const parsedAmount = Amount.tryFromHuman(
                      input.token,
                      input.amount,
                    )
                    if (!parsedAmount) return null

                    const price = prices?.get(input.token.wrap().address) || 0
                    const usdValue = Number(parsedAmount.amount) * price

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Currency.Icon
                            currency={input.token}
                            width={18}
                            height={18}
                          />
                          <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-slate-50">
                              {input.token.symbol}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {input.token.name}
                            </div>
                          </div>
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

              {depositRequest.data ? (
                <div className="flex flex-col gap-3 p-4 bg-white rounded-xl dark:bg-secondary border border-accent">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 dark:text-slate-400">
                      Estimated Value
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                      {formatUSD(estimatedValue || 0)}
                    </span>
                  </div>

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
                  <AddLiquidityButton
                    depositRequest={depositRequest}
                    handleRfqCall={handleRfqCall}
                    transactionMutation={transactionMutation}
                    handleConfirmTransaction={handleConfirmTransaction}
                    approved={approved}
                    confirm={confirm}
                  />
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
        buttonLink={`/${getEvmChainById(chainId).key}/pool/blade/${pool.address}`}
        txHash={transactionMutation.data}
      />
    </DialogProvider>
  )
}

const AddLiquidityButton: FC<{
  depositRequest: ReturnType<typeof useBladeDepositRequest>
  handleRfqCall: () => void
  transactionMutation: ReturnType<typeof useBladeDepositTransaction>
  handleConfirmTransaction: (confirm: () => void) => Promise<void>
  approved: boolean
  confirm: () => void
}> = ({
  depositRequest,
  handleRfqCall,
  transactionMutation,
  handleConfirmTransaction,
  approved,
  confirm,
}) => {
  if (!depositRequest.data) {
    return (
      <Button
        size="xl"
        fullWidth
        onClick={handleRfqCall}
        disabled={depositRequest.isPending}
      >
        {depositRequest.isPending ? <Dots>Getting quote</Dots> : 'Get quote'}
      </Button>
    )
  }

  return (
    <Button
      size="xl"
      disabled={transactionMutation.isPending || !approved}
      loading={transactionMutation.isPending}
      fullWidth
      onClick={() => handleConfirmTransaction(confirm)}
    >
      {transactionMutation.isPending ? (
        <Dots>Confirm transaction</Dots>
      ) : (
        'Confirm'
      )}
    </Button>
  )
}

export const BladeAddLiquidityReviewModalTrigger: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { onClick } = useBladeAddLiquidityReviewModal()
  return (
    <DialogTrigger asChild onClick={onClick}>
      {children}
    </DialogTrigger>
  )
}
