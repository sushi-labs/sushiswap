'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TextField,
  classNames,
} from '@sushiswap/ui'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ChainOptionsSelector } from 'src/ui/swap/chain-options-selector'
import { NetworkMenu } from 'src/ui/swap/trade/favorite-recent/network-menu'
import type { EvmChainId } from 'sushi/chain'
import type { Currency, Token, Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { CurrencyInfo } from './currency-info'
import { TokenSelectorStatesV2 } from './token-selector-states-v2'

export type TokenSelectorV2Type = 'buy' | 'sell' | 'browse'

interface TokenSelectorV2Props {
  selected: Type | undefined
  chainId: EvmChainId
  onSelect(currency: Type): void
  children: ReactNode
  currencies?: Record<string, Token>
  includeNative?: boolean
  hidePinnedTokens?: boolean
  hideSearch?: boolean
  networks?: readonly EvmChainId[]
  selectedNetwork?: EvmChainId
  onNetworkSelect?: (network: number) => void
  isBrowse?: boolean
  type: TokenSelectorV2Type
}

export const TokenSelectorV2: FC<TokenSelectorV2Props> = ({
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
  isBrowse,
  type,
}) => {
  const { address } = useAccount()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [currencyInfo, showCurrencyInfo] = useState<Currency | false>(false)
  console.log({ hideSearch, networks, selectedNetwork })
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className={classNames(
          'h-[80vh] !flex !flex-col md:!flex-row w-fit !p-0 md:min-w-[565px]',
        )}
      >
        <div className="flex flex-col w-full gap-4 overflow-y-auto hide-scrollbar overflow-x-hidden relative p-6">
          {currencyInfo ? (
            <CurrencyInfo
              currency={currencyInfo}
              onBack={() => showCurrencyInfo(false)}
            />
          ) : null}
          <DialogHeader className="!text-left mb-4">
            <DialogTitle>
              {isBrowse ? 'Browse Tokens' : 'Select Token'}
            </DialogTitle>
          </DialogHeader>
          {type === 'buy' ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-450 dark:text-slate-500">
                Chains
              </p>
              <ChainOptionsSelector size="lg" />
            </div>
          ) : null}
          <div className="flex gap-2 relative">
            <TextField
              placeholder="Search by token or address"
              icon={MagnifyingGlassIcon}
              type="text"
              testdata-id={`token-selector-address-input`}
              value={query}
              onValueChange={setQuery}
              className="py-7 placeholder:text-slate-450 !dark:text-slate-500 placeholder:dark:text-slate-450 dark:!bg-slate-900 !bg-gray-100"
            />
            {type !== 'buy' ? (
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <NetworkMenu className="bg-slate-50 border !rounded-md !px-2 border-black/10 dark:bg-slate-800 dark:border-white/10" />
              </div>
            ) : null}
          </div>
          <div
            id="token-list-container"
            className="flex flex-1 flex-col flex-grow px-1 py-0.5 hide-scrollbar overflow-y-scroll"
          >
            <TokenSelectorStatesV2
              selected={selected}
              chainId={chainId}
              account={address}
              onSelect={_onSelect}
              currencies={currencies}
              includeNative={includeNative}
              hidePinnedTokens={hidePinnedTokens}
              search={query}
              onShowInfo={showCurrencyInfo}
              type={type}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
