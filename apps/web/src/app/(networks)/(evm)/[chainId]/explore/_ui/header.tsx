'use client'

import { ChevronDownIcon, PlusIcon } from '@heroicons/react-v1/solid'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@sushiswap/ui'
import Link from 'next/link'
import {
  EvmChainId,
  SushiSwapProtocol,
  getEvmChainById,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { AddLiquidityDialog } from '~evm/[chainId]/_ui/add-liquidity/add-liquidity-dialog'

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
        <Button
          variant="quinary"
          size="lg"
          className="dark:bg-[#FFFFFF14] dark:text-white"
        >
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
        className="w-[95vw] md:max-w-[201px] md:!w-[201px] dark:bg-[#15152B] bg-slate-50 !p-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <AddLiquidityDialog
          poolType={SushiSwapProtocol.SUSHISWAP_V2}
          trigger={
            <Button variant="ghost" className="w-full">
              <span className="md:mr-auto">Add Liquidity to V2</span>
            </Button>
          }
          chainId={chainId}
        />
        <AddLiquidityDialog
          poolType={SushiSwapProtocol.SUSHISWAP_V3}
          trigger={
            <Button variant="ghost" className="w-full">
              <span className="md:mr-auto">Add Liquidity to V3</span>
            </Button>
          }
          chainId={chainId}
        />
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
      ? isSushiSwapV3ChainId(chainId)
        ? `/${getEvmChainById(chainId).key}/pool/v3/add`
        : `/${getEvmChainById(fallbackChain).key}/pool/v3/add`
      : isSushiSwapV2ChainId(chainId)
        ? `/${getEvmChainById(chainId).key}/pool/v2/add`
        : `/${getEvmChainById(fallbackChain).key}/pool/v2/add`

  return (
    <Link href={href} className="block p-2 text-slate-900 dark:text-slate-100">
      <div>Add Liquidity To {version.toUpperCase()}</div>
    </Link>
  )
}
