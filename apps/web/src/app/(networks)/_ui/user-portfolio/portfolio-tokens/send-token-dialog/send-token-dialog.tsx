'use client'

import { useCallback, useState } from 'react'
import {
  getNativeBalanceReserve,
  getSpendableNativeBalance,
} from 'src/lib/wagmi/components/web3-input/currency/native-balance-reserve'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount, isAddressEqual } from 'sushi'
import { type EvmChainId, isEvmAddress, isEvmChainId } from 'sushi/evm'
import { type StellarChainId, isStellarAddress } from 'sushi/stellar'
import { type SvmChainId, isSvmAddress, isSvmChainId } from 'sushi/svm'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { SendTokenDialogPresentation } from './send-token-dialog-presentation'
import { useSendToken } from './use-send-token'

type SendTokenChainId = EvmChainId | SvmChainId | StellarChainId

type SendTokenCurrency = CurrencyFor<SendTokenChainId>
type SendTokenDestination = AddressFor<SendTokenChainId>

interface SendTokenDialogProps {
  currency: SendTokenCurrency
  open: boolean
  onOpenChange(open: boolean): void
  onTransferConfirmed(): Promise<void>
}

function parseDestination(
  destination: string,
  chainId: SendTokenChainId,
): SendTokenDestination | undefined {
  if (isEvmChainId(chainId)) {
    return isEvmAddress(destination) ? destination : undefined
  }
  if (isSvmChainId(chainId)) {
    return isSvmAddress(destination) ? destination : undefined
  }
  return isStellarAddress(destination) ? destination : undefined
}

function exceedsSpendableNativeBalance(
  currency: SendTokenCurrency,
  balance: Amount<SendTokenCurrency> | undefined,
  sendAmount: Amount<SendTokenCurrency> | undefined,
): boolean {
  if (!currency.isNative || !balance || !sendAmount) return false
  if (sendAmount.amount > balance.amount) return false
  if (!isEvmChainId(currency.chainId) && !isSvmChainId(currency.chainId)) {
    return false
  }

  const reserve = getNativeBalanceReserve(currency.chainId)
  const spendableBalance = getSpendableNativeBalance(balance.amount, reserve)

  return sendAmount.amount > spendableBalance
}

export function SendTokenDialog({
  currency,
  onOpenChange,
  onTransferConfirmed,
  open,
}: SendTokenDialogProps) {
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')

  const activeWalletAddress = useAccount(currency.chainId)
  const { data: balance } = useAmountBalance(currency)
  const parsedDestination = parseDestination(destination, currency.chainId)
  const isDestinationValid = parsedDestination !== undefined
  const sendAmount = Amount.tryFromHuman(currency, amount)
  const exceedsNativeBalance = exceedsSpendableNativeBalance(
    currency,
    balance,
    sendAmount,
  )
  const isSelfTransfer = isAddressEqual(
    activeWalletAddress || '',
    parsedDestination || '',
  )

  const { isPending, sendTokenAsync } = useSendToken({
    currency,
    destination: parsedDestination,
  })

  const resetAndClose = useCallback(async () => {
    setAmount('')
    setDestination('')
    onOpenChange(false)
    await onTransferConfirmed()
  }, [onOpenChange, onTransferConfirmed])

  const handleSend = useCallback(async () => {
    if (!sendAmount) return
    if (await sendTokenAsync(sendAmount)) {
      await resetAndClose()
    }
  }, [resetAndClose, sendAmount, sendTokenAsync])

  return (
    <SendTokenDialogPresentation
      amount={amount}
      currency={currency}
      destination={destination}
      exceedsSpendableNativeBalance={exceedsNativeBalance}
      isDestinationValid={isDestinationValid}
      isPending={isPending}
      isSelfTransfer={isSelfTransfer}
      onAmountChange={setAmount}
      onDestinationChange={setDestination}
      onOpenChange={onOpenChange}
      onSend={handleSend}
      open={open}
      sendAmount={sendAmount}
    />
  )
}
