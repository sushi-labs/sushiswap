'use client'

import { Bond } from '@sushiswap/client'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardItem,
  CardLabel,
  CardTitle,
  Currency,
  Explainer,
  SkeletonText,
  Toggle,
} from '@sushiswap/ui'
import { FC, useMemo, useState } from 'react'
import { useBondMarketDetails } from 'src/lib/wagmi/hooks/bonds/use-bond-market-details'
import { Token } from 'sushi/currency'
import { formatNumber, formatPercent, formatUSD } from 'sushi/format'

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
    availableCapacity,
    availableCapacityUSD,
    remainingCapacity,
    remainingCapacityUSD,
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
          <CardItem
            title={
              <div className="flex flex-row space-x-1 items-center">
                <span>Market Price</span>
                <Explainer>Token price at current market spot price</Explainer>
              </div>
            }
          >
            {typeof payoutTokenPriceUSD === 'number' ? (
              formatUSD(payoutTokenPriceUSD, '$0.000a')
            ) : (
              <SkeletonText fontSize="sm" />
            )}
          </CardItem>
          <CardItem
            title={
              <div className="flex flex-row space-x-1 items-center">
                <span>Bond Price</span>
                <Explainer>Token price after bond discount</Explainer>
              </div>
            }
          >
            {typeof discountedPrice === 'number' ? (
              formatUSD(discountedPrice, '$0.000a')
            ) : (
              <SkeletonText fontSize="sm" />
            )}
          </CardItem>
          <CardItem
            title={
              <div className="flex flex-row space-x-1 items-center">
                <span>Discount</span>
                <Explainer>
                  Percentage of the current spot price and bond market price
                  difference
                </Explainer>
              </div>
            }
          >
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
            <div>
              {availableCapacity && availableCapacityUSD && isMounted ? (
                <div className="flex flex-row">
                  <div className="px-1 pt-0.5">
                    <Currency.Icon
                      currency={payoutToken}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {availableCapacity?.toSignificant(6)} {payoutToken.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatUSD(availableCapacityUSD)}
                    </div>
                  </div>
                </div>
              ) : (
                <SkeletonText fontSize="sm" />
              )}
            </div>
          </div>
          <div className="border border-accent p-4 flex flex-col gap-4 rounded-xl">
            <div className="flex">
              <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue/10 text-blue">
                Remaining Capacity
                <Explainer>
                  The total remaining capacity of the bond, in tokens.
                </Explainer>
              </div>
            </div>
            <div>
              {remainingCapacity && remainingCapacityUSD && isMounted ? (
                <div className="flex flex-row">
                  <div className="px-1 pt-0.5">
                    <Currency.Icon
                      currency={remainingCapacity?.currency}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {remainingCapacity?.toSignificant(6)}{' '}
                      {remainingCapacity?.currency.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatUSD(remainingCapacityUSD)}
                    </div>
                  </div>
                </div>
              ) : (
                <SkeletonText fontSize="sm" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
