import { LinkIcon } from '@heroicons/react/outline'
import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ConstantProductPool, HybridPool } from '@sushiswap/trident-sdk'
import CopyHelper from 'app/components/AccountDetails/Copy'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { formatPercent, getExplorerLink, shortenAddress } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useRollingPoolStats } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { FC } from 'react'

import { PoolProperties } from './PoolProperties'

const HeaderContainer = () => {
  const { i18n } = useLingui()
  const { poolWithState } = usePoolContext()

  return <Header i18n={i18n} pool={poolWithState?.pool} />
}

interface HeaderProps {
  pool?: ConstantProductPool | HybridPool
  i18n: I18n
}

export const Header: FC<HeaderProps> = ({ pool, i18n }) => {
  const isDesktop = useDesktopMediaQuery()
  const { chainId } = useActiveWeb3React()
  const poolId = `${pool?.assets.map((el) => el.symbol).join('-')}`

  const { data: stats } = useRollingPoolStats({
    chainId,
    variables: { where: { id: pool?.liquidityToken?.address.toLowerCase() } },
    shouldFetch: !!chainId && !!pool && !!pool.liquidityToken.address.toLowerCase(),
  })

  // TODO ramin: remove this make dynamic
  const isFarm = false

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2 lg:gap-5">
        <div className="lg:flex lg:flex-row lg:gap-3 lg:order-0 lg:items-center">
          <CurrencyLogoArray currencies={pool?.assets || []} size={64} dense />
          <div className="hidden lg:flex lg:flex-col lg:gap-2">
            <PoolProperties pool={pool} i18n={i18n} />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 lg:order-2">
          <div className="flex flex-col">
            {pool && (
              <Link href={getExplorerLink(chainId, pool.liquidityToken.address, 'address')} passHref={true}>
                <a target="_blank">
                  <Typography
                    id={`pool-title-${poolId}`}
                    variant={isDesktop ? 'h3' : 'h2'}
                    className="text-high-emphesis hover:text-blue-100 flex gap-1"
                    weight={700}
                  >
                    {poolId} <LinkIcon width={20} />
                  </Typography>
                </a>
              </Link>
            )}
            {pool && (
              <CopyHelper toCopy={pool.liquidityToken.address} className="opacity-100 text-primary">
                {shortenAddress(pool.liquidityToken.address)}
              </CopyHelper>
            )}
          </div>
          {isFarm && (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.7904 0.209709C13.8911 0.310448 13.9514 0.444652 13.9598 0.586872C14.2861 6.13511 12.6133 10.5787 9.48509 12.4733C8.48307 13.0873 7.33013 13.4106 6.15499 13.4073C6.0744 13.4073 5.9937 13.4059 5.91246 13.403C4.7522 13.3616 3.58099 13.0232 2.42495 12.3978L9.71849 5.10422C9.82746 4.99511 9.88865 4.84719 9.8886 4.69298C9.88856 4.53877 9.82727 4.39089 9.71823 4.28185C9.60919 4.17281 9.46131 4.11153 9.3071 4.11148C9.15289 4.11143 9.00497 4.17262 8.89586 4.28159L1.6023 11.5751C0.976917 10.4191 0.638475 9.24787 0.59713 8.08762C0.54634 6.83095 0.86991 5.58751 1.5268 4.515C3.4214 1.38674 7.86429 -0.286347 13.4132 0.0403245C13.5554 0.0486991 13.6896 0.10897 13.7904 0.209709ZM1.60229 11.5751C1.67406 11.7078 1.74866 11.8403 1.82801 11.9726C1.87712 12.0545 1.94565 12.123 2.02754 12.1721C2.15975 12.2514 2.29227 12.326 2.42493 12.3978L0.993024 13.8297C0.883927 13.9388 0.735964 14.0001 0.581685 14.0001C0.427406 14.0001 0.279448 13.9388 0.170361 13.8297C0.0612741 13.7206 -6.67704e-06 13.5726 5.45671e-10 13.4183C6.68032e-06 13.2641 0.0613004 13.1161 0.170397 13.007L1.60229 11.5751Z"
                  fill="#0993EC"
                />
              </svg>
              <Typography variant="sm" weight={700} className="text-blue">
                {i18n._(t`Farm`)}
              </Typography>
            </>
          )}
        </div>
        <div className="flex flex-row items-center gap-2 lg:order-1 lg:hidden">
          <PoolProperties pool={pool} i18n={i18n} />
        </div>
      </div>
      <div className="flex flex-col gap-1 text-right mt-[-54px] lg:mt-0">
        <Typography variant="sm">{i18n._(t`APY (Annualized)`)}</Typography>
        <div className="flex flex-col gap-2">
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {formatPercent(stats?.[0]?.apy, 'NEW')}
          </Typography>
          {isFarm ? (
            <div className="flex flex-row justify-end gap-2.5">
              <Typography variant="xxs">{i18n._(t`Rewards:`)} XX%</Typography>
              {pool && (
                <Typography variant="xxs">
                  {i18n._(t`Fees:`)} {pool.fee / 100}%
                </Typography>
              )}
            </div>
          ) : (
            <Typography variant="xxs">{i18n._(t`Including fees`)}</Typography>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderContainer
