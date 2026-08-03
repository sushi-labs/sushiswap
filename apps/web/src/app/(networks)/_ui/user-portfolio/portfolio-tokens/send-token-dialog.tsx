'use client'

import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  TextField,
} from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import { useTransferSol } from 'src/lib/svm/hooks/use-transfer-sol'
import { useTransferSplToken } from 'src/lib/svm/hooks/use-transfer-spl-token'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/Currency'
import {
  getNativeBalanceReserve,
  getSpendableNativeBalance,
} from 'src/lib/wagmi/components/web3-input/Currency/native-balance-reserve'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount, getChainById } from 'sushi'
import { type EvmCurrency, isEvmAddress, isEvmChainId } from 'sushi/evm'
import { type SvmCurrency, isSvmAddress, svmAddress } from 'sushi/svm'
import { zeroAddress } from 'viem'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useTransferEvmToken } from './use-transfer-evm-token'

interface SendTokenDialogProps {
  currency: EvmCurrency | SvmCurrency
  open: boolean
  onOpenChange(open: boolean): void
  onTransferConfirmed(): Promise<void>
}

function isEvmCurrency(
  currency: EvmCurrency | SvmCurrency,
): currency is EvmCurrency {
  return isEvmChainId(currency.chainId)
}

function isRejectedTransfer(error: unknown): boolean {
  return (
    isUserRejectedError(error) ||
    (error instanceof Error &&
      /cancelled|canceled|rejected/i.test(error.message))
  )
}

