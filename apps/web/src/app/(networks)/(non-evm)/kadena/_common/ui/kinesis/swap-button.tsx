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
import { useAccount } from 'wagmi'
import { kinesisClient } from '~kadena/_common/constants/client'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const KinesisSwapButton = ({
  closeModal,
  setTxHash,
  setStatus,
}: {
  closeModal: () => void
  setTxHash: (txHash: `0x${string}` | string) => void
  setStatus: (status: 'pending' | 'success' | 'error') => void
}) => {
  const queryClient = useQueryClient()
  const {
    state: {
      token0,
      token1,
      swapAmount,
      swapAmountString,
      chainId0,
      chainId1,
      simulateBridgeTx,
    },
    mutate: { setSwapAmount },
  } = useDerivedStateCrossChainSwap()
  const [isTxnPending, setIsTxnPending] = useState(false)
  const { address } = useAccount()
  const { activeAccount } = useKadena()

  const executeBridge = async () => {
    if (!token0 || !token1 || !swapAmount || !swapAmountString) return

    const senderAddress =
      chainId0 === ChainId.KADENA
        ? (activeAccount?.accountName ?? '')
        : (address ?? '')
    const receiverAddress =
      chainId1 === ChainId.KADENA
        ? (activeAccount?.accountName ?? '')
        : (address ?? '')

    try {
      setIsTxnPending(true)

      const networkIn = chainId0 === ChainId.KADENA ? 'mainnet01' : 'ethereum'
      const networkOut = chainId1 === ChainId.KADENA ? 'mainnet01' : 'ethereum'
      const chainIdIn = chainId0 === ChainId.KADENA ? 2 : 1
      const chainIdOut = chainId1 === ChainId.KADENA ? 2 : 1

      const params: ExecuteBridgeParams = {
        tokenAddressIn: token0.address,
        amountIn: swapAmountString,
        networkIn: networkIn,
        chainIdIn: chainIdIn,
        senderAddress: senderAddress,
        tokenAddressOut: token1.address,
        amountOut: simulateBridgeTx?.estimatedAmountReceived ?? '',
        minAmountOut: simulateBridgeTx?.amountMinReceived ?? '',
        networkOut: networkOut,
        chainIdOut: chainIdOut,
        receiverAddress: receiverAddress,
      }

      const tx = await kinesisClient.executeBridgeTransaction(params)
      const txnHash = tx.txnHash
      setTxHash(txnHash)
      setStatus('pending')

      createInfoToast({
        summary: 'Bridge swap initiated...',
        type: 'xswap',
        account: senderAddress,
        chainId: chainId0,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
        txHash: txnHash,
        href: getKvmChainByKey('kadena').getTransactionUrl(txnHash),
      })

      const result = await kinesisClient.waitForTransaction({
        txnHash,
        network: networkIn,
        chainId: chainIdIn,
      })

      if (result.status !== 'success') {
        setStatus('error')
        throw new Error(result.message || 'Bridge transaction failed')
      }

      setStatus('success')

      createSuccessToast({
        summary: 'Bridge swap executed successfully',
        type: 'xswap',
        account: senderAddress,
        chainId: chainId0,
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
        type: 'xswap',
        account: senderAddress,
        chainId: chainId0,
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
      setStatus('error')
      console.error(err)
    } finally {
      setIsTxnPending?.(false)
    }
  }

  const onSuccess = () => {
    setSwapAmount('')
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
