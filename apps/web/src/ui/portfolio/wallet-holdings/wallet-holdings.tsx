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
import { type EvmChainId, type EvmCurrency, EvmToken } from 'sushi/evm'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
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
  token: EvmToken
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
    token: new EvmToken({
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
  {
    chainId: 1 as EvmChainId,
    token: new EvmToken({
      chainId: 1,
      address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', // SUSHI
      decimals: 18,
      symbol: 'SUSHI',
      name: 'SushiToken',
    }),
    percentageOfPort: 0.2,
    price: 1.12,
    amount: 5000,
    value: 5600,
    uPnL: -50,
    last30Days: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Math.floor(Date.now() / 1000) - (29 - i) * 86400,
      price:
        Math.round((Math.cos(i / 7) * 0.5 + 1 + Math.random() * 0.2) * 100) /
        100,
    })),
  },
  {
    chainId: 1 as EvmChainId,
    token: new EvmToken({
      chainId: 1,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    }),
    percentageOfPort: 0.2,
    price: 1,
    amount: 10000,
    value: 10000,
    uPnL: 0,
    last30Days: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Math.floor(Date.now() / 1000) - (29 - i) * 86400,
      price: 1 + Math.round(Math.random() * 2) / 100, // ~1 ±0.02
    })),
  },
  {
    chainId: 1 as EvmChainId,
    token: new EvmToken({
      chainId: 1,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      decimals: 6,
      symbol: 'USDT',
      name: 'Tether USD',
    }),
    percentageOfPort: 0.1,
    price: 1,
    amount: 8000,
    value: 8000,
    uPnL: 10,
    last30Days: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Math.floor(Date.now() / 1000) - (29 - i) * 86400,
      price: 1 + Math.round(Math.random() * 3) / 100, // ~1 ±0.03
    })),
  },
]

export const WalletHoldings = () => {
  const { mutate } = useSendTokens()
  const [openMenu, setOpenMenu] = useState(false)
  const [selectedToken, setSelectedToken] = useState<EvmCurrency | null>(null)
  const isSmallScreen = useIsSmScreen()

  useEffect(() => {
    mutate.setToken0(data[0].token)
  }, [mutate.setToken0])

  const state: Partial<TableState> = useMemo(() => {
    return {
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [])

  useEffect(() => {
    if (!isSmallScreen) {
      setOpenMenu(false)
    }
  }, [isSmallScreen])

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
            rowRenderer={(row, value) => {
              if (!isSmallScreen) {
                return value
              }
              return (
                <Slot
                  onClick={() => {
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
            className="rounded-t-none dark:!border-[#FFFFFF14] !border-[#00000014] !space-y-6"
            tableRowClassName="dark:!border-[#FFFFFF14] !border-[#00000014] cursor-pointer md:cursor-default"
            showAllToggle
          />
        </CardContent>
      </Wrapper>
      <Dialog open={openMenu} onOpenChange={setOpenMenu}>
        <DialogTrigger asChild>
          <div className="hidden" />
        </DialogTrigger>
        <DialogContent hideClose className="!max-w-full">
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
