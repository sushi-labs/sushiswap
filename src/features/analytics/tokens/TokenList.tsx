import { getAddress } from '@ethersproject/address'
import { Token as CoreToken } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import LineGraph from 'app/components/LineGraph'
import Table, { Column } from 'app/components/Table'
import { formatNumber, formatPercent } from 'app/functions'
import { useRouter } from 'next/router'
import React from 'react'

import ColoredNumber from '../ColoredNumber'

type TokenListColumnType = 'name' | 'price' | 'liquidity' | 'priceChange' | 'volumeChange' | 'lastWeekGraph'

interface Token {
  token: {
    id: string
    symbol: string
  }
  liquidity: number
  volume1d: number
  volume1w: number
  price: number
  change1d: number
  change1w: number
}

interface TokenListProps {
  tokens: Token[]
  enabledColumns?: TokenListColumnType[]
}

interface TokenListNameProps {
  token: {
    id: string
    symbol: string
    decimals: number
    name: string
  }
}

function TokenListName({ token }: TokenListNameProps): JSX.Element {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const currency = new CoreToken(chainId, getAddress(token?.id), token?.decimals || 18, token?.symbol, token?.name)
  return (
    <>
      <div className="flex items-center">
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <CurrencyLogo className="rounded-full" currency={currency} size={40} />
        <div className="ml-4 text-lg font-bold text-high-emphesis">{token.symbol}</div>
      </div>
    </>
  )
}

export default function TokenList({
  tokens,
  enabledColumns = Object.keys(TokenListColumns) as TokenListColumnType[],
}: TokenListProps): JSX.Element {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const columns = React.useMemo<Column[]>(() => enabledColumns.map((col) => TokenListColumns[col]), [enabledColumns])
  return (
    <>
      {tokens && (
        <Table<Token>
          columns={columns}
          data={tokens}
          defaultSortBy={{ id: 'liquidity', desc: true }}
          link={{ href: `/analytics/${chainId}/tokens/`, id: 'token.id' }}
        />
      )}
    </>
  )
}

const TokenListColumns: Record<TokenListColumnType, Column> = {
  name: {
    Header: 'Name',
    accessor: 'token',
    Cell: (props) => <TokenListName token={props.value} />,
    disableSortBy: true,
    align: 'left',
  },
  price: {
    Header: 'Price',
    accessor: 'price',
    Cell: (props) => formatNumber(props.value, true, undefined, 2),
    align: 'right',
  },
  liquidity: {
    Header: 'Liquidity',
    accessor: 'liquidity',
    Cell: (props) => formatNumber(props.value, true, false),
    align: 'right',
  },
  priceChange: {
    Header: 'Daily / Weekly % Change',
    accessor: (row) => (
      <div>
        <ColoredNumber className="font-medium" number={row.change1d} percent={true} />
        <div className="font-normal">
          {row.change1w > 0 && '+'}
          {formatPercent(row.change1w)}
        </div>
      </div>
    ),
    align: 'right',
    sortType: (a, b) => a.original.change1d - b.original.change1d,
  },
  volumeChange: {
    Header: 'Daily / Weekly Volume',
    accessor: (row) => (
      <div>
        <div className="font-medium text-high-emphesis">{formatNumber(row.volume1d, true, false, 2)}</div>
        <div className="font-normal text-primary">{formatNumber(row.volume1w, true, false, 2)}</div>
      </div>
    ),
    align: 'right',
  },
  lastWeekGraph: {
    Header: 'Last Week',
    accessor: 'graph',
    Cell: (props) => (
      <div className="flex justify-end w-full h-full py-2 pr-2">
        <div className="w-32 h-10">
          <LineGraph data={props.value} stroke={{ solid: props.row.original.change1w >= 0 ? '#00ff4f' : '#ff3838' }} />
        </div>
      </div>
    ),
    disableSortBy: true,
    align: 'right',
  },
}
