'use client'

import type { ReactElement } from 'react'
import { RecipientSection as SwapRecipientSection } from '../../../../swap/_ui/simple-swap-trade-review-dialog/recipient-section'
import { useLifiXSwap } from '../xswap-provider'

export function RecipientSection(): ReactElement {
  const {
    state: { chainId1, recipient },
  } = useLifiXSwap()

  return <SwapRecipientSection chainId={chainId1} recipient={recipient} />
}
