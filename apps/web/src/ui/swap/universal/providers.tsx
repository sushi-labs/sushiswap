'use client'

import type { EdgeConfigValue } from '@vercel/edge-config'
import type { FC, ReactNode } from 'react'
import type { SupportedChainId } from 'src/config'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import type { EvmChainId } from 'sushi/chain'
import { FuulReferralProvider } from '~evm/_common/ui/fuul-referral-provider'
import { DerivedstateCrossChainSwapProvider } from '../cross-chain/derivedstate-cross-chain-swap-provider'
import { DerivedstateSimpleSwapProvider } from '../simple/derivedstate-simple-swap-provider'
import type { SwapMode } from '../swap-mode-buttons'

type SwapProviderProps = {
  children: ReactNode
  config: EdgeConfigValue
  chainId?: EvmChainId
  defaultToken0?: string
}

export const swapProviders: Record<SwapMode, FC<SwapProviderProps>> = {
  swap: function SwapProvider({ children, config, chainId, defaultToken0 }) {
    return (
      <EdgeProvider config={config}>
        <DerivedstateSimpleSwapProvider
          chainId={chainId as SupportedChainId}
          defaultToken0={defaultToken0}
        >
          <FuulReferralProvider>{children}</FuulReferralProvider>
        </DerivedstateSimpleSwapProvider>
      </EdgeProvider>
    )
  },
  limit: function LimitProvider({ children, config, chainId, defaultToken0 }) {
    return (
      <EdgeProvider config={config}>
        <DerivedstateSimpleSwapProvider
          chainId={chainId as SupportedChainId}
          defaultToken0={defaultToken0}
        >
          {children}
        </DerivedstateSimpleSwapProvider>
      </EdgeProvider>
    )
  },
  dca: function DcaProvider({ children, config, chainId, defaultToken0 }) {
    return (
      <EdgeProvider config={config}>
        <DerivedstateSimpleSwapProvider
          chainId={chainId as SupportedChainId}
          defaultToken0={defaultToken0}
        >
          {children}
        </DerivedstateSimpleSwapProvider>
      </EdgeProvider>
    )
  },
  crossChain: function CrossChainProvider({
    children,
    config,
    chainId,
    defaultToken0,
  }) {
    if (!chainId) return null
    return (
      <EdgeProvider config={config}>
        <DerivedstateCrossChainSwapProvider
          defaultChainId={chainId}
          defaultToken0={defaultToken0}
        >
          {children}
        </DerivedstateCrossChainSwapProvider>
      </EdgeProvider>
    )
  },
}
