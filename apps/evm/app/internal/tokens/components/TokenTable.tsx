'use client'

import { XIcon } from '@heroicons/react-v1/outline'
import { ChainId, chainName } from '@sushiswap/chain'
import { formatUSD } from 'sushi'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { DataTable } from '@sushiswap/ui'
import { CheckIcon, NetworkIcon } from '@sushiswap/ui/components/icons'
import { createColumnHelper } from '@tanstack/react-table'
import { FC } from 'react'

import { Token } from '../lib'
import { TokenAdder } from './TokenAdder'

interface TokenTable {
  tokens: Token[]
}

const columnHelper = createColumnHelper<Token>()
function useColumns() {
  return [
    columnHelper.accessor('chainId', {
      header: 'Chain',
      cell: (info) => {
        const chainId = info.getValue() as ChainId
        return (
          <div className="flex space-x-2">
            <NetworkIcon type="circle" chainId={chainId} width={20} height={20} />
            <div>{CHAIN_NAME[chainId] ?? chainName[chainId]}</div>
          </div>
        )
      },
      enableHiding: true,
    }),
    columnHelper.accessor('symbol', {
      header: 'Symbol',
      cell: (info) => info.getValue(),
      enableHiding: true,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      // cell: (info) => info.getValue(),
      cell: (info) => {
        const name = info.getValue()
        return <div className="flex w-full max-w-[150px] justify-start">{name}</div>
      },
      enableHiding: true,
    }),
    columnHelper.accessor('liquidityUSD', {
      header: 'Liquidity',
      cell: (info) => formatUSD(info.getValue()),
      enableHiding: true,
    }),
    columnHelper.accessor('volumeUSD', {
      header: 'Total Volume',
      cell: (info) => formatUSD(info.getValue()),
      enableHiding: true,
    }),
    columnHelper.accessor('listEntry', {
      header: 'Default List',
      cell: (info) => (
        <div className="flex max-w-[50px] justify-center">
          {info.getValue() ? (
            <CheckIcon width={24} height={24} className="text-green" />
          ) : (
            <XIcon width={24} height={24} className="text-red" />
          )}
        </div>
      ),
      enableHiding: true,
    }),
    columnHelper.display({
      id: 'addToDefaultList',
      header: 'Adder',
      cell: ({ row }) => (
        <div
          className="flex max-w-[50px] justify-center"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          <TokenAdder token={row.original} hasIcon={Boolean(row.original.listEntry?.logoURI)} />
        </div>
      ),
    }),
  ]
}

export const TokenTable: FC<TokenTable> = ({ tokens }) => {
  const columns = useColumns()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <DataTable pagination={true} data={tokens} columns={columns} />
}
