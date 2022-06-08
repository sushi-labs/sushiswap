import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { TradeV1 } from '@sushiswap/exchange'
import { Badge, Chip, NetworkIcon, Popover, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { UseTradeOutput } from '../lib/hooks'

interface Route {
  srcTrade: UseTradeOutput
  dstTrade: UseTradeOutput
}

export const Route: FC<Route> = ({ srcTrade, dstTrade }) => {
  if (!srcTrade || !dstTrade) return <></>

  return (
    <>
      <Typography variant="xs" className="text-slate-400">
        Optimized Route
      </Typography>
      <div className="flex items-center relative">
        <div className="flex flex-grow items-center gap-3 z-[1]">
          <div className="h-6 w-6 flex items-center">
            <Popover
              hover
              button={
                <Badge
                  badgeContent={
                    <div className="ring-1 ring-black/20 shadow-md rounded-full">
                      <NetworkIcon chainId={srcTrade.inputAmount.currency.chainId} width={16} height={16} />
                    </div>
                  }
                >
                  {/*TODO change to currencyLogo*/}
                  <NetworkIcon chainId={srcTrade.inputAmount.currency.chainId} width={20} height={20} />
                </Badge>
              }
              panel={
                <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-xl">
                  <Typography weight={700} variant="xxs" className="text-slate-400">
                    You pay
                  </Typography>
                  <Typography variant="xs" weight={700}>
                    {srcTrade.inputAmount.toSignificant(6)} {srcTrade.inputAmount.currency.symbol}
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="bg-slate-700 rounded-full flex items-center">
            <Chip
              color={srcTrade instanceof TradeV1 ? 'blue' : 'green'}
              label={srcTrade instanceof TradeV1 ? 'Legacy' : 'Trident'}
              size="sm"
              className="!px-2"
            />
          </div>
          <div className="bg-slate-700 px-2 py-2.5 w-full justify-center flex gap-1 rounded-full border-2 border-dashed border-slate-600">
            <Badge
              badgeContent={
                <div className="ring-1 ring-black/20 shadow-md rounded-full">
                  <NetworkIcon chainId={srcTrade.inputAmount.currency.chainId} width={14} height={14} />
                </div>
              }
            >
              <NetworkIcon chainId={srcTrade.outputAmount.currency.chainId} width={18} height={18} />
            </Badge>
            <DotsHorizontalIcon width={12} className="text-slate-600" />
            <NetworkIcon chainId={ChainId.ETHEREUM} width={18} height={18} />
            <DotsHorizontalIcon width={12} className="text-slate-600" />
            <Badge
              badgeContent={
                <div className="ring-1 ring-black/20 shadow-md rounded-full">
                  <NetworkIcon chainId={dstTrade.outputAmount.currency.chainId} width={14} height={14} />
                </div>
              }
            >
              <NetworkIcon chainId={dstTrade.outputAmount.currency.chainId} width={18} height={18} />
            </Badge>
          </div>
          <div className="bg-slate-700 rounded-full flex items-center">
            <Chip
              color={dstTrade instanceof TradeV1 ? 'blue' : 'green'}
              label={dstTrade instanceof TradeV1 ? 'Legacy' : 'Trident'}
              size="sm"
              className="!px-2"
            />
          </div>
          <div className="h-6 w-6 flex items-center">
            <Popover
              hover
              button={
                <Badge
                  badgeContent={
                    <div className="ring-1 ring-black/20 shadow-md rounded-full">
                      <NetworkIcon chainId={dstTrade.inputAmount.currency.chainId} width={16} height={16} />
                    </div>
                  }
                >
                  {/*TODO change to currencyLogo*/}
                  <NetworkIcon chainId={dstTrade.inputAmount.currency.chainId} width={20} height={20} />
                </Badge>
              }
              panel={
                <div className="flex flex-col gap-1 p-2 bg-slate-700 !rounded-xl">
                  <Typography weight={700} variant="xxs" className="text-slate-400">
                    You receive
                  </Typography>
                  <Typography variant="xs" weight={700}>
                    {dstTrade.outputAmount.toSignificant(6)} {dstTrade.outputAmount.currency.symbol}
                  </Typography>
                </div>
              }
            />
          </div>
        </div>
        <div className="border-dashed border border-slate-600 w-full absolute pointer-events-none z-0" />
      </div>
    </>
  )
}
