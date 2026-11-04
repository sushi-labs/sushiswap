'use client'

import type { ComponentProps, ReactElement } from 'react'
import { SelectPricesWidget } from './index'
import type { LiquidityFormMode } from './liquidity-form-mode-toggle'
import { SimplePriceRange } from './simple-price-range'

type Props = ComponentProps<typeof SelectPricesWidget> & {
  mode: LiquidityFormMode
}

export function LiquidityPriceRange({ mode, ...props }: Props): ReactElement {
  // Existing NFT positions have fixed ticks. Keep their original form, as well
  // as migration callers, outside the new editable-range experience.
  if (props.tokenId !== undefined) return <SelectPricesWidget {...props} />

  // Only presentation changes. The provider and deposit/review widgets stay
  // mounted, and switching modes never dispatches a mint-state action.
  return mode === 'advanced' ? (
    <SelectPricesWidget {...props} />
  ) : (
    <SimplePriceRange
      key={`${props.chainId}:${props.token0?.wrap().address}:${props.token1?.wrap().address}:${props.feeAmount}`}
      {...props}
    />
  )
}
