'use client'

import { InformationCircleIcon } from '@heroicons/react-v1/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import type { TokenListV2ChainId } from '@sushiswap/graph-client/data-api'
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
  isLimit?: boolean
  variant?: string
}

export const TokenSelectorV2: FC<TokenSelectorV2Props> = ({
  includeNative = true,
  selected,
  onSelect,
  // biome-ignore lint/correctness/noUnusedVariables: will remove once all props are for sure not going to be used
  chainId,
  children,
  currencies: _currencies,
  hidePinnedTokens,
  // biome-ignore lint/correctness/noUnusedVariables: will remove once all props are for sure not going to be used
  hideSearch,
  // biome-ignore lint/correctness/noUnusedVariables: will remove once all props are for sure not going to be used
  networks,
  selectedNetwork,
  onNetworkSelect,
  isBrowse,
  type,
  isLimit,
  variant,
}) => {
  const { address } = useAccount()
  //@dev using `number | null` for now until types decalred
  const [_selectedNetwork, setSelectedNetwork] = useState<number | null>(
    selectedNetwork ?? null,
  )

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [currencyInfo, showCurrencyInfo] = useState<Currency | false>(false)

  const [showLimitInfo, setShowLimitInfo] = useState(false)
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
      setSelectedNetwork(network)
      if (onNetworkSelect) {
        // onNetworkSelect(network)
        if (isLimit) {
          setShowLimitInfo(true)
        }
      }
    },
    [onNetworkSelect, currencyInfo, isLimit],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className={classNames(
          'h-[80vh] !flex !flex-col md:!flex-row w-fit !p-0 md:min-w-[580px]',
        )}
        variant={variant ?? undefined}
      >
        <div className="relative flex flex-col w-full gap-4 p-6 overflow-x-hidden overflow-y-auto hide-scrollbar">
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
          {type === 'buy' || isLimit ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-450 dark:text-slate-500">
                {isLimit ? 'Supported Chains' : 'Chains'}
              </p>
              {isLimit && showLimitInfo ? (
                <div className="flex items-center gap-1 p-2 text-xs bg-skyblue/5 rounded-xl text-skyblue">
                  <InformationCircleIcon width={16} height={16} />
                  <p>
                    Sushi currently support limit orders only for same-chain
                    swaps.
                  </p>
                </div>
              ) : null}
              <ChainOptionsSelector
                onNetworkSelect={_onNetworkSelect}
                size="lg"
              />
            </div>
          ) : null}
          <div className="relative flex gap-2">
            <TextField
              placeholder="Search by token or address"
              icon={MagnifyingGlassIcon}
              type="text"
              testdata-id={`token-selector-address-input`}
              value={query}
              onValueChange={setQuery}
              className="py-7 placeholder:text-slate-450 !dark:text-slate-500 placeholder:dark:text-slate-450 dark:!bg-slate-900 !bg-gray-100"
            />
            {type !== 'buy' && !isLimit ? (
              <div className="absolute -translate-y-1/2 top-1/2 right-2">
                <NetworkMenu
                  selectedNetwork={_selectedNetwork}
                  onNetworkSelect={_onNetworkSelect}
                  className="bg-slate-50 border !rounded-md !px-2 border-black/10 dark:bg-slate-800 dark:border-white/10"
                />
              </div>
            ) : null}
          </div>
          <div
            id="token-list-container"
            className="flex flex-1 flex-col flex-grow px-1 py-0.5 hide-scrollbar overflow-y-scroll"
          >
            <TokenSelectorStatesV2
              selected={selected}
              selectedNetwork={_selectedNetwork as TokenListV2ChainId}
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
