import { OrderType } from '@orbs-network/twap-sdk'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import {
  type TwapOrder,
  usePersistedOrdersStore,
} from 'src/lib/hooks/react-query/twap'
import { TwapSDK } from 'src/lib/swap/twap'
import { twapAbi_cancel } from 'src/lib/swap/twap/abi'
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

export const TwapCancelOrderButton = ({
  chainId,
  order,
}: { chainId: TwapSupportedChainId; order: TwapOrder }) => {
  const client = usePublicClient()

  const { address } = useAccount()

  const { addCancelledOrderId } = usePersistedOrdersStore({
    chainId,
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
            failed: `Something went wrong when canceling ${isLimitOrder ? 'limit' : 'DCA'} order`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      } finally {
        addCancelledOrderId(order.id)
      }
    },
    [order, tx, client, address, addCancelledOrderId],
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
      await sendTransactionAsync({
        ...tx,
        gas: (estGas * 6n) / 5n,
      })
      confirm?.()
    }
  }, [sendTransactionAsync, tx, estGas])

  const { isLoading: isTxLoading, isError: isTxError } =
    useWaitForTransactionReceipt({
      chainId: chainId,
      hash: data,
    })

  return (
    <Button
      fullWidth
      size="xl"
      loading={!write && !isEstGasError}
      onClick={() => write?.()}
      disabled={Boolean(
        isEstGasError ||
          isWritePending ||
          isTxLoading ||
          Boolean(!sendTransactionAsync),
      )}
      testId="cancel-order"
    >
      {isEstGasError || isTxError ? (
        'Shoot! Something went wrong :('
      ) : isWritePending || isTxLoading ? (
        <Dots>Cancel Order</Dots>
      ) : (
        'Cancel Order'
      )}
    </Button>
  )
}
