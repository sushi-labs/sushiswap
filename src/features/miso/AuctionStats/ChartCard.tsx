import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { JSBI } from '@sushiswap/core-sdk'
import LineGraph from 'app/components/LineGraph'
import Typography from 'app/components/Typography'
import AuctionChart from 'app/features/miso/AuctionChart'
import { useAuctionCommitments } from 'app/features/miso/context/hooks/useAuctionCommitments'
import { classNames, formatBalance } from 'app/functions'
import React, { useEffect, useState } from 'react'

import { Auction } from '../context/Auction'

enum ChartType {
  Price,
  FundRaised,
}

export const ChartCard = ({ auction }: { auction: Auction }) => {
  const { i18n } = useLingui()
  const [chartType, setChartType] = useState<ChartType>(ChartType.Price)
  const { commitments } = useAuctionCommitments(auction)
  const [selectedBlock, setSelectedBlock] = useState(commitments.length ? commitments.length - 1 : 0)
  let cumulativeSum = JSBI.BigInt(0)
  const parsedAuctionCommitments = [...commitments]
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .map((e) => {
      cumulativeSum = JSBI.add(cumulativeSum, e.amount.quotient)

      return {
        x: e.blockNumber,
        y: cumulativeSum.toString(),
      }
    })

  useEffect(() => setSelectedBlock(commitments.length - 1), [commitments])

  return (
    <div className="flex flex-col bg-[rgba(255,255,255,0.04)] border border-dark-900 rounded gap-5 shadow-2xl shadow-pink-red/5 h-full">
      <div className="flex justify-between gap-6 p-5">
        <div
          className={classNames(
            chartType === ChartType.FundRaised && parsedAuctionCommitments.length ? 'visible' : 'invisible'
          )}
        >
          <Typography className="text-xs text-transparent bg-gray-400 bg-clip-text">
            {i18n._(t`Funds Raised`)}
          </Typography>
          {parsedAuctionCommitments[selectedBlock] && (
            <Typography className="text-lg text-transparent text-gray-200 bg-clip-text">
              {formatBalance(parsedAuctionCommitments[selectedBlock]?.y, auction?.paymentToken?.decimals)}{' '}
              {auction?.commitmentsTotal?.currency.symbol}
            </Typography>
          )}
          <Typography className="text-xs text-transparent bg-gray-400 bg-clip-text">
            Block #{parsedAuctionCommitments[selectedBlock]?.x}
          </Typography>
        </div>
        <div className="flex gap-6">
          <Typography
            weight={400}
            variant="lg"
            role="button"
            onClick={() => setChartType(ChartType.Price)}
            className={classNames(
              chartType === ChartType.Price
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-red to-pink'
                : 'text-secondary'
            )}
          >
            {i18n._(t`Price`)}
          </Typography>
          <Typography
            weight={chartType === ChartType.FundRaised ? 700 : 400}
            variant="lg"
            role="button"
            onClick={() => setChartType(ChartType.FundRaised)}
            className={classNames(
              chartType === ChartType.FundRaised
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-red to-pink'
                : 'text-secondary'
            )}
          >
            {i18n._(t`Funds Raised`)}
          </Typography>
        </div>
      </div>
      {chartType === ChartType.Price && <AuctionChart auction={auction} showPriceIndicator={true} />}
      {chartType === ChartType.FundRaised && (
        <>
          {parsedAuctionCommitments.length ? (
            <div className="w-full h-full relative min-h-[234px] text-green px-4 py-20 box-border">
              <LineGraph
                data={parsedAuctionCommitments}
                stroke={{ solid: '#7CFF6B' }}
                strokeWidth={2}
                setSelectedIndex={(i) => setSelectedBlock(i)}
              />
            </div>
          ) : (
            <div className="w-full h-full relative min-h-[234px] flex items-center justify-center text-gray-200">
              <p className="mb-16">{i18n._(t`No commitments yet`)}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
