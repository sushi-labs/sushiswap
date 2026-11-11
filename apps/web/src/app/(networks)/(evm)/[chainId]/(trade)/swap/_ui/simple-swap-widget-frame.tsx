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
}

export function SimpleSwapWidgetFrame({
  children,
  chainId: chainIdProp,
}: SimpleSwapWidgetFrameProps) {
  const { chainId: chainIdParam } = useParams<{ chainId?: string }>()
  const chainId = chainIdProp ?? Number(chainIdParam)
  const swapPathname = isEvmChainId(chainId)
    ? `/${getChainById(chainId).key}/swap`
    : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4 md:px-12 md:py-6 bg-secondary rounded-3xl border-accent border">
        <div className="flex items-center self-end w-full py-2 gap-1">
          <SwapModeButtons chainId={chainId} activePathname={swapPathname} />
          <SimpleSwapSettingsOverlay />
        </div>
        {children}
      </div>
      {isEvmChainId(chainId) ? <SimpleSwapBanner chainId={chainId} /> : null}
    </div>
  )
}
