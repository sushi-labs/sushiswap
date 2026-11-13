'use client'

import { Button, Message } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { usePathname, useSearchParams } from 'next/navigation'
import { type ReactElement, useEffect, useMemo } from 'react'
import { isLifiXSwapSupportedChainId, isSupportedChainId } from 'src/config'
import { getNetworkName, replaceNetworkSlug } from 'src/lib/network'
import { isNearIntentsChainId } from 'src/lib/swap/near-intents'
import { SwapTokenSelectorContext } from 'src/lib/swap/swap-token-selector-context'
import {
  type UnifiedSwapChainId,
  getUnifiedSwapParams,
  isCurrentUnifiedSwapInput,
  isUnifiedSwapChainId,
  selectUnifiedSwapToken,
  switchUnifiedSwapTokens,
} from 'src/lib/swap/unified-swap'
import {
  UnifiedSwapContext,
  type UnifiedSwapState,
  useUnifiedSwap,
} from 'src/lib/swap/unified-swap-context'
import { SanctionedAddressDialog } from 'src/lib/wagmi/components/sanctioned-address-dialog'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { isEvmChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import { isSvmChainId } from 'sushi/svm'
import { UnifiedSwapExecutionProvider } from '../../cross-chain-swap/_ui/unified-swap-execution-provider'
import type { SwapEdgeConfig } from '../swap-edge-config'
import { SimpleSwapWidgetFrame } from './simple-swap-widget-frame'
import { UnifiedSwapTokenSelector } from './unified-swap-token-selector'

const EvmRuntime = dynamic(() =>
  import('./evm-simple-swap-runtime').then(
    (module) => module.EvmSimpleSwapRuntime,
  ),
)

const SvmRuntime = dynamic(() =>
  import('./svm-simple-swap-runtime').then(
    (module) => module.SvmSimpleSwapRuntime,
  ),
)

const StellarRuntime = dynamic(() =>
  import('./stellar-unified-swap-runtime').then(
    (module) => module.StellarUnifiedSwapRuntime,
  ),
)

const CrossChainRuntime = dynamic(() =>
  import('./unified-cross-chain-swap-runtime').then(
    (module) => module.UnifiedCrossChainSwapRuntime,
  ),
)

interface UnifiedSwapRuntimeProps {
  defaultChainId: UnifiedSwapChainId
  swapConfig: SwapEdgeConfig
  crossChainConfig: Promise<SwapEdgeConfig>
}

export function UnifiedSwapRuntime({
  defaultChainId,
  swapConfig,
  crossChainConfig,
}: UnifiedSwapRuntimeProps): ReactElement {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const form = useMemo<UnifiedSwapState>(() => {
    const params = getUnifiedSwapParams(searchParams.toString(), defaultChainId)
    const source = Number(params.get('chainId0'))
    const destination = Number(params.get('chainId1'))
    const chainId0 = isUnifiedSwapChainId(source) ? source : defaultChainId
    const chainId1 = isUnifiedSwapChainId(destination) ? destination : chainId0

    function update(next: URLSearchParams): void {
      history.pushState(null, '', `${pathname}?${next.toString()}`)
    }

    return {
      chainId0,
      chainId1,
      token0Param: params.get('token0') ?? undefined,
      token1Param: params.get('token1') ?? undefined,
      swapAmountString: params.get('swapAmount') ?? '',
      setAmount(amount) {
        if (
          window.location.pathname !== pathname ||
          !isCurrentUnifiedSwapInput(
            params,
            getUnifiedSwapParams(window.location.search, defaultChainId),
          )
        )
          return
        const next = new URLSearchParams(params)
        if (amount) next.set('swapAmount', amount)
        else next.delete('swapAmount')
        update(next)
      },
      selectToken(side, chainId, token) {
        if (isUnifiedSwapChainId(chainId))
          update(selectUnifiedSwapToken(params, side, chainId, token))
      },
      selectPair(chainId, token0, token1) {
        const next = new URLSearchParams(params)
        if (chainId0 !== chainId || chainId === StellarChainId.STELLAR)
          next.delete('swapAmount')
        next.set('chainId0', String(chainId))
        next.set('chainId1', String(chainId))
        next.set('token0', token0)
        next.set('token1', token1)
        update(next)
      },
      switchTokens() {
        update(switchUnifiedSwapTokens(params))
      },
    }
  }, [searchParams, defaultChainId, pathname])

  useEffect(() => {
    if (
      window.location.pathname !== pathname ||
      new URLSearchParams(window.location.search).toString() !==
        searchParams.toString()
    )
      return
    const sourcePathname = replaceNetworkSlug(form.chainId0, pathname)
    if (sourcePathname === pathname) return

    // Keep pending cross-chain tracking mounted when the source network changes.
    history.replaceState(
      null,
      '',
      `${sourcePathname}${window.location.search}${window.location.hash}`,
    )
  }, [form.chainId0, pathname, searchParams])

  return (
    <UnifiedSwapContext.Provider value={form}>
      <SwapTokenSelectorContext.Provider value={UnifiedSwapTokenSelector}>
        <CheckerProvider>
          {!isEvmChainId(defaultChainId) ? <SanctionedAddressDialog /> : null}
          <UnifiedSwapExecutionProvider>
            <ActiveSwapRuntime
              swapConfig={swapConfig}
              crossChainConfig={crossChainConfig}
            />
          </UnifiedSwapExecutionProvider>
        </CheckerProvider>
      </SwapTokenSelectorContext.Provider>
    </UnifiedSwapContext.Provider>
  )
}

function ActiveSwapRuntime({
  swapConfig,
  crossChainConfig,
}: Pick<
  UnifiedSwapRuntimeProps,
  'swapConfig' | 'crossChainConfig'
>): ReactElement | null {
  const form = useUnifiedSwap()
  if (!form) return null
  const { chainId0, chainId1 } = form
  if (chainId0 === chainId1) {
    if (chainId0 === StellarChainId.STELLAR)
      return <StellarRuntime config={swapConfig} />
    if (isSupportedChainId(chainId0)) {
      return (
        <EdgeProvider config={swapConfig}>
          <SimpleSwapWidgetFrame chainId={chainId0}>
            {isEvmChainId(chainId0) ? (
              <EvmRuntime key={chainId0} chainId={chainId0} />
            ) : isSvmChainId(chainId0) ? (
              <SvmRuntime key={chainId0} chainId={chainId0} />
            ) : null}
          </SimpleSwapWidgetFrame>
        </EdgeProvider>
      )
    }
  } else if (
    (isLifiXSwapSupportedChainId(chainId0) || isNearIntentsChainId(chainId0)) &&
    (isLifiXSwapSupportedChainId(chainId1) || isNearIntentsChainId(chainId1))
  ) {
    return <CrossChainRuntime chainId={chainId0} config={crossChainConfig} />
  }
  return <UnsupportedSwap />
}

function UnsupportedSwap(): ReactElement | null {
  const form = useUnifiedSwap()
  if (!form) return null
  return (
    <div className="flex flex-col gap-4 p-4 md:px-12 md:py-6 bg-secondary rounded-3xl border-accent border">
      <h2 className="font-semibold text-2xl">Trade tokens</h2>
      {(['INPUT', 'OUTPUT'] as const).map((side) => (
        <UnifiedSwapTokenSelector key={side} side={side}>
          <Button type="button" variant="secondary" fullWidth>
            {side === 'INPUT' ? 'Sell' : 'Buy'} on{' '}
            {getNetworkName(side === 'INPUT' ? form.chainId0 : form.chainId1)}
          </Button>
        </UnifiedSwapTokenSelector>
      ))}
      <Message size="sm">
        This swap pair is not currently supported. Choose another network or
        select both tokens on the same supported network.
      </Message>
    </div>
  )
}
