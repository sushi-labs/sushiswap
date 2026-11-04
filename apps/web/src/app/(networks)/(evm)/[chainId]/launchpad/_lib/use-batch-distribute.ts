'use client'

import {
  SPRAAY_BASE_ADDRESS,
  SPRAAY_BATCH_ABI,
  SPRAAY_CHAIN_ID,
  SPRAAY_MAX_RECIPIENTS,
  type SpraayRecipient,
  getSpraayDistributionAmount,
  validateSpraayRecipients,
} from '@spraay/dex-adapters/sushiswap'
import { createToast } from '@sushiswap/notifications'
import { useState } from 'react'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { EvmAddress } from 'sushi/evm'
import { erc20Abi } from 'viem'
import { useConnection, usePublicClient, useWriteContract } from 'wagmi'

export function useBatchDistribute({
  token,
}: {
  token: { address: EvmAddress; symbol: string } | 'native'
}) {
  const chainId = SPRAAY_CHAIN_ID
  const client = usePublicClient({ chainId })
  const { address: account, chainId: connectedChainId } = useConnection()
  const { mutateAsync: writeContractAsync } = useWriteContract()
  const [isDistributing, setIsDistributing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function batchDistribute(
    recipients: readonly SpraayRecipient[],
  ): Promise<boolean> {
    setError(null)
    setIsDistributing(true)
    try {
      if (!account) throw new Error('Connect a wallet to distribute')
      if (connectedChainId !== chainId)
        throw new Error('Switch to Base to distribute')
      if (!client) throw new Error('Could not connect to Base')
      const validationError = validateSpraayRecipients(recipients)
      if (validationError) throw new Error(validationError)

      // The protocol fee is owner-configurable, so read the cost on-chain.
      const totalCost = await client.readContract({
        address: SPRAAY_BASE_ADDRESS,
        abi: SPRAAY_BATCH_ABI,
        functionName: 'calculateTotalCost',
        args: [getSpraayDistributionAmount(recipients)],
      })
      const args = recipients.map(({ recipient, amount }) => ({
        recipient,
        amount,
      }))

      let hash: `0x${string}`
      if (token === 'native') {
        const transaction = {
          chainId,
          address: SPRAAY_BASE_ADDRESS,
          abi: SPRAAY_BATCH_ABI,
          functionName: 'sprayETH',
          args: [args],
          value: totalCost,
          account,
        } as const
        await client.simulateContract(transaction)
        hash = await writeContractAsync(transaction)
      } else {
        const allowance = await client.readContract({
          address: token.address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [account, SPRAAY_BASE_ADDRESS],
        })
        if (allowance < totalCost) {
          const approveHash = await writeContractAsync({
            chainId,
            address: token.address,
            abi: erc20Abi,
            functionName: 'approve',
            args: [SPRAAY_BASE_ADDRESS, totalCost],
            account,
          })
          const approveReceipt = await client.waitForTransactionReceipt({
            hash: approveHash,
          })
          if (approveReceipt.status !== 'success')
            throw new Error(`Failed to approve ${token.symbol}`)
        }
        const transaction = {
          chainId,
          address: SPRAAY_BASE_ADDRESS,
          abi: SPRAAY_BATCH_ABI,
          functionName: 'sprayToken',
          args: [token.address, args],
          account,
        } as const
        await client.simulateContract(transaction)
        hash = await writeContractAsync(transaction)
      }

      const symbol = token === 'native' ? 'ETH' : token.symbol
      const receiptPromise = client.waitForTransactionReceipt({ hash })
      const timestamp = Date.now()
      void createToast({
        account,
        chainId,
        txHash: hash,
        type: 'send',
        promise: receiptPromise,
        summary: {
          pending: `Distributing ${symbol} to ${recipients.length} holders`,
          completed: `${symbol} distributed to ${recipients.length} holders`,
          failed: `Failed to distribute ${symbol}`,
        },
        timestamp,
        groupTimestamp: timestamp,
        variant: 'perps',
      })
      const receipt = await receiptPromise
      if (receipt.status !== 'success')
        throw new Error('Batch distribution failed')
      return true
    } catch (error) {
      if (!isUserRejectedError(error)) {
        setError(
          error instanceof Error ? error.message : 'Batch distribution failed',
        )
      }
      return false
    } finally {
      setIsDistributing(false)
    }
  }

  return {
    batchDistribute,
    isDistributing,
    error,
    maxRecipients: SPRAAY_MAX_RECIPIENTS,
  }
}
