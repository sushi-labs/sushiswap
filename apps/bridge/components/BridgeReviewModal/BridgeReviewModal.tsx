import { Signature } from '@ethersproject/bytes'
import { Button, Dots } from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import React, { FC, ReactNode, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'

import { useNotifications } from '../../lib/state/storage'
import { BridgeExecuteProvider } from '../BridgeExecuteProvider'
import { useBridgeState, useBridgeStateActions } from '../BridgeStateProvider'
import { BridgeReviewModalBase } from './BridgeReviewModalBase'

interface BridgeReviewModal {
  children({ setOpen }: { setOpen(open: boolean): void }): ReactNode
}

export const BridgeReviewModal: FC<BridgeReviewModal> = ({ children }) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [, { createNotification }] = useNotifications(address)
  const { srcChainId, amount } = useBridgeState()
  const { setSignature } = useBridgeStateActions()

  const onSig = useCallback(
    (sig: Signature | undefined) => {
      if (sig) {
        setSignature(sig)
      }
    },
    [setSignature]
  )

  return (
    <>
      {children({ setOpen })}
      <BridgeReviewModalBase open={open} setOpen={setOpen}>
        <Approve
          className="flex-grow !justify-end pt-4"
          onSuccess={createNotification}
          components={
            <Approve.Components>
              <Approve.Bentobox
                size="md"
                className="whitespace-nowrap"
                fullWidth
                address={getSushiXSwapContractConfig(srcChainId).addressOrName}
                onSignature={onSig}
                enabled={Boolean(getSushiXSwapContractConfig(srcChainId).addressOrName)}
              />
              <Approve.Token
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={amount}
                address={BENTOBOX_ADDRESS[srcChainId]}
                enabled={Boolean(BENTOBOX_ADDRESS[srcChainId])}
              />
            </Approve.Components>
          }
          render={({ approved }) => {
            return (
              <BridgeExecuteProvider approved={approved}>
                {({ isWritePending, execute }) => {
                  return (
                    <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={() => execute?.()}>
                      {isWritePending ? <Dots>Confirm Bridging</Dots> : 'Bridge'}
                    </Button>
                  )
                }}
              </BridgeExecuteProvider>
            )
          }}
        />
      </BridgeReviewModalBase>
    </>
  )
}
