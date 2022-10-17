import { Amount, Type } from '@sushiswap/currency'
import { Button, Dots } from '@sushiswap/ui'
import { useWrapCallback, WrapType } from '@sushiswap/wagmi'
import { useNotifications } from 'lib/state/storage'
import React, { FC, ReactNode, useState } from 'react'
import { useAccount } from 'wagmi'

import { SwapReviewModalBase } from './SwapReviewModalBase'

interface WrapReviewModal {
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  wrapType: WrapType
  chainId: number | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const WrapReviewModal: FC<WrapReviewModal> = ({ input0, input1, wrapType, chainId, children }) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const [open, setOpen] = useState(false)

  const { sendTransaction, isLoading: isWritePending } = useWrapCallback({
    chainId,
    wrapType,
    onSuccess: (data) => {
      if (data) {
        setOpen(false)
        createNotification(data)
      }
    },
    amount: input0,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <SwapReviewModalBase chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
        <Button size="md" disabled={isWritePending} fullWidth onClick={() => sendTransaction?.()}>
          {isWritePending ? (
            <Dots>Confirm {wrapType === WrapType.Wrap ? 'Wrap' : 'Unwrap'}</Dots>
          ) : wrapType === WrapType.Wrap ? (
            'Wrap'
          ) : (
            'Unwrap'
          )}
        </Button>
      </SwapReviewModalBase>
    </>
  )
}
