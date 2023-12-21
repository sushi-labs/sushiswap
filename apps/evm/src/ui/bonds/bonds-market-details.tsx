'use client'

import { Bond } from '@sushiswap/client'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardItem,
  CardTitle,
  Currency,
  Explainer,
  SkeletonText,
} from '@sushiswap/ui'
import { CardGroup, CardLabel } from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui'
import { useBondMarketDetails } from '@sushiswap/wagmi'
import { FC, useMemo, useState } from 'react'
import { formatNumber, formatPercent, formatUSD } from 'sushi'
import { Token } from 'sushi/currency'

interface BondsMarketDetails {
  bond: Bond
}

export const BondsMarketDetails: FC<BondsMarketDetails> = ({
  bond: staleBond,
}) => {
  const isMounted = useIsMounted()

  const [quoteToken, payoutToken] = useMemo(() => {
    return [new Token(staleBond.quoteToken), new Token(staleBond.payoutToken)]
  }, [staleBond.quoteToken, staleBond.payoutToken])

  const [invert, setInvert] = useState(false)

  const {
    discount,
    discountedPrice,
    payoutTokenPriceUSD,
    quoteTokenPriceUSD,
    currentCapacity,
    remainingCapacity,
  } = useBondMarketDetails({
    bond: staleBond,
  })

  const price =
    payoutTokenPriceUSD && quoteTokenPriceUSD
      ? invert
        ? payoutTokenPriceUSD / quoteTokenPriceUSD
        : quoteTokenPriceUSD / payoutTokenPriceUSD
      : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Details</CardTitle>
        <CardDescription>
          {quoteTokenPriceUSD ? (
            <>
              Total Bonded Value:{' '}
              {formatUSD(staleBond.totalBondedAmount * quoteTokenPriceUSD)}
            </>
          ) : (
            <SkeletonText />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardItem title="Market Price">
            {typeof payoutTokenPriceUSD === 'number' ? (
              formatUSD(payoutTokenPriceUSD)
            ) : (
              <SkeletonText fontSize="sm" />
            )}
          </CardItem>
          <CardItem title="Bond Price">
            {typeof discountedPrice === 'number' ? (
              formatUSD(discountedPrice)
            ) : (
              <SkeletonText fontSize="sm" />
            )}
          </CardItem>
          <CardItem title="Discount">
            {discount && payoutTokenPriceUSD && discountedPrice ? (
              <span
                className={
                  discount > 0 ? 'text-green' : discount < 0 ? 'text-red' : ''
                }
              >
                {formatUSD(payoutTokenPriceUSD - discountedPrice)} (
                {formatPercent(discount)})
              </span>
            ) : (
              <SkeletonText fontSize="sm" />
            )}
          </CardItem>
        </CardGroup>
        <CardGroup>
          <CardLabel>Market Payout</CardLabel>
          <CardItem
            onClick={() => setInvert(!invert)}
            title={
              price !== undefined ? (
                `1 ${
                  invert ? payoutToken.symbol : quoteToken.symbol
                } = ${formatNumber(price)} ${
                  invert ? quoteToken.symbol : payoutToken.symbol
                }`
              ) : (
                <SkeletonText fontSize="sm" />
              )
            }
          >
            <div className="flex items-center gap-1">
              <Toggle
                pressed={!invert}
                onClick={() => setInvert(false)}
                size="xs"
                variant="outline"
              >
                {quoteToken.symbol}
              </Toggle>
              <Toggle
                pressed={invert}
                onClick={() => setInvert(true)}
                size="xs"
                variant="outline"
              >
                {payoutToken.symbol}
              </Toggle>
            </div>
          </CardItem>
        </CardGroup>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-accent p-4 flex flex-col gap-3 rounded-xl">
            <div className="flex">
              <div className="flex gap-1 px-2 py-1 text-xs font-medium rounded-full bg-pink/10 text-pink">
                Available Capacity{' '}
                <Explainer>
                  The maximum amount of tokens that is currently available.
                </Explainer>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-sm font-semibold">
                {currentCapacity && isMounted ? (
                  <>
                    <Currency.Icon
                      currency={payoutToken}
                      width={16}
                      height={16}
                    />
                    {currentCapacity?.toSignificant(4)} {payoutToken.symbol}
                  </>
                ) : (
                  <SkeletonText fontSize="sm" />
                )}
              </div>
            </div>
          </div>
          <div className="border border-accent p-4 flex flex-col gap-3 rounded-xl">
            <div className="flex">
              <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue/10 text-blue">
                Remaining Capacity
                <Explainer>
                  The total remaining capacity of the bond, in tokens.
                </Explainer>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-sm font-semibold">
                {remainingCapacity && isMounted ? (
                  <>
                    <Currency.Icon
                      currency={remainingCapacity?.currency}
                      width={16}
                      height={16}
                    />
                    {remainingCapacity?.toSignificant(4)}{' '}
                    {remainingCapacity?.currency.symbol}
                  </>
                ) : (
                  <SkeletonText fontSize="sm" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
