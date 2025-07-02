import { OrderType } from '@orbs-network/twap-sdk'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import { TwapSDK } from 'src/lib/swap/twap'
import { twapAbi_cancel } from 'src/lib/swap/twap/abi'
import { publicClientConfig } from 'src/lib/wagmi/config/viem'
import {
  type Address,
  type SendTransactionReturnType,
  UserRejectedRequestError,
  encodeFunctionData,
} from 'viem'
import {
  useAccount,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { type TwapOrder, usePersistedOrdersStore } from './useTwapOrders'

export const useCancelOrder = (
  chainId: TwapSupportedChainId,
  order: TwapOrder,
) => {
  const client = usePublicClient()

  const { address, chainId: connectedChainId } = useAccount()

  const { addCancelledOrderId } = usePersistedOrdersStore({
    account: address,
  })

  const tx = useMemo(() => {
    return {
      chainId,
      account: address,
      to: TwapSDK.onNetwork(chainId).config.twapAddress as Address,
      data: encodeFunctionData({
        abi: twapAbi_cancel,
        functionName: 'cancel',
        args: [BigInt(order.id)],
      }),
    }
  }, [chainId, order, address])

  const { data: estGas, isError: isEstGasError } = useEstimateGas({
    ...tx,
    query: {
      enabled: Boolean(tx),
    },
  })

  const onCancelSuccess = useCallback(
    async (hash: SendTransactionReturnType) => {
      const isLimitOrder = order.type === OrderType.LIMIT

      try {
        const ts = new Date().getTime()
        const promise = client.waitForTransactionReceipt({
          hash,
        })

        void createToast({
          account: address,
          type: 'swap',
          chainId: tx.chainId,
          txHash: hash,
          promise,
          summary: {
            pending: `Canceling ${isLimitOrder ? 'limit' : 'DCA'} order`,
            completed: `Canceled ${isLimitOrder ? 'limit' : 'DCA'} order`,
            failed: `Something went wrong when canceling ${
              isLimitOrder ? 'limit' : 'DCA'
            } order`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      } finally {
        addCancelledOrderId(chainId, order.id)
      }
    },
    [order, tx, client, address, addCancelledOrderId, chainId],
  )

  const onCancelError = useCallback((e: Error) => {
    if (e.cause instanceof UserRejectedRequestError) {
      return
    }

    createErrorToast(e.message, false)
  }, [])

  const {
    sendTransactionAsync,
    isPending: isWritePending,
    data,
  } = useSendTransaction({
    mutation: {
      onSuccess: onCancelSuccess,
      onError: onCancelError,
    },
  })

  const write = useMemo(() => {
    if (!sendTransactionAsync || !estGas) return undefined

    return async (confirm?: () => void) => {
      if (connectedChainId !== chainId) {
        void createErrorToast(
          `Please switch to ${publicClientConfig[chainId].chain.name} to cancel this order`,
          false,
        )
        return
      }
      await sendTransactionAsync({
        ...tx,
        gas: (estGas * 6n) / 5n,
      })
      confirm?.()
    }
  }, [sendTransactionAsync, tx, estGas, connectedChainId, chainId])

  const { isLoading: isTxLoading, isError: isTxError } =
    useWaitForTransactionReceipt({
      chainId: chainId,
      hash: data,
    })

  return {
    write,
    isWritePending,
    isTxLoading,
    isEstGasError,
    isTxError,
    txHash: data,
    disabled: Boolean(
      isEstGasError ||
        isWritePending ||
        isTxLoading ||
        Boolean(!sendTransactionAsync),
    ),
  }
}
