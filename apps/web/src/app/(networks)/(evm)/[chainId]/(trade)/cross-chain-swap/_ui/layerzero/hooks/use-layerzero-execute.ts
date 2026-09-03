'use client'

import { TransactionBuilder } from '@stellar/stellar-sdk'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import { NETWORK_PASSPHRASE } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/constants'
import { SorobanClient } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/client'
import {
  submitTransaction,
  waitForTransaction,
} from 'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/transaction-helpers'
import { APPROVE_TAG_XSWAP, TOAST_AUTOCLOSE_TIME } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import { LAYERZERO_OFT_ABI } from 'src/lib/swap/layerzero/abi'
import {
  LAYERZERO_USDT0_EVM_DEPLOYMENTS,
  isLayerZeroEvmChainId,
} from 'src/lib/swap/layerzero/config'
import {
  assertLayerZeroQuoteIsSafe,
  fetchLayerZeroQuote,
} from 'src/lib/swap/layerzero/quote'
import {
  assertStellarUsdt0Recipient,
  buildStellarOftSend,
} from 'src/lib/swap/layerzero/stellar'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { useApproved } from 'src/lib/wagmi/systems/checker/provider'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getStellarWalletKit } from 'src/lib/wallet/namespaces/stellar/config'
import { isEvmAddress } from 'sushi/evm'
import { StellarChainId, isStellarAccountAddress } from 'sushi/stellar'
import { type PublicClient, erc20Abi } from 'viem'
import { usePublicClient, useWriteContract } from 'wagmi'
import { useRefetchBalances } from '../../../../../../_common/ui/balance-provider/use-refetch-balances'
import { useLayerZeroXSwap } from '../xswap-provider'
import { useIsLayerZeroXSwapMaintenance } from './use-is-layerzero-xswap-maintenance'

export function useLayerZeroExecute(): UseMutationResult<
  string,
  Error,
  { id: string; quote: LayerZeroQuote }
