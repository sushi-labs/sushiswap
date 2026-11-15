'use client'

import { Button, Message } from '@sushiswap/ui'
import { isEcdsaCowOrder } from 'src/lib/swap/cow/order'
import type { CowOrder } from 'src/lib/swap/cow/schema'

export function CowEditOptions({
  editing,
  onStopEditing,
}: {
  editing: CowOrder
  onStopEditing(): void
}): React.JSX.Element {
  return (
    <Message variant="info" size="sm" className="flex flex-col gap-2">
      <span>
        Editing an order replaces its remaining amount. The token pair and
        recipient stay fixed.
        {!isEcdsaCowOrder(editing) &&
          ' The original order is cancelled on-chain (network gas) before the replacement is signed.'}
      </span>
      <Button variant="secondary" size="sm" onClick={onStopEditing}>
        Stop editing
      </Button>
    </Message>
  )
}
