import {
  getConfig,
  Order,
  REPERMIT_ABI,
  TWAP_ABI,
  useOrderHistoryPanel,
  useRefetchUntilStatusSynced,
} from '@orbs-network/spot-react'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'

import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import {
  type Address,
  type SendTransactionReturnType,
  encodeFunctionData,
} from 'viem'
import {
  useConnection,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { getTwapConfig, getTwapOrderTitle } from './helper'
import { EvmChainId } from 'sushi/evm'

export const TwapCancelOrderButton = ({
  chainId,
  order,
}: {
  chainId: EvmChainId
  order: Order
}) => {
  const client = usePublicClient()

  const { address } = useConnection()
  const { mutate: refetchOrders, isPending: isRefetchingOrders } =
    useRefetchUntilStatusSynced()

  const tx = useMemo(() => {
    if (order.version === 1) {
      return {
        chainId,
        account: address,
        to: order.twapAddress as Address,
        data: encodeFunctionData({
          abi: TWAP_ABI,
          functionName: 'cancel',
          args: [BigInt(order.id)],
        }),
      }
    }
    return {
      chainId,
      account: address,
      to: getTwapConfig(chainId).repermit,
      data: encodeFunctionData({
        abi: REPERMIT_ABI,
        functionName: 'cancel',
        args: [[order.hash]],
      }),
    }
  }, [chainId, order, address])

  const { data: estGas, isError: isEstGasError } = useEstimateGas({
    ...tx,
    query: {
      enabled: Boolean(tx),
    },
  })
  const title = getTwapOrderTitle(order.type)

  const onCancelSuccess = useCallback(
    async (hash: SendTransactionReturnType) => {
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
            pending: `Canceling ${title} order`,
            completed: `Canceled ${title} order`,
            failed: `Something went wrong when canceling ${title} order`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      } catch (e) {
        console.log(e)
      }
    },
    [tx, client, address, title],
  )

  const onCancelError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'TwapCancelOrderButton',
    })
    createErrorToast(e.message, false)
  }, [])

  const {
    mutateAsync: sendTransactionAsync,
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
      try {
        await sendTransactionAsync({
          ...tx,
          gas: (estGas * 6n) / 5n,
        })
        refetchOrders([order.hash])
        confirm?.()
      } catch {}
    }
  }, [sendTransactionAsync, tx, estGas, refetchOrders, order.hash])

  const { isLoading: isTxLoading, isError: isTxError } =
    useWaitForTransactionReceipt({
      chainId: chainId,
      hash: data,
    })

  return (
    <Button
      fullWidth
      size="xl"
      loading={(!write && !isEstGasError) || isRefetchingOrders}
      onClick={() => write?.()}
      disabled={Boolean(
        isEstGasError ||
        isWritePending ||
        isRefetchingOrders ||
        isTxLoading ||
        Boolean(!sendTransactionAsync),
      )}
      testId="cancel-order"
    >
      {isEstGasError || isTxError ? (
        'Shoot! Something went wrong :('
      ) : isWritePending || isTxLoading || isRefetchingOrders ? (
        <Dots>Cancel Order</Dots>
      ) : (
        'Cancel Order'
      )}
    </Button>
  )
}
