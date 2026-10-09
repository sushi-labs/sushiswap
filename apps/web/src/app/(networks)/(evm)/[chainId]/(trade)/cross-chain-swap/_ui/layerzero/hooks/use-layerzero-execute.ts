'use client'

import {
  getBase64EncodedWireTransaction,
  getTransactionDecoder,
} from '@solana/kit'
import { TransactionBuilder } from '@stellar/stellar-sdk'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import ms from 'ms'
import { useRef } from 'react'
import { NETWORK_PASSPHRASE } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/constants'
import { SorobanClient } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/client'
import {
  submitTransaction,
  waitForTransaction,
} from 'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/transaction-helpers'
import { APPROVE_TAG_XSWAP, TOAST_AUTOCLOSE_TIME } from 'src/lib/constants'
import { useSvmSignTransaction } from 'src/lib/svm/hooks/use-svm-sign-transaction'
import { getSvmRpc } from 'src/lib/svm/rpc'
import {
  SvmTransactionFailedError,
  waitForSvmSignature,
} from 'src/lib/svm/wait-for-svm-signature'
import {
  fetchValueTransferMetadata,
  fetchValueTransferUserSteps,
} from 'src/lib/swap/value-transfer/api'
import {
  assertValueTransferQuoteIsCurrent,
  assertValueTransferSolanaSignature,
  buildValueTransferStellarTransaction,
  getValueTransferApproval,
  validateValueTransferSolanaTransaction,
  validateValueTransferUserSteps,
} from 'src/lib/swap/value-transfer/execution'
import {
  type ValueTransferSubmitSignatureRequest,
  valueTransferSubmitSignatureResponseSchema,
} from 'src/lib/swap/value-transfer/schemas'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { DialogType, useDialog } from 'src/lib/transaction-dialog'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useApproved } from 'src/lib/wagmi/systems/checker/provider'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { getStellarWalletKit } from 'src/lib/wallet/namespaces/stellar/config'
import { isEvmChainId } from 'sushi/evm'
import { type Hex, type PublicClient, erc20Abi } from 'viem'
import { usePublicClient, useSendTransaction, useSignTypedData } from 'wagmi'
import { useRefetchBalances } from '../../../../../../_common/ui/balance-provider/use-refetch-balances'
import { useLayerZeroXSwap } from '../xswap-provider'
import { useIsLayerZeroXSwapMaintenance } from './use-is-layerzero-xswap-maintenance'

async function submitSignatures(
  body: ValueTransferSubmitSignatureRequest,
): Promise<void> {
  const response = await fetch(
    '/api/cross-chain/value-transfer/submit-signature',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )
  if (!response.ok) throw new Error('LayerZero submit-signature request failed')
  valueTransferSubmitSignatureResponseSchema.parse(await response.json())
}

export function useLayerZeroExecute(): UseMutationResult<
  string,
  Error,
  { id: string; quote: ValueTransferTrade }
