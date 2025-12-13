'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo } from 'react'
import { logger } from 'src/lib/logger'
import { prepareEnterSushiBarTx } from 'src/lib/stake'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { Amount } from 'sushi'
import { EvmChainId, type EvmToken, addGasMargin } from 'sushi/evm'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface UseBarDepositParams {
  amountIn: Amount<EvmToken> | undefined
  amountOut: Amount<EvmToken> | undefined
  enabled?: boolean
}

export function useBarDeposit({
  amountIn,
  amountOut,
  enabled = true,
}: UseBarDepositParams) {
  const { address } = useAccount()
  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!amountIn) return

      const receipt = client.waitForTransactionReceipt({ hash: data })
      receipt.then(() => {
        refetchBalances(EvmChainId.ETHEREUM)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'enterBar',
        chainId: EvmChainId.ETHEREUM,
        txHash: data,
        promise: receipt,
        summary: {
          pending: `Staking ${amountIn.toSignificant(6)} SUSHI`,
          completed: 'Successfully staked SUSHI',
          failed: 'Something went wrong when staking SUSHI',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [refetchBalances, amountIn, address, client],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'useBarDeposit',
      action: 'mutationError',
    })
    createErrorToast(e?.message, true)
  }, [])

  const prepareTx = useMemo(
    () =>
      amountIn && amountOut && address
        ? prepareEnterSushiBarTx(amountIn, amountOut, address)
        : {},
    [amountIn, amountOut, address],
  )

  const { data: simulation } = useSimulateContract({
    ...prepareTx,
    query: { enabled: Boolean(enabled && amountIn && amountOut && address) },
  })

  const { writeContractAsync, ...rest } = useWriteContract({
    mutation: { onSuccess, onError },
  })

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation) return undefined

    return async () => {
      try {
        const gas = simulation.request.gas
          ? addGasMargin(simulation.request.gas)
          : undefined
        await writeContractAsync({ ...simulation.request, gas })
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return { ...rest, write }
}
