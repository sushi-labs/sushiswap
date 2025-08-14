'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo } from 'react'
import { useTrade, useTradeQuote } from 'src/lib/hooks/react-query'
import { gasMargin } from 'sushi/calculate'
import { ChainId } from 'sushi/chain'
import { type Amount, SUSHI, type Token, XSUSHI } from 'sushi/currency'
import { UserRejectedRequestError } from 'viem'
import { useAccount, usePublicClient, useSendTransaction } from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface UseBarDepositParams {
  amount: Amount<Token> | undefined
  isApproved: boolean
  enabled?: boolean
}

export function useBarDeposit({
  amount,
  isApproved,
  enabled = true,
}: UseBarDepositParams) {
  const { address } = useAccount()
  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!amount) return

      const receipt = client.waitForTransactionReceipt({ hash: data })
      receipt.then(() => {
        refetchBalances(ChainId.ETHEREUM)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'enterBar',
        chainId: ChainId.ETHEREUM,
        txHash: data,
        promise: receipt,
        summary: {
          pending: `Staking ${amount.toSignificant(6)} SUSHI`,
          completed: 'Successfully staked SUSHI',
          failed: 'Something went wrong when staking SUSHI',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [refetchBalances, amount, address, client],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const useQuote = Boolean(!address || !isApproved)

  const { data: quote } = useTradeQuote({
    chainId: ChainId.ETHEREUM,
    fromToken: SUSHI[ChainId.ETHEREUM],
    toToken: XSUSHI[ChainId.ETHEREUM],
    amount,
    slippagePercentage: '0.001',
    recipient: address,
    enabled: Boolean(enabled && amount?.greaterThan(0) && useQuote),
    carbonOffset: false,
    onlyPools: [XSUSHI[ChainId.ETHEREUM].address],
  })

  const { data: trade } = useTrade({
    chainId: ChainId.ETHEREUM,
    fromToken: SUSHI[ChainId.ETHEREUM],
    toToken: XSUSHI[ChainId.ETHEREUM],
    amount,
    slippagePercentage: '0.001',
    recipient: address,
    enabled: Boolean(enabled && amount?.greaterThan(0) && !useQuote),
    carbonOffset: false,
    onlyPools: [XSUSHI[ChainId.ETHEREUM].address],
  })

  const amountOut = (useQuote ? quote : trade)?.amountOut

  const { sendTransactionAsync, ...rest } = useSendTransaction({
    mutation: { onSuccess, onError },
  })

  const write = useMemo(() => {
    if (!sendTransactionAsync || !trade?.tx || address !== trade.tx.from)
      return undefined

    const { to, gas, data, value } = trade.tx

    return async () => {
      try {
        await sendTransactionAsync({
          to,
          data,
          value,
          gas: gas ? gasMargin(BigInt(gas)) : undefined,
        })
      } catch {}
    }
  }, [address, sendTransactionAsync, trade?.tx])

  return { ...rest, write, amountOut }
}
