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
}) => {
  const { address } = useAccount()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

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
      <DialogContent className="!flex flex-col justify-start h-[80vh] md:min-w-[600px]">
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
                testdata-id={`token-selector-address-input`}
                value={query}
                onValueChange={setQuery}
              />
            </div>
          ) : null}

          <div
            id="token-list-container"
            className="space-y-2 relative flex flex-1 flex-col flex-grow gap-3 px-1 py-0.5 overflow-y-scroll md:pr-4 pr-2"
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
            />
          </div>
        </Trace>
      </DialogContent>
    </Dialog>
  )
}