export function SendTokenDialog({
  currency,
  onOpenChange,
  onTransferConfirmed,
  open,
}: SendTokenDialogProps) {
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')

  const { evmCurrency, isEvm, svmCurrency } = useMemo(
    () =>
      isEvmCurrency(currency)
        ? {
            evmCurrency: currency,
            isEvm: true,
            svmCurrency: undefined,
          }
        : {
            evmCurrency: undefined,
            isEvm: false,
            svmCurrency: currency,
          },
    [currency],
  )
  const walletNamespace = isEvm ? 'evm' : 'svm'
  const activeWalletAddress = useAccount(walletNamespace)
  const { data: balance } = useAmountBalance(currency)
  const transferUiOptions = useMemo<SendTransactionModalUIOptions>(
    () => ({
      showWalletUIs: true,
      description: `Send ${currency.symbol ?? 'token'} to ${destination}`,
      buttonText: 'Send',
      successHeader: `${currency.symbol ?? 'Token'} sent`,
      successDescription: 'Your transfer was submitted successfully.',
      isCancellable: true,
    }),
    [currency.symbol, destination],
  )
  const svmTransferOptions = useMemo(
    () => ({
      uiOptions: transferUiOptions,
      variant: 'default' as const,
    }),
    [transferUiOptions],
  )
  const { transferEvmTokenAsync, isPending: isEvmTransferPending } =
    useTransferEvmToken(evmCurrency)
  const { transferSolAsync, isPending: isSolTransferPending } =
    useTransferSol(svmTransferOptions)
  const { transferSplTokenAsync, isPending: isSplTransferPending } =
    useTransferSplToken(svmTransferOptions)

  const isPending =
    isEvmTransferPending || isSolTransferPending || isSplTransferPending

  const chain = useMemo(
    () => getChainById(currency.chainId),
    [currency.chainId],
  )
  const sendAmount = useMemo(
    () => Amount.tryFromHuman(currency, amount),
    [amount, currency],
  )

  const isDestinationValid = isEvm
    ? isEvmAddress(destination) &&
      destination.toLowerCase() !== zeroAddress.toLowerCase()
    : isSvmAddress(destination)
  const isSelfTransfer = Boolean(
    activeWalletAddress &&
      destination &&
      (isEvm
        ? activeWalletAddress.toLowerCase() === destination.toLowerCase()
        : activeWalletAddress === destination),
  )
  const recipientError = useMemo(() => {
    if (!destination) return 'Enter a recipient address'
    if (!isDestinationValid) {
      return `Enter a valid ${isEvm ? 'EVM' : 'Solana'} address`
    }
    if (isSelfTransfer) return 'Enter an address other than your own'
    return null
  }, [destination, isDestinationValid, isEvm, isSelfTransfer])
  const exceedsSpendableNativeBalance = useMemo(() => {
    if (!currency.isNative || !balance || !sendAmount) return false
    if (sendAmount.amount > balance.amount) return false

    const reserve = getNativeBalanceReserve(currency.chainId)
    const spendableBalance = getSpendableNativeBalance(balance.amount, reserve)
    return sendAmount.amount > spendableBalance
  }, [balance, currency, sendAmount])
  const nativeReserveError = exceedsSpendableNativeBalance
    ? `Leave some ${currency.symbol ?? 'native tokens'} for network fees`
    : null

  const resetAndClose = useCallback(async () => {
    setAmount('')
    setDestination('')
    onOpenChange(false)
    await onTransferConfirmed()
  }, [onOpenChange, onTransferConfirmed])

  const handleSend = useCallback(async () => {
    if (!sendAmount || recipientError || exceedsSpendableNativeBalance) {
      return
    }
    void createInfoToast({
      account: activeWalletAddress,
      type: 'send',
      chainId: sendAmount.currency.chainId,
      summary: `Sending ${sendAmount?.toSignificant(6) ?? amount} ${sendAmount.currency.symbol ?? 'token'}`,
      timestamp: Date.now(),
      groupTimestamp: Date.now(),
      autoClose: 2_000,
    })

    try {
      if (evmCurrency) {
        const evmAmount = Amount.tryFromHuman(evmCurrency, amount)
        if (!evmAmount || !isEvmAddress(destination)) return

        await transferEvmTokenAsync({
          amount: evmAmount,
          destination,
        })
      } else {
        if (!svmCurrency) return

        const svmAmount = Amount.tryFromHuman(svmCurrency, amount)
        if (!svmAmount || !isSvmAddress(destination)) return

        if (svmCurrency.isNative) {
          await transferSolAsync({
            amount: svmAmount.amount,
            destination: svmAddress(destination),
          })
        } else {
          await transferSplTokenAsync({
            amount: svmAmount.amount,
            destination: svmAddress(destination),
            tokenToSend: svmCurrency.wrap(),
          })
        }
      }
      void createSuccessToast({
        account: activeWalletAddress,
        type: 'send',
        chainId: sendAmount.currency.chainId,
        summary: `Sent ${sendAmount?.toSignificant(6) ?? amount} ${sendAmount.currency.symbol ?? 'token'}`,
        timestamp: Date.now(),
        groupTimestamp: Date.now(),
        autoClose: 2_000,
      })

      await resetAndClose()
    } catch (error) {
      if (evmCurrency && !isRejectedTransfer(error)) {
        createErrorToast(
          error instanceof Error ? error.message : 'Token transfer failed',
          false,
        )
      }
    }
  }, [
    amount,
    destination,
    evmCurrency,
    exceedsSpendableNativeBalance,
    recipientError,
    resetAndClose,
    sendAmount,
    svmCurrency,
    transferEvmTokenAsync,
    transferSolAsync,
    transferSplTokenAsync,
    activeWalletAddress,
  ])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isPending || nextOpen) {
        onOpenChange(nextOpen)
      }
    },
    [isPending, onOpenChange],
  )
  const preventDismissWhilePending = useCallback(
    (event: { preventDefault(): void }) => {
      if (isPending) event.preventDefault()
    },
    [isPending],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg "
        onEscapeKeyDown={preventDismissWhilePending}
        onInteractOutside={preventDismissWhilePending}
      >
        <DialogHeader className="!text-left">
          <DialogTitle>Send {currency.symbol}</DialogTitle>
          <DialogDescription>
            Transfer {currency.symbol} on {chain.name} to another address.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 max-h-[calc(100dvh-175px)] overflow-y-auto py-2">
          <CurrencyInput
            id="send-token-amount"
            chainId={currency.chainId}
            currency={currency}
            type="INPUT"
            value={amount}
            onChange={setAmount}
            disabled={isPending}
            error={nativeReserveError ?? undefined}
            label="Send Amount"
            className="rounded-xl bg-secondary p-4 min-h-[144px]"
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="send-token-address">
              Recipient
            </label>
            <TextField
              id="send-token-address"
              type="text"
              value={destination}
              onValueChange={setDestination}
              placeholder={isEvm ? '0x…' : 'Solana address'}
              isError={Boolean(destination && !isDestinationValid)}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Checker.Connect namespace={walletNamespace}>
            <Checker.Network chainId={currency.chainId}>
              <Checker.Guard
                guardWhen={Boolean(recipientError)}
                guardText={recipientError ?? ''}
              >
                <Checker.Amounts chainId={currency.chainId} amount={sendAmount}>
                  <Checker.Guard
                    guardWhen={exceedsSpendableNativeBalance}
                    guardText={nativeReserveError ?? ''}
                  >
                    <Button
                      fullWidth
                      size="xl"
                      onClick={handleSend}
                      loading={isPending}
                    >
                      Send
                    </Button>
                  </Checker.Guard>
                </Checker.Amounts>
              </Checker.Guard>
            </Checker.Network>
          </Checker.Connect>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
