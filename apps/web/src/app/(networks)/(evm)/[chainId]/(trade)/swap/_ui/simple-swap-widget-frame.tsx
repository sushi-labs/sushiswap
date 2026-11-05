'use client'

import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { type ChainId, getChainById } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { SwapModeButtons } from '../../_ui/swap-mode-buttons'
import { SimpleSwapBanner } from './simple-swap-banner'
import { SimpleSwapSettingsOverlay } from './simple-swap-settings-overlay'

interface SimpleSwapWidgetFrameProps {
  children: ReactNode
  chainId?: ChainId
  // Limit orders have no slippage settings or swap banner.
  mode?: 'swap' | 'limit'
}

export function SimpleSwapWidgetFrame({
  children,
  chainId: chainIdProp,
  mode = 'swap',
}: SimpleSwapWidgetFrameProps) {
  const { chainId: chainIdParam } = useParams<{ chainId?: string }>()
  const chainId = chainIdProp ?? Number(chainIdParam)
  const activePathname = isEvmChainId(chainId)
    ? `/${getChainById(chainId).key}/${mode}`
    : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <SwapModeButtons chainId={chainId} activePathname={activePathname} />
          {mode === 'swap' ? <SimpleSwapSettingsOverlay /> : null}
        </div>
        {children}
      </div>
      {mode === 'swap' && isEvmChainId(chainId) ? (
        <SimpleSwapBanner chainId={chainId} />
      ) : null}
    </div>
  )
}
