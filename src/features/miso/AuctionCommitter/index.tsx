import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Input from 'app/components/Input'
import Typography from 'app/components/Typography'
import AuctionTimer from 'app/features/miso/AuctionTimer'
import CommitReviewModal from 'app/features/miso/CommitReviewModal'
import { useAuctionContext } from 'app/features/miso/context/AuctionContext'
import { useAuctionPointListPoints } from 'app/features/miso/context/hooks/useAuctionPointList'
import { AuctionStatus } from 'app/features/miso/context/types'
import MisoButton from 'app/features/miso/MisoButton'
import { classNames, maxAmountSpend, tryParseAmount } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useState } from 'react'

import AuctionCommitterSkeleton from './AuctionCommitterSkeleton'

const AuctionCommitter: FC = () => {
  const { i18n } = useLingui()
  const { auction, loading } = useAuctionContext()
  const { account } = useActiveWeb3React()
  const [review, setReview] = useState(false)
  const balance = useCurrencyBalance(account ?? undefined, auction?.paymentToken)
  const [value, setValue] = useState<string>()
  const whitelistedAmount = useAuctionPointListPoints(
    auction?.pointListAddress,
    account ?? undefined,
    auction?.paymentToken
  )

  if (loading || !auction) return <AuctionCommitterSkeleton />

  const inputAmount =
    tryParseAmount(value, auction.paymentToken) || CurrencyAmount.fromRawAmount(auction.paymentToken, '0')
  const spend = whitelistedAmount?.greaterThan(ZERO)
    ? auction.totalTokensCommitted
      ? whitelistedAmount?.subtract(auction.totalTokensCommitted)
      : whitelistedAmount
    : maxAmountSpend(balance)
  const maxSpend = spend?.greaterThan(ZERO) ? spend : CurrencyAmount.fromRawAmount(auction.paymentToken, '0')

  const whitelist = whitelistedAmount?.greaterThan(ZERO)
  const notWhitelisted = auction.auctionInfo.usePointList && !whitelist
  const overSpend =
    auction && whitelistedAmount && auction.totalTokensCommitted?.add(inputAmount).greaterThan(whitelistedAmount)
  const notEnoughBalance = balance && inputAmount && inputAmount.greaterThan(balance)
  // @ts-ignore TYPE NEEDS FIXING
  let error

  if (inputAmount.equalTo(ZERO)) error = i18n._(t`Enter amount`)
  if (overSpend) error = i18n._(`Amount exceeds whitelist amount`)
  if (notEnoughBalance) error = i18n._(t`Not enough balance`)
  if (auction.status === AuctionStatus.UPCOMING) error = i18n._(i18n._(t`Not started`))
  if (notWhitelisted) error = i18n._(t`Not whitelisted`)

  return (
    <div className="relative mt-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <Typography weight={700} className="text-high-emphesis">
            {i18n._(t`Participate`)}
          </Typography>
          <Typography
            role="button"
            variant="sm"
            weight={700}
            className="text-low-emphesis"
            onClick={() => setValue(balance?.toExact())}
          >
            Balance: {balance?.toSignificant(6)} {balance?.currency.symbol}
          </Typography>
        </div>
        <div className="flex rounded bg-dark-900 px-4 py-2.5 gap-4 items-center">
          <CurrencyLogo currency={auction.paymentToken} size={42} className="!rounded-full overflow-hidden" />
          <div className="flex items-baseline flex-grow gap-2">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {auction.paymentToken.symbol}
            </Typography>
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              <Input.Numeric
                value={value || ''}
                onUserInput={(val: string) => setValue(val)}
                placeholder="0.00"
                className="w-full bg-transparent text-inherit"
                autoFocus
              />
            </Typography>
          </div>
          <Button
            size="sm"
            variant="outlined"
            color="blue"
            role="button"
            className="!rounded-full"
            onClick={() => setValue(maxSpend?.toExact())}
          >
            <Typography>{i18n._(t`MAX`)}</Typography>
          </Button>
        </div>
        <MisoButton amount={tryParseAmount(value, auction.paymentToken)} auction={auction} error={!!error}>
          <AuctionTimer auction={auction}>
            {() => (
              <Button
                onClick={() => setReview(true)}
                disabled={
                  inputAmount.equalTo(ZERO) ||
                  // @ts-ignore TYPE NEEDS FIXING
                  error ||
                  !!(notWhitelisted || notEnoughBalance || overSpend) ||
                  auction.status !== AuctionStatus.LIVE
                }
                size="lg"
                color="gradient"
              >
                <div className="flex flex-col items-center gap-1">
                  <Typography className="text-white" weight={700}>
                    {/*@ts-ignore TYPE NEEDS FIXING*/}
                    {error ? error : i18n._(t`Commit`)}
                  </Typography>
                  {whitelist && (
                    <div className="flex items-baseline gap-1 px-2 rounded">
                      <Typography
                        variant="xs"
                        className={classNames(overSpend ? 'text-red' : 'text-white')}
                        weight={700}
                      >
                        {auction.totalTokensCommitted?.add(inputAmount).toSignificant(6)}
                      </Typography>
                      <Typography variant="xxs" weight={700} className="bottom-[1px] relative">
                        /
                      </Typography>
                      <Typography variant="sm" className="text-white" weight={700}>
                        {whitelistedAmount?.toSignificant(6)}
                      </Typography>
                      <Typography variant="xxs" className="text-high-emphesis" weight={700}>
                        {whitelistedAmount?.currency.symbol}
                      </Typography>
                    </div>
                  )}
                </div>
              </Button>
            )}
          </AuctionTimer>
          <CommitReviewModal amount={inputAmount} auction={auction} open={review} onDismiss={() => setReview(false)} />
        </MisoButton>
      </div>
    </div>
  )
}

export default AuctionCommitter
