import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
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
  List,
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
import type { RfqAllowDepositResponse } from 'src/lib/pool/blade/useBladeAllowDeposit'
import { useBladeDepositRequest } from 'src/lib/pool/blade/useBladeDepositRequest'
import { useBladeDepositTransaction } from 'src/lib/pool/blade/useBladeDepositTransaction'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/provider'
import { Amount, formatUSD } from 'sushi'
import { type BladeChainId, type EvmCurrency, getEvmChainById } from 'sushi/evm'
import type { Hex } from 'viem'
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useBladePoolPosition } from '../blade-pool-position-provider'

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
  const { liquidityToken, refetch: refetchPosition } = useBladePoolPosition()
  const poolTotalSupply = useTotalSupply(liquidityToken)
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const { data: prices } = usePrices({ chainId })

  const onSuccess = useCallback(
    (hash: Hex) => {
      _onSuccess()

      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
        refetchPosition()
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
    [refetchBalances, refetchPosition, _onSuccess, address, chainId, client],
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

              <List>
                <List.Control>
                  {validInputs.map((input, index) => {
                    const parsedAmount = Amount.tryFromHuman(
                      input.token,
                      input.amount,
                    )
                    if (!parsedAmount) return null

                    const price = prices?.get(input.token.wrap().address) || 0
                    const usdValue = Number(parsedAmount.toString()) * price

                    return (
                      <List.KeyValue
                        key={index}
                        title={
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
                        }
                      >
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-900 dark:text-slate-50 font-semibold">
                            {parsedAmount.toSignificant(6)}
                          </span>
                          <span className="text-sm text-gray-400 dark:text-slate-400">
                            ${usdValue.toFixed(2)}
                          </span>
                        </div>
                      </List.KeyValue>
                    )
                  })}
                </List.Control>
              </List>

              {depositRequest.data ? (
                <List>
                  <List.Control>
                    <List.KeyValue title="Estimated Value">
                      {formatUSD(estimatedValue || 0)}
                    </List.KeyValue>

                    {lockTime?.message ? (
                      <List.KeyValue title="Lock time">
                        {lockTime.message}
                      </List.KeyValue>
                    ) : null}
                  </List.Control>
                </List>
              ) : null}

              <DialogFooter>
                <AddLiquidityButton
                  depositRequest={depositRequest}
                  handleRfqCall={handleRfqCall}
                  transactionMutation={transactionMutation}
                  handleConfirmTransaction={handleConfirmTransaction}
                  approved={approved}
                  confirm={confirm}
                />
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
