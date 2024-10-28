'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useBreakpoint, useDebounce } from '@sushiswap/hooks'
import {
  InterfaceEventName,
  InterfaceModalName,
  Trace,
} from '@sushiswap/telemetry'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TextField,
  gtagEvent,
} from '@sushiswap/ui'
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ChainId } from 'sushi/chain'
import { Currency, Token, Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { CurrencyInfo } from './currency-info'
import { DesktopNetworkSelector } from './desktop-network-selector'
import { MobileNetworkSelector } from './mobile-network-selector'
import { TokenSelectorStates } from './token-selector-states'

interface TokenSelectorProps {
  selected: Type | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  children: ReactNode
  currencies?: Record<string, Token>
  includeNative?: boolean
  hidePinnedTokens?: boolean
  hideSearch?: boolean
  networks?: readonly ChainId[]
  selectedNetwork?: ChainId
  onNetworkSelect?: (network: number) => void
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  includeNative = true,
  selected,
  onSelect,
  chainId,
  children,
  currencies: _currencies,
  hidePinnedTokens,
  hideSearch,
  networks,
  selectedNetwork,
  onNetworkSelect,
}) => {
  const { address } = useAccount()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [currencyInfo, showCurrencyInfo] = useState<Currency | false>(false)

  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    if (debouncedQuery) gtagEvent('token-search', { query: debouncedQuery })
  }, [debouncedQuery])

  // Clear the query when the dialog is closed
  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  const currencies = useMemo(() => {
    if (_currencies) {
      return Object.values(_currencies)
    }
  }, [_currencies])

  const _onSelect = useCallback(
    (currency: Type) => {
      if (onSelect) {
        onSelect(currency)
      }

      setOpen(false)
    },
    [onSelect],
  )

  const _onNetworkSelect = useCallback(
    (network: number) => {
      if (currencyInfo) {
        showCurrencyInfo(false)
      }

      if (onNetworkSelect) {
        onNetworkSelect(network)
      }
    },
    [onNetworkSelect, currencyInfo],
  )

  const { isMd } = useBreakpoint('md')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[80vh] !flex !flex-col md:!flex-row md:min-w-[720px] w-fit !p-0">
        <Trace
          name={InterfaceEventName.TOKEN_SELECTOR_OPENED}
          modal={InterfaceModalName.TOKEN_SELECTOR}
          shouldLogImpression
        >
          {networks && selectedNetwork && onNetworkSelect && isMd ? (
            <DesktopNetworkSelector
              networks={networks}
              selectedNetwork={selectedNetwork}
              onSelect={_onNetworkSelect}
            />
          ) : null}
          <div className="flex flex-col gap-4 overflow-y-auto relative p-6">
            {currencyInfo ? (
              <CurrencyInfo
                currency={currencyInfo}
                onBack={() => showCurrencyInfo(false)}
              />
            ) : null}
            <DialogHeader>
              <DialogTitle>Select a token</DialogTitle>
              <DialogDescription>
                Select a token from our default list or search for a token by
                symbol or address.
              </DialogDescription>
            </DialogHeader>
            {networks && selectedNetwork && onNetworkSelect && !isMd ? (
              <MobileNetworkSelector
                networks={networks}
                selectedNetwork={selectedNetwork}
                onSelect={_onNetworkSelect}
              />
            ) : null}
            {!hideSearch ? (
              <div className="flex gap-2">
                <TextField
                  placeholder="Search by token or address"
                  icon={MagnifyingGlassIcon}
                  type="text"
                  testdata-id={`token-selector-address-input`}
                  value={query}
                  onValueChange={setQuery}
                />
              </div>
            ) : null}
            <div
              id="token-list-container"
              className="space-y-2 flex flex-1 flex-col flex-grow gap-3 px-1 py-0.5 overflow-y-scroll md:pr-4 pr-2"
            >
              <TokenSelectorStates
                selected={selected}
                chainId={chainId}
                account={address}
                onSelect={_onSelect}
                currencies={currencies}
                includeNative={includeNative}
                hidePinnedTokens={hidePinnedTokens}
                search={query}
                onShowInfo={showCurrencyInfo}
              />
            </div>
          </div>
        </Trace>
      </DialogContent>
    </Dialog>
  )
}