> {
  const {
    state: { chainId0, chainId1, swapAmount, token0, token1 },
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
  const wallets = {
    evm: useAccount('evm'),
    svm: useAccount('svm'),
    stellar: useAccount('stellar'),
  }
  const currentWallets = useRef(wallets)
  currentWallets.current = wallets
  const publicClient = usePublicClient({
    chainId: isEvmChainId(chainId0) ? chainId0 : undefined,
  })
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()
  const { signTransaction } = useSvmSignTransaction()
  const { refetchChain } = useRefetchBalances()
  const { data: maintenance } = useIsLayerZeroXSwapMaintenance()
  const { approved } = useApproved(APPROVE_TAG_XSWAP)
  const { confirm } = useDialog(DialogType.Review)

  function assertWallets(reviewed: ValueTransferTrade): void {
    if (
      currentWallets.current[getNamespaceForChainId(reviewed.fromChainId)] !==
        reviewed.sourceAddress ||
      currentWallets.current[getNamespaceForChainId(reviewed.toChainId)] !==
        reviewed.recipient
    ) {
      throw new Error('The connected wallets changed. Review a new quote.')
    }
    assertValueTransferQuoteIsCurrent(reviewed)
  }

  return useMutation({
    mutationKey: ['value-transfer-execute', chainId0, chainId1],
    mutationFn: async ({ id, quote: reviewed }) => {
      if (maintenance)
        throw new Error('LayerZero swaps are undergoing maintenance')
      if (!sourceAddress || !recipient || !swapAmount?.gt(0n))
        throw new Error('Connect both wallets and enter an amount')
      if (!approved)
        throw new Error('Complete the swap checks before continuing')
      if (
        reviewed.fromChainId !== chainId0 ||
        reviewed.toChainId !== chainId1 ||
        reviewed.sourceAddress !== sourceAddress ||
        reviewed.recipient !== recipient ||
        reviewed.amountIn !== swapAmount.amount ||
        reviewed.token0.id !== token0?.id ||
        reviewed.token1.id !== token1?.id
      ) {
        throw new Error('Swap inputs changed. Review a new quote.')
      }
      assertWallets(reviewed)
      if (!beginExecution(id, reviewed))
        throw new Error(
          'This transfer has already been submitted or another submission is in progress',
        )
      const steps = await fetchValueTransferUserSteps({
        quoteId: reviewed.quote.id,
      })
      const metadata =
        reviewed.srcChain.chainType === 'EVM'
          ? await fetchValueTransferMetadata()
          : {}
      validateValueTransferUserSteps(reviewed, steps, metadata)
      let txHash: string | undefined
      const signatures: Hex[] = []
      const signatureCount = steps.filter(
        (step) => step.type === 'SIGNATURE',
      ).length
      for (const step of steps) {
        assertWallets(reviewed)
        if (step.type === 'SIGNATURE') {
          const typedData = step.signature.typedData
          const signature = await signTypedDataAsync({
            ...typedData,
            domain: {
              ...typedData.domain,
              chainId:
                typedData.domain.chainId === undefined
                  ? undefined
                  : Number(typedData.domain.chainId),
            },
            account: step.signerAddress,
          })
          signatures.push(signature)
          if (signatures.length === signatureCount) {
            assertWallets(reviewed)
            // Submission can be accepted even if its HTTP response times out.
            updateExecution(id, { submitted: true, sourceStatus: 'PENDING' })
            clearSwapAmountIfUnchanged(reviewed)
            await submitSignatures({ quoteId: reviewed.quote.id, signatures })
          }
          continue
        }
        if (step.chainType === 'EVM') {
          if (!publicClient || !isEvmChainId(reviewed.fromChainId))
            throw new Error('Connect the source EVM wallet')
          const encoded = step.transaction.encoded
          const approval = getValueTransferApproval(step)
          if (approval) {
            const allowance = await publicClient.readContract({
              address: encoded.to,
              abi: erc20Abi,
              functionName: 'allowance',
              args: [step.signerAddress, approval.spender],
            })
            if (allowance < reviewed.amountIn)
              throw new Error(
                'Token approval is required. Review the swap again.',
              )
            // Approval is completed before review. Rebuilt steps can retain
            // the approval or its zero reset, so never send it a second time.
            continue
          }
          const request = {
            account: step.signerAddress,
            to: encoded.to,
            data: encoded.data,
            value: BigInt(encoded.value ?? '0'),
          }
          // Estimate the exact API calldata against the approved current state.
          const estimateGas: PublicClient['estimateGas'] =
            publicClient.estimateGas
          const gas = await estimateGas(request)
          assertWallets(reviewed)
          updateExecution(id, { submitted: true, sourceStatus: 'PENDING' })
          let hash: Hex
          try {
            hash = await sendTransactionAsync({
              ...request,
              gas,
              chainId: reviewed.fromChainId,
            } as Parameters<typeof sendTransactionAsync>[0])
          } catch (error) {
            if (isUserRejectedError(error))
              updateExecution(id, { submitted: false, sourceStatus: 'FAILED' })
            throw error
          }
          txHash = hash
          updateExecution(id, {
            txHash,
            submitted: true,
            sourceStatus: 'PENDING',
          })
          clearSwapAmountIfUnchanged(reviewed)
          let replacementReason:
            | 'repriced'
            | 'replaced'
            | 'cancelled'
            | undefined
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
            onReplaced: ({ reason, transactionReceipt }) => {
              replacementReason = reason
              updateExecution(id, {
                txHash: transactionReceipt.transactionHash,
              })
            },
          })
          if (
            receipt.status !== 'success' ||
            replacementReason === 'cancelled'
          ) {
            updateExecution(id, { sourceStatus: 'FAILED' })
            throw new Error('The source transaction reverted or was cancelled')
          }
          if (replacementReason === 'replaced')
            throw new Error(
              'The source transaction was replaced. Check the existing transaction before sending again.',
            )
          txHash = receipt.transactionHash
        } else if (step.chainType === 'SOLANA') {
          const data = step.transaction.encoded.data
          validateValueTransferSolanaTransaction(data, step.signerAddress)
          const signed = await signTransaction(
            new Uint8Array(Buffer.from(data, 'base64')),
          )
          assertValueTransferSolanaSignature(
            data,
            signed.base64SignedTx,
            step.signerAddress,
          )
          assertWallets(reviewed)
          txHash = signed.base58TxSig
          updateExecution(id, {
            txHash,
            submitted: true,
            sourceStatus: 'PENDING',
          })
          clearSwapAmountIfUnchanged(reviewed)
          await getSvmRpc()
            .sendTransaction(
              getBase64EncodedWireTransaction(
                getTransactionDecoder().decode(
                  Buffer.from(signed.base64SignedTx, 'base64'),
                ),
              ),
              { encoding: 'base64', preflightCommitment: 'confirmed' },
            )
            .send()
          try {
            await waitForSvmSignature(txHash)
          } catch (error) {
            if (error instanceof SvmTransactionFailedError)
              updateExecution(id, { sourceStatus: 'FAILED' })
            throw error
          }
        } else {
          const transaction = await buildValueTransferStellarTransaction({
            ...step.transaction.encoded,
            sourceAddress: step.signerAddress,
          })
          assertWallets(reviewed)
          const kit = await getStellarWalletKit()
          const { signedTxXdr } = await kit.signTransaction(
            transaction.toXDR(),
            {
              address: step.signerAddress,
              networkPassphrase: NETWORK_PASSPHRASE,
            },
          )
          const signed = TransactionBuilder.fromXDR(
            signedTxXdr,
            NETWORK_PASSPHRASE,
          )
          if (
            !signed.hash().equals(transaction.hash()) ||
            signed.signatures.length === 0
          )
            throw new Error(
              'The signed Stellar transaction does not match the reviewed transfer',
            )
          assertWallets(reviewed)
          txHash = signed.hash().toString('hex')
          updateExecution(id, {
            txHash,
            submitted: true,
            sourceStatus: 'PENDING',
          })
          clearSwapAmountIfUnchanged(reviewed)
          const { result } = await submitTransaction(signedTxXdr)
          if (result.status === 'ERROR') {
            updateExecution(id, { sourceStatus: 'FAILED' })
            const reason = result.errorResult?.result().switch().name
            throw new Error(
              `Stellar rejected the LayerZero transaction${reason ? `: ${reason}` : ''}`,
            )
          }
          if (result.status !== 'PENDING' && result.status !== 'DUPLICATE')
            throw new Error(
              'Stellar submission is unconfirmed. Track the existing transaction before retrying.',
            )
          try {
            await waitForTransaction(txHash, ms('60s'))
          } catch (error) {
            const confirmed = await SorobanClient.getTransaction(txHash).catch(
              () => undefined,
            )
            if (confirmed?.status === 'FAILED')
              updateExecution(id, { sourceStatus: 'FAILED' })
            throw error
          }
        }
      }
      updateExecution(id, { txHash, submitted: true, sourceStatus: 'SUCCESS' })
      return txHash ?? reviewed.quote.id
    },
    onSuccess: (_result, { quote }) => {
      confirm()
      refetchChain(quote.fromChainId)
      createSuccessToast({
        summary:
          'Transfer submitted to LayerZero. Waiting for destination delivery.',
        type: 'swap',
        account: quote.sourceAddress,
        chainId: quote.fromChainId,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
    onError: (error, { id, quote }) => {
      const execution = failExecution(id, error.message)
      if (
        isUserRejectedError(error) &&
        !execution?.txHash &&
        !execution?.submitted
      )
        return
      confirm()
      const unconfirmed =
        (execution?.txHash || execution?.submitted) &&
        execution.sourceStatus !== 'FAILED'
      const notify = unconfirmed ? createInfoToast : createFailedToast
      notify({
        summary: unconfirmed
          ? 'Confirmation is uncertain. Track the existing transfer before retrying.'
          : error.message,
        type: 'swap',
        account: quote.sourceAddress,
        chainId: quote.fromChainId,
        txHash: execution?.txHash,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
      })
    },
    onSettled: (_data, _error, { id }) => finishSubmission(id),
  })
}
