'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useDebounce } from '@sushiswap/hooks'
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
import { Token, Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { useMyTokens } from './hooks/use-my-tokens'
import { useTrendingTokens } from './hooks/use-trending-tokens'
import { TokenSelectorChipBar } from './token-selector-chip-bar'
import { TokenSelectorCustomList } from './token-selector-custom-list'
import { TokenSelectorMyTokens } from './token-selector-my-tokens'
import { TokenSelectorSearch } from './token-selector-search'
import { TokenSelectorTrendingTokens } from './token-selector-trending-tokens'

interface TokenSelectorProps {
  id: string
  selected: Type | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  children: ReactNode
  currencies?: Record<string, Token>
  includeNative?: boolean
  hidePinnedTokens?: boolean
  hideSearch?: boolean
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  includeNative = true,
  id,
  selected,
  onSelect,
  chainId,
  children,
  currencies: _currencies,
  hidePinnedTokens,
  hideSearch,
}) => {
  const { address } = useAccount()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  // Ensure that the user's tokens are loaded
  useMyTokens({
    chainId,
    account: address,
  })

  // Ensure that the trending tokens are loaded
  useTrendingTokens({
    chainId,
  })

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!flex flex-col justify-start h-[80vh] min-w-[600px]">
        <Trace
          name={InterfaceEventName.TOKEN_SELECTOR_OPENED}
          modal={InterfaceModalName.TOKEN_SELECTOR}
          shouldLogImpression
        >
          <DialogHeader>
            <DialogTitle>Select a token</DialogTitle>
            <DialogDescription>
              Select a token from our default list or search for a token by
              symbol or address.
            </DialogDescription>
          </DialogHeader>
          {!hideSearch ? (
            <div className="flex gap-2">
              <TextField
                placeholder="Search by token or address"
                icon={MagnifyingGlassIcon}
                type="text"
                testdata-id={`${id}-address-input`}
                value={query}
                onValueChange={setQuery}
              />
            </div>
          ) : null}

          <div
            id="token-list-container"
            className="space-y-2 relative flex flex-1 flex-col flex-grow gap-3 px-1 py-0.5 overflow-y-scroll pr-4"
          >
            {(() => {
              if (currencies) {
                return (
                  <TokenSelectorCustomList
                    chainId={chainId}
                    account={address}
                    currencies={currencies}
                    selected={selected}
                    onSelect={_onSelect}
                  />
                )
              }

              if (debouncedQuery) {
                return (
                  <TokenSelectorSearch
                    chainId={chainId}
                    onSelect={_onSelect}
                    search={debouncedQuery}
                    selected={selected}
                  />
                )
              }

              return (
                <>
                  <TokenSelectorChipBar
                    chainId={chainId}
                    onSelect={_onSelect}
                    includeNative={includeNative}
                    showPinnedTokens={!hidePinnedTokens}
                  />

                  {address ? (
                    <TokenSelectorMyTokens
                      chainId={chainId}
                      onSelect={_onSelect}
                      selected={selected}
                    />
                  ) : null}

                  <TokenSelectorTrendingTokens
                    chainId={chainId}
                    onSelect={_onSelect}
                    selected={selected}
                  />
                </>
              )
            })()}
          </div>
        </Trace>
      </DialogContent>
    </Dialog>
  )
}
