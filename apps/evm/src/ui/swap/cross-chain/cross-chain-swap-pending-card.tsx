'use client'

import { LinkExternal, SelectIcon, Timer } from '@sushiswap/ui'
import { useState } from 'react'
import {
  CollapsibleContent,
  CollapsibleNew,
  CollapsibleTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { useLayerZeroScanLink } from '../../../lib/swap/useLayerZeroScanLink'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { Chain } from 'sushi/chain'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

export const CrossChainSwapPendingCard = () => {
  const {
    state: { tradeId, chainId0, chainId1 },
  } = useDerivedStateCrossChainSwap()

  const [open, setOpen] = useState<boolean>(true)
  const [date] = useState<Date>(new Date(Date.now() + 1000 * 60 * 5))

  const { data } = useLayerZeroScanLink({
    tradeId,
    network0: chainId0,
    network1: chainId1,
    txHash:
      '0xf5fe3c5d006e02b77b2c22f36d95ce57b116f8ca1efa9bc8c738016fd0d78727',
  })

  return (
    <CollapsibleNew open={open} onOpenChange={setOpen}>
      <div className="flex flex-col space-y-3 pl-4 pr-2 py-2 bg-white rounded-xl border border-input shadow-sm">
        <div className="flex items-center justify-between space-x-4 w-full">
          <div className="grid grid-cols-[auto_60px] gap-1 justify-between items-center w-full text-sm font-medium">
            <div className="block truncate">
              0.00533 ETH <ArrowRightIcon className="inline h-4 w-4 -mt-0.5" />{' '}
              0.3434 SUSHI
            </div>
            <div className="flex justify-end">
                <Timer date={date}>
                  {({ minutes, seconds }) => {
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <LinkExternal href={data?.link}>
                              {minutes}:{seconds}
                            </LinkExternal>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on LayerZeroScan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  }}
                </Timer>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <SelectIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2 pr-3 pb-3">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">From network</div>
            <div className="text-sm font-medium">{Chain.from(chainId0)?.name}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">To network</div>
            <div className="text-sm font-medium">{Chain.from(chainId1)?.name}</div>
          </div>
        </CollapsibleContent>
      </div>
    </CollapsibleNew>
  )
}
