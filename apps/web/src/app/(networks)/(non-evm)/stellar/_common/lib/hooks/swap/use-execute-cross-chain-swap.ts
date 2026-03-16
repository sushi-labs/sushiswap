'use client'

import * as StellarSdk from '@stellar/stellar-sdk'
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify'
import { ChainId } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress } from 'sushi/stellar'
import { formatUnits } from 'viem'
import { NETWORK_PASSPHRASE } from '~stellar/_common/lib/constants'
import { SorobanClient } from '~stellar/_common/lib/soroban/client'
import { DEFAULT_TIMEOUT } from '~stellar/_common/lib/soroban/constants'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { extractErrorMessage } from '~stellar/_common/lib/utils/error-helpers'
import { useStellarWallet } from '~stellar/providers'

export interface UseExecuteCrossChainSwapParams {
  userAddress: StellarAddress
  tokenIn: Token
  tokenOut: { symbol: string; decimals: number; address: EvmAddress }
  amountIn: bigint
  depositAddress: string
  recipient: EvmAddress
  correlationId?: string
}

export const useExecuteCrossChainSwap = () => {
  const { signTransaction } = useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['stellar', 'cross-chain-swap', 'execute'],
    onMutate: async (params: UseExecuteCrossChainSwapParams) => {
      const timestamp = Date.now()
      const infoToastId = `info:cross-chain-swap-${nanoid()}`
      const amountInFormatted = formatUnits(
        params.amountIn,
        params.tokenIn.decimals,
      )

      createInfoToast({
        summary: `Cross-chain swapping ${amountInFormatted} ${params.tokenIn.code} for ${params.tokenOut.symbol}...`,
        type: 'swap',
        account: params.userAddress,
        chainId: ChainId.STELLAR,
        groupTimestamp: timestamp,
        timestamp,
      })

      return { infoToastId }
    },
    mutationFn: async (params: UseExecuteCrossChainSwapParams) => {
      const { userAddress, tokenIn, amountIn, depositAddress, correlationId } =
        params

      // Get account info for sequence number
      const accountInfo = await SorobanClient.getAccount(userAddress)
      const account = new StellarSdk.Account(
        userAddress,
        accountInfo.sequenceNumber(),
      )

      // Create the asset to send using Stellar classic format
      // XLM is the native asset, other tokens use code + issuer
      const asset =
        tokenIn.code === 'XLM'
          ? StellarSdk.Asset.native()
          : new StellarSdk.Asset(tokenIn.code, tokenIn.issuer)

      // Build payment operation
      const paymentOp = StellarSdk.Operation.payment({
        destination: depositAddress,
        asset: asset,
        amount: formatUnits(amountIn, tokenIn.decimals),
      })

      // Build transaction with memo for Near Intents
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(paymentOp)
        .setTimeout(DEFAULT_TIMEOUT)

      // Add memo if correlationId is provided
      if (correlationId) {
        transaction.addMemo(StellarSdk.Memo.text(correlationId.slice(0, 28)))
      }

      const builtTx = transaction.build()
      const unsignedXdr = builtTx.toXDR()

      // Sign transaction
      const signedXdr = await signTransaction(unsignedXdr)

      // Submit transaction
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE,
      )
      const result = await SorobanClient.sendTransaction(signedTx)

      return {
        txHash: result.hash,
        amountIn,
        tokenIn,
      }
    },
    onSuccess: (result, params, context) => {
      if (context?.infoToastId) {
        toast.dismiss(context.infoToastId)
      }

      const amountInFormatted = formatUnits(
        params.amountIn,
        params.tokenIn.decimals,
      )

      const timestamp = Date.now()
      createSuccessToast({
        summary: `Initiated cross-chain swap of ${amountInFormatted} ${params.tokenIn.code} for ${params.tokenOut.symbol}`,
        type: 'swap',
        account: params.userAddress,
        chainId: ChainId.STELLAR,
        txHash: result.txHash,
        groupTimestamp: timestamp,
        timestamp,
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'token'],
      })
    },
    onError: (error, _variables, context) => {
      if (context?.infoToastId) {
        toast.dismiss(context.infoToastId)
      }

      const errorMessage = extractErrorMessage(error)
      console.warn('Cross-chain swap failed:', error)
      createErrorToast(errorMessage, false)
    },
  })
}
