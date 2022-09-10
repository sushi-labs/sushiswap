import { ChainId } from '@sushiswap/chain'
import { Button, Dots } from '@sushiswap/ui'
import { Approve, getV2RouterContractConfig } from '@sushiswap/wagmi'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { useNotifications } from '../../lib/state/storage'
import { useTrade } from '../TradeProvider'
import { SwapReviewModalBase } from './SwapReviewModalBase'

interface SwapReviewModalLegacy {
  chainId: ChainId
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const SwapReviewModalLegacy: FC<SwapReviewModalLegacy> = ({ chainId, children }) => {
  const { trade } = useTrade()
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({
    chainId,
    onSuccess: () => setOpen(false),
  })

  const execute = useCallback(async () => {
    try {
      await sendTransactionAsync()
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [sendTransactionAsync])

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount]
  )

  return (
    <>
      {children({ isWritePending, setOpen })}
      <SwapReviewModalBase
        chainId={chainId}
        input0={input0}
        input1={input1}
        open={open}
        setOpen={setOpen}
        error={error}
      >
        <Approve
          onSuccess={createNotification}
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              <Approve.Token
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input0}
                address={getV2RouterContractConfig(chainId).addressOrName}
              />
            </Approve.Components>
          }
          render={({ approved }) => {
            return (
              <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={execute}>
                {isWritePending ? <Dots>Confirm Swap</Dots> : 'Swap'}
              </Button>
            )
          }}
        />
      </SwapReviewModalBase>
    </>
  )
}
