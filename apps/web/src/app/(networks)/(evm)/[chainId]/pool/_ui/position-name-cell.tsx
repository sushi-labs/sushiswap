'use client'

import { Badge, Currency, SkeletonText } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import type { ReactElement } from 'react'
import { useCurrencyPair } from 'src/lib/wagmi/hooks/tokens/use-currency-pair'
import { formatPercent } from 'sushi'
import type { EvmAddress, EvmChainId } from 'sushi/evm'

interface PositionNameCellProps {
  chainId: EvmChainId
  currency0: EvmAddress
  currency1: EvmAddress
  version: 'V3' | 'V4'
  fee: number | 'dynamic'
}

export function PositionNameCell({
  chainId,
  currency0: address0,
  currency1: address1,
  version,
  fee,
}: PositionNameCellProps): ReactElement {
  const { currency0, currency1 } = useCurrencyPair({
    chainId,
    address0,
    address1,
  })
  if (!currency0 || !currency1) return <SkeletonText fontSize="lg" />

  return (
    <div className="flex items-center gap-5">
      <div className="hidden sm:flex">
        <Badge
          className="border-2 border-slate-900 rounded-full z-[11]"
          position="bottom-right"
          badgeContent={
            <NetworkIcon chainId={chainId} width={14} height={14} />
          }
        >
          <Currency.IconList iconWidth={26} iconHeight={26}>
            <Currency.Icon disableLink currency={currency0} />
            <Currency.Icon disableLink currency={currency1} />
          </Currency.IconList>
        </Badge>
      </div>
      <div className="flex sm:hidden" />
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {currency0.symbol}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>
          {currency1.symbol}
        </span>
        <div className="flex gap-1">
          <div className="bg-blue/20 text-blue text-[10px] px-2 rounded-full">
            {version}
          </div>
          <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
            {fee === 'dynamic' ? 'Dynamic' : formatPercent(fee / 1_000_000)}
          </div>
        </div>
      </div>
    </div>
  )
}
