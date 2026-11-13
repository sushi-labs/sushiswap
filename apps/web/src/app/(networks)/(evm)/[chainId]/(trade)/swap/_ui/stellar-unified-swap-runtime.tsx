'use client'

import { Message } from '@sushiswap/ui'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { useUnifiedSwap } from 'src/lib/swap/unified-swap-context'
import { useSearchTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-search-tokens'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import {
  STELLAR_DEFAULT_BASES,
  STELLAR_XLM,
  StellarChainId,
  type StellarToken,
  isStellarContractAddress,
} from 'sushi/stellar'
import type { SwapEdgeConfig } from '~stellar/_common/lib/edge/get-swap-edge-config'
import { EdgeProvider } from '~stellar/_common/providers/edge-config-provider'
import { SimpleSwapProvider } from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { SimpleSwapWidget } from '~stellar/_common/ui/swap/simple/simple-swap-widget'
import { Providers as StellarWalletProvider } from '~stellar/providers'
import { SwapInputLabel } from '../../_ui/swap-input-label'
import { useValueTransferCatalog } from '../../cross-chain-swap/_ui/layerzero/hooks/use-value-transfer-catalog'

function useStellarSwapToken(
  param: string | undefined,
  catalog: ReturnType<typeof useValueTransferCatalog>,
): {
  token: StellarToken | undefined
  isLoading: boolean
} {
  const address =
    param === 'NATIVE'
      ? STELLAR_XLM[StellarChainId.STELLAR].address
      : param?.toUpperCase()
  const baseToken = STELLAR_DEFAULT_BASES[StellarChainId.STELLAR].find(
    (token) => token.address === address,
  )
  const canSearch = Boolean(
    address && isStellarContractAddress(address) && !baseToken,
  )
  const { data, isLoading } = useSearchTokens({
    chainId: canSearch ? StellarChainId.STELLAR : undefined,
    search: address,
  })
  const catalogCurrency = catalog.getCurrency(StellarChainId.STELLAR, address)
  const catalogToken =
    catalogCurrency?.chainId === StellarChainId.STELLAR &&
    catalogCurrency.address === address
      ? catalogCurrency
      : undefined
  // Use the same catalog as the token selector for tokens not yet indexed by
  // the data API. Every source must match the selected address exactly.
  const token =
    baseToken ??
    data?.find((token) => token.address === address) ??
    catalogToken

  return {
    // Token search can return other matches. Never substitute one for the
    // address selected in the form, or retain a token from the previous query.
    token,
    isLoading: !token && canSearch && (isLoading || catalog.isLoading),
  }
}

export function StellarUnifiedSwapRuntime({
  config,
}: { config: SwapEdgeConfig }): ReactElement {
  const swap = useUnifiedSwap()
  const catalog = useValueTransferCatalog()
  const { token: token0, isLoading: token0Loading } = useStellarSwapToken(
    swap?.token0Param,
    catalog,
  )
  const { token: token1, isLoading: token1Loading } = useStellarSwapToken(
    swap?.token1Param,
    catalog,
  )
  const [resolvedTokens, setResolvedTokens] = useState<
    { token0: StellarToken; token1: StellarToken } | undefined
  >()
  if (
    token0 &&
    token1 &&
    (!resolvedTokens ||
      resolvedTokens.token0 !== token0 ||
      resolvedTokens.token1 !== token1)
  ) {
    setResolvedTokens({ token0, token1 })
  }
  const isResolved = Boolean(token0 && token1)
  const selectToken = swap?.selectToken
  const setToken0 = useCallback(
    (token: StellarToken) => {
      selectToken?.('INPUT', StellarChainId.STELLAR, token.address)
    },
    [selectToken],
  )
  const setToken1 = useCallback(
    (token: StellarToken) => {
      selectToken?.('OUTPUT', StellarChainId.STELLAR, token.address)
    },
    [selectToken],
  )
  const form = useMemo(
    () =>
      swap && resolvedTokens
        ? {
            ...resolvedTokens,
            amount: isResolved ? swap.swapAmountString : '',
            setToken0,
            setToken1,
            setAmount: swap.setAmount,
            swapTokens: swap.switchTokens,
          }
        : undefined,
    [swap, resolvedTokens, isResolved, setToken0, setToken1],
  )

  return (
    <StellarWalletProvider>
      <EdgeProvider config={config}>
        {/* Keep pending execution hooks mounted while token metadata loads. */}
        <div hidden={!isResolved} inert={!isResolved}>
          {form ? (
            <SimpleSwapProvider form={form}>
              <SimpleSwapWidget />
            </SimpleSwapProvider>
          ) : null}
        </div>
        {!isResolved ? (
          <div className="flex flex-col gap-4 p-4 md:px-12 md:py-6 bg-secondary rounded-3xl border-accent border">
            <CurrencyInput
              id="swap-from"
              type="INPUT"
              chainId={StellarChainId.STELLAR}
              currency={token0}
              value={swap?.swapAmountString ?? ''}
              onChange={swap?.setAmount}
              onSelect={setToken0}
              label={
                <SwapInputLabel chainId={StellarChainId.STELLAR} type="INPUT" />
              }
            />
            <CurrencyInput
              id="swap-to"
              type="OUTPUT"
              chainId={StellarChainId.STELLAR}
              currency={token1}
              value=""
              onSelect={setToken1}
              disabled
              disableMaxButton
              label={
                <SwapInputLabel
                  chainId={StellarChainId.STELLAR}
                  type="OUTPUT"
                />
              }
            />
            <Message size="sm">
              {token0Loading || token1Loading
                ? 'Loading Stellar tokens…'
                : 'Unable to load the selected Stellar tokens. Select a token to continue.'}
            </Message>
          </div>
        ) : null}
      </EdgeProvider>
    </StellarWalletProvider>
  )
}
