import { ROUTE_PROCESSOR_ADDRESS } from '@sushiswap/address'
import { Button, Dots } from '@sushiswap/ui'
import { Approve2 } from '@sushiswap/wagmi/systems/Approve2'
import { ApprovalType, ApproveDefinition } from '@sushiswap/wagmi/systems/Approve2/types'
import { useNotifications } from '../../lib/state/storage'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { SwapReviewModalBase } from './SwapReviewModalBase'
import { useTrade2 } from '../TradeProvider2'
import { TradeExecuteProvider2 } from '../TradeExecuteProvider2'
import { EnabledChainIds } from '../../config'

interface SwapReviewModalLegacy {
  chainId: EnabledChainIds
  children({ setOpen }: { setOpen(open: boolean): void }): ReactNode
  onSuccess(): void
}

export const SwapReviewModalLegacy: FC<SwapReviewModalLegacy> = ({ chainId, children, onSuccess }) => {
  const { data: trade } = useTrade2()
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)
  const [input0, input1] = useMemo(() => [trade?.amountIn, trade?.amountOut], [trade?.amountIn, trade?.amountOut])
  const onSwapSuccess = useCallback(() => {
    setOpen(false)
    onSuccess()
  }, [onSuccess])

  const definition = useMemo(() => {
    const definition: ApproveDefinition = [
      {
        type: ApprovalType.Token,
        amount: input0,
        address: ROUTE_PROCESSOR_ADDRESS[chainId],
        buttonProps: {
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'swap-review-approve-token-button',
        },
      },
    ]

    return definition
  }, [chainId, input0])

  return (
    <>
      {children({ setOpen })}
      <SwapReviewModalBase chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
        <Approve2.Root chainId={chainId} onSuccess={createNotification} definition={definition}>
          <TradeExecuteProvider2 chainId={chainId} approved={true} onSuccess={onSwapSuccess}>
            {({ isWritePending, execute }) => {
              console.log('sendTransaction function to exec', {
                sendTrasaction: execute,
              })
              return (
                <Button
                  size="md"
                  testdata-id="swap-review-confirm-button"
                  disabled={isWritePending}
                  fullWidth
                  onClick={() => execute?.()}
                >
                  {isWritePending ? <Dots>Confirm Swap</Dots> : 'Swap'}
                </Button>
              )
            }}
          </TradeExecuteProvider2>
        </Approve2.Root>
      </SwapReviewModalBase>
    </>
  )
}
