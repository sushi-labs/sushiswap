'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { PathnameButton } from 'src/app/_ui/pathname-button'

const SwapModeButton = ({
  isSupported,
  notSupportedText = 'Not supported on this network',
  path,
  children,
}: {
  isSupported: boolean
  notSupportedText?: string
  path: string
  children: ReactNode
}) => {
  return isSupported ? (
    <Link href={path}>
      <PathnameButton pathname={path} size="sm">
        {children}
      </PathnameButton>
    </Link>
  ) : (
    <HoverCard>
      <HoverCardTrigger>
        <PathnameButton
          pathname={path}
          size="sm"
          disabled
          className="cursor-not-allowed"
        >
          {children}
        </PathnameButton>
      </HoverCardTrigger>
      <HoverCardContent className="!px-3 !py-1.5 text-xs">
        {notSupportedText}
      </HoverCardContent>
    </HoverCard>
  )
}

export const SwapModeButtons = () => {
  return (
    <div className="flex flex-wrap gap-1 md:gap-2">
      <SwapModeButton isSupported={true} path={`/kadena/swap`}>
        Swap
      </SwapModeButton>
      <SwapModeButton isSupported={false} path={`/kadena/limit`}>
        Limit
      </SwapModeButton>
      <SwapModeButton isSupported={false} path={`/kadena/dca`}>
        DCA
      </SwapModeButton>

      <SwapModeButton isSupported={true} path={`/kadena/cross-chain-swap`}>
        <span className="flex gap-2 items-center text-transparent bg-clip-text bg-gradient-to-r saturate-200 from-blue to-pink">
          <ShuffleIcon
            width={20}
            height={20}
            className="hidden text-blue md:block"
          />
          Cross-Chain
        </span>
      </SwapModeButton>
    </div>
  )
}
