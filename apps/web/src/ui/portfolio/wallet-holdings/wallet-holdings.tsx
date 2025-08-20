'use client'

import { PaperAirplaneIcon } from '@heroicons/react-v1/solid'
import {
  Badge,
  Button,
  CardContent,
  CardHeader,
  CardTitle,
  Currency,
  DataTable,
  Switch,
  Toggle,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { SortingState, TableState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Wrapper } from 'src/ui/swap/trade/wrapper'
import { type EvmChainId, evmChains } from 'sushi'
import { type Native, Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import {
  AMOUNT_COLUMN,
  ASSETS_COLUMN,
  CHAIN_COLUMN,
  LAST_30_DAY_COLUMN,
  PRICE_COLUMN,
  UPNL_COLUMN,
  VALUE_COLUMN,
} from './wallet-holdings-columns'

export type PortfolioRow = {
  chainId: EvmChainId
  token: Token
  percentageOfPort: number
  price: number
  amount: number
  value: number
  uPnL: number
  last30Days: { timestamp: number; price: number }[]
}

const data: PortfolioRow[] = [
  {
    chainId: 1 as EvmChainId,
    token: new Token({
      chainId: 1,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Ether',
    }),
    percentageOfPort: 0.5,
    price: 633,
    amount: 100,
    value: 63300,
    uPnL: 100,
    last30Days: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Math.floor(Date.now() / 1000) - (29 - i) * 86400,
      price:
        Math.round((Math.sin(i / 5) * 100 + Math.random() * 50) * 100) / 100,
    })),
  },
]

export const WalletHoldings = () => {
  const [selectedChainId, setSelectedChainId] = useState<EvmChainId | null>(
    null,
  )

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'size', desc: true },
  ])
  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [sorting])

  return (
    <Wrapper className="!p-0" enableBorder>
      <CardHeader className="!gap-2.5">
        <CardTitle className="!text-primary flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="font-semibold">Wallet: $32,123.23 </span>
            <Button
              variant="default"
              className="!min-h-[32px] !h-[32px] !p-3 font-semibold"
              size="sm"
            >
              <PaperAirplaneIcon className="mb-1 w-4 h-4 rotate-45" />
              Send
            </Button>
          </div>
          <div className="flex gap-5">
            <div className="flex gap-2 items-center">
              <span className="text-[#535263] dark:!bg-slate-900">
                Hide &lt; $1
              </span>
              <Switch />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[#535263] dark:!bg-slate-900">
                Group By Assets
              </span>
              <Switch />
            </div>{' '}
          </div>
        </CardTitle>
        <div className="flex gap-2">
          <AssetItem
            chainId={1}
            selected={selectedChainId === 1}
            usdValue={12342}
            onSelect={(chainId) => setSelectedChainId(chainId)}
          />
          <AssetItem
            chainId={137}
            selected={selectedChainId === 137}
            usdValue={633}
            onSelect={(chainId) => setSelectedChainId(chainId)}
          />
          <AssetItem
            chainId={10}
            selected={selectedChainId === 10}
            usdValue={3810}
            onSelect={(chainId) => setSelectedChainId(chainId)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={false}
          // linkFormatter={(row) =>
          //   `/${ChainKey[row.chainId]}/pool/${
          //     row.protocol === SushiSwapProtocol.SUSHISWAP_V2 ? 'v2' : 'v3'
          //   }/${row.address}`
          // }

          columns={[
            CHAIN_COLUMN,
            ASSETS_COLUMN,
            PRICE_COLUMN,
            AMOUNT_COLUMN,
            VALUE_COLUMN,
            UPNL_COLUMN,
            LAST_30_DAY_COLUMN,
          ]}
          data={data}
          className="border-t-0"
        />
      </CardContent>
    </Wrapper>
  )
}

const AssetItem = ({
  chainId,
  selected,
  usdValue,
  onSelect,
}: {
  chainId: EvmChainId
  selected: boolean
  usdValue: number
  onSelect: (chainId: EvmChainId) => void
}) => {
  return (
    <Button
      key={`asset-item-${chainId}`}
      variant={'secondary'}
      type="button"
      className={classNames(
        '!rounded-xl gap-2.5 flex w-fit py-2 px-3 !justify-start !pl-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent',
        selected && '!bg-[#4217FF14] border border-[#4217FF]',
      )}
      onClick={() => onSelect(chainId)}
    >
      <NetworkIcon
        type="square"
        className="rounded-[4px] border border-slate-50 dark:border-slate-900"
        chainId={chainId}
        width={20}
        height={20}
      />

      <div className="flex gap-1 items-start">
        <span>{evmChains[chainId].name}</span>
        <span>{formatUSD(usdValue)}</span>
      </div>
    </Button>
  )
}
