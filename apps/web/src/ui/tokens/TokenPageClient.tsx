'use client'

import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import {
  ClipboardController,
  Currency,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkExternal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { type FC, useState } from 'react'
import { EvmChain } from 'sushi/chain'
import { type SerializedToken, Token } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import { PriceChart } from './charts/PriceChart'

// type ChartType = 'Price' | 'Volume' | 'TVL'
type ChartType = 'Price'

interface TokenPageClientProps {
  token: SerializedToken
}

export const TokenPageClient: FC<TokenPageClientProps> = ({
  token: tokenSerialized,
}) => {
  const token = Token.deserialize(tokenSerialized)
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('Price')

  return (
    <div className="flex flex-col">
      {/* Title row with token info and chart type selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {token ? (
            <Currency.Icon currency={token} width={36} height={36} />
          ) : null}
          <div className="flex items-end gap-2">
            <span className="font-bold text-3xl">{token?.name}</span>
            <span className="font-medium text-lg">{token?.symbol}</span>
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
                className="font-medium text-blue"
                href={EvmChain.from(token.chainId)?.getTokenUrl(token.address)}
              >
                {shortenAddress(token.address)}
              </LinkExternal>
            </div>
          </div>
        </div>

        {/* Chart type dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-xl"
            >
              {selectedChartType}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
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

      {/* Separation line */}
      <hr className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-4 border-0" />

      {/* Chart container */}
      <div style={{ height: 380 }}>
        {selectedChartType === 'Price' && (
          <PriceChart
            address={token.address}
            symbol={token.symbol}
            chainId={token.chainId}
          />
        )}
      </div>

      {/* Separation line */}
      <hr className="w-full h-px bg-gray-200 dark:bg-gray-800 mt-4 border-0" />
    </div>
  )
}
