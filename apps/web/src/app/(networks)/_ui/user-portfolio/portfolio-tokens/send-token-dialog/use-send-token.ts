import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useCallback } from 'react'
import { useTransferSol } from 'src/lib/svm/hooks/use-transfer-sol'
import { useTransferSplToken } from 'src/lib/svm/hooks/use-transfer-spl-token'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount, type Currency } from 'sushi'
import {
  type EvmChainId,
  type EvmCurrency,
  isEvmAddress,
  isEvmChainId,
} from 'sushi/evm'
import {
  type StellarChainId,
  type StellarCurrency,
  isStellarAddress,
  isStellarChainId,
} from 'sushi/stellar'
import {
  type SvmChainId,
  type SvmCurrency,
  isSvmAddress,
  isSvmChainId,
  svmAddress,
} from 'sushi/svm'
import { useTransferEvmToken } from '../use-transfer-evm-token'
import { useTransferStellarToken } from './use-transfer-stellar-token'

interface UseSendTokenParams<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
> {
  currency: CurrencyFor<TChainId>
  destination: AddressFor<TChainId> | undefined
}

function isEvmCurrency(currency: Currency): currency is EvmCurrency {
  return isEvmChainId(currency.chainId)
}

function isSvmCurrency(currency: Currency): currency is SvmCurrency {
  return isSvmChainId(currency.chainId)
}

function isStellarCurrency(currency: Currency): currency is StellarCurrency {
  return isStellarChainId(currency.chainId)
}

function isRejectedTransfer(error: unknown): boolean {
  return (
    isUserRejectedError(error) ||
    (error instanceof Error &&
      /cancelled|canceled|rejected/i.test(error.message))
  )
}

export function useSendToken<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
>({ currency, destination }: UseSendTokenParams<TChainId>) {
  const activeWalletAddress = useAccount(currency.chainId)
  const evmCurrency = isEvmCurrency(currency) ? currency : undefined
  const stellarCurrency = isStellarCurrency(currency) ? currency : undefined
  const svmTransferOptions = {
    notifications: false,
    uiOptions: {
      showWalletUIs: true,
      description: `Send ${currency.symbol ?? 'token'} to ${destination}`,
      buttonText: 'Send',
      successHeader: `${currency.symbol ?? 'Token'} sent`,
      successDescription: 'Your transfer was submitted successfully.',
      isCancellable: true,
    } satisfies SendTransactionModalUIOptions,
    variant: 'default' as const,
  }

  const { transferEvmTokenAsync, isPending: isEvmTransferPending } =
    useTransferEvmToken(evmCurrency)
  const { transferSolAsync, isPending: isSolTransferPending } =
    useTransferSol(svmTransferOptions)
  const { transferSplTokenAsync, isPending: isSplTransferPending } =
    useTransferSplToken(svmTransferOptions)
  const { transferStellarTokenAsync, isPending: isStellarTransferPending } =
    useTransferStellarToken(stellarCurrency)

  const sendTokenAsync = useCallback(
    async (sendAmount: Amount<CurrencyFor<TChainId>>): Promise<boolean> => {
      const timestamp = Date.now()
      const formattedAmount = sendAmount.toSignificant(6)
      const symbol = currency.symbol ?? 'token'

      createInfoToast({
        account: activeWalletAddress,
        type: 'send',
        chainId: currency.chainId,
        summary: `Sending ${formattedAmount} ${symbol}`,
        timestamp,
        groupTimestamp: timestamp,
        autoClose: 2_000,
      })

      try {
        if (!destination) throw new Error('Destination is required')
        if (sendAmount.currency.id !== currency.id) {
          throw new Error('Transfer currency changed')
        }

        if (isEvmCurrency(currency)) {
          if (!isEvmAddress(destination)) {
            throw new Error('Invalid EVM destination')
          }

          await transferEvmTokenAsync({
            amount: new Amount(currency, sendAmount.amount),
            destination,
          })
        } else if (isSvmCurrency(currency)) {
          if (!isSvmAddress(destination)) {
            throw new Error('Invalid Solana destination')
          }

          if (currency.isNative) {
            await transferSolAsync({
              amount: sendAmount.amount,
              destination: svmAddress(destination),
            })
          } else {
            await transferSplTokenAsync({
              amount: sendAmount.amount,
              destination: svmAddress(destination),
              tokenToSend: currency.wrap(),
            })
          }
        } else if (isStellarCurrency(currency)) {
          if (!isStellarAddress(destination)) {
            throw new Error('Invalid Stellar destination')
          }

          await transferStellarTokenAsync({
            amount: sendAmount.amount,
            destination,
          })
        }

        createSuccessToast({
          account: activeWalletAddress,
          type: 'send',
          chainId: currency.chainId,
          summary: `Sent ${formattedAmount} ${symbol}`,
          timestamp,
          groupTimestamp: timestamp,
          autoClose: 2_000,
        })

        return true
      } catch (error) {
        if (!isRejectedTransfer(error)) {
          createFailedToast({
            account: activeWalletAddress,
            type: 'send',
            chainId: currency.chainId,
            summary:
              error instanceof Error ? error.message : 'Token transfer failed',
            timestamp,
            groupTimestamp: timestamp,
            autoClose: 2_000,
          })
        }

        return false
      }
    },
    [
      activeWalletAddress,
      currency,
      destination,
      transferEvmTokenAsync,
      transferSolAsync,
      transferSplTokenAsync,
      transferStellarTokenAsync,
    ],
  )

  return {
    isPending:
      isEvmTransferPending ||
      isSolTransferPending ||
      isSplTransferPending ||
      isStellarTransferPending,
    sendTokenAsync,
  }
}
