'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import type { TokenListV2ChainId } from '@sushiswap/graph-client/data-api'
import {
  Currency,
  Dialog,
  DialogContent,
  DialogTrigger,
  Explainer,
  LinkExternal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  classNames,
} from '@sushiswap/ui'
import { ArrowUpRight } from '@sushiswap/ui/icons/ArrowUpRight'
import { InfoCircle } from '@sushiswap/ui/icons/InfoCircle'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { FavoriteButton } from 'src/ui/swap/trade/favorite-button'
import { EvmChain, type EvmChainId } from 'sushi/chain'
import type { Token, Type } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import { useAccount } from 'wagmi'

export type TokenSelectorBladeType = 'buy' | 'sell'

interface TokenSelectorBladeProps {
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
  type: TokenSelectorBladeType
  isTwap?: boolean
  variant?: string
}

export const TokenSelectorBlade: FC<TokenSelectorBladeProps> = ({
  onSelect,
  // biome-ignore lint/correctness/noUnusedVariables: will remove once all props are for sure not going to be used
  chainId,
  children,
  currencies: _currencies,
  // biome-ignore lint/correctness/noUnusedVariables: will remove once all props are for sure not going to be used
  hideSearch,
  // biome-ignore lint/correctness/noUnusedVariables: will remove once all props are for sure not going to be used
  networks,
  selectedNetwork,
}) => {
  // const { address } = useAccount()
  //@dev using `number | null` for now until types decalred
  const [_selectedNetwork, setSelectedNetwork] = useState<number | null>(
    selectedNetwork ?? null,
  )

  const [open, setOpen] = useState(false)
  // const [currencyInfo, showCurrencyInfo] = useState<Currency | false>(false)

  const _onSelect = useCallback(
    (currency: Type) => {
      if (onSelect) {
        onSelect(currency)
      }

      setOpen(false)
    },
    [onSelect],
  )

  useEffect(() => {
    setSelectedNetwork(selectedNetwork ?? null)
  }, [selectedNetwork])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        aria-describedby={undefined}
        className={classNames(
          '!flex !flex-col gap-4 !p-5 md:min-w-[364px] !w-fit dark:!bg-slate-800 !bg-slate-50',
        )}
        align="end"
        alignOffset={-15}
      >
        <div className="font-medium">Tokens</div>
        {_currencies &&
          Object.values(_currencies).map((currency) => (
            <button
              type="button"
              key={currency.address}
              className={classNames('flex justify-between items-center')}
              onClick={() => _onSelect(currency)}
            >
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Currency.IconList
                    iconWidth={32}
                    iconHeight={32}
                    className="!border-none"
                  >
                    <Currency.Icon currency={currency} />
                  </Currency.IconList>
                  <NetworkIcon
                    type="square"
                    className="rounded-[4px] z-10 absolute -right-[20%] -bottom-[2%] border border-background"
                    chainId={currency.chainId as EvmChainId}
                    width={16}
                    height={16}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">
                    {currency.symbol}
                  </span>
                  <LinkExternal
                    target="_blank"
                    href={EvmChain.from(currency.chainId)?.getTokenUrl(
                      currency.address,
                    )}
                    className="flex gap-1 items-center text-xs text-muted-foreground"
                  >
                    <span>{shortenAddress(currency.address)}</span>

                    <ArrowUpRight className="w-2 h-2" />
                  </LinkExternal>
                </div>
              </div>

              <div className="flex gap-3 items-center text-xs text-slate-900 dark:text-slate-100">
                <div className="flex flex-col items-end w-[109px]">
                  <span className="font-semibold">123 {currency.symbol}</span>
                  <span className="text-muted-foreground">$123</span>
                </div>
                <InfoCircle width={16} height={16} />
              </div>
            </button>
          ))}
      </PopoverContent>
    </Popover>
  )
}
