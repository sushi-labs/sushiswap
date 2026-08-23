'use client'

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
import { useCallback } from 'react'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Guard } from 'src/lib/wagmi/systems/checker/guard'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import type { WalletNamespace } from 'src/lib/wallet'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { type Amount, getChainById } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'

interface RecipientCopy {
  addressType: string
  placeholder: string
}

const RECIPIENT_COPY = {
  evm: {
    addressType: 'EVM',
    placeholder: '0x…',
  },
  stellar: {
    addressType: 'Stellar',
    placeholder: 'Stellar address',
  },
  svm: {
    addressType: 'Solana',
    placeholder: 'Solana address',
  },
} as const satisfies Record<WalletNamespace, RecipientCopy>

interface SendTokenDialogPresentationProps<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
> {
  amount: string
  currency: CurrencyFor<TChainId>
  destination: string
  exceedsSpendableNativeBalance: boolean
  isDestinationValid: boolean
  isPending: boolean
  isSelfTransfer: boolean
  onAmountChange(value: string): void
  onDestinationChange(value: string): void
  onOpenChange(open: boolean): void
  onSend(): Promise<void>
  open: boolean
  sendAmount: Amount<CurrencyFor<TChainId>> | undefined
}

export function SendTokenDialogPresentation<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
>({
  amount,
  currency,
  destination,
  exceedsSpendableNativeBalance,
  isDestinationValid,
  isPending,
  isSelfTransfer,
  onAmountChange,
  onDestinationChange,
  onOpenChange,
  onSend,
  open,
  sendAmount,
}: SendTokenDialogPresentationProps<TChainId>) {
  const walletNamespace = getNamespaceForChainId(currency.chainId)
  const recipientCopy = RECIPIENT_COPY[walletNamespace]
  const chain = getChainById(currency.chainId)
  const recipientError = !destination
    ? 'Enter a recipient address'
    : !isDestinationValid
      ? `Enter a valid ${recipientCopy.addressType} address`
      : isSelfTransfer
        ? 'Enter an address other than your own'
        : null
  const amountError = exceedsSpendableNativeBalance
    ? `Leave some ${currency.symbol ?? 'native tokens'} for network fees`
    : null

  const handleSend = useCallback(async () => {
    if (!sendAmount || recipientError || amountError) return
    await onSend()
  }, [amountError, onSend, recipientError, sendAmount])

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
        className="max-w-lg"
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
            onChange={onAmountChange}
            disabled={isPending}
            error={amountError ?? undefined}
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
              onValueChange={onDestinationChange}
              placeholder={recipientCopy.placeholder}
              isError={Boolean(destination && !isDestinationValid)}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Connect namespace={walletNamespace}>
            <Network chainId={currency.chainId}>
              <Guard
                guardWhen={Boolean(recipientError)}
                guardText={recipientError ?? ''}
              >
                <Amounts chainId={currency.chainId} amount={sendAmount}>
                  <Guard
                    guardWhen={Boolean(amountError)}
                    guardText={amountError ?? ''}
                  >
                    <Button
                      fullWidth
                      size="xl"
                      onClick={handleSend}
                      loading={isPending}
                    >
                      Send
                    </Button>
                  </Guard>
                </Amounts>
              </Guard>
            </Network>
          </Connect>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
