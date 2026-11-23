'use client'

import { Explainer, List } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'

export function ReviewDetailRow({
  title,
  explanation,
  children,
}: {
  title: ReactNode
  explanation?: ReactNode
  children: ReactNode
}): ReactElement {
  return (
    <List.KeyValue
      className="!py-1.5 !px-0"
      fontWeight="normal"
      title={
        <div className="flex items-center gap-1 text-muted-foreground">
          <span>{title}</span>
          {explanation ? <Explainer>{explanation}</Explainer> : null}
        </div>
      }
    >
      {children}
    </List.KeyValue>
  )
}
