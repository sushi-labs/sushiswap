import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/chain'
import { FC, ReactElement, useCallback } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { useNotifications } from '../lib/state/storage'
import { useTrade2 } from './TradeProvider2'
import { ROUTE_PROCESSOR_ADDRESS } from '@sushiswap/address'
import ROUTE_PROCESSOR_ABI from '../abis/route-processor.json'
import { EnabledChainIds } from '../config'

interface TradeExecuteProvider {
  onSuccess?(data: SendTransactionResult): void
  chainId: EnabledChainIds
  approved: boolean | undefined
  children({ execute, isWritePending }: { execute: (() => void) | undefined; isWritePending: boolean }): ReactElement
}

export const TradeExecuteProvider2: FC<TradeExecuteProvider> = ({ chainId, onSuccess, approved, children }) => {
  const { address: account } = useAccount()
  const { data: trade } = useTrade2()
  const [, { createNotification }] = useNotifications(account)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !chainId || !data) return

      const ts = new Date().getTime()

      createNotification({
        type: 'swap',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Swapping ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } for ${trade.amountOut?.toSignificant(6)} ${trade.amountOut?.currency.symbol}`,
          completed: `Successfully swapped ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } for ${trade.amountOut?.toSignificant(6)} ${trade.amountOut?.currency.symbol}`,
          failed: `Something went wrong when trying to swap ${trade.amountIn?.currency.symbol} for ${trade.amountOut?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, trade]
  )

  const { config } = usePrepareContractWrite({
    chainId,
    address: ROUTE_PROCESSOR_ADDRESS[chainId],
    abi: ROUTE_PROCESSOR_ABI,
    functionName: 'processRoute',
    args: trade?.writeArgs,
    enabled: Boolean(trade?.writeArgs) && approved,
    overrides:
      trade?.amountIn?.currency.isNative && trade?.writeArgs?.[1]
        ? { value: BigNumber.from(trade?.writeArgs?.[1]) }
        : undefined,
  })

  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    ...config,
    onSettled,
    onSuccess,
  })

  return children({ execute: writeAsync, isWritePending })
}
