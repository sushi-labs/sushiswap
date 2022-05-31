import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Fraction, JSBI, Percent, TradeType } from '@sushiswap/core-sdk'
import { Trade as LegacyTrade } from '@sushiswap/core-sdk/dist/entities/Trade'
import QuestionHelper from 'app/components/QuestionHelper'
import Tooltip from 'app/components/Tooltip'
import Typography from 'app/components/Typography'
import { KashiMarketView, useKashiMarket, useLiquidationPrice } from 'app/features/kashi/KashiMarket'
import { classNames, formatPercent, unwrappedToken } from 'app/functions'
import { useBentoStrategies } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import React, { FC, Fragment, useState } from 'react'

interface KashiMarketDetailsView {
  collateralAmount?: CurrencyAmount<Currency>
  borrowAmount?: CurrencyAmount<Currency>
  priceImpact?: Percent
  multiplier?: Fraction
  view: KashiMarketView
  trade?: LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT> | null
}

export const KashiMarketDetailsContentView: FC<KashiMarketDetailsView> = ({
  trade,
  priceImpact,
  collateralAmount,
  borrowAmount,
  multiplier,
  view,
}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const strategies = useBentoStrategies({
    chainId,
    variables: { where: { token: market.collateral.token.address.toLowerCase() } },
  })
  const strategy = strategies?.[0]
  const allowedSlippage = useAppSelector(selectSlippage)

  const currentUserBorrowAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.asset.token),
    market.currentUserBorrowAmount
  )

  const userCollateralAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )

  const extraCollateral =
    view === KashiMarketView.BORROW && multiplier && trade
      ? trade.minimumAmountOut(allowedSlippage)
      : CurrencyAmount.fromRawAmount(unwrappedToken(market.collateral.token), JSBI.BigInt(0))

  const nextCollateralAmount = collateralAmount
    ? userCollateralAmount[view === KashiMarketView.BORROW ? 'add' : 'subtract'](collateralAmount.add(extraCollateral))
    : CurrencyAmount.fromRawAmount(market.collateral.token, market.userCollateralAmount)

  const nextBorrowAmount = borrowAmount
    ? currentUserBorrowAmount[view === KashiMarketView.BORROW ? 'add' : 'subtract'](borrowAmount)
    : CurrencyAmount.fromRawAmount(market.asset.token, market.currentUserBorrowAmount)

  return (
    <div className="flex flex-col divide-y divide-dark-850">
      <div className="flex flex-col gap-1 pb-2">
        {(collateralAmount || borrowAmount) && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{i18n._(t`Position Health`)}</Typography>
            <div className="flex gap-1">
              <Typography variant="xs" className="text-right text-secondary">
                {new Percent(market.health, 1e18).toSignificant(6)}%
              </Typography>
              <ArrowSmRightIcon width={14} className="text-secondary" />
              <Typography variant="xs" className="text-right">
                {new Percent(
                  market.simulatedHealth(nextBorrowAmount?.quotient, nextCollateralAmount?.quotient),
                  1e18
                ).toSignificant(6)}
                %
              </Typography>
            </div>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`APR (annualized)`)}</Typography>
          <Typography variant="xs" className="text-right">
            {new Percent(market.currentInterestPerYear, 1e18).toFixed(2)}%
          </Typography>
        </div>

        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`Loan to Value (LTV)`)}</Typography>
          <Typography variant="xs" className="text-right">
            75%
          </Typography>
        </div>
        {priceImpact && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{i18n._(t`Price Impact`)}</Typography>
            <Typography variant="xs" className="text-right">
              {priceImpact.toSignificant(2)}%
            </Typography>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="flex items-center">
            {i18n._(t`BentoBox strategy`)}
            <QuestionHelper
              text={
                <div>
                  <Typography variant="xs">
                    BentoBox strategies can create yield for your liquidity while it is not lent out.
                  </Typography>
                </div>
              }
            />
          </Typography>
          {strategy ? (
            <Tooltip
              text={
                <div className="flex flex-col">
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{i18n._(t`Strategy APY`)}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(strategy.apy)}
                    </Typography>
                  </div>
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{i18n._(t`Current Percentage`)}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(strategy.utilization)}
                    </Typography>
                  </div>
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{i18n._(t`Target Percentage`)}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(strategy.targetPercentage)}
                    </Typography>
                  </div>
                </div>
              }
            >
              <Typography variant="xs" className={classNames(strategy ? 'text-blue' : '', 'text-right')}>
                {strategy ? i18n._(t`Active`) : i18n._(t`None`)}{' '}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="xs" className={classNames(strategy ? 'text-blue' : '', 'text-right')}>
              {strategy ? i18n._(t`Active`) : i18n._(t`None`)}{' '}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 pt-2">
        {collateralAmount && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs" className="text-secondary">
              {i18n._(t`Total collateral`)}
            </Typography>
            <div className="flex gap-1">
              <Typography variant="xs" className="text-right text-secondary">
                {userCollateralAmount.toSignificant(6)} {market.collateral.token.symbol}
              </Typography>
              <ArrowSmRightIcon width={14} className="text-secondary" />
              <Typography variant="xs" className="text-right">
                {nextCollateralAmount?.toSignificant(6)} {market.collateral.token.symbol}
              </Typography>
            </div>
          </div>
        )}
        {borrowAmount && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs" className="text-secondary">
              {i18n._(t`Total borrowed`)}
            </Typography>
            <div className="flex gap-1">
              <Typography variant="xs" className="text-right text-secondary">
                {currentUserBorrowAmount?.toSignificant(6)} {market.asset.token.symbol}
              </Typography>
              <ArrowSmRightIcon width={14} className="text-secondary" />
              <Typography variant="xs" className="text-right">
                {nextBorrowAmount?.toSignificant(6)} {market.asset.token.symbol}
              </Typography>
            </div>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Oracle`)}
          </Typography>
          <Typography variant="xs" className="text-right text-secondary">
            {market.oracle.name}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export const KashiMarketDetailsView: FC<KashiMarketDetailsView> = ({
  priceImpact,
  collateralAmount,
  borrowAmount,
  multiplier,
  view,
  trade,
}) => {
  const { i18n } = useLingui()
  const [invert, setInvert] = useState(false)

  const liquidationPrice = useLiquidationPrice({
    invert,
    borrowAmount,
    collateralAmount,
    trade,
    reduce: view === KashiMarketView.REPAY,
  })

  return (
    <Disclosure as="div">
      {({ open }) => (
        <div
          className={classNames(
            open ? 'bg-dark-900' : '',
            'shadow-inner flex flex-col gap-2 py-2 rounded px-2 border border-dark-700 transition hover:border-dark-700'
          )}
        >
          <div className="flex items-center justify-between gap-2 pl-1">
            <div className="flex items-center gap-3">
              <Typography variant="xs" weight={700} className="flex gap-2 -ml-1">
                <QuestionHelper
                  text={
                    <div className="flex flex-col gap-2">
                      <Typography variant="xs" className="text-white">
                        {i18n._(
                          t`When the value of your collateral becomes less than the asset you borrow, your position gets liquidated.`
                        )}
                      </Typography>
                      <Typography variant="xs" className="italic">
                        {i18n._(
                          t`When a non-leveraged positions gets liquidated, you lose the collateral but you can keep the borrowed assets`
                        )}
                      </Typography>
                    </div>
                  }
                />
                {view === KashiMarketView.BORROW ? i18n._(t`Liquidation Price`) : i18n._(t`New Liquidation Price`)}
              </Typography>
              {liquidationPrice && (
                <Typography
                  onClick={() => setInvert((prev) => !prev)}
                  variant="xs"
                  weight={700}
                  className="py-1 rounded rounded-full cursor-pointer hover:text-high-emphesis"
                >
                  {liquidationPrice}
                </Typography>
              )}
            </div>

            <Disclosure.Button as={Fragment}>
              <div className="flex items-center justify-end flex-grow p-1 rounded cursor-pointer">
                <ChevronDownIcon
                  width={20}
                  className={classNames(open ? 'transform rotate-180' : '', 'transition hover:text-white')}
                />
              </div>
            </Disclosure.Button>
          </div>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            unmount={false}
          >
            <Disclosure.Panel static className="px-1 pt-2">
              <KashiMarketDetailsContentView
                trade={trade}
                priceImpact={priceImpact}
                collateralAmount={collateralAmount}
                multiplier={multiplier}
                borrowAmount={borrowAmount}
                view={view}
              />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
