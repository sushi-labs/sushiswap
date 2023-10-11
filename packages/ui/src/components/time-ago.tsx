'use client'

import { Slot } from '@radix-ui/react-slot'
import { useInterval } from '@sushiswap/hooks'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import React, { useState } from 'react'

export interface TimeAgoProps
  extends Omit<React.ButtonHTMLAttributes<HTMLSpanElement>, 'value'> {
  asChild?: boolean
  value: Date
}

const TimeAgo = React.forwardRef<HTMLButtonElement, TimeAgoProps>(
  ({ value, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span'

    const [distance, setDistance] = useState<string>(
      formatDistanceToNow(value, { addSuffix: true, includeSeconds: true }),
    )

    useInterval(() => {
      setDistance(
        formatDistanceToNow(value, { addSuffix: true, includeSeconds: true }),
      )
    }, 1000)

    return (
      <Comp ref={ref} {...props}>
        {distance}
      </Comp>
    )
  },
)

TimeAgo.displayName = 'TimeAgo'

export { TimeAgo }
