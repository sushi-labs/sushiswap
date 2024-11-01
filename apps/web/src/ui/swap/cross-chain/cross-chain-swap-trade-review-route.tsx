'use client'

import { Currency, SkeletonText } from '@sushiswap/ui'
import { SquidIcon } from '@sushiswap/ui/icons/SquidIcon'
import { SushiXSwap2Adapter } from 'src/lib/swap/cross-chain'
import { Chain } from 'sushi/chain'
import { STARGATE_TOKEN } from 'sushi/config'
import {
  useCrossChainSwapTrade,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapTradeReviewRoute = () => {
  const {
    state: { adapter, chainId0, token0, token1, chainId1 },
  } = useDerivedStateCrossChainSwap()
  const { data: trade, isInitialLoading: isTradeLoading } =
    useCrossChainSwapTrade()

  return (
    <div className="px-3 flex justify-between w-full">
      <div className="p-3 flex flex-col gap-2.5 overflow-hidden">
        <span className="text-[10px] text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
          From: {Chain.fromChainId(chainId0)?.name?.toUpperCase()}
        </span>
        <div className="flex flex-col gap-2">
          {isTradeLoading || !trade?.srcBridgeToken || !token0 ? (
            <SkeletonText fontSize="xs" />
          ) : (
            <span className="text-xs font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
              Swap {token0.symbol} to {trade.srcBridgeToken.symbol}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center opacity-20 -ml-1 gap-1">
        <span className="bg-blue w-2 h-2 rounded-full" />
        <span className="bg-blue w-4 h-0.5 rounded-md" />
        <span className="bg-blue w-2 h-2 rounded-full" />
      </div>
      <div className="p-3 grow flex flex-col gap-2.5 items-center overflow-hidden">
        <CrossChainAdapter adapter={adapter} />
        {isTradeLoading || !trade?.srcBridgeToken ? (
          <SkeletonText fontSize="xs" />
        ) : (
          <span className="text-xs font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
            Bridge {trade.srcBridgeToken.symbol}
          </span>
        )}
      </div>
      <div className="flex items-center opacity-20 -mr-1 gap-1">
        <span className="bg-blue w-2 h-2 rounded-full" />
        <span className="bg-blue w-4 h-0.5 rounded-md" />
        <span className="bg-blue w-2 h-2 rounded-full" />
      </div>
      <div className="p-3 flex flex-col gap-2.5 overflow-hidden">
        <span className="text-[10px] text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
          To: {Chain.fromChainId(chainId1)?.name?.toUpperCase()}
        </span>
        <div className="flex flex-col gap-2">
          {isTradeLoading || !trade?.dstBridgeToken || !token1 ? (
            <SkeletonText fontSize="xs" />
          ) : (
            <span className="text-xs font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
              Swap {trade.dstBridgeToken.symbol} to {token1.symbol}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const CrossChainAdapter = ({
  adapter,
}: { adapter: SushiXSwap2Adapter | undefined }) => {
  return adapter === SushiXSwap2Adapter.Stargate ? (
    <span className="flex items-center text-[10px] text-muted-foreground gap-1">
      Via
      <Currency.Icon currency={STARGATE_TOKEN} width={10} height={10} />
      Stargate
    </span>
  ) : (
    <span className="flex items-center text-[10px] text-muted-foreground gap-1">
      Via
      <SquidIcon width={10} height={10} />
      Squid
    </span>
  )
}
