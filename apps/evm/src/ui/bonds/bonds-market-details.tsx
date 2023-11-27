'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardItem,
  CardTitle,
  Currency,
  Explainer,
} from '@sushiswap/ui'
import { CardGroup, CardLabel } from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { formatNumber, formatUSD } from 'sushi'
import { tryParseAmount } from 'sushi/currency'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { MOCK_DATA } from './bonds-market-page-header'

export const BondsMarketDetails = () => {
  const [invert, setInvert] = useState(false)
  const assetAmounts = useMemo(() => {
    return [
      tryParseAmount('1', MOCK_DATA.bondAsset),
      tryParseAmount('1', MOCK_DATA.payoutAsset),
    ]
  }, [])

  const [bondAssetPrice, payoutAssetPrice] = useTokenAmountDollarValues({
    chainId: MOCK_DATA.chainId,
    amounts: assetAmounts,
  })

  const price = invert
    ? payoutAssetPrice / bondAssetPrice
    : bondAssetPrice / payoutAssetPrice

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Details</CardTitle>
        <CardDescription>
          Total Bonded Value: {formatUSD(MOCK_DATA.totalBondedValue)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardItem title="Bond Price">
            {formatUSD(MOCK_DATA.bondPrice)}
          </CardItem>
          <CardItem title="Market Price">
            {formatUSD(MOCK_DATA.marketPrice)}
          </CardItem>
          <CardItem title="Discount">
            <span
              className={
                MOCK_DATA.bondPrice > 0
                  ? 'text-green'
                  : MOCK_DATA.bondPrice < 0
                  ? 'text-red'
                  : ''
              }
            >
              {formatUSD(MOCK_DATA.bondPrice)}
            </span>
          </CardItem>
        </CardGroup>
        <CardGroup>
          <CardLabel>Market Payout</CardLabel>
          <CardItem
            onClick={() => setInvert(!invert)}
            title={`1 ${
              invert ? MOCK_DATA.payoutAsset.symbol : MOCK_DATA.bondAsset.symbol
            } = ${formatNumber(price)} ${
              invert ? MOCK_DATA.bondAsset.symbol : MOCK_DATA.payoutAsset.symbol
            }`}
          >
            <div className="flex items-center gap-1">
              <Toggle
                pressed={!invert}
                onClick={() => setInvert(false)}
                size="xs"
                variant="outline"
              >
                {MOCK_DATA.bondAsset.symbol}
              </Toggle>
              <Toggle
                pressed={invert}
                onClick={() => setInvert(true)}
                size="xs"
                variant="outline"
              >
                {MOCK_DATA.payoutAsset.symbol}
              </Toggle>
            </div>
          </CardItem>
        </CardGroup>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-accent p-4 flex flex-col gap-3 rounded-xl">
            <div className="flex">
              <div className="flex gap-1 px-2 py-1 text-xs font-medium rounded-full bg-pink/10 text-pink">
                Max Payout{' '}
                <Explainer>
                  The maximum amount of tokens that can be purchased from the
                  bond.
                </Explainer>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Currency.Icon
                  currency={MOCK_DATA.payoutAsset}
                  width={16}
                  height={16}
                />
                {MOCK_DATA.maxPayout?.toSignificant(4)}{' '}
                {MOCK_DATA.maxPayout?.currency.symbol}
              </div>
            </div>
          </div>
          <div className="border border-accent p-4 flex flex-col gap-3 rounded-xl">
            <div className="flex">
              <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue/10 text-blue">
                Remaining Capacity
                <Explainer>
                  The remaining capacity of the bond, in tokens.
                </Explainer>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Currency.Icon
                  currency={MOCK_DATA.bondAsset}
                  width={16}
                  height={16}
                />
                {MOCK_DATA.remainingCapacity?.toSignificant(4)}{' '}
                {MOCK_DATA.remainingCapacity?.currency.symbol}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