> {
  const {
    state: { chainId0, chainId1, swapAmount },
    mutate: {
      beginExecution,
      updateExecution,
      failExecution,
      finishSubmission,
      clearSwapAmountIfUnchanged,
    },
  } = useLayerZeroXSwap()
  const sourceAddress = useAccount(chainId0)
  const recipient = useAccount(chainId1)
  const publicClient = usePublicClient({
    chainId: isLayerZeroEvmChainId(chainId0) ? chainId0 : undefined,
  })
  const { writeContractAsync } = useWriteContract()
  const [slippagePercent] = useSlippageTolerance()
  const { refetchChain } = useRefetchBalances()
  const { data: maintenance } = useIsLayerZeroXSwapMaintenance()
  const { approved } = useApproved(APPROVE_TAG_XSWAP)

  return useMutation({
    mutationKey: ['layerzero-execute', chainId0, chainId1],
    mutationFn: async ({
      id,
      quote: reviewed,
    }: { id: string; quote: LayerZeroQuote }) => {
      if (maintenance)
        throw new Error('LayerZero swaps are undergoing maintenance')
      if (!sourceAddress || !recipient || !swapAmount?.gt(0n)) {
        throw new Error('Connect both wallets and enter an amount')
      }
      if (!approved)
        throw new Error('Complete the swap checks before continuing')
      if (
        reviewed.fromChainId !== chainId0 ||
        reviewed.toChainId !== chainId1 ||
        reviewed.sourceAddress !== sourceAddress ||
        reviewed.recipient !== recipient ||
        reviewed.amountIn !== swapAmount.amount
      ) {
        throw new Error('Swap inputs changed. Review a new quote.')
      }
      if (!beginExecution(id, reviewed))
        throw new Error('A source transaction is still being submitted')

      if (isLayerZeroEvmChainId(chainId0)) {
        if (!publicClient || !isEvmAddress(sourceAddress))
          throw new Error('Connect the source EVM wallet')
        const deployment = LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId0]
        if (deployment.approvalRequired) {
          const allowance = await publicClient.readContract({
            address: deployment.tokenAddress,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [sourceAddress, deployment.oftAddress],
          })
          if (allowance < reviewed.amountSent) {
            throw new Error(
              'USDT approval changed. Approve the token before swapping.',
            )
          }
        }
      }

      const executable = await fetchLayerZeroQuote({
        fromChainId: chainId0,
        toChainId: chainId1,
        amount: swapAmount.amount,
        slippageBps: Math.round(slippagePercent.toNumber() * 10_000),
        sourceAddress,
        recipient,
        publicClient,
      })
      assertLayerZeroQuoteIsSafe(reviewed, executable)
      // Preserve the minimum and maximum fee explicitly reviewed by the user.
      const sendParam = {
        ...executable.sendParam,
        minAmountLD: reviewed.sendParam.minAmountLD,
      }
      if (chainId1 === StellarChainId.STELLAR) {
        if (!isStellarAccountAddress(recipient))
          throw new Error('Invalid Stellar recipient')
        await assertStellarUsdt0Recipient(recipient, executable.amountOut)
      }

      if (isLayerZeroEvmChainId(chainId0)) {
        if (!publicClient || !isEvmAddress(sourceAddress))
          throw new Error('Connect the source EVM wallet')
        const deployment = LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId0]
        const request = {
          account: sourceAddress,
          address: deployment.oftAddress,
          abi: LAYERZERO_OFT_ABI,
          functionName: 'send' as const,
          args: [
            sendParam,
            { nativeFee: reviewed.maxNativeFee, lzTokenFee: 0n },
            sourceAddress,
          ] as const,
          value: reviewed.maxNativeFee,
        }
        const simulationClient: Pick<PublicClient, 'simulateContract'> =
          publicClient
        await simulationClient.simulateContract(request)
        const txHash = await writeContractAsync({
          ...request,
          chainId: chainId0,
        })
        updateExecution(id, { txHash, sourceStatus: 'PENDING' })
        clearSwapAmountIfUnchanged(reviewed)
        let replacementReason: 'repriced' | 'replaced' | 'cancelled' | undefined
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          onReplaced: ({ reason, transactionReceipt }) => {
            replacementReason = reason
            updateExecution(id, {
              txHash: transactionReceipt.transactionHash,
            })
          },
        })
        if (receipt.status !== 'success' || replacementReason === 'cancelled') {
          updateExecution(id, {
            txHash: receipt.transactionHash,
            sourceStatus: 'FAILED',
          })
          throw new Error('The source transaction reverted or was cancelled')
        }
        if (replacementReason === 'replaced')
          throw new Error(
            'The source transaction was replaced. Check the existing transaction before sending again.',
          )
        updateExecution(id, {
          txHash: receipt.transactionHash,
          sourceStatus: 'SUCCESS',
        })
        return receipt.transactionHash
      }

      if (!isStellarAccountAddress(sourceAddress))
        throw new Error('Connect the source Stellar wallet')
      const transaction = await buildStellarOftSend({
        from: sourceAddress,
        sendParam,
        nativeFee: reviewed.maxNativeFee,
      })
      if (!transaction.built)
        throw new Error('Stellar transaction was not prepared')
      const kit = await getStellarWalletKit()
      const { signedTxXdr } = await kit.signTransaction(transaction.toXDR(), {
        address: sourceAddress,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      const signed = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE)
      if (
        !signed.hash().equals(transaction.built.hash()) ||
        signed.signatures.length === 0
      ) {
        throw new Error(
          'The signed Stellar transaction does not match the reviewed transfer',
        )
      }
      // Record the deterministic hash before submission: an RPC timeout can happen
      // after broadcast and must not encourage a second transfer.
      const txHash = signed.hash().toString('hex')
      updateExecution(id, { txHash, sourceStatus: 'PENDING' })
      clearSwapAmountIfUnchanged(reviewed)
      const { result } = await submitTransaction(signedTxXdr)
      if (result.status === 'ERROR') {
        updateExecution(id, { txHash, sourceStatus: 'FAILED' })
        throw new Error('Stellar rejected the LayerZero transaction')
      }
      if (result.status !== 'PENDING' && result.status !== 'DUPLICATE') {
        throw new Error(
          'Stellar submission is unconfirmed. Track the existing transaction before retrying.',
        )
      }
      try {
        await waitForTransaction(txHash, 60_000)
      } catch (error) {
        const confirmed = await SorobanClient.getTransaction(txHash).catch(
          () => undefined,
        )
        if (confirmed?.status === 'FAILED') {
          updateExecution(id, { txHash, sourceStatus: 'FAILED' })
        }
        throw error
      }
      updateExecution(id, { txHash, sourceStatus: 'SUCCESS' })
      return txHash
    },
    onSuccess: (txHash, { quote }) => {
      refetchChain(quote.fromChainId)
      createSuccessToast({
        summary: 'USDT0 sent to LayerZero. Waiting for destination delivery.',
        type: 'swap',
        account: quote.sourceAddress,
        chainId: quote.fromChainId,
        txHash,
        href: `https://layerzeroscan.com/tx/${encodeURIComponent(txHash)}`,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
    onError: (error, { id, quote }) => {
      const execution = failExecution(id, error.message)
      const unconfirmed =
        execution?.txHash && execution.sourceStatus !== 'FAILED'
      const notify = unconfirmed ? createInfoToast : createFailedToast
      notify({
        summary: unconfirmed
          ? 'Confirmation is uncertain. Track the existing transfer before retrying.'
          : error.message,
        type: 'swap',
        account: quote.sourceAddress,
        chainId: quote.fromChainId,
        txHash: execution?.txHash,
        href: execution?.txHash
          ? `https://layerzeroscan.com/tx/${encodeURIComponent(execution.txHash)}`
          : undefined,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
    onSettled: (_data, _error, { id }) => finishSubmission(id),
  })
}
