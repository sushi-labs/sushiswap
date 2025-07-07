'use client'

import { Button } from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import Link from 'next/link'
import type { FC, ReactNode } from 'react'
import { isTwapSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import { PathnameButton } from 'src/ui/pathname-button'
import { type EvmToken, getEvmChainById } from 'sushi/evm'

interface SwapModeButtonProps {
  href?: string
  className?: string
  children: ReactNode
}

const SwapModeButton: FC<SwapModeButtonProps> = ({ href, children }) => {
  return href ? (
    <Link href={href}>
      <PathnameButton pathname={href} size="sm">
        {children}
      </PathnameButton>
    </Link>
  ) : (
    <PathnameButton pathname="" disabled size="sm">
      {children}
    </PathnameButton>
  )
}

interface SwapModeButtonsProps {
  token: EvmToken
}

export const SwapModeButtons: FC<SwapModeButtonsProps> = ({ token }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="secondary" size="sm">
        Swap
      </Button>
      <SwapModeButton
        href={
          isTwapSupportedChainId(token.chainId)
            ? `/${getEvmChainById(token.chainId).key}/limit?token=${token.address}`
            : undefined
        }
      >
        Limit
      </SwapModeButton>
      <SwapModeButton
        href={
          isTwapSupportedChainId(token.chainId)
            ? `/${getEvmChainById(token.chainId).key}/dca?token=${token.address}`
            : undefined
        }
      >
        DCA
      </SwapModeButton>
      <SwapModeButton
        href={
          isXSwapSupportedChainId(token.chainId)
            ? `/${getEvmChainById(token.chainId).key}/cross-chain-swap?token0=${token.address}`
            : undefined
        }
      >
        <span className="saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
          <ShuffleIcon width={20} height={20} className="text-blue" />
          Cross-Chain
        </span>
      </SwapModeButton>
    </div>
  )
}
