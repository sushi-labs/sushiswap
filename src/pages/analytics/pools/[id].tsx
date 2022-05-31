import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import ChartCard from 'app/features/analytics/ChartCard'
import InfoCard from 'app/features/analytics/InfoCard'
import { LegacyTransactions } from 'app/features/transactions/Transactions'
import { getExplorerLink } from 'app/functions/explorer'
import { formatNumber } from 'app/functions/format'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useNativePrice, useOneDayBlock, usePairDayData, useSushiPairs, useTwoDayBlock } from 'app/services/graph'
import { times } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useMemo } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'

const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

export default function Pool() {
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  const id = (router.query.id as string).toLowerCase()

  const { data: block1d } = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const { data: block2d } = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const { data: pairs } = useSushiPairs({ chainId, variables: { where: { id } }, shouldFetch: !!chainId })
  const pair = pairs?.[0]
  const { data: pairs1d } = useSushiPairs({
    chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!chainId && !!block1d,
  })
  const pair1d = pairs1d?.[0]

  const { data: pairs2d } = useSushiPairs({
    chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!chainId && !!block2d,
  })

  const pair2d = pairs2d?.[0]

  const pairDayData = usePairDayData({
    chainId,
    variables: { where: { pair: id?.toLowerCase() } },
    shouldFetch: !!chainId && !!id,
  })

  const { data: nativePrice } = useNativePrice({ chainId, shouldFetch: !!chainId })

  // For the charts
  const chartData = useMemo(
    () => ({
      liquidity: pair?.reserveUSD,
      liquidityChange: (pair?.reserveUSD / pair1d?.reserveUSD) * 100 - 100,
      liquidityChart: pairDayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.reserveUSD) })),

      volume1d: pair?.volumeUSD - pair1d?.volumeUSD,
      volume1dChange: ((pair?.volumeUSD - pair1d?.volumeUSD) / (pair1d?.volumeUSD - pair2d?.volumeUSD)) * 100 - 100,
      volumeChart: pairDayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [pair, pair1d, pair2d, pairDayData]
  )

  // For the Info Cards
  const liquidityUSDChange = pair?.reserveUSD / pair1d?.reserveUSD

  const volumeUSD1d = pair?.volumeUSD - pair1d?.volumeUSD
  const volumeUSD2d = pair1d?.volumeUSD - pair2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  const tx1d = pair?.txCount - pair1d?.txCount
  const tx2d = pair1d?.txCount - pair2d?.txCount
  const tx1dChange = (tx1d / tx2d) * 100 - 100

  const avgTrade1d = volumeUSD1d / tx1d
  const avgTrade2d = volumeUSD2d / tx2d
  const avgTrade1dChange = (avgTrade1d / avgTrade2d) * 100 - 100

  const utilisation1d = (volumeUSD1d / pair?.reserveUSD) * 100
  const utilisation2d = (volumeUSD2d / pair1d?.reserveUSD) * 100
  const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100

  // For the logos

  if (!pair) return <></>

  console.log(pair)

  const currency0 = new Token(
    chainId,
    getAddress(pair?.token0?.id),
    Number(pair?.token0?.decimals) || 18,
    pair?.token0?.symbol,
    pair?.token0?.name
  )
  const currency1 = new Token(
    chainId,
    getAddress(pair?.token1?.id),
    Number(pair?.token1?.decimals) || 18,
    pair?.token1?.symbol,
    pair?.token1?.name
  )

  return (
    <>
      <NextSeo title={`${pair?.token0?.symbol}-${pair?.token1?.symbol} Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <DoubleCurrencyLogo
              className="-space-x-3"
              logoClassName="rounded-full"
              currency0={currency0}
              currency1={currency1}
              size={54}
            />
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {pair?.token0?.symbol}-{pair?.token1?.symbol}
            </Typography>
          </div>

          <Typography variant="sm" weight={400}>
            Dive deeper in the analytics of the {pair?.token0?.symbol}-{pair?.token1?.symbol} liquidity pool.
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <div className="text-2xl font-bold text-high-emphesis">Overview</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ChartCard
              header="Liquidity"
              subheader={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`}
              figure={chartData.liquidity}
              change={chartData.liquidityChange}
              chart={chartData.liquidityChart}
              defaultTimespan="1W"
              timespans={chartTimespans}
            />
            <ChartCard
              header="Volume"
              subheader={`${pair?.token0?.symbol}-${pair?.token1?.symbol}`}
              figure={chartData.volume1d}
              change={chartData.volume1dChange}
              chart={chartData.volumeChart}
              defaultTimespan="1W"
              timespans={chartTimespans}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {times(2).map((i) => (
              <div
                key={i}
                className="w-full p-6 space-y-2 border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]"
              >
                <div className="flex flex-row items-center space-x-2">
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <CurrencyLogo size={32} currency={[currency0, currency1][i]} />
                  <div className="text-2xl font-bold">{formatNumber([pair?.reserve0, pair?.reserve1][i])}</div>
                  <div className="text-lg text-secondary">{[pair?.token0, pair?.token1][i]?.symbol}</div>
                </div>
                <div className="font-bold">
                  1 {[pair?.token0, pair?.token1][i]?.symbol} ={' '}
                  {formatNumber([pair?.token1Price, pair?.token0Price][i])} {[pair?.token1, pair?.token0][i]?.symbol} (
                  {formatNumber([pair?.token1, pair?.token0][i]?.derivedETH * nativePrice, true)})
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
            <InfoCard text="Liquidity (24h)" number={pair?.reserveUSD} percent={liquidityUSDChange} />
            <InfoCard text="Volume (24h)" number={volumeUSD1d} percent={volumeUSD1dChange} />
            <InfoCard text="Fees (24h)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
            <InfoCard text="Tx (24h)" number={!isNaN(tx1d) ? tx1d : ''} numberType="text" percent={tx1dChange} />
            <InfoCard text="Avg. Trade (24h)" number={avgTrade1d} percent={avgTrade1dChange} />
            <InfoCard
              text="Utilisation (24h)"
              number={utilisation1d}
              numberType="percent"
              percent={utilisation1dChange}
            />
          </div>
          <div className="text-2xl font-bold text-high-emphesis">Information</div>
          <div>
            <div className="text-sm leading-48px overflow-x-auto border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]">
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    <th className="py-3 pl-4 text-sm text-left text-secondary">
                      {pair?.token0?.symbol}-{pair?.token1?.symbol} Address
                    </th>
                    <th className="py-3 pl-4 text-sm text-left text-secondary">{pair?.token0?.symbol} Address</th>
                    <th className="py-3 pl-4 text-sm text-left text-secondary">{pair?.token1?.symbol} Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-4 border-t border-dark-900">
                      <div className="flex items-center w-11/12 space-x-1">
                        <ExternalLink href={getExplorerLink(chainId, pair?.id, 'token')} className="flex items-center">
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {pair?.id}
                          </div>
                          <LinkIcon size={16} />
                        </ExternalLink>
                      </div>
                    </td>
                    <td className="pl-4 border-t border-dark-900">
                      <div className="flex items-center w-11/12 space-x-1">
                        <Link href={`/analytics/tokens/${pair?.token0?.id}`} passHref>
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {pair?.token0?.id}
                          </div>
                        </Link>
                        <a href={getExplorerLink(chainId, pair?.token0?.id, 'token')} target="_blank" rel="noreferrer">
                          <LinkIcon size={16} />
                        </a>
                      </div>
                    </td>
                    <td className="pl-4 border-t border-dark-900">
                      <div className="flex items-center w-11/12 space-x-1">
                        <Link href={`/analytics/tokens/${pair?.token1?.id}`} passHref>
                          <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                            {pair?.token1?.id}
                          </div>
                        </Link>
                        <a href={getExplorerLink(chainId, pair?.token1?.id, 'token')} target="_blank" rel="noreferrer">
                          <LinkIcon size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <LegacyTransactions pairs={[id]} />
        </div>
      </TridentBody>
    </>
  )
}
