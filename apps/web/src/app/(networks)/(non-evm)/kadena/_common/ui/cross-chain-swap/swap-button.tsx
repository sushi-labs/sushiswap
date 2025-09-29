import type { ExecuteBridgeParams } from '@kinesis-bridge/kinesis-sdk/dist/types'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ChainId } from 'sushi'
import { getKvmChainByKey } from 'sushi/kvm'
import { kinesisClient } from '~kadena/_common/constants/client'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'

export const XChainSwapButton = ({
  closeModal,
}: { closeModal: () => void }) => {
  const queryClient = useQueryClient()
  const { state, mutate } = useDerivedStateCrossChainSwap()
  const { token0, token1, swapAmount, swapAmountString } = state
  const [isTxnPending, setIsTxnPending] = useState(false)

  const executeBridge = async () => {
    if (!token0 || !token1 || !swapAmount || !swapAmountString) return

    try {
      setIsTxnPending(true)

      const networkIn =
        state.chainId0 === ChainId.KADENA ? 'mainnet01' : 'ethereum'
      const networkOut =
        state.chainId1 === ChainId.KADENA ? 'mainnet01' : 'ethereum'
      const chainIdIn = state.chainId0 === ChainId.KADENA ? 2 : 1
      const chainIdOut = state.chainId1 === ChainId.KADENA ? 2 : 1

      // Step 1: Build params
      const params: ExecuteBridgeParams = {
        tokenAddressIn: token0.address,
        amountIn: swapAmountString,
        networkIn: networkIn,
        chainIdIn: chainIdIn,
        senderAddress: state.recipient ?? '',
        tokenAddressOut: token1.address,
        amountOut: swapAmountString, // expected
        minAmountOut: swapAmountString, // slippage tolerance can be applied here
        networkOut: networkOut,
        chainIdOut: chainIdOut,
        receiverAddress: state.recipient ?? '',
      }

      // Step 2: Execute bridge transaction
      const tx = await kinesisClient.executeBridgeTransaction(params)
      const txnHash = tx.txnHash

      createInfoToast({
        summary: 'Bridge swap initiated...',
        type: 'swap',
        account: state.recipient!,
        chainId: state.chainId0,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txnHash,
        href: getKvmChainByKey('kadena').getTransactionUrl(txnHash),
      })

      // Step 3: Wait for confirmation
      const result = await kinesisClient.waitForTransaction({
        txnHash,
        network: networkIn,
        chainId: chainIdIn,
      })

      if (result.status !== 'success') {
        throw new Error(result.message || 'Bridge transaction failed')
      }

      createSuccessToast({
        summary: 'Bridge swap executed successfully',
        type: 'swap',
        account: state.recipient!,
        chainId: state.chainId0,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txnHash,
        href: getKvmChainByKey('kadena').getTransactionUrl(txnHash),
      })

      onSuccess()
    } catch (err) {
      createFailedToast({
        summary:
          typeof err === 'string'
            ? err
            : ((err as Error)?.message ?? 'Bridge swap failed'),
        type: 'swap',
        account: state.recipient!,
        chainId: state.chainId0,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
      console.error(err)
    } finally {
      setIsTxnPending?.(false)
    }
  }

  const onSuccess = () => {
    mutate.setSwapAmount?.('')
    closeModal()
    queryClient.invalidateQueries()
  }

  return (
    <Button
      disabled={isTxnPending}
      color="blue"
      fullWidth
      size="xl"
      onClick={executeBridge}
    >
      {isTxnPending ? (
        <Dots>Confirming Bridge Swap</Dots>
      ) : (
        <>
          Swap {token0?.symbol} to {token1?.symbol}
        </>
      )}
    </Button>
  )
}
