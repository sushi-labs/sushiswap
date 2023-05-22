'use client'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@sushiswap/ui/future/components/Tooltip'
import React from 'react'

export function InfoIconTooltip({ description }: { description: string }) {
  return (
    <Tooltip description={description}>
      <InformationCircleIcon className="h-4 w-4" strokeWidth={2} />
    </Tooltip>
  )
}
