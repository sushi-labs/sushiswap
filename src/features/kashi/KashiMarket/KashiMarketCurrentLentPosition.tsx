import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Percent } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { useKashiMarket } from 'app/features/kashi/KashiMarket/KashiMarketContext'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

interface KashiMarketCurrentLentPosition {
  setLentAmount?(x: string): void
}

export const KashiMarketCurrentLentPosition: FC<KashiMarketCurrentLentPosition> = ({ setLentAmount }) => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()

  const currentLent = CurrencyAmount.fromRawAmount(market.asset.token, market.currentUserAssetAmount)

  return (
    <div className="grid grid-cols-3 px-3">
      <div className="flex flex-col items-baseline">
        <Typography variant="xs" className="text-secondary">
          {i18n._(t`Deposited`)}
        </Typography>
        <Typography
          weight={700}
          variant="sm"
          className={classNames(setLentAmount ? 'cursor-pointer' : '', 'text-high-emphesis')}
          onClick={() => setLentAmount && setLentAmount(currentLent.toExact())}
        >
          {currentLent.toSignificant(6)}
          <Typography weight={700} variant="xs" className="text-secondary" component="span">
            {' '}
            {market.asset.token.symbol}
          </Typography>
        </Typography>
      </div>
      <div className="flex flex-col items-center">
        <Typography variant="xs" className="text-secondary">
          {i18n._(t`Borrowed`)}
        </Typography>
        <Typography weight={700} variant="sm" className="text-high-emphesis">
          {new Percent(market.utilization, 1e18).toSignificant(6)}%
        </Typography>
      </div>
      <div className="flex flex-col items-end">
        <Typography variant="xs" className="text-secondary text-right">
          {i18n._(t`Supply APR`)}
        </Typography>
        <Typography weight={700} variant="sm" className="text-high-emphesis flex items-center">
          {new Percent(market.supplyAPR, 1e18).toSignificant(6)}%
        </Typography>
      </div>
    </div>
  )
}
