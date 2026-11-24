'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { SushiSwapChainId } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { type ReactElement, useState } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { PriceChart } from './price-chart'

type ChartType = 'Price' // | 'Volume' | 'TVL'

interface TokenChartProps {
  chainId: SushiSwapChainId
  address: EvmAddress
}

export function TokenChart({
  chainId,
  address,
}: TokenChartProps): ReactElement {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('Price')

  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="flex items-center px-4 pb-3 pt-4 sm:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              {selectedChartType}
              <ChevronDownIcon aria-hidden="true" className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
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

      {selectedChartType === 'Price' && (
        <PriceChart chainId={chainId} address={address} />
      )}
    </Card>
  )
}
