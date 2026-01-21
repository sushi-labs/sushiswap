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
  classNames,
  gtagEvent,
} from '@sushiswap/ui'
import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { useConnection } from 'wagmi'
import { CurrencyInfo } from './currency-info'
import { DesktopNetworkSelector } from './desktop-network-selector'
import { MobileNetworkSelector } from './mobile-network-selector'
import { TokenSelectorStates } from './token-selector-states'

interface TokenSelectorProps<TChainId extends EvmChainId | SvmChainId> {
  selected: CurrencyFor<TChainId> | undefined
  chainId: TChainId
  onSelect(currency: CurrencyFor<TChainId>): void
  children: ReactNode
  currencies?: Record<string, CurrencyFor<TChainId, { approved?: boolean }>>
  includeNative?: boolean
  hidePinnedTokens?: boolean
  hideSearch?: boolean
  networks?: readonly (EvmChainId | SvmChainId)[]
  selectedNetwork?: EvmChainId | SvmChainId
  onNetworkSelect?: (network: number) => void
}

export function TokenSelector<TChainId extends EvmChainId | SvmChainId>({
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
}: TokenSelectorProps<TChainId>) {
  // TODO: Solana useAccount?
  const { address: evmAddress } = useConnection()
  // ! Hack for now
  const address = evmAddress as AddressFor<TChainId> | undefined

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [currencyInfo, showCurrencyInfo] = useState<
    CurrencyFor<TChainId> | false
  >(false)

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
    (currency: CurrencyFor<TChainId>) => {
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
      <DialogContent
        className={classNames(
          'h-[80vh] !flex !flex-col md:!flex-row w-fit !p-0',
          networks ? 'md:min-w-[720px]' : 'md:min-w-[600px]',
        )}
      >
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
            <DialogHeader className="!text-left">
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
