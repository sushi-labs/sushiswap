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
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { ChainOptionsSelector } from 'src/ui/swap/chain-options-selector'
import { NetworkMenu } from 'src/ui/swap/trade/favorite-recent/network-menu'
import type { EvmChainId } from 'sushi/chain'
import type { Currency, Token, Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { CurrencyInfo } from './currency-info'
import { TokenSelectorStatesV2 } from './token-selector-states-v2'

export type TokenSelectorV2Type = 'buy' | 'sell'

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
  isTwap?: boolean
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
  isTwap,
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
      }
    },
    [onNetworkSelect, currencyInfo],
  )

  useEffect(() => {
    setSelectedNetwork(selectedNetwork ?? null)
  }, [selectedNetwork])

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
        token select woo
      </DialogContent>
    </Dialog>
  )
}
