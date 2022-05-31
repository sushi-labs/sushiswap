import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, JSBI, Pair, Percent, Token } from '@sushiswap/core-sdk'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { BIG_INT_ZERO } from 'app/constants'
import { classNames } from 'app/functions'
import { currencyId, unwrappedToken } from 'app/functions/currency'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { useRouter } from 'next/router'
import { FC } from 'preact/compat'
import React, { Fragment } from 'react'

import Button from '../Button'
import { CurrencyLogoArray } from '../CurrencyLogo'

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export const MinimalPositionCard: FC<PositionCardProps> = ({ pair }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <div>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, JSBI.BigInt(0)) && (
        <ListPanel
          header={
            <div className="overflow-hidden px-4 py-2 bg-dark-900">
              <Typography variant="xs" className="text-secondary">
                {i18n._(t`My Position`)}
              </Typography>
            </div>
          }
          items={[token0Deposited, token1Deposited].map((cur, index) => (
            <ListPanel.CurrencyAmountItem amount={cur} key={index} size="xs" />
          ))}
          footer={
            <div className="flex overflow-hidden px-4 py-2 justify-between">
              <Typography variant="xs" className="text-secondary">
                {i18n._(t`Pool Share`)}
              </Typography>
              <Typography variant="xs">{poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}</Typography>
            </div>
          }
        />
      )}
    </div>
  )
}

const FullPositionCard: FC<PositionCardProps> = ({ pair, stakedBalance }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)
  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <Disclosure as="div" className="py-2">
      {({ open }) => (
        <div
          className={classNames(
            open ? 'bg-dark-900' : 'hover:bg-dark-800',
            'shadow-inner flex flex-col rounded-2xl gap-2 py-2 pl-1 pr-2 transition'
          )}
        >
          <Disclosure.Button as={Fragment}>
            <div className="flex justify-between gap-2 items-center pl-2 cursor-pointer">
              <div className="flex items-center gap-2">
                <CurrencyLogoArray currencies={[currency0, currency1]} dense />
                <Typography variant="sm" weight={700} className="text-white">
                  {currency0.symbol}-{currency1.symbol}
                </Typography>
              </div>
              <div className="flex gap-2 flex-grow items-center justify-end p-1 rounded">
                <ChevronDownIcon
                  width={20}
                  className={classNames(open ? 'transform rotate-180' : '', 'transition hover:text-white')}
                />
              </div>
            </div>
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            unmount={false}
          >
            <Disclosure.Panel static>
              <div className="border border-dark-800 rounded p-3">
                {[token0Deposited, token1Deposited].map((cur, index) => (
                  <ListPanel.CurrencyAmountItem amount={cur} key={index} size="xs" className="!px-0 !py-1" />
                ))}
                {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
                  <div className="flex justify-between border-t border-dark-800 pt-3 mt-3">
                    <div className="flex items-center mb-1">
                      <Typography variant="xs" className="text-low-emphesis">
                        {i18n._(t`Pool share`)}{' '}
                        {poolTokenPercentage
                          ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                          : '-'}
                      </Typography>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        size="xs"
                        variant="empty"
                        color="blue"
                        onClick={() => {
                          router.push(`/remove/${currencyId(currency0)}/${currencyId(currency1)}`)
                        }}
                      >
                        {i18n._(t`Remove`)}
                      </Button>
                      <Button
                        startIcon={<PlusIcon width={14} height={14} />}
                        size="xs"
                        color="blue"
                        onClick={() => {
                          router.push(`/add/${currencyId(currency0)}/${currencyId(currency1)}`)
                        }}
                      >
                        {i18n._(t`Add`)}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}

export default FullPositionCard
