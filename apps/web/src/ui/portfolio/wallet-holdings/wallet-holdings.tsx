'use client'

import { CardContent, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import type { TableState } from '@tanstack/react-table'
import { useEffect, useMemo } from 'react'
import { Wrapper } from 'src/ui/swap/trade/wrapper'
import { ChainKey, type EvmChainId } from 'sushi'
import { Token } from 'sushi/currency'
import { useSendTokens } from './send-token-provider'
import {
  AMOUNT_COLUMN,
  ASSETS_COLUMN,
  CHAIN_COLUMN,
  LAST_30_DAY_COLUMN,
  PRICE_COLUMN,
  UPNL_COLUMN,
  VALUE_COLUMN,
} from './wallet-holdings-columns'
import { WalletHoldingsHeader } from './wallet-holdings-header'
import { WalletHoldingsSubHeader } from './wallet-holdings-sub-header'

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
  const { mutate } = useSendTokens()

  useEffect(() => {
    mutate.setToken0(data[0].token)
  }, [mutate])

  const state: Partial<TableState> = useMemo(() => {
    return {
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [])

  return (
    <Wrapper className="!p-0" enableBorder>
      <CardHeader className="!gap-2.5 relative">
        <CardTitle className="!text-primary flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0">
          <WalletHoldingsHeader />
        </CardTitle>
        <WalletHoldingsSubHeader />
      </CardHeader>
      <CardContent>
        <DataTable
          state={state}
          loading={false}
          linkFormatter={(row) =>
            `/${ChainKey[row.chainId]}/swap?token0=${row.token.address}`
          }
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
