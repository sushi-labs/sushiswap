'use client'

import { ChevronDownIcon, XIcon } from '@heroicons/react-v1/solid'
import {
  Badge,
  Currency,
  DialogClose,
  FormattedNumber,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useState } from 'react'
import { PopoverDrawer } from 'src/app/(networks)/_ui/popover-drawer'
import { usePortfolioWalletTokensByChain } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio-by-chain'
import { useWalletPortfolioOverview } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio-overview'
import { formatPercent, formatUSD } from 'sushi'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
  isEvmAddress,
} from 'sushi/evm'
import { NetworkMenu } from '~evm/[chainId]/[trade]/_ui/swap/trade/favorite-recent/network-menu'

export const AssetsFilter = ({
  setSelectedTokenAction,
  selectedToken,
}: {
  setSelectedTokenAction: (token: EvmCurrency | undefined) => void
  selectedToken: EvmCurrency | undefined
}) => {
  const { chains } = useWalletPortfolioOverview()

  const [selectedNetwork, setSelectedNetwork] = useState<EvmChainId | null>(
    null,
  )
  const { tokens } = usePortfolioWalletTokensByChain({
    selectedChainId: selectedNetwork,
  })
  const [open, setOpen] = useState(false)

  return (
    <PopoverDrawer
      open={open}
      setOpen={setOpen}
      align="start"
      popoverContentClassName="md:max-w-[370px] md:w-[370px] !p-0 !bg-[#FFFFFF] dark:!bg-slate-800  h-full"
      dialogContentClassName="max-w-none h-[100dvh] !flex !flex-col"
      dialogContentWrapperClassName="h-full md:h-auto"
      dialogTitle="Select Token"
      dialogTitleClassName="!mt-0"
      hideDialogClose
      customDialogClose={
        <DialogClose>
          <XIcon width={20} height={20} />
        </DialogClose>
      }
      trigger={
        <div className="flex gap-2 items-center md:gap-5">
          {' '}
          <Button
            iconPosition="end"
            icon={ChevronDownIcon}
            variant="outline"
            role="combobox"
            size="sm"
            className={classNames(
              'hover:dark:!bg-skyblue/20 hover:!bg-blue/20 hover:!text-blue hover:dark:!text-skyblue !gap-1 !w-fit !border-none !rounded-full',
            )}
          >
            {selectedToken ? (
              <div className="flex gap-2.5 items-center">
                <Badge
                  className="border border-slate-200 dark:border-slate-750 rounded-[4px] z-[11] bottom-0 -right-1"
                  position="bottom-right"
                  badgeContent={
                    <NetworkIcon
                      type="square"
                      className="rounded-[3px]"
                      chainId={selectedToken?.chainId as EvmChainId}
                      width={12}
                      height={12}
                    />
                  }
                >
                  <Currency.Icon
                    disableLink
                    currency={
                      new EvmToken({
                        address: selectedToken?.wrap().address,
                        name: selectedToken?.name,
                        symbol: selectedToken?.symbol,
                        chainId: selectedToken?.chainId as EvmChainId,
                        decimals: selectedToken?.decimals,
                      })
                    }
                    width={24}
                    height={24}
                  />
                </Badge>
                <span>{selectedToken?.name}</span>
              </div>
            ) : (
              <span>All Assets</span>
            )}
          </Button>
          {selectedToken && (
            <Button
              size="sm"
              variant="ghost"
              className="flex gap-1 items-center text-sm font-medium text-blue dark:text-skyblue"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedTokenAction(undefined)
              }}
            >
              Clear
              <XIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      }
      content={
        <Command className="flex items-center md:p-5">
          <div className="w-full">
            <div className="mb-2 w-full h-[54px] justify-between pr-2 items-center rounded-md bg-slate-100 dark:bg-slate-900 dark:border-[#FFFFFF14] border-transparent border flex">
              <CommandInput
                testdata-id="network-selector-input"
                placeholder="Search"
                className="!max-h-[39px] w-full !bg-slate-100 dark:!bg-slate-900  placeholder:text-slate-450 dark:placeholder:text-slate-500"
              />
              <NetworkMenu
                className="!min-w-[202px]"
                triggerClassName="border !min-h-[36px] !rounded-lg !h-[36px] !border-[#00000014] dark:border-slate-750 dark:!bg-slate-800 bg-slate-50"
                selectedNetwork={selectedNetwork}
                onNetworkSelect={setSelectedNetwork}
                networkOptions={chains.map((chain) => chain.chainId)}
              />
            </div>
          </div>

          <CommandGroup className="!overflow-x-hidden !overflow-y-scroll scroll max-h-[300px]">
            {tokens.map((asset, idx) => {
              return (
                <CommandItem
                  key={`${asset.name}__${asset.chainId}__${idx}`}
                  value={`${asset.name}__${asset.chainId}`}
                  onSelect={() => {
                    setSelectedTokenAction(
                      !isEvmAddress(asset.id)
                        ? EvmNative.fromChainId(asset.chainId as EvmChainId)
                        : new EvmToken({
                            chainId: asset.chainId as EvmChainId,
                            address: asset.id as `0x${string}`,
                            decimals: asset.decimals,
                            symbol: asset.symbol,
                            name: asset.name,
                          }),
                    )
                    setOpen(false)
                  }}
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
                              !isEvmAddress(asset.id)
                                ? EvmNative.fromChainId(
                                    asset.chainId as EvmChainId,
                                  )
                                : new EvmToken({
                                    chainId: asset.chainId as EvmChainId,
                                    address: asset.id as `0x${string}`,
                                    decimals: asset.decimals,
                                    symbol: asset.symbol,
                                    name: asset.name,
                                  })
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <span> {asset.name}</span>
                          <span className="text-xs text-muted-foreground">
                            <FormattedNumber number={asset.amount.toString()} />{' '}
                            {asset.symbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="overflow-hidden text-sm font-medium overflow-ellipsis">
                        {formatUSD(asset.amountUSD)}
                      </div>
                      <div
                        className={classNames(
                          'text-[10px] ml-auto',
                          asset.price24hChange > 0
                            ? 'text-green-500'
                            : asset.price24hChange < 0
                              ? 'text-red'
                              : 'text-muted-foreground',
                        )}
                      >
                        {`${asset.price24hChange > 0 ? '+' : ''}${formatPercent(asset.price24hChange)}`}
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
