'use client'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { isXSwapSupportedChainId } from 'src/config'
import { PathnameButton } from 'src/ui/pathname-button'

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
  const { chainId: _chainId } = useParams()
  const chainId = +_chainId!

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
      <HoverCard>
        <SwapModeButton
          isSupported={false}
          path={`/kadena/cross-chain-swap`}
          notSupportedText="Coming soon"
        >
          <HoverCardTrigger asChild>
            <span className="flex gap-2 items-center text-transparent bg-clip-text bg-gradient-to-r saturate-200 from-blue to-pink">
              <ShuffleIcon
                width={20}
                height={20}
                className="hidden text-blue md:block"
              />
              Cross-Chain
            </span>
          </HoverCardTrigger>
        </SwapModeButton>
        {isXSwapSupportedChainId(chainId) ? (
          <HoverCardContent className="!p-0 max-w-[320px]">
            <CardHeader>
              <CardTitle>Cross-Chain Swap</CardTitle>
              <CardDescription>
                Swap tokens natively across 15 chains including Ethereum,
                Arbitrum, Optimism, Polygon, Base and more!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                target="_blank"
                className="text-sm text-blue hover:underline"
                href="https://www.sushi.com/blog/sushixswap-v2"
                rel="noreferrer"
              >
                Learn more.
              </a>
            </CardContent>
          </HoverCardContent>
        ) : null}
      </HoverCard>
    </div>
  )
}
