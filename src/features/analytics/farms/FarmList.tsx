import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import Table from 'app/components/Table'
import { formatNumber, formatPercent } from 'app/functions'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

import ColoredNumber from '../ColoredNumber'

interface FarmListProps {
  pools: {
    pair: FarmListNameProps
    rewards: Reward[]
    liquidity: number
    apr: number
  }[]
}

type FarmListNameProps = {
  pair: {
    token0: {
      id: string
      decimals: number
      symbol: string
      name: string
    }
    token1: {
      id: string
      decimals: number
      symbol: string
      name: string
    }
    name: string
    type: 'Sushi Farm' | 'Kashi Farm'
  }
}

type Reward = {
  icon: string
  currency: {
    symbol: string
  }
  rewardPerDay: number
}

function FarmListName({ pair }: FarmListNameProps): JSX.Element {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const token0 = new Token(
    chainId,
    getAddress(pair?.token0?.id),
    Number(pair?.token0?.decimals) || 18,
    pair?.token0?.symbol,
    pair?.token0?.name
  )
  const token1 = new Token(
    chainId,
    getAddress(pair?.token1?.id),
    Number(pair?.token1?.decimals) || 18,
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
          <div className="font-bold text-high-emphesis">{pair?.name}</div>
          <div className="text-secondary">{pair.type}</div>
        </div>
      </div>
    </>
  )
}

function Rewards({ rewards }: { rewards: Reward[] }): JSX.Element {
  return (
    <div>
      <div className="inline-flex items-center space-x-4 flex-inline">
        <div className="flex flex-col items-center space-y-2">
          {rewards?.map((reward, i) => (
            <div key={i} className="flex items-center">
              {reward.icon && (
                <Image
                  src={reward.icon}
                  width="30px"
                  height="30px"
                  className="rounded-full"
                  layout="fixed"
                  alt={reward.currency.symbol}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-1">
          {rewards?.map((reward, i) => {
            const decimals = 6 - String(reward?.rewardPerDay?.toFixed(0)).length
            return (
              <div key={i} className="text-base whitespace-nowrap">
                {reward?.rewardPerDay?.toFixed(decimals > 0 ? decimals : 0)} {reward.currency.symbol}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function FarmList({ pools }: FarmListProps): JSX.Element {
  const defaultSortBy = React.useMemo(
    () => ({
      id: 'liquidity',
      desc: true,
    }),
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Pool Name',
        accessor: 'pair',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <FarmListName pair={props.value} />,
        disableSortBy: true,
        align: 'left',
      },
      {
        Header: 'Annual / Monthly / Daily APR',
        accessor: 'apr',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => (
          <div className="inline-flex flex-row font-medium">
            {props.value.annual < 10000 ? (
              <ColoredNumber number={props.value.annual} percent={true} />
            ) : (
              <div className="font-normal text-green">{'>10,000%'}</div>
            )}
            &nbsp;/ {props.value.monthly > 10000 ? '>10,000%' : formatPercent(props.value.monthly)}
            &nbsp;/ {props.value.daily > 10000 ? '>10,000%' : formatPercent(props.value.daily)}
          </div>
        ),
        align: 'right',
        // @ts-ignore TYPE NEEDS FIXING
        sortType: (rowA, rowB) => {
          if (rowA.original.apr.annual > rowB.original.apr.annual) return 1
          if (rowB.original.apr.annual > rowA.original.apr.annual) return -1
          return 0
        },
        //sortType: (a, b) => a.original.apr.annual - b.original.apr.annual,
      },
      {
        Header: 'TVL',
        accessor: 'liquidity',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => (
          <div className="text-base font-medium text-primary">{formatNumber(props.value, true, false)}</div>
        ),
        align: 'right',
      },
      {
        Header: 'Daily Rewards',
        accessor: 'rewards',
        // @ts-ignore TYPE NEEDS FIXING
        Cell: (props) => <Rewards rewards={props.value} />,
        disableSortBy: true,
        align: 'right',
      },
    ],
    []
  )

  return (
    <>
      {pools && (
        <Table
          columns={columns}
          data={pools}
          defaultSortBy={defaultSortBy}
          // link={{ href: '/analytics/pools/', id: 'pair.address' }}
        />
      )}
    </>
  )
}
