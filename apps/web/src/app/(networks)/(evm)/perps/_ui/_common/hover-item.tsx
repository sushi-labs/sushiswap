import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import type { ReactNode } from 'react'

export const HoverItem = ({
  title,
  description,
  side = 'top',
}: {
  title: ReactNode
  description: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}) => {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <span className="underline text-perps-muted-50">{title}</span>
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side={side}
        className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>{description}</p>
      </HoverCardContent>
    </HoverCard>
  )
}
