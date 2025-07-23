'use client'

import { ChevronDownIcon, PlusIcon } from '@heroicons/react-v1/solid'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@sushiswap/ui'
import Link from 'next/link'
import { ChainKey, EvmChainId } from 'sushi'
import {
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/config'

export const ExploreHeader = ({ chainId }: { chainId: EvmChainId }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 md:py-8">
      <h2 className="text-lg font-semibold md:text-4xl">Explore Pool</h2>
      <AddLiquidityPopover chainId={chainId} />
    </div>
  )
}

const AddLiquidityPopover = ({ chainId }: { chainId: EvmChainId }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" size="lg">
          <div className="flex items-center justify-between w-full">
            <div className="w-5 block md:hidden" />
            <div className="flex items-center gap-2 mr-4">
              <PlusIcon className="w-4 h-4" />
              <span>Add Liquidity</span>
            </div>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="!w-[201px] dark:bg-[#15152B] bg-slate-50 !p-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <AddLiquidityLink chainId={chainId} version="v2" />
        <AddLiquidityLink chainId={chainId} version="v3" />
      </PopoverContent>
    </Popover>
  )
}

export const AddLiquidityLink = ({
  chainId,
  version,
}: { chainId: EvmChainId; version: 'v2' | 'v3' }) => {
  const fallbackChain = EvmChainId.ETHEREUM

  const href =
    version === 'v3'
      ? isSushiSwapV3ChainId(chainId as SushiSwapV3ChainId)
        ? `/${ChainKey[chainId]}/pool/v3/add`
        : `/${ChainKey[fallbackChain]}/pool/v3/add`
      : isSushiSwapV2ChainId(chainId as SushiSwapV2ChainId)
        ? `/${ChainKey[chainId]}/pool/v2/add`
        : `/${ChainKey[fallbackChain]}/pool/v2/add`

  return (
    <Link href={href} className="block p-2 text-slate-900 dark:text-slate-100">
      <div>Add Liquidity To {version.toUpperCase()}</div>
    </Link>
  )
}
