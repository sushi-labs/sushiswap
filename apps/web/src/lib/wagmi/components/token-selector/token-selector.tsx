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
  PerpsDialogContent,
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
import { useAccount } from 'src/lib/wallet'
import type { TokenSelectorChainId } from './config'
import { CurrencyInfo } from './currency-info'
import { DesktopNetworkSelector } from './desktop-network-selector'
import { MobileNetworkSelector } from './mobile-network-selector'
import { TokenSelectorStates } from './token-selector-states'
import {
  type TokenSelectorTheme,
  TokenSelectorThemeProvider,
} from './token-selector-theme'

interface TokenSelectorProps<
  TChainId extends TokenSelectorChainId,
  TNetwork extends TokenSelectorChainId = TChainId,
> {
  id?: string
  selected: CurrencyFor<TChainId> | undefined
  chainId: TChainId
  onSelect?(currency: CurrencyFor<TChainId>): void
  children: ReactNode
  currencies?: Record<string, CurrencyFor<TChainId, { approved?: boolean }>>
  includeNative?: boolean
  hideSearch?: boolean
  networks?: readonly TNetwork[]
  selectedNetwork?: TNetwork
  onNetworkSelect?: (network: TNetwork) => void
  theme?: TokenSelectorTheme
}

export function TokenSelector<
  TChainId extends TokenSelectorChainId,
  TNetwork extends TokenSelectorChainId = TChainId,
>({
  includeNative = true,
  selected,
  onSelect,
  chainId,
  children,
  currencies: _currencies,
  hideSearch,
  networks,
  selectedNetwork,
  onNetworkSelect,
  theme = 'default',
}: TokenSelectorProps<TChainId, TNetwork>) {
  const address = useAccount(chainId)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [currencyInfo, showCurrencyInfo] = useState<
    CurrencyFor<TChainId> | false
  >(false)

  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    if (debouncedQuery) gtagEvent('token-search', { query: debouncedQuery })
  }, [debouncedQuery])

  // Reset transient selector navigation when the dialog is closed.
  useEffect(() => {
    if (!open) {
      setQuery('')
      showCurrencyInfo(false)
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
    (network: TNetwork) => {
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

  const content = (
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
      <div
        className={classNames(
          'relative flex flex-col gap-4 overflow-y-auto p-6',
          theme === 'perps' && 'min-h-0 flex-1',
        )}
      >
        {currencyInfo ? (
          <CurrencyInfo
            currency={currencyInfo}
            onBack={() => showCurrencyInfo(false)}
          />
        ) : null}
        <DialogHeader className="!text-left">
          <DialogTitle
            className={classNames(theme === 'perps' && '!text-perps-muted')}
          >
            Select a token
          </DialogTitle>
          <DialogDescription
            className={classNames(theme === 'perps' && '!text-perps-muted-50')}
          >
            Select a token from our default list or search for a token by symbol
            or address.
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
              iconProps={{
                className: classNames(
                  theme === 'perps' && '!text-perps-muted-50',
                ),
              }}
              type="text"
              testdata-id={`token-selector-address-input`}
              value={query}
              onValueChange={setQuery}
              className={classNames(
                theme === 'perps' &&
                  '!border !border-white/[0.06] !bg-white/[0.04] !text-perps-muted placeholder:!text-perps-muted-50 focus:!border-perps-blue',
              )}
            />
          </div>
        ) : null}
        <div
          id="token-list-container"
          className="flex flex-1 flex-grow flex-col gap-3 space-y-2 overflow-y-scroll px-1 py-0.5 pr-2 md:pr-4"
        >
          <TokenSelectorStates
            selected={selected}
            chainId={chainId}
            account={address}
            onSelect={_onSelect}
            currencies={currencies}
            includeNative={includeNative}
            search={query}
            onShowInfo={showCurrencyInfo}
          />
        </div>
      </div>
    </Trace>
  )

  return (
    <TokenSelectorThemeProvider theme={theme}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {theme === 'perps' ? (
          <PerpsDialogContent
            className={classNames(
              'h-[80vh] !w-full !p-0 md:!w-fit',
              networks ? 'md:min-w-[720px]' : 'md:min-w-[600px]',
            )}
            wrapperClassName="!flex h-full min-h-0 !flex-col overflow-hidden md:!flex-row"
          >
            {content}
          </PerpsDialogContent>
        ) : (
          <DialogContent
            className={classNames(
              'h-[80vh] !flex !flex-col md:!flex-row w-fit !p-0',
              networks ? 'md:min-w-[720px]' : 'md:min-w-[600px]',
            )}
          >
            {content}
          </DialogContent>
        )}
      </Dialog>
    </TokenSelectorThemeProvider>
  )
}
