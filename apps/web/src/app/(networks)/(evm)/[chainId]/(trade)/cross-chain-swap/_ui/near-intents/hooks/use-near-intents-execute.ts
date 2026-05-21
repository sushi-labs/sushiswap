'use client'

import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { NETWORK_PASSPHRASE } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { TOAST_AUTOCLOSE_TIME } from 'src/lib/perps/config'
import {
  type NearIntentsActiveExecution,
  type NearIntentsCurrencyEntry,
  type NearIntentsDepositAddress,
  type NearIntentsDepositAddressFor,
  type NearIntentsSupportedChainId,
  getNearIntentsAssetId,
  isNearIntentsEvmChainId,
  submitNearIntentsStellarPayment,
} from 'src/lib/swap/near-intents'
import { useAccount } from 'src/lib/wallet'
import { stellarWalletKit } from 'src/lib/wallet/namespaces/stellar/config'
import { Amount, getChainById } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import {
  type StellarAccountAddress,
  type StellarToken,
  isStellarAccountAddress,
  isStellarChainId,
} from 'sushi/stellar'
import { type Hex, erc20Abi, getAddress } from 'viem'
import { usePublicClient, useSendTransaction, useWriteContract } from 'wagmi'
import type { NearIntentsQuoteResponse } from '~evm/api/cross-chain/near-intents/schemas'
import { useRefetchBalances } from '../../../../../../_common/ui/balance-provider/use-refetch-balances'
import { fetchNearIntentsQuote } from './use-near-intents-quote'

async function submitDeposit(payload: {
  depositAddress: NearIntentsDepositAddress
  memo?: string
  txHash: string
}) {
  const response = await fetch('/api/cross-chain/near-intents/deposit-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(error?.message || 'Failed to submit deposit transaction')
  }

  return response.json()
}

export function assertExecutableQuoteIsSafe({
  executableQuote,
  previewQuote,
  requestedAmountIn,
}: {
  executableQuote: NearIntentsQuoteResponse
  previewQuote: NearIntentsQuoteResponse
  requestedAmountIn: string
}) {
  if (executableQuote.quote.amountIn !== requestedAmountIn) {
    throw new Error(
      'Executable quote amount does not match selected input amount',
    )
  }

  if (executableQuote.quote.amountIn !== previewQuote.quote.amountIn) {
    throw new Error('Executable quote amount does not match previewed amount')
  }
}

