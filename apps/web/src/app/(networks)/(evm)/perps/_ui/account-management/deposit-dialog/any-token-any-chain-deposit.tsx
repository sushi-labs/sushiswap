import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  Currency,
  Dots,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import {
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getPerpsDepositTransactionFees } from 'src/lib/perps/deposit/get-perps-deposit-transaction-fees'
import { LIFI_PERPS_USDC_DECIMALS } from 'src/lib/perps/deposit/lifi-perps-schemas'
import {
  useLifiPerpsDepositRoutes,
  useLifiPerpsDepositStep,
} from 'src/lib/perps/deposit/use-lifi-perps-deposit'
import {
  type LifiPerpsDepositExecution,
  useLifiPerpsDepositExecution,
} from 'src/lib/perps/deposit/use-lifi-perps-deposit-execution'
import { useLifiPerpsDepositStatus } from 'src/lib/perps/deposit/use-lifi-perps-deposit-status'
import { useMyTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-my-tokens'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { useApproved } from 'src/lib/wagmi/systems/checker/provider'
import {
  TransactionReceiptRevertedError,
  TransactionReplacedError,
} from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { useAccount } from 'src/lib/wallet'
import {
  Amount,
  Percent,
  formatNumber,
  formatUSD,
  getNativeAddress,
} from 'sushi'
import {
  DEFAULT_SLIPPAGE,
  type EvmCurrency,
  EvmNative,
  type EvmTxHash,
  addGasMargin,
} from 'sushi/evm'
import { formatUnits, zeroAddress } from 'viem'
import { useEstimateGas, usePublicClient, useSendTransaction } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { InputWithKeyboard } from '../../_common'
import { PerpsChecker } from '../../perps-checker'
import type { AnyTokenDepositOption } from './deposit-dialog'
import { DepositStatItem } from './deposit-stat-item'

const SLIPPAGE = new Percent({
  numerator: Math.floor(Number(DEFAULT_SLIPPAGE) * 100),
  denominator: 10_000,
})
const APPROVE_TAG = 'approve-perps-deposit'

function formatUsdc(amount?: string): string {
  return amount
    ? formatNumber(formatUnits(BigInt(amount), LIFI_PERPS_USDC_DECIMALS))
    : '0.00'
}

function formatDuration(seconds?: number): string {
  if (seconds === undefined) return '—'
  return seconds < 60
    ? `~${Math.ceil(seconds)} second${seconds === 1 ? '' : 's'}`
    : `~${Math.ceil(seconds / 60)} minute${Math.ceil(seconds / 60) === 1 ? '' : 's'}`
}

export function AnyTokenAnyChainDeposit({
  depositOption,
  setOpen,
  execution,
}: {
  depositOption: Extract<AnyTokenDepositOption, { type: 'any-token-any-chain' }>
  setOpen: (open: boolean) => void
  execution?: LifiPerpsDepositExecution
}): ReactElement {
  const address = useAccount('evm')
  const queryClient = useQueryClient()
  const client = usePublicClient({ chainId: depositOption.chainId })
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const [token, setToken] = useState<EvmCurrency>()
  const [amount, setAmount] = useState('')
  const localExecution = useLifiPerpsDepositExecution()
  const { submitted, setSubmitted, isSubmitting, setIsSubmitting } =
    execution ?? localExecution
  const [submissionError, setSubmissionError] = useState<string>()
  const submitting = useRef(false)
  const handledCompletion = useRef<EvmTxHash | undefined>(undefined)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const context = `${address}:${depositOption.chainId}:${token?.id}:${amount}`
  const currentContext = useRef(context)
  currentContext.current = context
  const currentAddress = useRef(address)
  currentAddress.current = address

  const { data: prices } = usePrices({ chainId: depositOption.chainId })
  const { data: tokenData, isLoading: isLoadingTokens } = useMyTokens({
    account: address,
    chainId: depositOption.chainId,
    includeNative: true,
  })
  const currencies = useMemo(
    () =>
      tokenData?.tokens.map((currency) => {
        const balance = tokenData.balanceMap?.get(
          currency.type === 'native'
            ? getNativeAddress(currency.chainId)
            : currency.address,
        )
        const price = prices?.getFraction(currency.wrap().address)
        return {
          currency,
          balance,
          usd: balance?.mul(price || 0n)?.toString({ fixed: 2 }),
        }
      }) ?? [],
    [tokenData, prices],
  )
  useEffect(() => {
    if (
      (!token || token.chainId !== depositOption.chainId) &&
      currencies.length &&
      !isSubmitting &&
      !submitted
    ) {
      setToken(currencies[0].currency)
      setAmount('')
    }
  }, [token, depositOption.chainId, currencies, isSubmitting, submitted])
  const selectedToken = currencies.find(
    (entry) => entry.currency.id === token?.id,
  )
  const fromAmount = useMemo(
    () =>
      token?.chainId === depositOption.chainId
        ? Amount.tryFromHuman(token, amount)
        : undefined,
    [token, amount, depositOption.chainId],
  )
  const {
    data: routes,
    isLoading: isLoadingRoutes,
    isError: isRoutesError,
  } = useLifiPerpsDepositRoutes({
    fromAmount,
    address,
    slippage: SLIPPAGE,
    enabled: !submitted && !isSubmitting,
  })
  const route = routes?.[0]
  const { approved } = useApproved(APPROVE_TAG)
  const requiresApproval =
    token?.type === 'token' && !route?.step.estimate.skipApproval
  const shouldPrepare =
    !!route && !submitted && !isSubmitting && (!requiresApproval || approved)
  const {
    data: step,
    isLoading: isPreparing,
    isError: isPreparationError,
  } = useLifiPerpsDepositStep({ step: route?.step, enabled: shouldPrepare })
  const isCurrentStep =
    !!step &&
    !!route &&
    step.id === route.step.id &&
    step.action.fromChainId === depositOption.chainId &&
    step.action.fromAddress.toLowerCase() === address?.toLowerCase() &&
    step.action.fromToken.address.toLowerCase() ===
      (token?.type === 'native' ? zeroAddress : token?.address.toLowerCase()) &&
    step.action.fromAmount === fromAmount?.amount.toString()
  const transaction = isCurrentStep ? step.transactionRequest : undefined
  const {
    data: gas,
    isLoading: isEstimating,
    isError: isGasError,
  } = useEstimateGas({
    chainId: depositOption.chainId,
    to: transaction?.to,
    data: transaction?.data,
    value: transaction ? BigInt(transaction.value) : undefined,
    account: transaction?.from,
    query: { enabled: shouldPrepare && !!transaction },
  })
  const { mutateAsync: sendTransaction, isPending: isWalletPending } =
    useSendTransaction()
  const { data: status, isError: isStatusError } = useLifiPerpsDepositStatus({
    txHash: submitted?.hash,
    fromChainId: submitted?.chainId ?? depositOption.chainId,
    bridge: submitted?.bridge,
    recipient: submitted?.recipient,
    minimumAmount: submitted?.minimumAmount,
    enabled: !!submitted && !submitted.sourceFailure,
  })
  const state = submitted?.sourceFailure
    ? 'failed'
    : (status?.state ?? 'pending')
  const isPending = !!submitted && state === 'pending'

  useEffect(() => {
    if (
      !submitted ||
      state !== 'completed' ||
      handledCompletion.current === submitted.hash
    )
      return
    handledCompletion.current = submitted.hash
    refetchBalances(submitted.chainId)
    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['useClearinghouseState', submitted.recipient],
      }),
      queryClient.invalidateQueries({
        queryKey: ['useUserNonFundingLedgerUpdates', submitted.recipient],
      }),
    ])
    if (
      currentAddress.current?.toLowerCase() ===
      submitted.recipient.toLowerCase()
    ) {
      setSubmitted(undefined)
      setOpen(false)
    }
  }, [submitted, state, refetchBalances, queryClient, setOpen, setSubmitted])

  const deposit = useCallback(async () => {
    if (
      submitting.current ||
      isSubmitting ||
      submitted ||
      !step ||
      !isCurrentStep ||
      !transaction ||
      !gas ||
      !fromAmount ||
      !address ||
      !client
    )
      return
    submitting.current = true
    setIsSubmitting(true)
    setSubmissionError(undefined)
    let broadcast = false
    try {
      const fees = await getPerpsDepositTransactionFees(
        depositOption.chainId,
        client,
      )
      if (!mounted.current || currentContext.current !== context)
        throw new Error('Deposit details changed. Review your deposit again.')
      const hash = await sendTransaction({
        chainId: depositOption.chainId,
        account: address,
        to: transaction.to,
        data: transaction.data,
        value: BigInt(transaction.value),
        gas: addGasMargin(gas, 30),
        ...fees,
      })
      broadcast = true
      setSubmitted({
        hash,
        chainId: depositOption.chainId,
        recipient: address,
        bridge: step.tool,
        amount: step.estimate.toAmount,
        minimumAmount: step.estimate.toAmountMin,
      })
      let activeHash = hash
      let wasReplaced = false
      const promise = client
        .waitForTransactionReceipt({
          hash,
          onReplaced: ({ reason, transaction }) => {
            const previousHash = activeHash
            const replacementHash = transaction.hash
            activeHash = replacementHash
            if (reason !== 'repriced') wasReplaced = true
            setSubmitted((previous) =>
              previous?.hash === previousHash
                ? {
                    ...previous,
                    hash: replacementHash,
                    sourceFailure:
                      previous.sourceFailure ??
                      (reason === 'repriced' ? undefined : 'replaced'),
                  }
                : previous,
            )
          },
        })
        .then((receipt) => {
          if (wasReplaced) throw new TransactionReplacedError('replaced')
          if (receipt.status !== 'success') {
            setSubmitted((previous) =>
              previous?.hash === activeHash
                ? { ...previous, sourceFailure: 'reverted' }
                : previous,
            )
            throw new TransactionReceiptRevertedError(receipt.transactionHash)
          }
          return receipt
        })
      const timestamp = Date.now()
      void createToast({
        account: address,
        type: 'send',
        chainId: depositOption.chainId,
        txHash: hash,
        promise,
        summary: {
          pending: `Sending ${fromAmount.toSignificant(6)} ${fromAmount.currency.symbol} to your perps account`,
          completed: 'Deposit submitted. Waiting for perps USDC.',
          failed: 'The deposit transaction failed.',
        },
        timestamp,
        groupTimestamp: timestamp,
        variant: 'perps',
      })
      await promise
    } catch (error) {
      if (
        !isUserRejectedError(error) &&
        !(error instanceof TransactionReplacedError) &&
        !(error instanceof TransactionReceiptRevertedError)
      ) {
        const message = broadcast
          ? 'Deposit submitted. Tracking will continue while transaction confirmation is unavailable.'
          : error instanceof Error
            ? error.message
            : 'Unable to submit the deposit.'
        if (mounted.current) setSubmissionError(message)
        if (!broadcast) createErrorToast(message, false, 'perps')
      }
    } finally {
      submitting.current = false
      setIsSubmitting(false)
      if (broadcast) refetchBalances(depositOption.chainId)
    }
  }, [
    submitted,
    isSubmitting,
    setSubmitted,
    setIsSubmitting,
    step,
    isCurrentStep,
    transaction,
    gas,
    fromAmount,
    address,
    client,
    depositOption.chainId,
    context,
    sendTransaction,
    refetchBalances,
  ])

  const estimate = isCurrentStep ? step.estimate : route?.step.estimate
  const displayedAmount = submitted?.amount ?? estimate?.toAmount
  const displayedMinimum = submitted?.minimumAmount ?? estimate?.toAmountMin
  const hasRoute = !!route && BigInt(route.toAmountMin) > 0n
  const loading = isSubmitting || isWalletPending || isPreparing || isEstimating
  const statusMessage =
    state === 'partial'
      ? 'The route delivered a different asset. Review the transfer details before making another deposit.'
      : state === 'refunded'
        ? 'The transfer was refunded. Review the transfer details for the returned asset and network.'
        : state === 'unverified'
          ? 'We could not verify the perps credit. Review the transfer details before making another deposit.'
          : state === 'failed'
            ? submitted?.sourceFailure
              ? submitted.sourceFailure === 'replaced'
                ? 'The source transaction was cancelled or replaced. Review your wallet before trying again.'
                : 'The source transaction reverted. Your deposit was not sent.'
              : 'The deposit could not be completed. Review the transfer details.'
            : state === 'completed'
              ? 'USDC has been deposited into your perps account.'
              : 'Waiting for perps USDC'

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={token?.id}
        disabled={!!submitted || isSubmitting}
        onValueChange={(value) => {
          const option = currencies.find((entry) => entry.currency.id === value)
          if (option && !submitted && !submitting.current) {
            setToken(option.currency)
            setAmount('')
            setSubmissionError(undefined)
          }
        }}
      >
        <SelectTrigger
          aria-label="Deposit token"
          className="w-full text-sm !px-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border"
        >
          {token ? (
            <div className="flex items-center gap-1">
              <Currency.Icon
                disableLink
                currency={token}
                width={20}
                height={20}
              />
              {token.name} ({token.symbol})
            </div>
          ) : (
            'Select a Token'
          )}
        </SelectTrigger>
        <SelectContent className="w-full !bg-black/10">
          {currencies.map((entry) => (
            <SelectItem
              key={entry.currency.id}
              value={entry.currency.id}
              className="font-medium !text-white gap-4 !block"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <Currency.Icon
                    disableLink
                    currency={entry.currency}
                    width={20}
                    height={20}
                  />
                  {entry.currency.name} ({entry.currency.symbol})
                </div>
                <div>
                  {formatUSD(entry.usd || '0')} (
                  {formatNumber(entry.balance?.toSignificant(6) || '0')})
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {submitted ? (
        <div className="flex flex-col gap-2 py-4 text-center" role="status">
          <p className="font-medium">
            {isPending
              ? 'Depositing into your perps account'
              : state === 'completed'
                ? 'Deposit complete'
                : 'Deposit needs attention'}
          </p>
          <p className="text-perps-muted-50 text-sm">
            {isPending ? <Dots>{statusMessage}</Dots> : statusMessage}
          </p>
          {isStatusError && (
            <p className="text-perps-muted-50 text-sm">
              Status is temporarily unavailable. Checking again automatically.
            </p>
          )}
          <a
            className="text-sm text-perps-blue underline"
            href={
              status?.lifiExplorerLink ??
              `https://scan.li.fi/tx/${submitted.hash}`
            }
            target="_blank"
            rel="noreferrer"
          >
            View transfer
          </a>
        </div>
      ) : isSubmitting ? (
        <p
          className="py-4 text-center text-sm text-perps-muted-50"
          role="status"
        >
          <Dots>Confirm the deposit in your wallet</Dots>
        </p>
      ) : (
        <InputWithKeyboard
          amount={amount}
          setAmount={(value) => {
            if (!submitting.current && !isSubmitting) {
              setAmount(value)
              setSubmissionError(undefined)
            }
          }}
          balance={selectedToken?.balance}
          currency={token ?? EvmNative.fromChainId(depositOption.chainId)}
          error={undefined}
          isLoading={isLoadingTokens}
          address={address}
        />
      )}
      <div className="flex flex-col gap-1">
        <DepositStatItem
          label="Expected deposit"
          value={`${formatUsdc(displayedAmount)} USDC`}
          isLoading={!submitted && isLoadingRoutes}
        />
        <DepositStatItem
          label="Min. received"
          value={`${formatUsdc(displayedMinimum)} USDC`}
          isLoading={!submitted && isLoadingRoutes}
        />
        {!submitted && (
          <DepositStatItem
            label="Estimated time"
            value={formatDuration(estimate?.executionDuration)}
            isLoading={isLoadingRoutes}
          />
        )}
      </div>
      {submissionError && (
        <p role="alert" className="text-sm text-perps-muted-70">
          {submissionError}
        </p>
      )}
      {!submitted && (isPreparationError || isGasError) && (
        <p role="alert" className="text-sm text-perps-muted-70">
          {isGasError
            ? 'Unable to estimate source-chain gas. Check your balance and try again.'
            : 'Unable to prepare this deposit. Please try again.'}
        </p>
      )}
      <PerpsChecker.Legal size="default" variant="perps-tertiary">
        {submitted ? (
          <Button
            variant="perps-tertiary"
            size="default"
            className="w-full"
            disabled={isPending || isSubmitting}
            onClick={() => {
              if (
                state === 'unverified' ||
                state === 'partial' ||
                state === 'completed'
              ) {
                setSubmitted(undefined)
                setOpen(false)
                return
              }
              setSubmitted(undefined)
              setSubmissionError(undefined)
            }}
          >
            {isPending
              ? 'Deposit pending'
              : state === 'unverified' ||
                  state === 'partial' ||
                  state === 'completed'
                ? 'Close'
                : 'Try again'}
          </Button>
        ) : isSubmitting ? (
          <Button
            variant="perps-tertiary"
            size="default"
            className="w-full"
            disabled
            loading
          >
            Confirm in wallet
          </Button>
        ) : (
          <Checker.Connect
            size="default"
            variant="perps-tertiary"
            namespace="evm"
          >
            <Checker.Network
              size="default"
              chainId={depositOption.chainId}
              variant="perps-tertiary"
            >
              <Checker.Amounts
                size="default"
                chainId={depositOption.chainId}
                amount={fromAmount}
                variant="perps-tertiary"
              >
                <Checker.Custom
                  onClick={() => {}}
                  size="default"
                  showChildren={hasRoute}
                  buttonText={
                    isLoadingRoutes
                      ? 'Loading Routes'
                      : isRoutesError
                        ? 'Unable to load routes'
                        : 'No deposit route available'
                  }
                  variant="perps-tertiary"
                  loading={isLoadingRoutes}
                  disabled={!hasRoute}
                >
                  <Checker.ApproveERC20
                    size="default"
                    id={APPROVE_TAG}
                    variant="perps-tertiary"
                    amount={fromAmount}
                    contract={route?.step.estimate.approvalAddress}
                    enabled={requiresApproval}
                  >
                    <Checker.Success tag={APPROVE_TAG}>
                      <Button
                        variant="perps-tertiary"
                        size="default"
                        className="w-full"
                        disabled={
                          !transaction || !gas || !hasRoute || isSubmitting
                        }
                        loading={loading}
                        onClick={deposit}
                      >
                        Deposit
                      </Button>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Custom>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        )}
      </PerpsChecker.Legal>
    </div>
  )
}
