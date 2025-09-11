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
import {
  isSupportedChainId,
  isTwapSupportedChainId,
  isXSwapSupportedChainId,
} from 'src/config'
import { getEvmChainById, isEvmChainId } from 'sushi/evm'
import { PathnameButton } from '../pathname-button'

const SwapModeButton = ({
  isSupported,
  path,
  children,
}: { isSupported: boolean; path: string; children: ReactNode }) => {
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
        Not supported on this network
      </HoverCardContent>
    </HoverCard>
  )
}

export const SwapModeButtons = () => {
  const { chainId: _chainId } = useParams()
  const chainId = +_chainId!

  if (!isEvmChainId(chainId)) {
    return null
  }

  return (
    <div className="flex gap-1 md:gap-2 flex-wrap">
      <SwapModeButton
        isSupported={isSupportedChainId(chainId)}
        path={`/${getEvmChainById(chainId).key}/swap`}
      >
        Swap
      </SwapModeButton>
      <SwapModeButton
        isSupported={isTwapSupportedChainId(chainId)}
        path={`/${getEvmChainById(chainId).key}/limit`}
      >
        Limit
      </SwapModeButton>
      <SwapModeButton
        isSupported={isTwapSupportedChainId(chainId)}
        path={`/${getEvmChainById(chainId).key}/dca`}
      >
        DCA
      </SwapModeButton>
      <HoverCard>
        <SwapModeButton
          isSupported={isXSwapSupportedChainId(chainId)}
          path={`/${getEvmChainById(chainId).key}/cross-chain-swap`}
        >
          <HoverCardTrigger asChild>
            <span className="saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
              <ShuffleIcon
                width={20}
                height={20}
                className="text-blue hidden md:block"
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
