'use client'

import { Button, SkeletonText } from '@sushiswap/ui'
import type { ReactElement } from 'react'

interface TokenRateProps {
  baseSymbol?: string
  quoteSymbol?: string
  rate?: string
  fiatValue?: string
  isLoading?: boolean
  onInvert(): void
  'aria-label'?: string
}

export function TokenRate({
  baseSymbol,
  quoteSymbol,
  rate,
  fiatValue,
  isLoading = false,
  onInvert,
  'aria-label': ariaLabel,
}: TokenRateProps): ReactElement {
  if (isLoading) return <SkeletonText fontSize="sm" className="!w-[100px]" />

  return (
    <Button
      className="!text-xs md:!text-sm !font-medium !text-primary !gap-0.5 !px-0 hover:!bg-transparent focus:!bg-transparent"
      variant="ghost"
      size="xs"
      aria-label={ariaLabel}
      onClick={onInvert}
    >
      1 {baseSymbol} = {rate} {quoteSymbol}
      {fiatValue !== undefined ? (
        <span className="!font-normal">({fiatValue})</span>
      ) : null}
    </Button>
  )
}
