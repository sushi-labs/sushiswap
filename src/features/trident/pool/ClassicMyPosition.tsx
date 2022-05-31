import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import ListPanel from 'app/components/ListPanel'
import { usePoolContext } from 'app/features/trident/PoolContext'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { formatPercent } from 'app/functions'
import { FC } from 'react'

const ClassicMyPosition: FC = () => {
  const { i18n } = useLingui()
  const { poolBalance, liquidityValue, poolShare } = usePoolContext()

  return (
    <ListPanel
      header={
        <SumUSDCValues amounts={liquidityValue}>
          {({ amount }) => (
            <ListPanel.Header
              id="my-position-header"
              className="bg-dark-1000"
              title={i18n._(t`My Position`)}
              value={`$${amount?.greaterThan(ZERO) ? `${amount.toSignificant(6)}` : '0.00'}`}
              subValue={`${amount?.greaterThan(ZERO) ? poolBalance?.toSignificant(6) : '0.00'} ${
                poolBalance?.currency?.symbol
              }`}
            />
          )}
        </SumUSDCValues>
      }
      items={liquidityValue.map((amount, index) => (
        <ListPanel.CurrencyAmountItem hideIfZero={false} id={`my-position-${index}`} amount={amount} key={index} />
      ))}
      footer={
        <ListPanel.Footer
          title={i18n._(t`Share of Pool`)}
          value={poolShare ? formatPercent(poolShare.toSignificant(6)) : '0.00%'}
        />
      }
    />
  )
}

export default ClassicMyPosition