export function useNearIntentsExecute({
  chainId0,
  chainId1,
  swapAmount,
  token0,
  token1,
  currencyEntries,
}: {
  chainId0: NearIntentsSupportedChainId
  chainId1: NearIntentsSupportedChainId
  swapAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | undefined
  token0: CurrencyFor<NearIntentsSupportedChainId> | undefined
  token1: CurrencyFor<NearIntentsSupportedChainId> | undefined
  currencyEntries: NearIntentsCurrencyEntry[]
}) {
  const refundTo = useAccount(chainId0)
  const recipient = useAccount(chainId1)
  const stellarAccount = useAccount('stellar')

  const { mutateAsync: sendTransactionAsync } = useSendTransaction()
  const { mutateAsync: writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient({
    chainId: isNearIntentsEvmChainId(chainId0) ? chainId0 : undefined,
  })
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const [slippagePercent] = useSlippageTolerance()

  const amount = swapAmount?.amount.toString()
  const slippageBps = useMemo(
    () => Math.round(slippagePercent.toNumber() * 10_000),
    [slippagePercent],
  )
  const token0AssetId = getNearIntentsAssetId(currencyEntries, token0)
  const token1AssetId = getNearIntentsAssetId(currencyEntries, token1)

  async function executeStellarDeposit({
    amountIn,
    depositAddress,
    depositMemo,
  }: {
    amountIn: string
    depositAddress: StellarAccountAddress
    depositMemo?: string
  }): Promise<TxHashFor<typeof chainId0>> {
    if (!stellarWalletKit || !stellarAccount) {
      throw new Error('Connect your Stellar wallet')
    }
    if (!token0 || !isStellarChainId(token0.chainId)) {
      throw new Error('Selected Stellar token does not match source chain')
    }
    const signTransaction = async (xdr: string) => {
      const { signedTxXdr } = await stellarWalletKit.signTransaction(xdr, {
        address: stellarAccount,
        networkPassphrase: NETWORK_PASSPHRASE,
      })

      return signedTxXdr
    }
    const stellarAmountIn = new Amount(token0 as StellarToken, amountIn)

    return (
      await submitNearIntentsStellarPayment({
        amount: stellarAmountIn,
        destination: depositAddress,
        memo: depositMemo,
        signTransaction,
        sourceAddress: stellarAccount,
      })
    ).txHash as TxHashFor<typeof chainId0>
  }

  async function executeEvmDeposit({
    amountIn,
    depositAddress,
  }: {
    amountIn: string
    depositAddress: EvmAddress
    depositMemo?: string
  }): Promise<TxHashFor<typeof chainId0>> {
    if (!isNearIntentsEvmChainId(chainId0) || !token0) {
      throw new Error('Source chain is not a supported EVM deposit chain')
    }

    const evmToken0 = token0 as CurrencyFor<typeof chainId0>
    const evmAmountIn = new Amount(evmToken0, amountIn)

    return (await (async () => {
      if (evmToken0.type === 'native') {
        return sendTransactionAsync({
          chainId: chainId0,
          to: depositAddress,
          value: evmAmountIn.amount,
        })
      } else {
        return writeContractAsync({
          address: evmToken0.wrap().address,
          abi: erc20Abi,
          args: [depositAddress, evmAmountIn.amount],
          chainId: chainId0,
          functionName: 'transfer',
        })
      }
    })()) as TxHashFor<typeof chainId0>
  }

  return useMutation({
    mutationKey: [
      'near-intents',
      'execute',
      chainId0,
      chainId1,
      token0AssetId,
      token1AssetId,
      amount,
      slippageBps,
    ],
    mutationFn: async ({
      previewQuote,
    }: {
      previewQuote: NearIntentsQuoteResponse
    }) => {
      if (!token0 || !token1 || !amount || amount === '0') {
        throw new Error('Enter an amount to swap')
      }
      if (token0.chainId !== chainId0 || token1.chainId !== chainId1) {
        throw new Error('Selected token does not match the active chain')
      }
      if (!token0AssetId || !token1AssetId) {
        throw new Error('Selected token is not supported by NEAR Intents')
      }
      if (!refundTo || !recipient) {
        throw new Error('Connect both source and destination wallets')
      }

      const quote = await fetchNearIntentsQuote({
        dry: false,
        amount,
        destinationAsset: token1AssetId,
        fromChainId: chainId0,
        originAsset: token0AssetId,
        recipient,
        refundTo,
        slippageBps,
        toChainId: chainId1,
      })

      const depositAddress = quote.quote.depositAddress
      if (!depositAddress) {
        throw new Error('Executable quote did not return a deposit address')
      }

      assertExecutableQuoteIsSafe({
        executableQuote: quote,
        previewQuote,
        requestedAmountIn: amount,
      })

      const { depositMemo, amountIn } = quote.quote

      const sourceDeposit = await (async () => {
        if (isStellarChainId(chainId0)) {
          if (!isStellarAccountAddress(depositAddress)) {
            throw new Error(
              'Executable quote returned an invalid Stellar address',
            )
          }

          return {
            depositAddress,
            txHash: await executeStellarDeposit({
              amountIn,
              depositAddress,
              depositMemo,
            }),
          }
        }

        const sourceDepositAddress = getAddress(depositAddress)

        return {
          depositAddress: sourceDepositAddress,
          txHash: await executeEvmDeposit({
            amountIn,
            depositAddress: sourceDepositAddress,
          }),
        }
      })()

      if (isNearIntentsEvmChainId(chainId0)) {
        await publicClient.waitForTransactionReceipt({
          hash: sourceDeposit.txHash as Hex,
        })
      }
      refetchBalances(chainId0)

      await submitDeposit({
        depositAddress: sourceDeposit.depositAddress,
        memo: depositMemo,
        txHash: sourceDeposit.txHash,
      })

      return {
        chainId0,
        depositAddress: sourceDeposit.depositAddress,
        depositMemo,
        txHash: sourceDeposit.txHash,
      } satisfies NearIntentsActiveExecution<typeof chainId0>
    },
    onMutate: () => {
      const timestamp = Date.now()

      createInfoToast({
        summary: 'Confirm transaction in wallet',
        type: 'swap',
        account: refundTo,
        chainId: chainId0,
        groupTimestamp: timestamp,
        timestamp,
        autoClose: TOAST_AUTOCLOSE_TIME,
      })

      return { timestamp }
    },
    onSuccess: (result, _vars, context) => {
      createSuccessToast({
        summary: 'Deposit submitted to NEAR Intents',
        type: 'swap',
        account: refundTo,
        chainId: chainId0,
        txHash: result.txHash,
        href: getChainById(chainId0).getTransactionUrl(result.txHash),
        groupTimestamp: context?.timestamp ?? Date.now(),
        timestamp: context?.timestamp ?? Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
    onError: (error, _vars, context) => {
      createFailedToast({
        summary:
          error instanceof Error
            ? error.message
            : 'Failed to execute cross-chain swap',
        type: 'swap',
        account: refundTo,
        chainId: chainId0,
        groupTimestamp: context?.timestamp ?? Date.now(),
        timestamp: context?.timestamp ?? Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
  })
}
