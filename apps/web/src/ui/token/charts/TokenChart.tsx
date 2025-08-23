'use client'

import { DocumentDuplicateIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  ClipboardController,
  Currency,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkExternal,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { type FC, useMemo, useState } from 'react'
import {
  EvmToken,
  type SerializedEvmToken,
  getEvmChainById,
  shortenEvmAddress,
} from 'sushi/evm'
import { PriceChart } from './PriceChart'

type ChartType = 'Price' // | 'Volume' | 'TVL'

interface TokenChartProps {
  token: SerializedEvmToken
}

export const TokenChart: FC<TokenChartProps> = ({ token }) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('Price')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <Currency.Icon
            currency={useMemo(() => new EvmToken(token), [token])}
            width={36}
            height={36}
          />
          <div className="flex items-end gap-2 flex-wrap">
            <span className="font-bold text-3xl">{token.name}</span>
            <span className="font-medium text-lg">{token.symbol}</span>
            <div className="flex gap-1 items-center mb-[1px]">
              <ClipboardController hideTooltip>
                {({ setCopied }) => (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DocumentDuplicateIcon
                          className="h-4 w-4 cursor-pointer text-blue mb-[1px]"
                          onClick={() => setCopied(token.address)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Copy address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </ClipboardController>
              <LinkExternal
                className="font-medium"
                href={getEvmChainById(token.chainId).getTokenUrl(token.address)}
              >
                {shortenEvmAddress(token.address)}
              </LinkExternal>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary rounded-xl">
            {selectedChartType}
            <ChevronDownIcon width={14} height={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setSelectedChartType('Price')}
                className="cursor-pointer"
              >
                Price
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator />

      <div>{selectedChartType === 'Price' && <PriceChart token={token} />}</div>
    </div>
  )
}
