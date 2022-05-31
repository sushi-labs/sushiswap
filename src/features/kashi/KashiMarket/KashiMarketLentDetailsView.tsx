import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, JSBI, Percent, ZERO } from '@sushiswap/core-sdk'
import QuestionHelper from 'app/components/QuestionHelper'
import Tooltip from 'app/components/Tooltip'
import Typography from 'app/components/Typography'
import { KashiMarketView, useKashiMarket } from 'app/features/kashi/KashiMarket'
import { classNames, formatPercent, unwrappedToken } from 'app/functions'
import { useBentoStrategies } from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, Fragment } from 'react'

interface KashiMarketLentDetailsView {
  lentAmount?: CurrencyAmount<Currency>
  view: KashiMarketView
}

export const KashiMarketLentDetailsContentView: FC<KashiMarketLentDetailsView> = ({ lentAmount, view }) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const strategies = useBentoStrategies({
    chainId,
    variables: { where: { token: market.collateral.token.address.toLowerCase() } },
  })
  const strategy = strategies?.[0]

  const lentPosition = CurrencyAmount.fromRawAmount(unwrappedToken(market.asset.token), market.currentUserAssetAmount)

  const newLentPosition =
    lentAmount &&
    CurrencyAmount.fromRawAmount(lentAmount.currency, market.currentUserAssetAmount)[
      view === KashiMarketView.DEPOSIT ? 'add' : 'subtract'
    ](lentAmount)

  return (
    <div className="flex flex-col divide-y divide-dark-850">
      <div className="flex flex-col gap-1 pb-2">
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{i18n._(t`Supply APR`)}</Typography>
          <Typography variant="xs" className="text-right">
            {new Percent(market.supplyAPR, 1e18).toFixed(6)}%
          </Typography>
        </div>

        {JSBI.greaterThan(market.utilization, ZERO) && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{i18n._(t`Health`)}</Typography>
            <Typography variant="xs" className="text-right">
              {new Percent(market.marketHealth, 1e18).toFixed(6)}%
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
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Total lent`)}
          </Typography>
          <div className="flex gap-1">
            <Typography variant="xs" className="text-right text-secondary">
              {lentPosition?.toSignificant(6)} {lentPosition?.currency.symbol}
            </Typography>
            <ArrowSmRightIcon width={14} className="text-secondary" />
            <Typography variant="xs" className="text-right">
              {newLentPosition?.toSignificant(6)} {lentPosition?.currency.symbol}
            </Typography>
          </div>
        </div>
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

export const KashiMarketLentDetailsView: FC<KashiMarketLentDetailsView> = ({ lentAmount, view }) => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const lentPosition = CurrencyAmount.fromRawAmount(unwrappedToken(market.asset.token), market.currentUserAssetAmount)
  const newLentPosition =
    lentAmount &&
    CurrencyAmount.fromRawAmount(lentAmount.currency, market.currentUserAssetAmount)[
      view === KashiMarketView.DEPOSIT ? 'add' : 'subtract'
    ](lentAmount)

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
              <Typography variant="xs" weight={700}>
                {i18n._(t`Deposited`)}
              </Typography>
              <div className="flex justify-between gap-1">
                <Typography variant="xs" className="text-right text-secondary">
                  {lentPosition?.toSignificant(6)} {lentPosition?.currency.symbol}
                </Typography>
                <ArrowSmRightIcon width={14} className="text-secondary" />
                <Typography variant="xs" className="text-right">
                  {newLentPosition?.toSignificant(6)} {lentPosition?.currency.symbol}
                </Typography>
              </div>
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
              <KashiMarketLentDetailsContentView lentAmount={lentAmount} view={view} />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
