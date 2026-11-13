'use client'

import { type ReactElement, useMemo, useState } from 'react'
import type { SwapTokenSelectorProps } from 'src/lib/swap/swap-token-selector-context'
import {
  UNIFIED_SWAP_CHAIN_IDS,
  type UnifiedSwapChainId,
} from 'src/lib/swap/unified-swap'
import { useUnifiedSwap } from 'src/lib/swap/unified-swap-context'
import { AdditionalCurrenciesProvider } from 'src/lib/wagmi/components/token-selector/additional-currencies-provider'
import type { TokenSelectorChainId } from 'src/lib/wagmi/components/token-selector/config'
import {
  type TokenSelectorSelection,
  isTokenSelectorPair,
} from 'src/lib/wagmi/components/token-selector/selection'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { isWNativeSupported } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import { useValueTransferCatalog } from '../../cross-chain-swap/_ui/layerzero/hooks/use-value-transfer-catalog'
import {
  useXSwapRouting,
  useXSwapRoutingLock,
} from '../../cross-chain-swap/_ui/xswap-routing-context'

function currencyParam(currency: CurrencyFor<TokenSelectorChainId>): string {
  return currency.type === 'native' ? 'NATIVE' : currency.address
}

export function UnifiedSwapTokenSelector({
  side,
  children,
  currency,
}: SwapTokenSelectorProps): ReactElement | null {
  const form = useUnifiedSwap()
  const [open, setOpen] = useState(false)
  const routingMode = useXSwapRouting()
  useXSwapRoutingLock(routingMode, open)
  const [network, setNetwork] = useState<UnifiedSwapChainId>(
    form?.chainId0 ?? UNIFIED_SWAP_CHAIN_IDS[0],
  )
  const catalog = useValueTransferCatalog(open)
  const additionalCurrencies = useMemo(
    () => catalog.entries.map(({ currency }) => currency),
    [catalog.entries],
  )
  if (!form) return null

  function select(
    selection: TokenSelectorSelection<TokenSelectorChainId, true>,
  ): void {
    if (isTokenSelectorPair(selection)) {
      form?.selectPair(
        network,
        currencyParam(selection[0]),
        currencyParam(selection[1]),
      )
    } else {
      form?.selectToken(side, selection.chainId, currencyParam(selection))
    }
  }

  return (
    <AdditionalCurrenciesProvider currencies={additionalCurrencies}>
      <TokenSelector
        chainId={network}
        selected={currency?.chainId === network ? currency : undefined}
        onSelect={select}
        allowPairSelection
        networks={UNIFIED_SWAP_CHAIN_IDS}
        networkSelectorLayout="bar"
        selectedNetwork={network}
        onNetworkSelect={setNetwork}
        onOpenChange={(open) => {
          setOpen(open)
          if (open) setNetwork(side === 'INPUT' ? form.chainId0 : form.chainId1)
        }}
        includeNative={
          network !== StellarChainId.STELLAR && isWNativeSupported(network)
        }
      >
        {children}
      </TokenSelector>
    </AdditionalCurrenciesProvider>
  )
}
