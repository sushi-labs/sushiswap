'use client'

import { ChevronUpIcon, XIcon } from '@heroicons/react-v1/solid'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Currency, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@sushiswap/ui'
import { CheckIcon } from '@sushiswap/ui/icons/CheckIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useState } from 'react'
import { getNetworkName } from 'src/lib/network'
import { PopoverDrawer } from 'src/ui/common/popover-drawer'
import { NetworkMenu } from 'src/ui/swap/trade/favorite-recent/network-menu'
import type { ChainId, EvmChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { formatPercent, formatUSD } from 'sushi/format'

const PLACEHOLDER_ASSETS = [
  {
    chainId: 1,
    currency: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
      decimals: 18,
      symbol: 'DAI',
      name: 'DAI',
    },
  },
  {
    chainId: 1,
    currency: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      decimals: 6,
      symbol: 'USDC',
      name: 'USDC',
    },
  },
  {
    chainId: 1,
    currency: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      decimals: 6,
      symbol: 'USDT',
      name: 'USDT',
    },
  },
  {
    chainId: 1,
    currency: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      decimals: 18,
      symbol: 'WETH',
      name: 'WETH',
    },
  },
  {
    chainId: 1,
    currency: {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
      decimals: 8,
      symbol: 'WBTC',
      name: 'WBTC',
    },
  },
]

export const AssetsFilter = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null)

  const clearAll = () => {
    setSelectedNetwork(1)
  }

  const clearSelections = () => {
    setSelectedNetwork(1)
  }

  const token = {
    price24hChange: 10,
  }

  const selectedToken = false
  return (
    <PopoverDrawer
      align="start"
      popoverContentClassName="md:max-w-[370px] md:w-[370px] !p-0 !bg-[#FFFFFF] dark:!bg-slate-800"
      dialogContentClassName="max-w-none"
      dialogTitle="Network Filter"
      trigger={
        <Button
          iconPosition="end"
          icon={ChevronUpIcon}
          variant="outline"
          role="combobox"
          size="sm"
          className={classNames(
            'hover:dark:!bg-skyblue/20 hover:!bg-blue/20 hover:!text-blue hover:dark:!text-skyblue !gap-1 !w-fit !border-none !rounded-full',
          )}
        >
          {selectedToken ? (
            <>
              {/* <span>Network: </span>
              <div>{getNetworkName(selectedNetwork[0])}</div>
              <div>
                {selectedNetwork.length > 1
                  ? ` +${selectedNetwork.length - 1}`
                  : null}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearSelections()
                }}
                className="py-2 px-0.5"
              >
                <XIcon className="w-4 h-4" />
              </button> */}
              tokens
            </>
          ) : (
            <span>All Assets</span>
          )}
        </Button>
      }
      content={
        <Command className="flex items-center p-5">
          <div className="w-full">
            <div className="mb-2 w-full h-[54px] justify-between pr-2 items-center rounded-md bg-slate-200 dark:bg-slate-900 dark:border-[#FFFFFF14] border-transparent border flex">
              <CommandInput
                testdata-id="network-selector-input"
                placeholder="Search"
                className="!max-h-[39px] w-full dark:!bg-slate-900 !text-slate-450 dark:!text-slate-500"
              />
              <NetworkMenu
                className="border !min-h-[36px] !h-[36px] border-slate-200 dark:border-slate-750 dark:!bg-slate-800"
                selectedNetwork={selectedNetwork}
                onNetworkSelect={setSelectedNetwork}
              />
            </div>
          </div>

          <CommandGroup className="!overflow-x-hidden !overflow-y-scroll scroll max-h-[300px]">
            {PLACEHOLDER_ASSETS.map((asset) => {
              const name = getNetworkName(asset.chainId as ChainId)

              return (
                <CommandItem
                  key={asset.chainId}
                  value={`${name}__${asset.chainId}`}
                  onSelect={() => {}}
                  className={classNames(
                    'py-2 pr-2 hover:bg-[#0000000A] cursor-pointer hover:dark:bg-[#FFFFFF0A] font-medium text-slate-900 dark:text-slate-200',
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                      <div className="flex gap-3 items-center">
                        <div className="relative">
                          <NetworkIcon
                            type="square"
                            chainId={asset.chainId}
                            width={14}
                            height={14}
                            className="absolute -right-1.5 -bottom-[1px] z-10 rounded-[4px] border border-slate-200 dark:border-slate-750"
                          />
                          <Currency.Icon
                            width={28}
                            height={28}
                            currency={
                              new Token({
                                chainId: asset.chainId as EvmChainId,
                                address: asset.currency.address,
                                decimals: asset.currency.decimals,
                                symbol: asset.currency.symbol,
                                name: asset.currency.name,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <span> {asset.currency.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {`0.35 ${asset.currency.symbol}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* {isSelected ? (
                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center bg-blue dark:bg-skyblu p-0.5 rounded-sm">
                      <CheckIcon
                        strokeWidth={3}
                        width={16}
                        height={16}
                        className="text-slate-200 dark:text-slate-750"
                      />
                    </span>
                  ) : null} */}

                    <div className="flex flex-col">
                      <div className="overflow-hidden text-sm font-medium overflow-ellipsis">
                        {formatUSD(100)}
                      </div>
                      <div
                        className={classNames(
                          'text-[10px] ml-auto',
                          token.price24hChange > 0
                            ? 'text-green-500'
                            : token.price24hChange < 0
                              ? 'text-red'
                              : 'text-muted-foreground',
                        )}
                      >
                        {`${token.price24hChange > 0 ? '+' : ''}${formatPercent(token.price24hChange)}`}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>

          <CommandEmpty>No assets found.</CommandEmpty>
        </Command>
      }
    />
  )
}
