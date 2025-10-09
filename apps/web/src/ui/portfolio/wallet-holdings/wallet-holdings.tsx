'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { useIsSmScreen } from '@sushiswap/hooks'
import {
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
import { useWalletPortfolio } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
} from 'sushi/evm'
import { ethAddress } from 'viem'
import { useAccount } from 'wagmi'
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

export const WalletHoldings = () => {
  const { address } = useAccount()

  const { data, isLoading } = useWalletPortfolio({
    address: address as `0x${string}`,
  })
  const { tokens } = data || {}
  const { mutate } = useSendTokens()
  const [openMenu, setOpenMenu] = useState(false)
  const [selectedToken, setSelectedToken] = useState<EvmCurrency | null>(null)
  const isSmallScreen = useIsSmScreen()

  useEffect(() => {
    if (!tokens || tokens.length === 0) return

    const firstToken = new EvmToken({
      ...tokens[0].token,
      chainId: tokens[0].token.chainId as EvmChainId,
      address: tokens[0].token.address as `0x${string}`,
    })

    mutate.setToken0(firstToken)
  }, [mutate.setToken0, tokens])

  const state: Partial<TableState> = useMemo(() => {
    return {
      pagination: {
        pageIndex: 0,
        pageSize: tokens?.length ?? 0,
      },
    }
  }, [tokens])

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
            loading={isLoading}
            rowRenderer={(row, value) => {
              if (!isSmallScreen) {
                return value
              }
              return (
                <Slot
                  onClick={() => {
                    const token =
                      row.original.token.address === ethAddress
                        ? new EvmNative({
                            ...row.original.token,
                            chainId: row.original.token.chainId as EvmChainId,
                          })
                        : new EvmToken({
                            ...row.original.token,
                            chainId: row.original.token.chainId as EvmChainId,
                            address: row.original.token
                              .address as `0x${string}`,
                          })
                    setSelectedToken(token)
                    setOpenMenu(true)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      const token =
                        row.original.token.address === ethAddress
                          ? new EvmNative({
                              ...row.original.token,
                              chainId: row.original.token.chainId as EvmChainId,
                            })
                          : new EvmToken({
                              ...row.original.token,
                              chainId: row.original.token.chainId as EvmChainId,
                              address: row.original.token
                                .address as `0x${string}`,
                            })
                      setSelectedToken(token)
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
            data={tokens ?? []}
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
