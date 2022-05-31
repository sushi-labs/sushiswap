import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { usePoolContext } from 'app/features/trident/PoolContext'
import React, { FC } from 'react'

const ClassicMyRewards: FC = () => {
  const { i18n } = useLingui()

  // TODO ramin: this is a placeholder and incorrect
  const { liquidityValue } = usePoolContext()

  return (
    <ListPanel
      header={
        <div className="flex flex-row justify-between pl-4 pr-3 py-3 items-center">
          <Typography variant="lg" className="text-high-emphesis flex-grow" weight={700}>
            {i18n._(t`My Rewards`)}
          </Typography>
          <Button color="gradient" className="w-[unset] h-[32px]" size="sm">
            {i18n._(t`Claim All`)}
          </Button>
        </div>
      }
      items={liquidityValue.map((el, index) => (
        <ListPanel.CurrencyAmountItem amount={el} key={index} />
      ))}
    />
  )
}

export default ClassicMyRewards
