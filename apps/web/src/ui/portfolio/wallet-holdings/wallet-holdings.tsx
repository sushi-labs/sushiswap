'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { useIsSmScreen } from '@sushiswap/hooks'
import {
  Button,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Slot,
} from '@sushiswap/ui'
import type { TableState } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { Wrapper } from 'src/ui/swap/trade/wrapper'
import { ChainKey, type EvmChainId } from 'sushi'
import { Token, type Type } from 'sushi/currency'
import { ActionButtons } from '../assets-chart/action-buttons'
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
  const [openMenu, setOpenMenu] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Type | null>(null)
  const isSmallScreen = useIsSmScreen()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    mutate.setToken0(data[0].token)
  }, [])

  const state: Partial<TableState> = useMemo(() => {
    return {
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [])

  return (
    <>
      <Wrapper className="!p-0 rounded-lg overflow-x-auto" enableBorder>
        <CardHeader className="!gap-2.5 relative !p-4">
          <CardTitle className="!text-primary flex justify-between items-start md:items-center flex-col md:flex-row gap-3 md:gap-0">
            <WalletHoldingsHeader />
          </CardTitle>
        </CardHeader>
        <CardContent className="!p-0">
          <DataTable
            state={state}
            loading={false}
            linkFormatter={(row) => {
              return isSmallScreen
                ? ''
                : `/${ChainKey[row.chainId]}/swap?token0=${row.token.address}`
            }}
            rowRenderer={(row, value) => {
              if (!isSmallScreen) {
                return value
              }
              return (
                <Slot
                  onClick={() => {
                    console.log(
                      '[WalletHoldings] Row clicked (small screen):',
                      row.original.token,
                    )
                    setSelectedToken(row.original.token)
                    setOpenMenu(true)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedToken(row.original.token)
                      setOpenMenu(true)
                    }
                  }}
                >
                  {value}
                </Slot>
              )
            }}
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
            className="dark:border-[#FFFFFF14] border-[#EBEBEB] rounded-t-none"
          />
        </CardContent>
      </Wrapper>
      <Dialog open={openMenu} onOpenChange={setOpenMenu}>
        <DialogTrigger asChild>
          <div className="hidden" />
        </DialogTrigger>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle className="flex justify-end !mr-0">
              <DialogClose className="!ml-auto">
                <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <ActionButtons token={selectedToken!} splitRows />
        </DialogContent>
      </Dialog>
    </>
  )
}
