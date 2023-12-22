'use client'

import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { getCliffTimestamp } from '@sushiswap/bonds-sdk'
import { Bond } from '@sushiswap/client'
import { useIsMounted } from '@sushiswap/hooks'
import {
  CardContent,
  Collapsible,
  DialogTrigger,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { Checker, Web3Input, useBondMarketDetails } from '@sushiswap/wagmi'
import { CheckerProvider } from '@sushiswap/wagmi/systems/Checker/Provider'
import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import { useCallback, useMemo, useState } from 'react'
import { APPROVE_TAG_BONDS } from 'src/lib/constants'
import { Amount, Token, tryParseAmount } from 'sushi/currency'
import { formatPercent } from 'sushi/format'
import { BondsBuyReviewModal } from './bonds-buy-review-modal'

export const BondsWidget = ({ bond: staleBond }: { bond: Bond }) => {
  const [quoteToken, payoutToken] = useMemo(() => {
    return [new Token(staleBond.quoteToken), new Token(staleBond.payoutToken)]
  }, [staleBond.quoteToken, staleBond.payoutToken])

  const { maxAmountAccepted, currentCapacity, marketPrice, discount } =
    useBondMarketDetails({
      bond: staleBond,
    })

  // Amount handling
  const [quoteInputField, setQuoteInput] = useState('')
  const [payoutInputField, setPayoutInput] = useState('')

  const [quoteAmount, setQuoteAmount] = useState(
    Amount.fromRawAmount(quoteToken, 0),
  )
  const [payoutAmount, setPayoutAmount] = useState(
    Amount.fromRawAmount(payoutToken, 0),
  )

  const onQuoteInput = useCallback(
    (value: string) => {
      if (!maxAmountAccepted || !marketPrice) {
        return
      }

      let quoteAmount = tryParseAmount(value, quoteToken)

      if (quoteAmount === undefined) {
        quoteAmount = Amount.fromRawAmount(quoteToken, 0)
      }

      if (quoteAmount.greaterThan(maxAmountAccepted)) {
        quoteAmount = maxAmountAccepted
        value = quoteAmount.toSignificant(8)
      }

      setQuoteInput(value)
      setQuoteAmount(quoteAmount)

      let payoutAmount = quoteAmount
        .multiply(staleBond.marketScale)
        .divide(marketPrice)
      payoutAmount = Amount.fromFractionalAmount(
        payoutToken,
        payoutAmount.numerator,
        payoutAmount.denominator,
      )

      setPayoutAmount(payoutAmount)
      setPayoutInput(value === '' ? '' : payoutAmount.toSignificant(8))
    },
    [
      maxAmountAccepted,
      marketPrice,
      quoteToken,
      staleBond.marketScale,
      payoutToken,
    ],
  )

  const onPayoutInput = useCallback(
    (value: string) => {
      if (!currentCapacity || !marketPrice) {
        return
      }

      let payoutAmount = tryParseAmount(value, payoutToken)

      if (payoutAmount === undefined) {
        payoutAmount = Amount.fromRawAmount(payoutToken, 0)
      }

      if (payoutAmount.greaterThan(currentCapacity)) {
        payoutAmount = currentCapacity
        value = payoutAmount.toSignificant(8)
      }

      setPayoutInput(value)
      setPayoutAmount(payoutAmount)

      let quoteAmount = payoutAmount
        .multiply(marketPrice)
        .divide(staleBond.marketScale)
      quoteAmount = Amount.fromFractionalAmount(
        quoteToken,
        quoteAmount.numerator,
        quoteAmount.denominator,
      )

      setQuoteAmount(quoteAmount)
      setQuoteInput(value === '' ? '' : quoteAmount.toSignificant(8))
    },
    [
      currentCapacity,
      marketPrice,
      payoutToken,
      quoteToken,
      staleBond.marketScale,
    ],
  )

  // Negative discount warning
  const [noDiscountConfirmed, setNoDiscountConfirmed] = useState(false)

  const isMounted = useIsMounted()

  const isNegativeDiscount = discount && discount < 0
  const buttonVariant = isNegativeDiscount ? 'destructive' : 'default'
  const buttonText = isNegativeDiscount ? 'Bond Anyways' : 'Bond'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bond</CardTitle>
        <CardDescription>
          Acquire vested tokens at a discount using the widget below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Web3Input.Currency
            type="INPUT"
            className="border border-accent px-3 py-1.5 !rounded-xl"
            loading={false}
            value={quoteInputField}
            onChange={onQuoteInput}
            currency={quoteToken}
            chainId={staleBond.chainId}
          />
          <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
            <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
              <ArrowDownIcon
                width={16}
                height={16}
                className="text-muted-foreground"
              />
            </div>
          </div>
          <Web3Input.Currency
            type="OUTPUT"
            className="border border-accent px-3 py-1.5 !rounded-xl"
            value={payoutInputField}
            onChange={onPayoutInput}
            currency={payoutToken}
            chainId={staleBond.chainId}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col">
          {isMounted ? (
            <CheckerProvider>
              <Checker.Connect variant={buttonVariant}>
                <Checker.Network
                  chainId={staleBond.chainId}
                  variant={buttonVariant}
                >
                  <Checker.Amounts
                    chainId={staleBond.chainId}
                    amounts={[quoteAmount]}
                    variant={buttonVariant}
                  >
                    <Checker.ApproveERC20
                      id="approve-erc20"
                      amount={quoteAmount}
                      contract={staleBond.tellerAddress}
                      variant={buttonVariant}
                    >
                      <Checker.Success tag={APPROVE_TAG_BONDS}>
                        <Checker.Guard
                          guardText={buttonText}
                          guardWhen={Boolean(
                            (discount || -1) <= 0 && !noDiscountConfirmed,
                          )}
                          variant={buttonVariant}
                        >
                          <BondsBuyReviewModal
                            bond={staleBond}
                            discount={discount}
                            quoteAmount={quoteAmount}
                            payoutAmount={payoutAmount}
                            onSuccess={() => onQuoteInput('')}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant={buttonVariant}
                                size="xl"
                                fullWidth
                              >
                                {buttonText}
                              </Button>
                            </DialogTrigger>
                          </BondsBuyReviewModal>
                        </Checker.Guard>
                      </Checker.Success>
                    </Checker.ApproveERC20>
                  </Checker.Amounts>
                </Checker.Network>
              </Checker.Connect>
            </CheckerProvider>
          ) : (
            <Button size="xl" fullWidth disabled>
              Enter Amount
            </Button>
          )}
          <Collapsible
            open={quoteAmount.greaterThan(0)}
            className="gap-4 flex flex-col"
          >
            <div className="mt-4 flex items-start px-4 py-3 rounded-xl bg-red/20">
              <input
                id="expert-checkbox"
                type="checkbox"
                checked={noDiscountConfirmed}
                onChange={(e) => setNoDiscountConfirmed(e.target.checked)}
                className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-500 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 scale-75"
              />
              <label
                htmlFor="expert-checkbox"
                className="text-sm ml-2 font-medium text-red-500"
              >
                I understand this market is currently priced at a premium, it is
                cheaper to buy on the market.
              </label>
            </div>

            <div className=" w-full px-2 flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-slate-400">
                  Discount
                </span>
                {discount !== undefined ? (
                  <span
                    className={classNames(
                      isNegativeDiscount ? 'text-red' : 'text-green',
                      'text-sm font-medium text-right',
                    )}
                  >
                    {formatPercent(discount)}
                  </span>
                ) : (
                  <SkeletonText fontSize="sm" />
                )}
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-slate-400">
                  Cliff
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-400 text-right">
                  {isMounted &&
                    formatDistance(
                      getCliffTimestamp({
                        vestingLength: staleBond.vesting,
                        vestingType: staleBond.vestingType,
                      }) * 1000,
                      Date.now(),
                    )}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-slate-400">
                  Claimable Date
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-400 text-right">
                  {isMounted &&
                    format(
                      getCliffTimestamp({
                        vestingLength: staleBond.vesting,
                        vestingType: staleBond.vestingType,
                      }) * 1000,
                      'MMM dd, yyyy HH:mm',
                    )}
                </span>
              </div>
            </div>
          </Collapsible>
        </div>
      </CardFooter>
    </Card>
  )
}
