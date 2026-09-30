'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Toggle,
} from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'

interface FeeTierCardProps {
  fee: number
  description: string
  selected?: boolean
  disabled?: boolean
  badge?: ReactNode
  onSelect?(): void
}

export function FeeTierCard({
  fee,
  description,
  selected = false,
  disabled = false,
  badge,
  onSelect,
}: FeeTierCardProps): ReactElement {
  const content = (
    <CardHeader>
      <CardTitle>
        <span className="flex flex-wrap items-center gap-2">
          <span>{fee / 10000}% Fees</span>
          {badge}
        </span>
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  )

  if (!onSelect) return <Card className="opacity-40">{content}</Card>

  return (
    <Toggle
      type="button"
      pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      testdata-id={`fee-option-${fee}`}
      className="!h-auto !w-auto !p-0 !text-left !justify-start items-stretch whitespace-normal bg-white dark:bg-background dark:data-[state=on]:bg-secondary"
    >
      <Card variant="outline" className="w-full text-left">
        {content}
      </Card>
    </Toggle>
  )
}
