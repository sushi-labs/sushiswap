import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import Table from 'app/components/Table'
import ColoredNumber from 'app/features/analytics/ColoredNumber'
import { formatNumber, formatNumberScale, formatPercent, getApy } from 'app/functions'
import { useRouter } from 'next/router'
import React from 'react'

interface PairListProps {
  pairs: {
    pair: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
      id: string
    }
    liquidity: number
    volume1d: number
    volume1w: number
  }[]
  type: 'all' | 'gainers' | 'losers'
}

interface PairListNameProps {
  pair: {
    token0: {
      id: string
      symbol: string
      decimals: number
      name: string
    }
    token1: {
      id: string
      symbol: string
      decimals: number
      name: string
    }
  }
}

function PairListName({ pair }: PairListNameProps): JSX.Element {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const token0 = new Token(
    chainId,
    getAddress(pair?.token0?.id),
    Number(pair?.token0?.decimals || 18),
    pair?.token0?.symbol,
    pair?.token0?.name
  )
  const token1 = new Token(
    chainId,
    getAddress(pair?.token1?.id),
    Number(pair?.token1?.decimals || 18),
    pair?.token1?.symbol,
    pair?.token1?.name
  )
  return (
    <>
      <div className="flex items-center">
        <DoubleCurrencyLogo
          className="-space-x-3"
          logoClassName="rounded-full"
          // @ts-ignore TYPE NEEDS FIXING
          currency0={token0}
          // @ts-ignore TYPE NEEDS FIXING
          currency1={token1}
          size={40}
        />
        <div className="flex flex-col ml-3 whitespace-nowrap">
          <div className="font-bold text-high-emphesis">
            {pair?.token0?.symbol}-{pair?.token1?.symbol}
          </div>
        </div>
      </div>
    </>
  )
}

const allColumns = [
  {
    Header: 'Pair',
    accessor: 'pair',
    // @ts-ignore TYPE NEEDS FIXING
    Cell: (props) => <PairListName pair={props.value} />,
    align: 'left',
  },
  {
    Header: 'TVL',
    accessor: 'liquidity',
    // @ts-ignore TYPE NEEDS FIXING
    Cell: (props) => formatNumberScale(props.value, true),
    align: 'right',
  },
  {
    Header: 'Annual APY',
    // @ts-ignore TYPE NEEDS FIXING
    accessor: (row) => (
      <div className="text-high-emphesis">{getApy({ volume: row.volume1w, liquidity: row.liquidity, days: 7 })}</div>
    ),
    align: 'right',
    // @ts-ignore TYPE NEEDS FIXING
    sortType: (a, b) => a.original.volume1w / a.original.liquidity - b.original.volume1w / b.original.liquidity,
  },
  {
    Header: 'Daily / Weekly Volume',
    // @ts-ignore TYPE NEEDS FIXING
    accessor: (row) => (
      <div>
        <div className="font-medium text-high-emphesis">{formatNumber(row.volume1d, true, false, 2)}</div>
        <div className="font-normal text-primary">{formatNumber(row.volume1w, true, false, 2)}</div>
      </div>
    ),
    align: 'right',
  },
  {
    Header: 'Daily / Weekly Fees',
    // @ts-ignore TYPE NEEDS FIXING
    accessor: (row) => (
      <div>
        <div className="font-medium text-high-emphesis">{formatNumber(row.volume1d * 0.003, true, false, 2)}</div>
        <div className="font-normal text-primary">{formatNumber(row.volume1w * 0.003, true, false, 2)}</div>
      </div>
    ),
    align: 'right',
  },
]

const gainersColumns = [
  {
    Header: 'Pair',
    accessor: 'pair',
    // @ts-ignore TYPE NEEDS FIXING
    Cell: (props) => <PairListName pair={props.value} />,
    disableSortBy: true,
    align: 'left',
  },
  {
    Header: 'Daily / Weekly Liquidity Change',
    id: 'liquidity',
    // @ts-ignore TYPE NEEDS FIXING
    accessor: (row) => (
      <div className="inline-flex flex-col">
        <div className="font-medium text-high-emphesis">
          <ColoredNumber number={row.liquidityChangeNumber1d} scaleNumber={false} />
        </div>
        <div>{formatNumber(row.liquidityChangeNumber1w, true, false)}</div>
      </div>
    ),
    align: 'right',
    // @ts-ignore TYPE NEEDS FIXING
    sortType: (a, b) => a.original.liquidityChangeNumber1d - b.original.liquidityChangeNumber1d,
  },
  {
    Header: '%',
    // @ts-ignore TYPE NEEDS FIXING
    accessor: (row) => (
      <div className="inline-flex">
        <div>
          <div className="font-medium text-high-emphesis">{formatPercent(row.liquidityChangePercent1d)}</div>
          <div>{formatPercent(row.liquidityChangePercent1w)}</div>
        </div>
      </div>
    ),
    align: 'right',
    // @ts-ignore TYPE NEEDS FIXING
    sortType: (a, b) => a.original.liquidityChangePercent1d - b.original.liquidityChangePercent1d,
  },
  {
    Header: 'Daily / Weekly Volume Change',
    // @ts-ignore TYPE NEEDS FIXING
    accessor: (row) => (
      <div className="inline-flex flex-col">
        <div className="font-medium text-high-emphesis">
          <ColoredNumber number={row.volumeChangeNumber1d} scaleNumber={false} />
        </div>
        <div>{formatNumber(row.volumeChangeNumber1w, true, false)}</div>
      </div>
    ),
    align: 'right',
    // @ts-ignore TYPE NEEDS FIXING
    sortType: (a, b) => a.original.volumeChangeNumber1d - b.original.volumeChangeNumber1d,
  },
  {
    Header: ' %',
    // @ts-ignore TYPE NEEDS FIXING
    accessor: (row) => (
      <div className="inline-flex">
        <div>
          <div className="font-medium text-high-emphesis">{formatPercent(row.volumeChangePercent1d)}</div>
          <div>{formatPercent(row.volumeChangePercent1w)}</div>
        </div>
      </div>
    ),
    align: 'right',
    // @ts-ignore TYPE NEEDS FIXING
    sortType: (a, b) => a.original.volumeChangePercent1d - b.original.volumeChangePercent1d,
  },
]

export default function PairList({ pairs, type }: PairListProps): JSX.Element {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const defaultSortBy = React.useMemo(() => {
    switch (type) {
      case 'all':
        return { id: 'liquidity', desc: true }
      case 'gainers':
        return { id: 'liquidity', desc: true }
      case 'losers':
        return { id: 'liquidity', desc: false }
    }
  }, [type])

  const columns = React.useMemo(() => {
    switch (type) {
      case 'all':
        return allColumns
      case 'gainers':
        return gainersColumns
      case 'losers':
        return gainersColumns
    }
  }, [type])

  return (
    <>
      {pairs && (
        <Table
          columns={columns}
          data={pairs}
          defaultSortBy={defaultSortBy}
          link={{ href: `/analytics/pairs/`, id: 'pair.id' }}
        />
      )}
    </>
  )
}
