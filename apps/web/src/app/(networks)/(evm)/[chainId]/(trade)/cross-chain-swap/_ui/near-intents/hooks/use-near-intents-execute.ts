'use client'

import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
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
  signNearIntentsStellarPayment,
  submitSignedNearIntentsStellarPayment,
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

type NearIntentsSourceDeposit<TChainId extends NearIntentsSupportedChainId> = {
  depositAddress: NearIntentsDepositAddressFor<TChainId>
  signedXdr?: string
  txHash: TxHashFor<TChainId>
}

type NearIntentsSourceExecution<TChainId extends NearIntentsSupportedChainId> =
  NearIntentsActiveExecution<TChainId> & {
    signedXdr?: string
  }

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

  const confirmSourceDeposit = useCallback(
    async (result: NearIntentsSourceExecution<typeof chainId0>) => {
      try {
        if (isStellarChainId(chainId0) && result.signedXdr) {
          await submitSignedNearIntentsStellarPayment({
            signedXdr: result.signedXdr,
          })
        }

        if (isNearIntentsEvmChainId(chainId0)) {
          await publicClient.waitForTransactionReceipt({
            hash: result.txHash as Hex,
          })
        }
        refetchBalances(chainId0)

        await submitDeposit({
          depositAddress: result.depositAddress,
          memo: result.depositMemo,
          txHash: result.txHash,
        })

        createSuccessToast({
          summary: 'Deposit submitted to NEAR Intents',
          type: 'swap',
          account: refundTo,
          chainId: chainId0,
          txHash: result.txHash,
          href: getChainById(chainId0).getTransactionUrl(result.txHash),
          groupTimestamp: Date.now(),
          timestamp: Date.now(),
          autoClose: TOAST_AUTOCLOSE_TIME,
        })
      } catch (error) {
        createFailedToast({
          summary:
            error instanceof Error
              ? error.message
              : 'Failed to submit deposit transaction',
          type: 'swap',
          account: refundTo,
          chainId: chainId0,
          groupTimestamp: Date.now(),
          timestamp: Date.now(),
          autoClose: TOAST_AUTOCLOSE_TIME,
        })

        throw error
      }
    },
    [chainId0, publicClient, refetchBalances, refundTo],
  )

  async function executeStellarDeposit({
    amountIn,
    depositAddress,
    depositMemo,
  }: {
    amountIn: string
    depositAddress: StellarAccountAddress
    depositMemo?: string
  }): Promise<{
    signedXdr: string
    txHash: TxHashFor<typeof chainId0>
  }> {
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

    const result = await signNearIntentsStellarPayment({
      amount: stellarAmountIn,
      destination: depositAddress,
      memo: depositMemo,
      signTransaction,
      sourceAddress: stellarAccount,
    })

    return {
      signedXdr: result.signedXdr,
      txHash: result.txHash as TxHashFor<typeof chainId0>,
    }
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

  const mutation = useMutation({
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

      const sourceDeposit: NearIntentsSourceDeposit<typeof chainId0> =
        await (async () => {
          if (isStellarChainId(chainId0)) {
            if (!isStellarAccountAddress(depositAddress)) {
              throw new Error(
                'Executable quote returned an invalid Stellar address',
              )
            }

            const stellarDeposit = await executeStellarDeposit({
              amountIn,
              depositAddress,
              depositMemo,
            })

            return {
              depositAddress,
              signedXdr: stellarDeposit.signedXdr,
              txHash: stellarDeposit.txHash,
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

      return {
        chainId0,
        depositAddress: sourceDeposit.depositAddress,
        depositMemo,
        signedXdr: sourceDeposit.signedXdr,
        txHash: sourceDeposit.txHash,
      } satisfies NearIntentsSourceExecution<typeof chainId0>
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

  return { confirmSourceDeposit, submitSourceTransaction: mutation }
}
