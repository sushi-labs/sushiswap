import { getAddress } from '@ethersproject/address'
import { Token } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import ChartCard from 'app/features/analytics/ChartCard'
import ColoredNumber from 'app/features/analytics/ColoredNumber'
import InfoCard from 'app/features/analytics/InfoCard'
import { LegacyTransactions } from 'app/features/transactions/Transactions'
import { getExplorerLink } from 'app/functions/explorer'
import { formatNumber } from 'app/functions/format'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import {
  useNativePrice,
  useOneDayBlock,
  useTokenDayData,
  useTokenPairs,
  useTokens,
  useTwoDayBlock,
} from 'app/services/graph'
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

export default function TokenPage() {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const id = (router.query.id as string)?.toLowerCase()

  const { data: block1d } = useOneDayBlock({ chainId })
  const { data: block2d } = useTwoDayBlock({ chainId })

  // General data (volume, liquidity)
  const { data: nativePrice } = useNativePrice({ chainId })
  const { data: nativePrice1d } = useNativePrice({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })

  const token = useTokens({ chainId, variables: { where: { id } }, shouldFetch: !!id })?.[0]
  const token1d = useTokens({
    chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!id && !!block1d,
  })?.[0]
  const token2d = useTokens({
    chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!id && !!block2d,
  })?.[0]

  // Token Pairs
  const tokenPairs = useTokenPairs({ chainId, variables: { id } })

  // For the Info Cards
  const price = token?.derivedETH * nativePrice
  const priceChange = ((token?.derivedETH * nativePrice) / (token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const liquidityUSD = token?.liquidity * token?.derivedETH * nativePrice
  const liquidityUSDChange =
    ((token?.liquidity * price) / (token1d?.liquidity * token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const volumeUSD1d = token?.volumeUSD - token1d?.volumeUSD
  const volumeUSD2d = token1d?.volumeUSD - token2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  // The Chart
  const tokenDayData = useTokenDayData({
    chainId,
    variables: { where: { token: id.toLowerCase() } },
    shouldFetch: !!id && !!chainId,
  })

  const chartData = useMemo(
    () => ({
      liquidityChart: tokenDayData
        /* @ts-ignore TYPE NEEDS FIXING */
        ?.sort((a, b) => a.date - b.date)
        /* @ts-ignore TYPE NEEDS FIXING */
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.liquidityUSD) })),

      volumeChart: tokenDayData
        /* @ts-ignore TYPE NEEDS FIXING */
        ?.sort((a, b) => a.date - b.date)
        /* @ts-ignore TYPE NEEDS FIXING */
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [tokenDayData]
  )

  const currency = token
    ? new Token(chainId, getAddress(id), Number(token?.decimals) || 18, token?.symbol, token?.name)
    : undefined

  const totalSupply = useTotalSupply(currency)

  if (!token) return <></>

  return (
    <>
      <NextSeo title={`${token?.name} Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <CurrencyLogo className="rounded-full" currency={currency} size={60} />
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {token?.name}
            </Typography>
          </div>

          <Typography variant="sm" weight={400}>
            Dive deeper in the analytics of {token?.name}.
          </Typography>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col">
            <div className="text-secondary">Price</div>
            <div className="flex items-center space-x-2">
              <div className="text-xl font-medium text-high-emphesis">{formatNumber(price ?? 0, true)}</div>
              <ColoredNumber number={priceChange} percent={true} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-secondary">Market Cap</div>
            <div className="flex items-center space-x-2">
              <div className="text-xl font-medium text-high-emphesis">
                {formatNumber(price * Number(totalSupply?.toExact()) ?? 0, true, false)}
              </div>
              <ColoredNumber number={priceChange} percent={true} />
            </div>
          </div>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <div className="text-3xl font-bold text-high-emphesis">Overview</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ChartCard
              header="Liquidity"
              subheader={token?.symbol}
              figure={liquidityUSD}
              change={liquidityUSDChange}
              chart={chartData.liquidityChart}
              defaultTimespan="1W"
              timespans={chartTimespans}
            />
            <ChartCard
              header="Volume"
              subheader={token?.symbol}
              figure={volumeUSD1d}
              change={volumeUSD1dChange}
              chart={chartData.volumeChart}
              defaultTimespan="1W"
              timespans={chartTimespans}
            />
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
            <InfoCard text="Liquidity (24H)" number={liquidityUSD} percent={liquidityUSDChange} />
            <InfoCard text="Volume (24H)" number={volumeUSD1d} percent={volumeUSD1dChange} />
            <InfoCard text="Fees (24H)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
          </div>
          <div className="text-2xl font-bold text-high-emphesis">Information</div>
          <div className="overflow-x-auto border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="py-3 pl-4 text-sm text-left text-secondary">Name</th>
                  <th className="py-3 pl-4 text-sm text-left text-secondary">Symbol</th>
                  <th className="py-3 pl-4 text-sm text-left text-secondary">Address</th>
                  <th className="py-3 pl-4 text-sm text-right text-secondary">Etherscan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 pl-4 border-t border-dark-900">{token?.name}</td>
                  <td className="py-3 pl-4 border-t border-dark-900">{token?.symbol}</td>
                  <td className="py-3 pl-4 border-t border-dark-900">
                    <div className="w-11/12 overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap">
                      {id}
                    </div>
                  </td>
                  <td className="py-3 pl-4 text-right border-t border-dark-900">
                    <a
                      className="flex flex-row items-center justify-end space-x-1 text-purple"
                      href={getExplorerLink(chainId, id, 'token')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div>View</div>
                      <LinkIcon size={16} />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <LegacyTransactions pairs={tokenPairs ? tokenPairs.map((pair: any) => pair.id) : []} />
        </div>
      </TridentBody>
    </>
  )
}
