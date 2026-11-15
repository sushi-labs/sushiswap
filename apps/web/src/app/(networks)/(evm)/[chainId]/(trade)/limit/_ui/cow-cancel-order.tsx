'use client'

import { Button, Message } from '@sushiswap/ui'
import { useState } from 'react'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { isEcdsaCowOrder } from 'src/lib/swap/cow/order'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { useCowCancelOrder } from './use-cow-cancel-order'

export function CowCancelOrder({
  chainId,
  order,
  disabled,
}: {
  chainId: CowLimitChainId
  order: CowOrder
  disabled: boolean
}): React.JSX.Element {
  const [review, setReview] = useState(false)
  const { busy, error, cancel } = useCowCancelOrder(chainId, order)

  return (
    <div className="flex flex-col gap-2">
      {!review ? (
        <Button
          variant="secondary"
          disabled={disabled}
          onClick={() => setReview(true)}
        >
          Cancel order
        </Button>
      ) : (
        <>
          <Message variant="muted" size="xs">
            Cancellation prevents future fills. A fill already in settlement may
            complete. On-chain cancellation costs network gas.
          </Message>
          <Checker.Connect namespace="evm">
            <Checker.Network chainId={chainId}>
              <div className="flex gap-2">
                {isEcdsaCowOrder(order) && (
                  <Button
                    size="sm"
                    loading={busy}
                    disabled={busy || disabled}
                    onClick={() => cancel(false)}
                  >
                    Cancel without gas
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  loading={busy}
                  disabled={busy || disabled}
                  onClick={() => cancel(true)}
                >
                  Cancel on-chain
                </Button>
              </div>
            </Checker.Network>
          </Checker.Connect>
        </>
      )}
      {error && (
        <Message variant="destructive" size="xs" role="alert">
          {error}
        </Message>
      )}
    </div>
  )
}
